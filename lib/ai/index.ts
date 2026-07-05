import { createGoogleGenerativeAI } from '@ai-sdk/google';

if (!process.env.GEMINI_API_KEY) {
  throw new Error('GEMINI_API_KEY is not defined in environment variables');
}

export const google = createGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export const chatModel = google('gemini-2.5-flash');
export const embeddingModel = google.textEmbeddingModel('gemini-embedding-001');
