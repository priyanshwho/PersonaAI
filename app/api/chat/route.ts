import { NextResponse } from 'next/server';
import { streamText, generateText } from 'ai';
import { chatModel } from '../../../lib/ai';
import { searchContext } from '../../../lib/rag';
import { getSystemPrompt } from '../../../lib/prompts';

export const maxDuration = 30; // Max API duration 30 seconds

export async function POST(req: Request) {
  try {
    const { messages, persona } = await req.json();

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: 'Messages are required' }, { status: 400 });
    }
    if (!persona) {
      return NextResponse.json({ error: 'Persona ID is required' }, { status: 400 });
    }

    // 1. Get latest user message for RAG query
    const lastUserMessage = messages[messages.length - 1]?.content || '';
    
    // 2. Perform pgvector similarity search on Neon PostgreSQL (Filtered by Persona)
    let contextText = '';
    try {
      const chunks = await searchContext(lastUserMessage, persona, 5);
      if (chunks && chunks.length > 0) {
        contextText = chunks
          .map(
            (c, idx) =>
              `[Document ${idx + 1}: ${c.title} (${c.source})]\nTopic: ${c.topic}\nContent: ${c.content}\nSource Link: ${c.url}`
          )
          .join('\n\n');
      }
    } catch (err) {
      console.error('Error fetching context chunks:', err);
    }

    // 3. Summarize conversation history if it exceeds 8 messages
    let summaryContext = '';
    let chatMessagesToRun = messages;

    if (messages.length > 8) {
      const olderMessages = messages.slice(0, messages.length - 8);
      chatMessagesToRun = messages.slice(-8);

      const conversationHistoryText = olderMessages
        .map((m: any) => `${m.role === 'user' ? 'Student' : 'Mentor'}: ${m.content}`)
        .join('\n');

      try {
        const { text } = await generateText({
          model: chatModel,
          prompt: `Summarize the following educational discussion between a student and their programming mentor in 2-3 sentences. Focus on the core topics and final advice discussed:\n\n${conversationHistoryText}`,
        });
        summaryContext = `SUMMARY OF PREVIOUS DISCUSSIONS:\n${text}\n\n`;
      } catch (sumErr) {
        console.error('Failed to summarize older messages:', sumErr);
      }
    }

    // 4. Construct final system prompt
    const baseSystemPrompt = getSystemPrompt(persona, contextText);
    const finalSystemPrompt = `${baseSystemPrompt}\n\n${summaryContext ? summaryContext : ''}`;

    // 5. Stream response using streamText from Vercel AI SDK
    const result = streamText({
      model: chatModel,
      system: finalSystemPrompt,
      messages: chatMessagesToRun.map((m: any) => ({
        role: m.role,
        content: m.content,
      })),
    });

    return result.toTextStreamResponse();
  } catch (error: any) {
    console.error('API Error in /api/chat:', error);
    return NextResponse.json({ error: error?.message || 'Internal Server Error' }, { status: 500 });
  }
}
