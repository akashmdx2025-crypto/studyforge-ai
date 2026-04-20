// source_handbook: week11-hackathon-preparation
import { NextRequest, NextResponse } from 'next/server';
import { openai, CHAT_MODEL } from '@/lib/openai';
import { vectorStore } from '@/lib/vectorstore';
import { SUMMARY_SYSTEM_PROMPT } from '@/lib/prompts';
import { logAICall } from '@/lib/logger';
import { computeQualityScore } from '@/lib/guardrails';

export async function POST(req: NextRequest) {
  const startTime = Date.now();
  try {
    const { detailLevel = 'standard' } = await req.json();

    if (vectorStore.size === 0) {
      return NextResponse.json({ success: false, error: 'No document uploaded yet.' }, { status: 400 });
    }

    const allTexts = vectorStore.getAllTexts();
    const allChunksText = allTexts.join('\n\n---\n\n');
    const prompt = SUMMARY_SYSTEM_PROMPT
      .replace('{detail_level}', detailLevel)
      .replace('{all_chunks}', allChunksText.slice(0, 12000)); // cap to avoid token overflow

    const completion = await openai.chat.completions.create({
      model: CHAT_MODEL,
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3,
      max_tokens: 1200,
    });

    const summary = completion.choices[0].message.content || '';
    const usage = completion.usage;
    const wordCount = summary.trim().split(/\s+/).length;

    const log = logAICall({
      action: 'summary',
      model: CHAT_MODEL,
      promptTokens: usage?.prompt_tokens ?? 0,
      completionTokens: usage?.completion_tokens ?? 0,
      totalTokens: usage?.total_tokens ?? 0,
      latencyMs: Date.now() - startTime,
      guardrailsPassed: true,
      qualityScore: computeQualityScore(summary, allTexts.slice(0, 5)),
    });

    return NextResponse.json({ success: true, summary, wordCount, logEntry: log });
  } catch (error: unknown) {
    console.error('Summary error:', error);
    const message = error instanceof Error ? error.message : 'Failed to generate summary';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
