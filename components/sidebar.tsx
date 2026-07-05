'use client';

import * as React from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  MessageSquare,
  Trash2,
  PanelLeft,
  PanelLeftClose,
  Sun,
  Moon,
  Bot,
  LayoutDashboard,
} from 'lucide-react';
import { useTheme } from './theme-provider';
import { PERSONAS } from '../lib/prompts';

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
      className="h-screen bg-[#FDF0EC]/60 dark:bg-[#0d0d0f]/60 backdrop-blur-xl border-r border-border/30 flex flex-col z-30 shrink-0 select-none relative"
      animate={{ width: isCollapsed ? 64 : 280 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      {/* Header with Brand Logo & Collapse trigger */}
      <div className="p-4 flex items-center justify-between border-b border-border/40 min-h-16 shrink-0">
        {!isCollapsed ? (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2.5 font-bold text-sm tracking-tight text-foreground"
            >
              <Bot className="w-5 h-5 text-primary" />
              <span>AI Mentor</span>
            </motion.div>
            
            <button
              onClick={() => setIsCollapsed(true)}
              className="p-1.5 rounded-lg hover:bg-secondary/60 text-muted-foreground hover:text-foreground transition-all duration-150 focus-visible:ring-2 focus-visible:ring-ring outline-hidden"
              aria-label="Collapse sidebar"
              title="Collapse sidebar"
            >
              <PanelLeftClose className="w-4 h-4" />
            </button>
          </>
        ) : (
          <div className="w-full flex justify-center">
            <button
              onClick={() => setIsCollapsed(false)}
              className="p-1.5 rounded-lg hover:bg-secondary/60 text-muted-foreground hover:text-foreground transition-all duration-150 focus-visible:ring-2 focus-visible:ring-ring outline-hidden"
              aria-label="Expand sidebar"
              title="Expand sidebar"
            >
              <PanelLeft className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Action Button: Start a New Chat */}
      <div className="p-3 shrink-0">
        <button
          onClick={onNewChat}
          className={cn(
            'w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-foreground text-background font-bold text-xs hover:opacity-90 active:scale-95 transition-all duration-150 shadow-sm border border-border/10 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 outline-hidden',
            isCollapsed ? 'p-2' : ''
          )}
          aria-label="Start a new chat session"
        >
          <Plus className="w-4 h-4" />
          {!isCollapsed && <span>New Chat</span>}
        </button>
      </div>

      {/* Collapsible Mentor Switcher */}
      <div className="px-3 py-2 border-b border-border/40 shrink-0">
        {!isCollapsed && (
          <div className="mb-2 px-1">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground">
              Mentors
            </span>
          </div>
        )}
        <div className={`flex gap-1.5 justify-between items-center ${isCollapsed ? 'flex-col py-2' : 'flex-row'}`}>
          {PERSONAS.map((persona) => {
            const isActive = activePersonaId === persona.id;
            return (
              <button
                key={persona.id}
                onClick={() => onSelectPersona(persona.id)}
                className={cn(
                  'relative rounded-full transition-all duration-200 focus-visible:ring-2 focus-visible:ring-ring outline-hidden group shrink-0',
                  isActive
                    ? 'ring-2 ring-foreground ring-offset-2 ring-offset-background scale-105'
                    : 'opacity-70 hover:opacity-100 hover:scale-105'
                )}
                aria-label={`Switch persona to ${persona.name}`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={persona.avatar}
                  alt={persona.name}
                  className="w-10 h-10 rounded-full bg-muted border border-border/60 select-none"
                />
                
                {isCollapsed && (
                  <div className="absolute left-14 top-1/2 -translate-y-1/2 bg-popover border border-border text-popover-foreground text-xs py-1.5 px-2.5 rounded-lg shadow-md opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-150 whitespace-nowrap z-50 font-semibold">
                    {persona.name}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Recent Conversations Scrollable list */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-1">
        {!isCollapsed && (
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground block px-2 mb-2 select-none">
            Recent Conversations
          </span>
        )}
        <div className="space-y-1 font-semibold">
          {conversations.map((chat) => {
            const isActive = activeConversationId === chat.id;
            return (
              <div
                key={chat.id}
                className={cn(
                  'group flex items-center justify-between rounded-xl transition-all duration-150 text-xs focus-within:ring-2 focus-within:ring-ring outline-hidden',
                  isActive
                    ? 'bg-secondary text-foreground'
                    : 'hover:bg-secondary/40 text-muted-foreground hover:text-foreground'
                )}
              >
                <button
                  onClick={() => onSelectConversation(chat.id)}
                  className="flex-1 flex items-center gap-2.5 py-2.5 px-3 text-left truncate focus:outline-hidden"
                  aria-label={`Open conversation: ${chat.title}`}
                >
                  <MessageSquare className="w-3.5 h-3.5 shrink-0" />
                  {!isCollapsed && (
                    <span className="truncate pr-1 font-medium">{chat.title}</span>
                  )}
                </button>

                {!isCollapsed && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteConversation(chat.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 focus-visible:opacity-100 hover:text-destructive p-1.5 mr-1.5 rounded-lg hover:bg-border/40 transition-all duration-150 focus:outline-hidden"
                    aria-label={`Delete conversation ${chat.title}`}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            );
          })}

          {conversations.length === 0 && !isCollapsed && (
            <div className="text-[11px] text-muted-foreground text-center py-8 select-none font-medium">
              No recent chats…
            </div>
          )}
        </div>
      </div>

      {/* Footer controls: Theme toggle & Dashboard navigation */}
      <div className="p-3 border-t border-border/40 flex flex-col gap-2 mt-auto shrink-0">
        <div className="flex items-center justify-between">
          {/* Theme Switcher */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-secondary/60 text-muted-foreground hover:text-foreground transition-all duration-150 focus-visible:ring-2 focus-visible:ring-ring outline-hidden relative group"
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? <Moon className="w-4.5 h-4.5" /> : <Sun className="w-4.5 h-4.5" />}
            {isCollapsed && (
              <div className="absolute left-14 top-1/2 -translate-y-1/2 bg-popover border border-border text-popover-foreground text-xs py-1.5 px-2.5 rounded-lg shadow-md opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-150 whitespace-nowrap z-50 font-semibold">
                Toggle Theme
              </div>
            )}
          </button>

          {/* Go to Dashboard button */}
          <Link
            href="/"
            className="p-2 rounded-lg hover:bg-secondary/60 text-muted-foreground hover:text-foreground transition-all duration-150 focus-visible:ring-2 focus-visible:ring-ring outline-hidden relative group"
            aria-label="Go to Dashboard"
            title="Go to Dashboard"
          >
            <LayoutDashboard className="w-4.5 h-4.5" />
            {isCollapsed && (
              <div className="absolute left-14 top-1/2 -translate-y-1/2 bg-popover border border-border text-popover-foreground text-xs py-1.5 px-2.5 rounded-lg shadow-md opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-150 whitespace-nowrap z-50 font-semibold">
                Dashboard
              </div>
            )}
          </Link>
        </div>
      </div>
    </motion.aside>
  );
}

// Inline fallback for layout class joiner
function cn(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}
