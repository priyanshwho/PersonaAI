import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/db';

// Fetch all conversations
export async function GET() {
  try {
    const conversations = await prisma.conversation.findMany({
      orderBy: { updatedAt: 'desc' },
      include: {
        _count: {
          select: { messages: true },
        },
      },
    });
    return NextResponse.json(conversations);
  } catch (error: any) {
    console.error('Error fetching conversations:', error);
    return NextResponse.json({ error: 'Failed to fetch conversations' }, { status: 500 });
  }
}

// Create a new conversation
export async function POST(req: Request) {
  try {
    const { title, persona } = await req.json();

    if (!title || !persona) {
      return NextResponse.json({ error: 'Title and Persona are required' }, { status: 400 });
    }

    const conversation = await prisma.conversation.create({
      data: {
        title,
        persona,
      },
    });

    return NextResponse.json(conversation);
  } catch (error: any) {
    console.error('Error creating conversation:', error);
    return NextResponse.json({ error: 'Failed to create conversation' }, { status: 500 });
  }
}
