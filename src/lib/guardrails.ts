// source_handbook: week11-hackathon-preparation
import { GuardrailResult } from './types';

// 1. Relevance check — is the query related to uploaded content?
export function checkRelevance(similarityScore: number): GuardrailResult {
  if (similarityScore < 0.3) {
    return {
      passed: false,
      reason: "Your question doesn't seem related to the uploaded material.",
    };
  }
  return { passed: true };
}

// 2. Input sanitization — block prompt injection attempts
export function checkInputSafety(input: string): GuardrailResult {
  const blockedPatterns = [
    /ignore previous instructions/i,
    /forget your rules/i,
    /you are now/i,
    /act as if/i,
    /pretend you/i,
    /override/i,
    /jailbreak/i,
    /system prompt/i,
    /disregard/i,
  ];

  for (const pattern of blockedPatterns) {
    if (pattern.test(input)) {
      return {
        passed: false,
        reason: 'This input was flagged by our safety system.',
      };
    }
  }
  return { passed: true };
}

// 3. Output validation — check AI response stays grounded
export function checkOutputGrounding(response: string, chunks: string[]): GuardrailResult {
  const responseWords = new Set(
    response.toLowerCase().split(/\s+/).filter(w => w.length > 4)
  );
  const chunkWords = new Set(
    chunks.join(' ').toLowerCase().split(/\s+/).filter(w => w.length > 4)
  );
  const overlap = [...responseWords].filter(w => chunkWords.has(w));

  if (overlap.length < 5) {
    return {
      passed: false,
      reason: 'The AI response may not be well-grounded in your material.',
    };
  }
  return { passed: true };
}

// 4. Compute a simple quality score 1-5 based on grounding
export function computeQualityScore(response: string, chunks: string[]): number {
  const responseWords = response.toLowerCase().split(/\s+/).filter(w => w.length > 4);
  const chunkWordSet = new Set(
    chunks.join(' ').toLowerCase().split(/\s+/).filter(w => w.length > 4)
  );
  const overlap = responseWords.filter(w => chunkWordSet.has(w));
  const ratio = responseWords.length > 0 ? overlap.length / responseWords.length : 0;

  if (ratio > 0.6) return 5;
  if (ratio > 0.45) return 4;
  if (ratio > 0.3) return 3;
  if (ratio > 0.15) return 2;
  return 1;
}
