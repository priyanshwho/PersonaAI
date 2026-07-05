'use client';

import * as React from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  MessageSquare,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Sun,
  Moon,
  Bot,
  LayoutDashboard,
} from 'lucide-react';
import { useTheme } from './theme-provider';
import { PERSONAS, Persona } from '../lib/prompts';


interface SidebarProps {
  activePersonaId: string;
  onSelectPersona: (id: string) => void;
  conversations: any[];
  activeConversationId: string | null;
  onSelectConversation: (id: string | null) => void;
  onDeleteConversation: (id: string) => void;
  onNewChat: () => void;
}

export function Sidebar({
  activePersonaId,
  onSelectPersona,
  conversations,
  activeConversationId,
  onSelectConversation,
  onDeleteConversation,
  onNewChat,
}: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const { theme, toggleTheme } = useTheme();

  return (
    <motion.aside
      className={cn(
        'h-screen bg-card border-r border-border flex flex-col z-30 shrink-0 select-none relative transition-all duration-300',
        isCollapsed ? 'w-16' : 'w-76'
      )}
      layout="position"
    >
      {/* Header with Logo */}
      <div className="p-4 flex items-center justify-between border-b border-border min-h-16">
        {!isCollapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2.5 font-bold text-lg tracking-tight text-foreground"
          >
            <Bot className="w-5 h-5 text-primary" />
            <span>AI Mentor</span>
          </motion.div>
        )}
        {isCollapsed && (
          <div className="w-full flex justify-center">
            <Bot className="w-5 h-5 text-primary" />
          </div>
        )}
        {!isCollapsed && (
          <Link
            href="/"
            className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-all duration-150"
            aria-label="Go to Dashboard"
            title="Dashboard"
          >
            <LayoutDashboard className="w-4 h-4" />
          </Link>
        )}
      </div>

      {/* Action Button: New Chat */}
      <div className="p-3">
        <button
          onClick={onNewChat}
          className={cn(
            'w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 active:scale-95 transition-all duration-150 shadow-sm border border-border/10 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 outline-hidden',
            isCollapsed ? 'p-2' : ''
          )}
          aria-label="Start a new chat session"
        >
          <Plus className="w-4 h-4" />
          {!isCollapsed && <span>New Chat</span>}
        </button>
      </div>

      {/* Collapsible Persona Switcher - displays 4 personas in a row */}
      <div className="px-3 py-2 border-b border-border">
        {!isCollapsed && (
          <div className="mb-2 px-1 flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Mentors
            </span>
          </div>
        )}
        <div
          className={cn(
            'flex gap-1.5 justify-between items-center',
            isCollapsed ? 'flex-col py-2' : 'flex-row'
          )}
        >
          {PERSONAS.map((persona) => {
            const isActive = activePersonaId === persona.id;
            return (
              <button
                key={persona.id}
                onClick={() => onSelectPersona(persona.id)}
                className={cn(
                  'relative rounded-full transition-all duration-200 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 outline-hidden group',
                  isActive
                    ? 'ring-2 ring-ring ring-offset-2 ring-offset-background scale-105'
                    : 'opacity-70 hover:opacity-100 hover:scale-105'
                )}
                aria-label={`Switch persona to ${persona.name}`}
              >
                {/* Avatar Image */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={persona.avatar}
                  alt={persona.name}
                  className="w-10 h-10 rounded-full bg-muted border border-border select-none"
                />
                
                {/* Hover Tooltip when collapsed */}
                {isCollapsed && (
                  <div className="absolute left-14 top-1/2 -translate-y-1/2 bg-popover border border-border text-popover-foreground text-xs py-1 px-2 rounded-md shadow-md opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-150 whitespace-nowrap z-50 font-medium">
                    {persona.name}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Recent Conversations */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-1">
        {!isCollapsed && (
          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground block px-2 mb-2 select-none">
            Recent Conversations
          </span>
        )}
        <div className="space-y-1 font-medium">
          {conversations.map((chat) => {
            const isActive = activeConversationId === chat.id;
            return (
              <div
                key={chat.id}
                className={cn(
                  'group flex items-center justify-between rounded-lg transition-colors-custom text-sm focus-within:ring-2 focus-within:ring-ring outline-hidden',
                  isActive
                    ? 'bg-secondary text-secondary-foreground'
                    : 'hover:bg-secondary/50 text-muted-foreground hover:text-foreground'
                )}
              >
                <button
                  onClick={() => onSelectConversation(chat.id)}
                  className="flex-1 flex items-center gap-2.5 py-2 px-2.5 text-left truncate focus:outline-hidden"
                  aria-label={`Open conversation: ${chat.title}`}
                >
                  <MessageSquare className="w-4 h-4 shrink-0" />
                  {!isCollapsed && (
                    <span className="truncate pr-1">{chat.title}</span>
                  )}
                </button>

                {!isCollapsed && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteConversation(chat.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 focus-visible:opacity-100 hover:text-destructive p-1.5 mr-1 rounded-md hover:bg-border/50 transition-all duration-150 focus:outline-hidden"
                    aria-label={`Delete conversation ${chat.title}`}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            );
          })}

          {conversations.length === 0 && !isCollapsed && (
            <div className="text-xs text-muted-foreground text-center py-6 select-none font-medium">
              No recent chats…
            </div>
          )}
        </div>
      </div>

      {/* Footer controls: Collapse Toggle, Theme, Settings */}
      <div className="p-3 border-t border-border flex flex-col gap-2 mt-auto">
        <div className="flex items-center justify-between">
          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-all duration-150 focus-visible:ring-2 focus-visible:ring-ring outline-hidden relative group"
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            role="switch"
            aria-checked={theme === 'dark'}
          >
            {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            {isCollapsed && (
              <div className="absolute left-14 top-1/2 -translate-y-1/2 bg-popover border border-border text-popover-foreground text-xs py-1 px-2 rounded-md shadow-md opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-150 whitespace-nowrap z-50 font-medium">
                Toggle Theme
              </div>
            )}
          </button>

          {/* Sidebar Collapse Button */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-all duration-150 focus-visible:ring-2 focus-visible:ring-ring outline-hidden"
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </motion.aside>
  );
}

// Inline fallback for the class merger to avoid import bugs if utils.ts isn't ready
function cn(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}
