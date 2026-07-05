import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/db';

type RouteContext = { params: Promise<{ id: string }> };

// Retrieve a single conversation history
export async function GET(req: Request, context: RouteContext) {
  try {
    const { id } = await context.params;

    const conversation = await prisma.conversation.findUnique({
      where: { id },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (!conversation) {
      return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });
    }

    return NextResponse.json(conversation);
  } catch (error: any) {
    console.error('Error fetching conversation:', error);
    return NextResponse.json({ error: 'Failed to fetch conversation' }, { status: 500 });
  }
}

// Delete a conversation
export async function DELETE(req: Request, context: RouteContext) {
  try {
    const { id } = await context.params;

    await prisma.conversation.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting conversation:', error);
    return NextResponse.json({ error: 'Failed to delete conversation' }, { status: 500 });
  }
}

// Save a new message inside a conversation
export async function POST(req: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const { role, content } = await req.json();

    if (!role || !content) {
      return NextResponse.json({ error: 'Role and Content are required' }, { status: 400 });
    }

    const message = await prisma.message.create({
      data: {
        conversationId: id,
        role,
        content,
      },
    });

    // Update conversation updatedAt timestamp
    await prisma.conversation.update({
      where: { id },
      data: { updatedAt: new Date() },
    });

    return NextResponse.json(message);
  } catch (error: any) {
    console.error('Error saving message:', error);
    return NextResponse.json({ error: 'Failed to save message' }, { status: 500 });
  }
}
