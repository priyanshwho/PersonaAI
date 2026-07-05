'use client';

import * as React from 'react';
import { useSearchParams } from 'next/navigation';
import { Sidebar } from '../../components/sidebar';
import { ChatWindow } from '../../components/chat-window';
import { GradientBackground } from '../../components/ui/gradient-backgrounds';
import { PERSONAS } from '../../lib/prompts';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

interface Conversation {
  id: string;
  title: string;
  persona: string;
  updatedAt: string;
}

export default function ChatPage() {
  return (
    <React.Suspense fallback={<div className="flex h-screen items-center justify-center text-muted-foreground text-sm">Loading…</div>}>
      <ChatPageInner />
    </React.Suspense>
  );
}

function ChatPageInner() {
  const searchParams = useSearchParams();
  const personaParam = searchParams.get('persona');
  const validPersona = PERSONAS.find(p => p.id === personaParam);

  const [activePersonaId, setActivePersonaId] = React.useState<string>(
    validPersona ? validPersona.id : 'Hitesh_chaudhary_sir'
  );
  const [conversations, setConversations] = React.useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = React.useState<string | null>(null);
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [latency, setLatency] = React.useState<number | undefined>(undefined);
  
  // Keep track of abort controller for stopping generation
  const abortControllerRef = React.useRef<AbortController | null>(null);

  // Fetch all conversations on mount
  const fetchConversations = React.useCallback(async () => {
    try {
      const res = await fetch('/api/conversations');
      if (res.ok) {
        const data = await res.json();
        setConversations(data);
      }
    } catch (err) {
      console.error('Failed to fetch conversations:', err);
    }
  }, []);

  React.useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  // Load conversation details
  const loadConversation = React.useCallback(async (id: string) => {
    try {
      const res = await fetch(`/api/conversations/${id}`);
      if (res.ok) {
        const data = await res.json();
        setMessages(data.messages);
        setActivePersonaId(data.persona);
        setActiveConversationId(id);
      }
    } catch (err) {
      console.error('Failed to load conversation:', err);
    }
  }, []);

  const handleSelectConversation = (id: string | null) => {
    if (id) {
      loadConversation(id);
    } else {
      handleNewChat();
    }
  };

  const handleNewChat = () => {
    setActiveConversationId(null);
    setMessages([]);
    setLatency(undefined);
  };

  const handleDeleteConversation = async (id: string) => {
    try {
      const res = await fetch(`/api/conversations/${id}`, { method: 'DELETE' });
      if (res.ok) {
        if (activeConversationId === id) {
          handleNewChat();
        }
        fetchConversations();
      }
    } catch (err) {
      console.error('Failed to delete conversation:', err);
    }
  };

  const handleSelectPersona = (id: string) => {
    setActivePersonaId(id);
    handleNewChat();
  };

  // Main sending action with custom stream parser
  const handleSendMessage = async (content: string) => {
    setIsLoading(true);
    setLatency(undefined);
    
    // Create new abort controller
    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    let currentConversationId = activeConversationId;
    
    const userMessageId = Math.random().toString();
    const newUserMessage: Message = { id: userMessageId, role: 'user', content };
    const updatedMessages = [...messages, newUserMessage];
    setMessages(updatedMessages);

    try {
      // 1. If new conversation, create session first
      if (!currentConversationId) {
        const title = content.length > 30 ? `${content.substring(0, 30)}…` : content;
        const res = await fetch('/api/conversations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title, persona: activePersonaId }),
        });
        
        if (!res.ok) throw new Error('Failed to create new conversation');
        const newChat = await res.json();
        currentConversationId = newChat.id;
        setActiveConversationId(currentConversationId);
        fetchConversations();
      }

      // 2. Save user message to database
      await fetch(`/api/conversations/${currentConversationId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: 'user', content }),
      });

      // 3. Initiate streaming query
      const startTime = Date.now();
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updatedMessages,
          persona: activePersonaId,
        }),
        signal: abortController.signal,
      });

      if (!response.ok) {
        throw new Error('Streaming failed');
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error('No stream reader available');

      const decoder = new TextDecoder();
      let assistantContent = '';
      const assistantMessageId = Math.random().toString();
      
      // Place temporary placeholder in message list
      setMessages((prev) => [...prev, { id: assistantMessageId, role: 'assistant', content: '' }]);

      let firstChunkReceived = false;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const textChunk = decoder.decode(value, { stream: true });
        
        // Direct plain text stream appending
        assistantContent += textChunk;

        if (!firstChunkReceived && assistantContent.length > 0) {
          firstChunkReceived = true;
          // Record response latency
          setLatency(Date.now() - startTime);
        }

        // Update content in active stream
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantMessageId ? { ...msg, content: assistantContent } : msg
          )
        );
      }

      // 4. Save generated response to database
      await fetch(`/api/conversations/${currentConversationId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: 'assistant', content: assistantContent }),
      });

      // Refresh list to trigger correct order
      fetchConversations();
    } catch (err: any) {
      if (err.name === 'AbortError') {
        console.log('Generation aborted by user');
      } else {
        console.error('Error in send message loop:', err);
      }
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  };

  const handleStopGeneration = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setIsLoading(false);
    }
  };

  const handleRegenerate = () => {
    if (messages.length === 0 || isLoading) return;
    
    // Find the last user query to resubmit
    const lastUserQueryIndex = [...messages].reverse().findIndex(m => m.role === 'user');
    if (lastUserQueryIndex !== -1) {
      const realIndex = messages.length - 1 - lastUserQueryIndex;
      const lastUserQuery = messages[realIndex].content;
      
      // Truncate message history up to that point
      const truncatedMessages = messages.slice(0, realIndex);
      setMessages(truncatedMessages);
      
      // Resend
      handleSendMessage(lastUserQuery);
    }
  };

  const exportChatMarkdown = () => {
    if (messages.length === 0) return;
    
    const activePersona = PERSONAS.find(p => p.id === activePersonaId) || PERSONAS[0];
    let mdContent = `# AI Mentor Session with ${activePersona.name}\n`;
    mdContent += `Role: ${activePersona.role}\n`;
    mdContent += `Generated: ${new Date().toLocaleString()}\n\n---\n\n`;

    messages.forEach((msg) => {
      mdContent += `### **${msg.role === 'user' ? 'Student' : activePersona.name}**\n\n`;
      mdContent += `${msg.content}\n\n`;
    });

    const blob = new Blob([mdContent], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `ai-mentor-${activePersonaId}-session.md`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background text-foreground transition-colors duration-200">
      {/* Collapsible Sidebar */}
      <Sidebar
        activePersonaId={activePersonaId}
        onSelectPersona={handleSelectPersona}
        conversations={conversations}
        activeConversationId={activeConversationId}
        onSelectConversation={handleSelectConversation}
        onDeleteConversation={handleDeleteConversation}
        onNewChat={handleNewChat}
      />

      {/* Main Interactive Chat Window */}
      <main className="flex-1 flex flex-col min-w-0 relative">
        <ChatWindow
          activePersonaId={activePersonaId}
          messages={messages}
          isLoading={isLoading}
          onSendMessage={handleSendMessage}
          onStopGeneration={handleStopGeneration}
          onRegenerate={handleRegenerate}
          latency={latency}
          exportChatMarkdown={exportChatMarkdown}
        />
      </main>
    </div>
  );
}
