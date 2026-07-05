'use client';

import * as React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  Send,
  Loader2,
  Copy,
  Check,
  RefreshCw,
  StopCircle,
  Download,
  Share2,
  User,
  Sparkles,
} from 'lucide-react';
import { Persona, PERSONAS } from '../lib/prompts';
import {
  ProfileCard,
  ProfileCardAvatar,
  ProfileCardHeader,
  ProfileCardTitle,
  ProfileCardDescription,
  ProfileCardContent,
  ProfileCardTags,
  ProfileCardActions,
} from './profile/profile-card';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt?: string;
}

interface ChatWindowProps {
  activePersonaId: string;
  messages: Message[];
  isLoading: boolean;
  onSendMessage: (content: string) => void;
  onStopGeneration: () => void;
  onRegenerate: () => void;
  latency?: number; // Response latency in ms
  exportChatMarkdown: () => void;
}

export function ChatWindow({
  activePersonaId,
  messages,
  isLoading,
  onSendMessage,
  onStopGeneration,
  onRegenerate,
  latency,
  exportChatMarkdown,
}: ChatWindowProps) {
  const [input, setInput] = React.useState('');
  const [copiedId, setCopiedId] = React.useState<string | null>(null);
  
  const messagesEndRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLTextAreaElement>(null);
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);

  const activePersona = PERSONAS.find((p) => p.id === activePersonaId) || PERSONAS[0];

  // Auto-scroll logic with auto-fallback for active typing/streaming
  const scrollToBottom = React.useCallback((behavior: 'smooth' | 'auto' = 'smooth') => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      setTimeout(() => {
        container.scrollTo({
          top: container.scrollHeight,
          behavior,
        });
      }, 30);
    }
  }, []);

  React.useEffect(() => {
    scrollToBottom(isLoading ? 'auto' : 'smooth');
  }, [messages, isLoading, scrollToBottom]);

  // Reset scroll to top when active persona changes
  React.useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
    }
  }, [activePersonaId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    onSendMessage(input.trim());
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSuggestedQuestion = (question: string) => {
    onSendMessage(question);
  };

  return (
    <section
      className="flex-1 flex flex-col h-screen bg-transparent relative focus:outline-hidden"
      id="main-content"
      tabIndex={-1}
    >
      {/* Mentor Top Nav Header */}
      <header className="py-2.5 px-4 border-b border-border/20 flex items-center justify-between bg-transparent min-h-14 z-10 shrink-0">
        <div className="flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={activePersona.avatar}
            alt={activePersona.name}
            className="w-10 h-10 rounded-full border border-border select-none"
          />
          <div>
            <h1 className="font-bold text-base leading-tight text-foreground select-none">
              {activePersona.name}
            </h1>
            <p className="text-xs text-muted-foreground font-medium select-none">
              {activePersona.role}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {messages.length > 0 && (
            <button
              onClick={exportChatMarkdown}
              className="p-2 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-all duration-150 focus-visible:ring-2 focus-visible:ring-ring outline-hidden"
              aria-label="Export chat session to markdown file"
            >
              <Download className="w-4 h-4" />
            </button>
          )}
        </div>
      </header>

      {/* Main Messages View Area */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6" ref={scrollContainerRef}>
        {messages.length === 0 ? (
          // Welcome Screen with ProfileCard and Suggested Questions
          <div className="max-w-2xl mx-auto py-12 flex flex-col justify-center">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-extrabold tracking-tight text-foreground mb-2 flex items-center justify-center gap-2 balance">
                <Sparkles className="w-6 h-6 text-yellow-500 animate-pulse" />
                Meet Your AI Mentor
              </h2>
              <p className="text-sm text-muted-foreground max-w-md mx-auto">
                Select questions below or write your own to start learning from first principles.
              </p>
            </div>

            {/* ProfileCard Compound Component */}
            <ProfileCard className="mb-6 shadow-md border-border/70">
              <div className="flex items-start gap-4">
                <ProfileCardAvatar
                  src={activePersona.avatar}
                  alt={activePersona.name}
                />
                <ProfileCardHeader className="flex-1">
                  <ProfileCardTitle>{activePersona.name}</ProfileCardTitle>
                  <ProfileCardDescription>
                    {activePersona.role}
                  </ProfileCardDescription>
                </ProfileCardHeader>
              </div>
              <ProfileCardContent className="mt-3 text-muted-foreground text-sm font-medium">
                {activePersona.description}
              </ProfileCardContent>
              <ProfileCardTags tags={activePersona.tags} />
            </ProfileCard>

            {/* Suggested Questions Grid */}
            <div className="space-y-2.5">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground px-1 select-none">
                Suggested Questions
              </span>
              <div className="grid gap-2 grid-cols-1">
                {activePersona.suggestedQuestions.map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSuggestedQuestion(q)}
                    className="text-left w-full p-3.5 rounded-xl border border-border bg-card hover:bg-secondary hover:border-muted-foreground/30 text-sm font-medium transition-all duration-200 focus-visible:ring-2 focus-visible:ring-ring outline-hidden text-foreground hover:scale-[1.01] active:scale-[0.99] shadow-2xs"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          // Chat Messages List
          <div className="max-w-3xl mx-auto space-y-6">
            {messages.map((message) => {
              const isUser = message.role === 'user';
              return (
                <div
                  key={message.id}
                  className={`flex gap-4 ${isUser ? 'justify-end' : 'justify-start'}`}
                >
                  {/* Avatar left-side for Assistant */}
                  {!isUser && (
                    <div className="w-8 h-8 rounded-full overflow-hidden border border-border bg-muted shrink-0 select-none">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={activePersona.avatar}
                        alt={activePersona.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  {/* Message Bubble */}
                  <div
                    className={`max-w-[85%] rounded-2xl p-4 shadow-2xs relative group border ${
                      isUser
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'bg-card text-foreground border-border'
                    }`}
                  >
                    {/* Render message content */}
                    {isUser ? (
                      <p className="text-sm leading-relaxed whitespace-pre-wrap font-medium break-words">
                        {message.content}
                      </p>
                    ) : (
                      <div className="prose prose-sm dark:prose-invert max-w-none text-sm leading-relaxed font-medium break-words space-y-3">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {message.content}
                        </ReactMarkdown>
                      </div>
                    )}

                    {/* Latency and Action triggers inside bubble */}
                    {!isUser && (
                      <div className="flex items-center justify-end mt-3 pt-2 border-t border-border/30 text-2xs text-muted-foreground">
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                          <button
                            onClick={() => copyToClipboard(message.content, message.id)}
                            className="p-1 rounded-md hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors duration-150"
                            aria-label="Copy response text"
                          >
                            {copiedId === message.id ? (
                              <Check className="w-3.5 h-3.5 text-green-500" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Avatar right-side for User */}
                  {isUser && (
                    <div className="w-8 h-8 rounded-full overflow-hidden border border-border bg-secondary flex items-center justify-center shrink-0 select-none">
                      <User className="w-4 h-4 text-muted-foreground" />
                    </div>
                  )}
                </div>
              );
            })}

            {/* In-progress streaming indicators */}
            {isLoading && (
              <div className="flex gap-4 justify-start">
                <div className="w-8 h-8 rounded-full overflow-hidden border border-border bg-muted shrink-0 select-none animate-pulse">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={activePersona.avatar}
                    alt={activePersona.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div
                  className="max-w-[85%] rounded-2xl p-4 bg-card text-foreground border border-border shadow-2xs flex items-center gap-2 text-sm font-medium"
                  aria-live="polite"
                >
                  <Loader2 className="w-4 h-4 text-muted-foreground animate-spin" aria-hidden="true" />
                  <span>Thinking…</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Message Input Form Area */}
      <footer className="p-4 border-t border-border bg-card/30 backdrop-blur-md shrink-0 z-10">
        <div className="max-w-3xl mx-auto">
          {/* Controls if generating stream */}
          {isLoading && (
            <div className="flex justify-center mb-2">
              <button
                onClick={onStopGeneration}
                className="flex items-center gap-1.5 py-1 px-3 rounded-full bg-destructive text-destructive-foreground hover:opacity-90 font-bold text-xs shadow-sm active:scale-95 transition-all duration-150 focus:outline-hidden"
              >
                <StopCircle className="w-3.5 h-3.5" />
                <span>Stop Generating</span>
              </button>
            </div>
          )}

          {!isLoading && messages.length > 0 && (
            <div className="flex justify-center mb-2">
              <button
                onClick={onRegenerate}
                className="flex items-center gap-1.5 py-1 px-3 rounded-full bg-secondary hover:bg-secondary/80 text-muted-foreground hover:text-foreground font-bold text-xs border border-border shadow-sm active:scale-95 transition-all duration-150 focus:outline-hidden"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Regenerate Response</span>
              </button>
            </div>
          )}

          <form onSubmit={handleSubmit} className="relative">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask anything, learn from first principles…"
              className="w-full min-h-12 max-h-40 pl-4 pr-12 py-3 rounded-xl border border-border bg-card text-foreground text-sm font-medium focus:outline-hidden focus-visible:ring-2 focus-visible:ring-ring resize-none"
              rows={1}
              disabled={isLoading}
              aria-label="Message prompt input"
              name="message"
              autoComplete="off"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 p-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 active:scale-95 disabled:opacity-40 disabled:scale-100 transition-all duration-150 focus:outline-hidden"
              aria-label="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </footer>
    </section>
  );
}

// Inline helper to get message index for timing metric
function idxOf(arr: any[], id: string) {
  return arr.findIndex((x) => x.id === id);
}
