// source_handbook: week11-hackathon-preparation
import { NextRequest, NextResponse } from 'next/server';
import { generateEmbeddings } from '@/lib/openai';
import { vectorStore } from '@/lib/vectorstore';
import { chunkText } from '@/lib/chunker';
import { VectorEntry } from '@/lib/types';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ success: false, error: 'No file provided' }, { status: 400 });
    }

    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return NextResponse.json({ success: false, error: 'File too large. Max 10MB.' }, { status: 400 });
    }

    const allowedTypes = ['application/pdf', 'text/plain', 'text/markdown'];
    const fileExt = file.name.split('.').pop()?.toLowerCase();
    const isAllowed = allowedTypes.includes(file.type) || ['pdf', 'txt', 'md'].includes(fileExt || '');

    if (!isAllowed) {
      return NextResponse.json({ success: false, error: 'Unsupported file type. Use PDF, TXT, or MD.' }, { status: 400 });
    }

    let extractedText = '';
    const fileType = fileExt || 'txt';

    if (fileExt === 'pdf') {
      const arrayBuffer = await file.arrayBuffer();
      // unpdf is built for serverless — no DOMMatrix, no Node.js-only APIs
      const { extractText } = await import('unpdf');
      const { text } = await extractText(new Uint8Array(arrayBuffer), { mergePages: true });
      extractedText = text;
    } else {
      extractedText = await file.text();
    }

    if (!extractedText || extractedText.trim().length < 50) {
      return NextResponse.json({ success: false, error: 'Could not extract enough text from file.' }, { status: 400 });
    }

    // Clear previous document
    vectorStore.clear();

    // Chunk the text
    const chunks = chunkText(extractedText);

    // Generate embeddings in batches of 20
    const BATCH_SIZE = 20;
    const entries: VectorEntry[] = [];

    for (let i = 0; i < chunks.length; i += BATCH_SIZE) {
      const batch = chunks.slice(i, i + BATCH_SIZE);
      
      // Retry logic for rate limiting (429)
      let retries = 0;
      let success = false;
      let embeddings: number[][] = [];
      
      while (!success && retries < 3) {
        try {
          embeddings = await generateEmbeddings(batch.map(c => c.text));
          success = true;
        } catch (error: any) {
          if (error.message?.includes('429') || error.status === 429) {
            retries++;
            // Wait with exponential backoff (2s, 4s, 8s)
            await new Promise(r => setTimeout(r, Math.pow(2, retries) * 1000));
          } else {
            throw error;
          }
        }
      }

      for (let j = 0; j < batch.length; j++) {
        entries.push({
          id: crypto.randomUUID(),
          text: batch[j].text,
          embedding: embeddings[j],
          metadata: {
            chunkIndex: i + j,
            startChar: batch[j].startChar,
            endChar: batch[j].endChar,
          },
        });
      }
      
      // Small pause between batches to stay under free tier RPM
      if (i + BATCH_SIZE < chunks.length) {
        await new Promise(r => setTimeout(r, 500));
      }
    }

    vectorStore.add(entries);

    const words = extractedText.trim().split(/\s+/);
    const preview = extractedText.trim().slice(0, 500);

    return NextResponse.json({
      success: true,
      stats: {
        wordCount: words.length,
        charCount: extractedText.length,
        chunkCount: chunks.length,
        fileName: file.name,
        fileType,
      },
      preview,
    });
  } catch (error: unknown) {
    console.error('Upload error:', error);
    const message = error instanceof Error ? error.message : 'Failed to process file';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
