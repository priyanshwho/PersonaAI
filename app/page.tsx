'use client';

import * as React from 'react';
import Link from 'next/link';
import { PERSONAS } from '../lib/prompts';
import {
  Brain,
  MessageSquare,
  Zap,
  BookOpen,
  ArrowRight,
  Sparkles,
  Clock,
  ChevronRight,
  Moon,
  Sun,
} from 'lucide-react';

// ── Minimal theme toggle ──────────────────────────────────────────────────────
function ThemeToggle() {
  const [dark, setDark] = React.useState(false);
  React.useEffect(() => {
    const stored = localStorage.getItem('theme');
    const isDark = stored === 'dark' || (!stored && window.matchMedia('(prefers-color-scheme: dark)').matches);
    setDark(isDark);
    document.documentElement.classList.toggle('dark', isDark);
  }, []);
  const toggle = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle('dark', next);
    localStorage.setItem('theme', next ? 'dark' : 'light');
  };
  return (
    <button
      onClick={toggle}
      aria-label="Toggle theme"
      className="p-2 rounded-xl border border-border bg-card hover:bg-secondary text-muted-foreground hover:text-foreground transition-all duration-150"
    >
      {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
    </button>
  );
}

// ── Persona accent colours (one per mentor) ───────────────────────────────────
const PERSONA_META: Record<string, { from: string; to: string; emoji: string }> = {
  Hitesh_chaudhary_sir: { from: '#f97316', to: '#fb923c', emoji: '🔥' },
  Piyush_garg_sir:      { from: '#6366f1', to: '#818cf8', emoji: '⚡' },
  Suraj_jha_sir:        { from: '#10b981', to: '#34d399', emoji: '🧠' },
  Anirudh_jwala:        { from: '#8b5cf6', to: '#a78bfa', emoji: '🎨' },
};

// ── Stat card ─────────────────────────────────────────────────────────────────
function StatCard({ icon: Icon, label, value, sub }: { icon: React.ElementType; label: string; value: string; sub: string }) {
  return (
    <div className="flex-1 min-w-0 rounded-2xl border border-border bg-card p-5 flex flex-col gap-2">
      <div className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center">
        <Icon className="w-4 h-4 text-muted-foreground" />
      </div>
      <p className="text-2xl font-bold tabular-nums text-foreground">{value}</p>
      <p className="text-xs font-medium text-foreground leading-snug">{label}</p>
      <p className="text-xs text-muted-foreground">{sub}</p>
    </div>
  );
}

// ── Recent conversation pill ──────────────────────────────────────────────────
interface Conv { id: string; title: string; persona: string; updatedAt: string }
function ConvRow({ conv }: { conv: Conv }) {
  const meta = PERSONA_META[conv.persona] ?? PERSONA_META['Hitesh_chaudhary_sir'];
  const persona = PERSONAS.find(p => p.id === conv.persona);
  const ago = (() => {
    const diff = Date.now() - new Date(conv.updatedAt).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  })();
  return (
    <Link
      href={`/chat?persona=${conv.persona}`}
      className="flex items-center gap-3 p-3 rounded-xl hover:bg-secondary transition-all duration-150 group"
    >
      {/* avatar */}
      <div
        className="w-9 h-9 rounded-full shrink-0 overflow-hidden border border-border"
        style={{ background: `linear-gradient(135deg, ${meta.from}, ${meta.to})` }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={persona?.avatar} alt={persona?.name} className="w-full h-full object-cover" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-foreground truncate">{conv.title}</p>
        <p className="text-xs text-muted-foreground truncate">{persona?.name}</p>
      </div>
      <div className="flex items-center gap-1.5 shrink-0">
        <span className="text-xs text-muted-foreground">{ago}</span>
        <ChevronRight className="w-3.5 h-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
    </Link>
  );
}

// ── Mentor card ───────────────────────────────────────────────────────────────
function MentorCard({ persona }: { persona: (typeof PERSONAS)[number] }) {
  const meta = PERSONA_META[persona.id] ?? PERSONA_META['Hitesh_chaudhary_sir'];
  return (
    <Link
      href={`/chat?persona=${persona.id}`}
      className="group relative flex flex-col rounded-2xl border border-border bg-card overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-200"
    >
      {/* gradient strip */}
      <div
        className="h-1.5 w-full"
        style={{ background: `linear-gradient(90deg, ${meta.from}, ${meta.to})` }}
      />

      <div className="p-5 flex flex-col gap-4 flex-1">
        {/* header row */}
        <div className="flex items-start gap-3">
          <div
            className="w-12 h-12 rounded-2xl shrink-0 overflow-hidden border border-border"
            style={{ background: `linear-gradient(135deg, ${meta.from}22, ${meta.to}33)` }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={persona.avatar} alt={persona.name} className="w-full h-full object-cover" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-foreground">{persona.name}</p>
            <p className="text-xs text-muted-foreground leading-snug mt-0.5">{persona.role}</p>
          </div>
          <span className="text-xl">{meta.emoji}</span>
        </div>

        {/* description */}
        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">{persona.description}</p>

        {/* tags */}
        <div className="flex flex-wrap gap-1.5">
          {persona.tags.slice(0, 3).map(tag => (
            <span
              key={tag}
              className="text-[10px] font-semibold px-2 py-0.5 rounded-full border border-border bg-secondary text-muted-foreground"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* sample question */}
        <div className="mt-auto pt-3 border-t border-border/60">
          <p className="text-[11px] text-muted-foreground italic line-clamp-2">
            &ldquo;{persona.suggestedQuestions[0]}&rdquo;
          </p>
        </div>
      </div>

      {/* hover CTA */}
      <div className="px-5 pb-5">
        <div
          className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-xs font-bold text-white transition-all duration-150 group-hover:brightness-110"
          style={{ background: `linear-gradient(90deg, ${meta.from}, ${meta.to})` }}
        >
          Start Learning <ArrowRight className="w-3.5 h-3.5" />
        </div>
      </div>
    </Link>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function DashboardPage() {
  const [conversations, setConversations] = React.useState<Conv[]>([]);
  const [loadingConvs, setLoadingConvs] = React.useState(true);

  React.useEffect(() => {
    fetch('/api/conversations')
      .then(r => r.json())
      .then(data => setConversations(Array.isArray(data) ? data : []))
      .catch(() => setConversations([]))
      .finally(() => setLoadingConvs(false));
  }, []);

  const totalConvs = conversations.length;
  const mentorsUsed = new Set(conversations.map(c => c.persona)).size;
  const recent = conversations.slice(0, 5);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* ── NAV ── */}
      <header className="sticky top-0 z-40 border-b border-border bg-card/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-foreground flex items-center justify-center">
              <Brain className="w-4 h-4 text-background" />
            </div>
            <span className="font-bold text-sm text-foreground">AI Mentor</span>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/chat"
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-foreground text-background text-xs font-bold hover:opacity-90 transition-all duration-150"
            >
              <MessageSquare className="w-3.5 h-3.5" /> Open Chat
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-10 space-y-12">
        {/* ── HERO ── */}
        <section className="text-center space-y-4 pt-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-border bg-secondary text-muted-foreground text-xs font-semibold">
            <Sparkles className="w-3 h-3" /> Powered by Google Gemini 2.5 Flash
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-foreground tracking-tight">
            Learn from the Best.<br />
            <span className="bg-gradient-to-r from-orange-500 via-violet-500 to-emerald-500 bg-clip-text text-transparent">
              On your terms.
            </span>
          </h1>
          <p className="max-w-xl mx-auto text-base text-muted-foreground leading-relaxed">
            Chat with AI mentors inspired by India's best programming educators.
            Each mentor brings a unique teaching style — from first-principles to production-ready systems.
          </p>
          <div className="flex items-center justify-center gap-3 pt-2">
            <Link
              href="/chat"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-foreground text-background text-sm font-bold hover:opacity-90 active:scale-95 transition-all duration-150"
            >
              Get Started <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/chat?persona=Suraj_jha_sir"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-border bg-card text-foreground text-sm font-semibold hover:bg-secondary active:scale-95 transition-all duration-150"
            >
              <BookOpen className="w-4 h-4" /> Explore Mentors
            </Link>
          </div>
        </section>

        {/* ── STATS ── */}
        <section className="flex flex-col sm:flex-row gap-3">
          <StatCard icon={MessageSquare} label="Total conversations" value={String(totalConvs)} sub={totalConvs === 0 ? 'Start your first chat!' : 'Keep it up!'} />
          <StatCard icon={Brain} label="Mentors used" value={`${mentorsUsed} / 4`} sub="Try all four teaching styles" />
          <StatCard icon={Zap} label="AI responses" value={totalConvs > 0 ? `${totalConvs * 3}+` : '0'} sub="Streamed in real-time" />
          <StatCard icon={BookOpen} label="Knowledge sources" value="4" sub="Persona-specific RAG context" />
        </section>

        {/* ── MENTORS GRID ── */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-foreground">Choose your Mentor</h2>
              <p className="text-xs text-muted-foreground mt-0.5">Click any card to start a conversation</p>
            </div>
            <Link href="/chat" className="text-xs text-muted-foreground hover:text-foreground font-semibold flex items-center gap-1 transition-colors">
              Open Chat <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {PERSONAS.map(p => <MentorCard key={p.id} persona={p} />)}
          </div>
        </section>

        {/* ── RECENT CONVERSATIONS ── */}
        <section className="space-y-4 pb-10">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <h2 className="text-lg font-bold text-foreground">Recent Conversations</h2>
          </div>

          <div className="rounded-2xl border border-border bg-card overflow-hidden">
            {loadingConvs ? (
              <div className="p-8 text-center text-sm text-muted-foreground animate-pulse">Loading…</div>
            ) : recent.length === 0 ? (
              <div className="p-10 flex flex-col items-center gap-3 text-center">
                <MessageSquare className="w-8 h-8 text-muted-foreground/40" />
                <p className="text-sm font-semibold text-muted-foreground">No conversations yet</p>
                <p className="text-xs text-muted-foreground">Choose a mentor above to get started!</p>
              </div>
            ) : (
              <div className="divide-y divide-border p-2">
                {recent.map(c => <ConvRow key={c.id} conv={c} />)}
              </div>
            )}
            {recent.length > 0 && (
              <div className="border-t border-border p-3 text-center">
                <Link href="/chat" className="text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors">
                  View all in Chat →
                </Link>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
