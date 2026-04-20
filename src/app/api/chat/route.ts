// source_handbook: week11-hackathon-preparation
import { NextRequest, NextResponse } from 'next/server';
import { CHAT_MODEL, generateEmbedding, generateChatResponse } from '@/lib/openai';
import { vectorStore } from '@/lib/vectorstore';
import { CHAT_SYSTEM_PROMPT } from '@/lib/prompts';
import { checkInputSafety, checkRelevance, checkOutputGrounding, computeQualityScore } from '@/lib/guardrails';
import { logAICall } from '@/lib/logger';

export async function POST(req: NextRequest) {
  const startTime = Date.now();
  try {
    const { question } = await req.json();

    if (!question || typeof question !== 'string') {
      return NextResponse.json({ success: false, error: 'No question provided' }, { status: 400 });
    }

    if (vectorStore.size === 0) {
      return NextResponse.json({ success: false, error: 'No document uploaded yet. Please upload a study material first.' }, { status: 400 });
    }

    // Guardrail 1: Input safety
    const safetyCheck = checkInputSafety(question);
    if (!safetyCheck.passed) {
      const log = logAICall({
        action: 'chat',
        model: CHAT_MODEL,
        promptTokens: 0,
        completionTokens: 0,
        totalTokens: 0,
        latencyMs: Date.now() - startTime,
        guardrailsPassed: false,
        guardrailDetails: safetyCheck.reason,
        qualityScore: 0,
      });
      return NextResponse.json({
        success: false,
        guardrailBlocked: true,
        message: safetyCheck.reason,
        sources: [],
        logEntry: log,
      });
    }

    // Generate embedding for the question
    const queryEmbedding = await generateEmbedding(question);

    // Retrieve top 3 chunks
    const results = vectorStore.search(queryEmbedding, 3);
    const topScore = results[0]?.score ?? 0;

    // Guardrail 2: Relevance check
    const relevanceCheck = checkRelevance(topScore);
    if (!relevanceCheck.passed) {
      const log = logAICall({
        action: 'chat',
        model: CHAT_MODEL,
        promptTokens: 0,
        completionTokens: 0,
        totalTokens: 0,
        latencyMs: Date.now() - startTime,
        guardrailsPassed: false,
        guardrailDetails: relevanceCheck.reason,
        similarityScore: topScore,
        qualityScore: 0,
      });
      return NextResponse.json({
        success: false,
        guardrailBlocked: true,
        message: relevanceCheck.reason,
        sources: [],
        logEntry: log,
      });
    }

    const retrievedChunks = results.map(r => r.entry.text);
    const retrievedContext = retrievedChunks
      .map((text, i) => `[Chunk ${i + 1}]\n${text}`)
      .join('\n\n---\n\n');

    const prompt = CHAT_SYSTEM_PROMPT
      .replace('{retrieved_chunks}', retrievedContext)
      .replace('{question}', question);

    const { text: responseText, promptTokens, completionTokens } = await generateChatResponse(prompt);

    // Guardrail 3: Output grounding
    const groundingCheck = checkOutputGrounding(responseText, retrievedChunks);
    const qualityScore = computeQualityScore(responseText, retrievedChunks);

    const log = logAICall({
      action: 'chat',
      model: CHAT_MODEL,
      promptTokens,
      completionTokens,
      totalTokens: promptTokens + completionTokens,
      latencyMs: Date.now() - startTime,
      guardrailsPassed: groundingCheck.passed,
      guardrailDetails: groundingCheck.reason,
      similarityScore: topScore,
      qualityScore,
    });

    return NextResponse.json({
      success: true,
      message: responseText,
      sources: results.map((r, i) => ({
        chunkIndex: r.entry.metadata.chunkIndex,
        text: r.entry.text,
        score: r.score,
      })),
      logEntry: log,
    });
  } catch (error: unknown) {
    console.error('Chat error:', error);
    const message = error instanceof Error ? error.message : 'Chat request failed';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
