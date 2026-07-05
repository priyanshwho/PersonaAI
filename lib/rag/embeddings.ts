import { embed } from 'ai';
import { embeddingModel } from '../ai';

/**
 * Generates vector embedding (768 dimensions) for the given input text using gemini-embedding-001.
 */
export async function getEmbedding(text: string): Promise<number[]> {
  try {
    const { embedding } = await embed({
      model: embeddingModel,
      value: text.replace(/\n/g, ' '), // sanitize newline characters for better embedding quality
      providerOptions: {
        google: {
          outputDimensionality: 768, // Match 768 dimensions in pgvector using Matryoshka
        },
      },
    });
    return embedding;
  } catch (error) {
    console.error('Error generating embedding:', error);
    throw error;
  }
}
