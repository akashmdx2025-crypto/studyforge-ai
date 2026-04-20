// source_handbook: week11-hackathon-preparation
import { VectorEntry, SearchResult } from './types';

class InMemoryVectorStore {
  private entries: VectorEntry[] = [];

  add(entries: VectorEntry[]) {
    this.entries.push(...entries);
  }

  search(queryEmbedding: number[], topK: number = 3): SearchResult[] {
    return this.entries
      .map(entry => ({
        entry,
        score: this.cosineSimilarity(queryEmbedding, entry.embedding),
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, topK);
  }

  private cosineSimilarity(a: number[], b: number[]): number {
    let dot = 0, normA = 0, normB = 0;
    for (let i = 0; i < a.length; i++) {
      dot += a[i] * b[i];
      normA += a[i] * a[i];
      normB += b[i] * b[i];
    }
    const denom = Math.sqrt(normA) * Math.sqrt(normB);
    if (denom === 0) return 0;
    return dot / denom;
  }

  clear() {
    this.entries = [];
  }

  get size() {
    return this.entries.length;
  }

  getAllTexts(): string[] {
    return this.entries.map(e => e.text);
  }

  getRandomChunks(count: number): string[] {
    const shuffled = [...this.entries].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count).map(e => e.text);
  }
}

// Singleton instance — persists in Next.js server memory during runtime
const globalForStore = global as unknown as { vectorStore: InMemoryVectorStore };
export const vectorStore = globalForStore.vectorStore ?? new InMemoryVectorStore();
if (process.env.NODE_ENV !== 'production') globalForStore.vectorStore = vectorStore;
