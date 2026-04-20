// source_handbook: week11-hackathon-preparation

const CHUNK_SIZE = 500; // approximate tokens (~4 chars/token → ~2000 chars)
const OVERLAP = 50;     // approximate tokens (~200 chars)
const CHARS_PER_TOKEN = 4;

export function chunkText(text: string): { text: string; startChar: number; endChar: number }[] {
  const chunks: { text: string; startChar: number; endChar: number }[] = [];
  const chunkChars = CHUNK_SIZE * CHARS_PER_TOKEN;
  const overlapChars = OVERLAP * CHARS_PER_TOKEN;

  // Clean whitespace
  const cleaned = text.replace(/\s+/g, ' ').trim();

  let start = 0;
  while (start < cleaned.length) {
    let end = start + chunkChars;

    // Try to break at a sentence boundary
    if (end < cleaned.length) {
      const breakPoints = ['. ', '! ', '? ', '\n', '; '];
      let bestBreak = end;
      for (const bp of breakPoints) {
        const idx = cleaned.lastIndexOf(bp, end);
        if (idx > start + chunkChars / 2) {
          bestBreak = idx + bp.length;
          break;
        }
      }
      end = bestBreak;
    } else {
      end = cleaned.length;
    }

    chunks.push({
      text: cleaned.slice(start, end).trim(),
      startChar: start,
      endChar: end,
    });

    start = Math.max(start + 1, end - overlapChars);
  }

  return chunks.filter(c => c.text.length > 20);
}
