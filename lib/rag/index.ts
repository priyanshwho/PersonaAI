import { prisma } from '../db';
import { getEmbedding } from './embeddings';

interface ChunkInput {
  text: string;
  persona: string;
  title: string;
  source: string;
  url: string;
  topic: string;
}

/**
 * Splits text into chunks of specified length with overlap.
 * Uses sentence/line boundaries to avoid chopping words.
 */
export function chunkText(text: string, chunkSize = 800, overlap = 150): string[] {
  const chunks: string[] = [];
  let index = 0;

  // Clean up whitespace & normalize text
  const cleanText = text.replace(/\s+/g, ' ').trim();

  while (index < cleanText.length) {
    // Determine target end of chunk
    let end = index + chunkSize;

    if (end < cleanText.length) {
      // Find the last period, question mark, or exclamation mark to end clean
      const lastSentenceBoundary = Math.max(
        cleanText.lastIndexOf('. ', end),
        cleanText.lastIndexOf('? ', end),
        cleanText.lastIndexOf('! ', end)
      );

      // If a boundary is found and it is after the current index, align there
      if (lastSentenceBoundary > index) {
        end = lastSentenceBoundary + 1;
      } else {
        // Fallback: find last space to avoid breaking words
        const lastSpace = cleanText.lastIndexOf(' ', end);
        if (lastSpace > index) {
          end = lastSpace;
        }
      }
    }

    const chunk = cleanText.slice(index, end).trim();
    if (chunk.length > 0) {
      chunks.push(chunk);
    }

    // Step forward, taking overlap into account
    index = end - overlap;
    if (index >= cleanText.length || end >= cleanText.length) {
      break;
    }
  }

  return chunks;
}

/**
 * Queries the database using pgvector cosine distance to find the top 5 chunks.
 */
export async function searchContext(query: string, persona: string, limit = 5): Promise<any[]> {
  try {
    const queryEmbedding = await getEmbedding(query);
    const vectorString = `[${queryEmbedding.join(',')}]`;

    // Perform vector search using pgvector operator (<=> is Cosine Distance)
    const results = await prisma.$queryRawUnsafe<any[]>(
      `SELECT id, persona, title, source, url, topic, content, (embedding <=> $1::vector) as distance
       FROM "DocumentChunk"
       WHERE persona = $2
       ORDER BY distance ASC
       LIMIT $3`,
      vectorString,
      persona,
      limit
    );

    return results.map(r => ({
      id: r.id,
      persona: r.persona,
      title: r.title,
      source: r.source,
      url: r.url,
      topic: r.topic,
      content: r.content,
      distance: r.distance
    }));
  } catch (error) {
    console.error('Error searching vector DB:', error);
    return [];
  }
}
