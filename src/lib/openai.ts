// source_handbook: week11-hackathon-preparation
import { GoogleGenerativeAI } from '@google/generative-ai';

if (!process.env.GOOGLE_AI_API_KEY) {
  throw new Error('Missing GOOGLE_AI_API_KEY environment variable');
}

export const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY);

export const CHAT_MODEL = 'gemini-1.5-flash';
export const EMBEDDING_MODEL = 'embedding-001';

export async function generateEmbedding(text: string): Promise<number[]> {
  const model = genAI.getGenerativeModel({ model: EMBEDDING_MODEL });
  const result = await model.embedContent(text);
  return result.embedding.values;
}

export async function generateEmbeddings(texts: string[]): Promise<number[][]> {
  const model = genAI.getGenerativeModel({ model: EMBEDDING_MODEL });
  const results = await Promise.all(texts.map(t => model.embedContent(t)));
  return results.map(r => r.embedding.values);
}

export async function generateChatResponse(prompt: string, temperature = 0.3): Promise<{ text: string; promptTokens: number; completionTokens: number }> {
  const model = genAI.getGenerativeModel({
    model: CHAT_MODEL,
    generationConfig: { temperature, maxOutputTokens: 1200 },
  });
  const result = await model.generateContent(prompt);
  const response = result.response;
  const text = response.text();
  const usage = response.usageMetadata;
  return {
    text,
    promptTokens: usage?.promptTokenCount ?? 0,
    completionTokens: usage?.candidatesTokenCount ?? 0,
  };
}

export async function generateJsonResponse(prompt: string, temperature = 0.4): Promise<{ text: string; promptTokens: number; completionTokens: number }> {
  const model = genAI.getGenerativeModel({
    model: CHAT_MODEL,
    generationConfig: {
      temperature,
      maxOutputTokens: 2000,
      responseMimeType: 'application/json',
    },
  });
  const result = await model.generateContent(prompt);
  const response = result.response;
  const text = response.text();
  const usage = response.usageMetadata;
  return {
    text,
    promptTokens: usage?.promptTokenCount ?? 0,
    completionTokens: usage?.candidatesTokenCount ?? 0,
  };
}
