// source_handbook: week11-hackathon-preparation
import { NextRequest, NextResponse } from 'next/server';
import { CHAT_MODEL, generateJsonResponse } from '@/lib/openai';
import { vectorStore } from '@/lib/vectorstore';
import { QUIZ_SYSTEM_PROMPT } from '@/lib/prompts';
import { logAICall } from '@/lib/logger';
import { computeQualityScore } from '@/lib/guardrails';

export async function POST(req: NextRequest) {
  const startTime = Date.now();
  try {
    const { count = 5 } = await req.json();

    if (vectorStore.size === 0) {
      return NextResponse.json({ success: false, error: 'No document uploaded yet.' }, { status: 400 });
    }

    const chunks = vectorStore.getRandomChunks(Math.min(10, vectorStore.size));
    const chunkText = chunks.join('\n\n---\n\n');
    const prompt = QUIZ_SYSTEM_PROMPT
      .replace('{n}', String(count))
      .replace('{chunks}', chunkText);

    const { text: responseText, promptTokens, completionTokens } = await generateJsonResponse(prompt, 0.5);
    const quizData = JSON.parse(responseText);

    const log = logAICall({
      action: 'quiz',
      model: CHAT_MODEL,
      promptTokens,
      completionTokens,
      totalTokens: promptTokens + completionTokens,
      latencyMs: Date.now() - startTime,
      guardrailsPassed: true,
      qualityScore: computeQualityScore(responseText, chunks),
    });

    return NextResponse.json({ success: true, quiz: quizData, logEntry: log });
  } catch (error: unknown) {
    console.error('Quiz error:', error);
    const message = error instanceof Error ? error.message : 'Failed to generate quiz';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
