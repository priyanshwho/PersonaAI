'use client';

import * as React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { RadialGlowBackground } from '../components/ui/radial-glow-background';
import { PERSONAS } from '../lib/prompts';
import {
  Brain,
  MessageSquare,
  ArrowRight,
  Sparkles,
  Clock,
  ChevronRight,
  Moon,
  Sun,
  Zap,
  BookOpen,
  Users,
} from 'lucide-react';

// ─── Persona accent config ──────────────────────────────────────────────────
const ACCENT: Record<string, { from: string; to: string; glow: string; emoji: string; label: string }> = {
  Hitesh_chaudhary_sir: { from: '#f97316', to: '#fbbf24', glow: 'rgba(249,115,22,0.18)', emoji: '🔥', label: 'orange' },
  Piyush_garg_sir:      { from: '#6366f1', to: '#8b5cf6', glow: 'rgba(99,102,241,0.18)',  emoji: '⚡', label: 'violet' },
  Suraj_jha_sir:        { from: '#10b981', to: '#06b6d4', glow: 'rgba(16,185,129,0.18)',  emoji: '🧠', label: 'emerald' },
  Anirudh_jwala:        { from: '#8b5cf6', to: '#ec4899', glow: 'rgba(139,92,246,0.18)',  emoji: '🎨', label: 'purple' },
};

// ─── Motion variants ────────────────────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show:   { opacity: 1, y: 0,  transition: { duration: 0.55, ease: 'easeOut' as const } },
};
const stagger = {
  show: { transition: { staggerChildren: 0.09 } },
};

// ─── Theme toggle ────────────────────────────────────────────────────────────
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
      aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
      className="w-9 h-9 flex items-center justify-center rounded-xl glass hover:bg-secondary/60 text-muted-foreground hover:text-foreground transition-all duration-200"
    >
      {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
    </button>
  );
}

// ─── Stat pill ───────────────────────────────────────────────────────────────
function StatPill({ icon: Icon, value, label }: { icon: React.ElementType; value: string; label: string }) {
  return (
    <motion.div
      variants={fadeUp}
      className="flex items-center gap-3 px-5 py-3.5 rounded-2xl glass"
    >
      <div className="w-8 h-8 rounded-xl bg-secondary/80 flex items-center justify-center shrink-0">
        <Icon className="w-4 h-4 text-muted-foreground" />
      </div>
      <div>
        <p className="text-lg font-bold text-foreground leading-none tabular-nums">{value}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
      </div>
    </motion.div>
  );
}

// ─── Mentor card ─────────────────────────────────────────────────────────────
function MentorCard({ persona, index }: { persona: (typeof PERSONAS)[number]; index: number }) {
  const acc = ACCENT[persona.id] ?? ACCENT['Hitesh_chaudhary_sir'];
  const [hovered, setHovered] = React.useState(false);

  return (
    <motion.div variants={fadeUp}>
      <Link
        href={`/chat?persona=${persona.id}`}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="group relative flex flex-col h-full rounded-3xl overflow-hidden transition-all duration-300 hover:-translate-y-1.5"
        style={{
          boxShadow: hovered
            ? `0 20px 60px -10px ${acc.glow}, 0 0 0 1px color-mix(in srgb, var(--border) 60%, transparent)`
            : `0 1px 2px 0 rgba(0,0,0,0.06), 0 0 0 1px color-mix(in srgb, var(--border) 80%, transparent)`,
        }}
      >
        {/* Glass card background */}
        <div className="absolute inset-0 glass rounded-3xl" />

        {/* Gradient top accent bar */}
        <div
          className="relative h-1 w-full rounded-t-3xl"
          style={{ background: `linear-gradient(90deg, ${acc.from}, ${acc.to})` }}
        />

        {/* Ambient glow blob (visible on hover) */}
        <motion.div
          className="absolute -top-10 -right-10 w-40 h-40 rounded-full blur-3xl pointer-events-none"
          style={{ background: acc.glow }}
          animate={{ opacity: hovered ? 1 : 0 }}
          transition={{ duration: 0.4 }}
        />

        {/* Content */}
        <div className="relative flex flex-col gap-4 p-6 flex-1">
          {/* Avatar + name row */}
          <div className="flex items-start gap-4">
            <div
              className="relative w-14 h-14 rounded-2xl overflow-hidden shrink-0 border border-border/50"
              style={{ background: `linear-gradient(135deg, ${acc.from}22, ${acc.to}33)` }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={persona.avatar}
                alt={persona.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-lg">{acc.emoji}</span>
                <p className="text-sm font-bold text-foreground leading-tight">{persona.name}</p>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5 leading-snug">{persona.role}</p>
            </div>
          </div>

          {/* Description */}
          <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">{persona.description}</p>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5">
            {persona.tags.slice(0, 3).map(tag => (
              <span
                key={tag}
                className="text-[10px] font-semibold px-2.5 py-1 rounded-full"
                style={{
                  background: `${acc.from}18`,
                  color: acc.from,
                  border: `1px solid ${acc.from}30`,
                }}
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Sample question */}
          <div className="mt-auto pt-4 border-t border-border/40">
            <p className="text-[11px] text-muted-foreground/80 italic line-clamp-2">
              &ldquo;{persona.suggestedQuestions[0]}&rdquo;
            </p>
          </div>
        </div>

        {/* CTA footer */}
        <div className="relative px-6 pb-6">
          <div
            className="flex items-center justify-center gap-2 w-full py-3 rounded-2xl text-xs font-bold text-white transition-all duration-200 group-hover:brightness-105 group-hover:shadow-md"
            style={{ background: `linear-gradient(135deg, ${acc.from}, ${acc.to})` }}
          >
            Start Learning
            <motion.span
              animate={{ x: hovered ? 4 : 0 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
            >
              <ArrowRight className="w-3.5 h-3.5" />
            </motion.span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

// ─── Recent conversation row ─────────────────────────────────────────────────
interface Conv { id: string; title: string; persona: string; updatedAt: string }
function ConvRow({ conv, index }: { conv: Conv; index: number }) {
  const acc = ACCENT[conv.persona] ?? ACCENT['Hitesh_chaudhary_sir'];
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
    <motion.div
      variants={fadeUp}
      custom={index}
    >
      <Link
        href={`/chat?persona=${conv.persona}`}
        className="flex items-center gap-3.5 px-4 py-3 rounded-2xl hover:bg-secondary/50 transition-all duration-150 group"
      >
        <div
          className="w-9 h-9 rounded-xl overflow-hidden shrink-0 border border-border/50"
          style={{ background: `linear-gradient(135deg, ${acc.from}22, ${acc.to}33)` }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={persona?.avatar} alt={persona?.name} className="w-full h-full object-cover" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-foreground truncate">{conv.title}</p>
          <p className="text-xs text-muted-foreground">{persona?.name}</p>
        </div>
        <div className="flex items-center gap-1.5 shrink-0 text-muted-foreground">
          <span className="text-xs">{ago}</span>
          <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all duration-150" />
        </div>
      </Link>
    </motion.div>
  );
}

// ─── Dashboard page ──────────────────────────────────────────────────────────
export default function DashboardPage() {
  const [conversations, setConversations] = React.useState<Conv[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    fetch('/api/conversations')
      .then(r => r.json())
      .then(d => setConversations(Array.isArray(d) ? d : []))
      .catch(() => setConversations([]))
      .finally(() => setLoading(false));
  }, []);

  const totalConvs  = conversations.length;
  const mentorsUsed = new Set(conversations.map(c => c.persona)).size;
  const recent      = conversations.slice(0, 5);

  return (
    <RadialGlowBackground className="min-h-screen" glowColor="rgba(99, 102, 241, 0.15)">

      {/* ── Nav ── */}
      <header className="sticky top-0 z-40 glass border-b border-border/50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-foreground flex items-center justify-center shadow-sm">
              <Brain className="w-4 h-4 text-background" />
            </div>
            <span className="font-bold text-sm tracking-tight text-foreground">AI Mentor</span>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Link
              href="/chat"
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-foreground text-background text-xs font-bold hover:opacity-85 active:scale-95 transition-all duration-150 shadow-sm"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              Open Chat
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main id="main-content" className="relative max-w-6xl mx-auto px-6 py-16 space-y-20">

        {/* ── Hero ── */}
        <motion.section
          initial="hidden"
          animate="show"
          variants={stagger}
          className="text-center space-y-6"
        >
          <motion.div variants={fadeUp}>
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full glass text-xs font-semibold text-muted-foreground border-0">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              Powered by Google Gemini 2.5 Flash · pgvector RAG
            </span>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.08] text-foreground"
          >
            Learn from<br />
            <span
              className="gradient-text"
              style={{ backgroundImage: 'linear-gradient(135deg, #f97316 0%, #8b5cf6 50%, #10b981 100%)' }}
            >
              the best minds.
            </span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="max-w-lg mx-auto text-base md:text-lg text-muted-foreground leading-relaxed"
          >
            AI mentors inspired by India&rsquo;s top programming educators —
            each with a distinct teaching philosophy, streamed in real-time.
          </motion.p>

          <motion.div variants={fadeUp} className="flex items-center justify-center gap-3 pt-2">
            <Link
              href="/chat"
              className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-foreground text-background text-sm font-bold hover:opacity-85 active:scale-95 transition-all duration-200 shadow-lg"
            >
              Get Started <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/chat?persona=Suraj_jha_sir"
              className="flex items-center gap-2 px-6 py-3 rounded-2xl glass text-foreground text-sm font-semibold hover:bg-secondary/50 active:scale-95 transition-all duration-200"
            >
              <BookOpen className="w-4 h-4" /> Explore Mentors
            </Link>
          </motion.div>
        </motion.section>

        {/* ── Stats ── */}
        <motion.section
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-80px' }}
          variants={stagger}
          className="grid grid-cols-2 md:grid-cols-4 gap-3"
        >
          <StatPill icon={MessageSquare} value={String(totalConvs)}       label="Total conversations" />
          <StatPill icon={Users}         value={`${mentorsUsed} / 4`}     label="Mentors explored" />
          <StatPill icon={Zap}           value={totalConvs > 0 ? `${totalConvs * 3}+` : '0'} label="AI responses" />
          <StatPill icon={BookOpen}      value="4"                         label="Knowledge sources" />
        </motion.section>

        {/* ── Mentor grid ── */}
        <section className="space-y-6">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="text-2xl font-bold text-foreground tracking-tight">Choose your mentor</h2>
              <p className="text-sm text-muted-foreground mt-1">Each mentor has a unique teaching style</p>
            </div>
            <Link
              href="/chat"
              className="text-xs font-semibold text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors duration-150"
            >
              Open chat <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-60px' }}
            variants={stagger}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
          >
            {PERSONAS.map((p, i) => (
              <MentorCard key={p.id} persona={p} index={i} />
            ))}
          </motion.div>
        </section>

        {/* ── Recent conversations ── */}
        <motion.section
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-60px' }}
          variants={stagger}
          className="space-y-5 pb-20"
        >
          <motion.div variants={fadeUp} className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-xl bg-secondary flex items-center justify-center">
                <Clock className="w-3.5 h-3.5 text-muted-foreground" />
              </div>
              <h2 className="text-xl font-bold text-foreground">Recent conversations</h2>
            </div>
            {recent.length > 0 && (
              <Link href="/chat" className="text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors duration-150 flex items-center gap-1">
                View all <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            )}
          </motion.div>

          <motion.div variants={fadeUp} className="rounded-3xl glass overflow-hidden">
            {loading ? (
              <div className="p-10 space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-12 rounded-xl animate-shimmer rounded-2xl" style={{ animationDelay: `${i * 0.15}s` }} />
                ))}
              </div>
            ) : recent.length === 0 ? (
              <div className="p-14 flex flex-col items-center gap-4 text-center">
                <div className="w-14 h-14 rounded-2xl bg-secondary flex items-center justify-center">
                  <MessageSquare className="w-6 h-6 text-muted-foreground/50" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">No conversations yet</p>
                  <p className="text-xs text-muted-foreground mt-1">Pick a mentor above to start learning</p>
                </div>
                <Link
                  href="/chat"
                  className="mt-1 flex items-center gap-1.5 px-4 py-2 rounded-xl bg-foreground text-background text-xs font-bold hover:opacity-85 active:scale-95 transition-all duration-150"
                >
                  Start your first chat <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ) : (
              <motion.div
                variants={stagger}
                className="p-2 divide-y divide-border/40"
              >
                {recent.map((c, i) => <ConvRow key={c.id} conv={c} index={i} />)}
              </motion.div>
            )}

            {recent.length > 0 && (
              <div className="border-t border-border/40 p-3 text-center">
                <Link href="/chat" className="text-xs text-muted-foreground hover:text-foreground font-semibold transition-colors">
                  View all conversations →
                </Link>
              </div>
            )}
          </motion.div>
        </motion.section>

      </main>
    </RadialGlowBackground>
  );
}
