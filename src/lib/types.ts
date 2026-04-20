// source_handbook: week11-hackathon-preparation

export interface VectorEntry {
  id: string;
  text: string;
  embedding: number[];
  metadata: { chunkIndex: number; startChar: number; endChar: number };
}

export interface SearchResult {
  entry: VectorEntry;
  score: number;
}

export interface DocumentStats {
  wordCount: number;
  charCount: number;
  chunkCount: number;
  fileName: string;
  fileType: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  sources?: SourceChunk[];
  timestamp: string;
  guardrailBlocked?: boolean;
}

export interface SourceChunk {
  chunkIndex: number;
  text: string;
  score: number;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: { A: string; B: string; C: string; D: string };
  correct: 'A' | 'B' | 'C' | 'D';
  explanation: string;
}

export interface QuizData {
  questions: QuizQuestion[];
}

export interface Flashcard {
  id: number;
  front: string;
  back: string;
}

export interface FlashcardData {
  flashcards: Flashcard[];
}

export interface AILogEntry {
  id: string;
  timestamp: string;
  action: 'chat' | 'quiz' | 'flashcards' | 'summary';
  model: string;
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  latencyMs: number;
  guardrailsPassed: boolean;
  guardrailDetails?: string;
  similarityScore?: number;
  qualityScore?: number;
}

export interface GuardrailResult {
  passed: boolean;
  reason?: string;
}

export interface UploadResponse {
  success: boolean;
  stats: DocumentStats;
  preview: string;
  entries: VectorEntry[];
  error?: string;
}

export interface ChatResponse {
  success: boolean;
  message: string;
  sources: SourceChunk[];
  logEntry: AILogEntry;
  error?: string;
  guardrailBlocked?: boolean;
}

export interface GenerateQuizResponse {
  success: boolean;
  quiz: QuizData;
  logEntry: AILogEntry;
  error?: string;
}

export interface GenerateFlashcardsResponse {
  success: boolean;
  flashcards: FlashcardData;
  logEntry: AILogEntry;
  error?: string;
}

export interface GenerateSummaryResponse {
  success: boolean;
  summary: string;
  wordCount: number;
  logEntry: AILogEntry;
  error?: string;
}
