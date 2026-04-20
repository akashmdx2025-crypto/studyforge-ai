// source_handbook: week11-hackathon-preparation
import { AILogEntry } from './types';

const logs: AILogEntry[] = [];

export function logAICall(entry: Omit<AILogEntry, 'id' | 'timestamp'>): AILogEntry {
  const fullEntry: AILogEntry = {
    ...entry,
    id: crypto.randomUUID(),
    timestamp: new Date().toISOString(),
  };
  logs.push(fullEntry);
  return fullEntry;
}

export function getLogs(): AILogEntry[] {
  return [...logs].reverse(); // newest first
}

export function clearLogs(): void {
  logs.length = 0;
}

// Singleton guard for dev hot reload
const globalForLogs = global as unknown as { aiLogs: AILogEntry[] };
if (!globalForLogs.aiLogs) {
  globalForLogs.aiLogs = logs;
}
