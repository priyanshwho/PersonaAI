'use client';

import * as React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { PERSONAS } from '../lib/prompts';
import { useTheme } from '../components/theme-provider';
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
  Flame,
  Palette,
} from 'lucide-react';

// ─── Persona accent config styled for light pastel ───────────────────────────
const ACCENT: Record<string, { from: string; to: string; glow: string; icon: React.ComponentType<any>; label: string }> = {
  Hitesh_chaudhary_sir: { from: '#f97316', to: '#fbbf24', glow: 'rgba(249,115,22,0.06)', icon: Flame, label: 'orange' },
  Piyush_garg_sir:      { from: '#6366f1', to: '#8b5cf6', glow: 'rgba(99,102,241,0.06)',  icon: Zap, label: 'violet' },
  Suraj_jha_sir:        { from: '#10b981', to: '#06b6d4', glow: 'rgba(16,185,129,0.06)',  icon: Brain, label: 'emerald' },
  Anirudh_jwala:        { from: '#ec4899', to: '#8b5cf6', glow: 'rgba(236,72,153,0.06)',  icon: Palette, label: 'pink' },
};

// ─── Motion variants ────────────────────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show:   { opacity: 1, y: 0,  transition: { duration: 0.6, ease: 'easeOut' as const } },
};
const stagger = {
  show: { transition: { staggerChildren: 0.08 } },
};

// ─── Theme toggle (uses single central theme state) ──────────────────────────
interface ThemeToggleProps {
  scrolled: boolean;
}
function ThemeToggle({ scrolled }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();
  return (
    <button
      onClick={toggleTheme}
      aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      className={`w-9 h-9 flex items-center justify-center rounded-xl border transition-all duration-200 shadow-sm ${
        scrolled
          ? 'bg-white/80 dark:bg-zinc-800/45 border-white/90 dark:border-zinc-700/60 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          : 'bg-white/10 border-white/20 text-white hover:bg-white/20'
      }`}
    >
      {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
    </button>
  );
}

// ─── Stat pill ───────────────────────────────────────────────────────────────
function StatPill({ icon: Icon, value, label }: { icon: React.ElementType; value: string; label: string }) {
  return (
    <motion.div
      variants={fadeUp}
      className="flex items-center gap-4 px-6 py-4 rounded-2xl bg-white/70 dark:bg-zinc-900/40 border border-white/80 dark:border-zinc-800/50 backdrop-blur-md shadow-[0_8px_30px_rgba(0,0,0,0.015)]"
    >
      <div className="w-9 h-9 rounded-xl bg-white/80 dark:bg-zinc-800/60 border border-white/90 dark:border-zinc-700/70 flex items-center justify-center shrink-0">
        <Icon className="w-4.5 h-4.5 text-slate-550 dark:text-slate-400" />
      </div>
      <div>
        <p className="text-xl font-bold text-slate-800 dark:text-slate-200 leading-none tabular-nums">{value}</p>
        <p className="text-[10px] uppercase tracking-wider font-semibold text-slate-550 dark:text-slate-400 mt-1.5">{label}</p>
      </div>
    </motion.div>
  );
}

// ─── Mentor card ─────────────────────────────────────────────────────────────
function MentorCard({ persona }: { persona: (typeof PERSONAS)[number] }) {
  const acc = ACCENT[persona.id] ?? ACCENT['Hitesh_chaudhary_sir'];
  const [hovered, setHovered] = React.useState(false);

  return (
    <motion.div variants={fadeUp}>
      <Link
        href={`/chat?persona=${persona.id}`}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="group relative flex flex-col h-full rounded-3xl overflow-hidden border border-white/60 dark:border-zinc-800/50 bg-white/65 dark:bg-zinc-950/20 hover:bg-white/85 dark:hover:bg-zinc-900/40 shadow-[0_8px_32px_0_rgba(148,163,184,0.01)] hover:shadow-[0_16px_40px_rgba(148,163,184,0.04)] hover:-translate-y-1 transition-all duration-300"
      >
        {/* Ambient glow blob (visible on hover) */}
        <motion.div
          className="absolute -top-10 -right-10 w-40 h-40 rounded-full blur-3xl pointer-events-none opacity-45"
          style={{ background: `radial-gradient(circle, ${acc.from}33 0%, transparent 70%)` }}
          animate={{ opacity: hovered ? 0.65 : 0.25 }}
          transition={{ duration: 0.4 }}
        />

        {/* Content */}
        <div className="relative flex flex-col gap-5 p-7 flex-1">
          {/* Avatar + name row */}
          <div className="flex items-start gap-4">
            <div
              className="relative w-14 h-14 rounded-2xl overflow-hidden shrink-0 border border-white/80 dark:border-zinc-800/60 bg-white/80 dark:bg-zinc-900/45"
              style={{ boxShadow: `inset 0 0 20px ${acc.from}15` }}
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
                <acc.icon className="w-4.5 h-4.5 shrink-0" style={{ color: acc.from }} />
                <p className="text-sm font-extrabold text-slate-800 dark:text-slate-200 leading-tight">{persona.name}</p>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">{persona.role}</p>
            </div>
          </div>

          {/* Description */}
          <p className="text-xs text-slate-600 dark:text-slate-355 leading-relaxed line-clamp-3 font-medium">{persona.description}</p>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5">
            {persona.tags.slice(0, 3).map(tag => (
              <span
                key={tag}
                className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-white/80 dark:bg-zinc-800/60 border border-white dark:border-zinc-700/80"
                style={{
                  color: acc.from,
                }}
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Sample question */}
          <div className="mt-auto pt-4 border-t border-white/40 dark:border-zinc-800/40">
            <p className="text-[11px] text-slate-500/80 dark:text-slate-450/80 italic line-clamp-2">
              &ldquo;{persona.suggestedQuestions[0]}&rdquo;
            </p>
          </div>
        </div>

        {/* CTA footer */}
        <div className="relative px-7 pb-6 mt-auto">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400 group-hover:text-slate-800 dark:group-hover:text-slate-200 transition-colors duration-200">
            <span>Start learning</span>
            <div className="w-8 h-8 rounded-full border border-white/80 dark:border-zinc-700/80 bg-white/40 dark:bg-zinc-900/40 group-hover:border-slate-300 dark:group-hover:border-zinc-600 group-hover:bg-white/85 dark:group-hover:bg-zinc-800/85 flex items-center justify-center transition-all duration-200">
              <motion.span
                animate={{ x: hovered ? 2 : 0 }}
                transition={{ duration: 0.2, ease: 'easeOut' as const }}
              >
                <ArrowRight className="w-3.5 h-3.5 text-slate-600 dark:text-slate-400" />
              </motion.span>
            </div>
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
        className="flex items-center gap-3.5 px-4 py-3.5 rounded-2xl hover:bg-white/80 dark:hover:bg-zinc-800/50 border border-transparent hover:border-white/60 dark:hover:border-zinc-700/40 transition-all duration-150 group"
      >
        <div
          className="w-9 h-9 rounded-xl overflow-hidden shrink-0 border border-white/60 dark:border-zinc-800/60 bg-white/40 dark:bg-zinc-900/40"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={persona?.avatar} alt={persona?.name} className="w-full h-full object-cover" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-slate-800 dark:text-slate-200 truncate">{conv.title}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">{persona?.name}</p>
        </div>
        <div className="flex items-center gap-1.5 shrink-0 text-slate-500 dark:text-slate-450">
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
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    fetch('/api/conversations')
      .then(r => r.json())
      .then(d => setConversations(Array.isArray(d) ? d : []))
      .catch(() => setConversations([]))
      .finally(() => setLoading(false));
  }, []);

  React.useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const totalConvs  = conversations.length;
  const mentorsUsed = new Set(conversations.map(c => c.persona)).size;
  const recent      = conversations.slice(0, 5);

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-gradient-to-tr from-[#FFF5F2] via-[#FFF9F6] to-[#FFEBE6] dark:from-[#070708] dark:via-[#0d060a] dark:to-[#1b0812] font-sans transition-colors duration-200">
      
      {/* ── Ambient Background Glow Blobs (Clipped by wrapper overflow-x-hidden) ── */}
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Blob 1: Behind Mentor Grid left */}
        <div 
          className="absolute top-[120vh] left-[-15%] w-[50vw] h-[50vw] rounded-full blur-[160px] opacity-75 dark:opacity-40"
          style={{
            background: 'radial-gradient(circle, rgba(244,63,94,0.09) 0%, rgba(244,63,94,0) 70%)',
          }}
        />
        {/* Blob 2: Behind Mentor Grid right */}
        <div 
          className="absolute top-[160vh] right-[-15%] w-[45vw] h-[45vw] rounded-full blur-[140px] opacity-70 dark:opacity-30"
          style={{
            background: 'radial-gradient(circle, rgba(99,102,241,0.08) 0%, rgba(99,102,241,0) 70%)',
          }}
        />
        {/* Blob 3: Behind Recent Conversations */}
        <div 
          className="absolute bottom-[5%] left-[5%] w-[40vw] h-[40vw] rounded-full blur-[140px] opacity-60 dark:opacity-35"
          style={{
            background: 'radial-gradient(circle, rgba(16,185,129,0.07) 0%, rgba(16,185,129,0) 70%)',
          }}
        />
      </div>
      
      {/* ── Dynamic Header (Fades from Transparent to Frosted Glass on scroll) ── */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-white/60 dark:bg-zinc-950/45 backdrop-blur-md border-b border-white/80 dark:border-zinc-800/40 shadow-xs h-16'
            : 'bg-transparent border-b border-transparent h-20'
        }`}
      >
        <div className="max-w-6xl mx-auto px-6 h-full flex items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center shadow-xs transition-colors duration-300 ${
              scrolled ? 'bg-slate-900 dark:bg-white' : 'bg-white'
            }`}>
              <Brain className={`w-4 h-4 transition-colors duration-300 ${
                scrolled ? 'text-white dark:text-slate-900' : 'text-slate-900'
              }`} />
            </div>
            <span className={`font-extrabold text-sm tracking-tight transition-colors duration-300 ${
              scrolled ? 'text-slate-800 dark:text-slate-200' : 'text-white drop-shadow-sm'
            }`}>
              AI Mentor
            </span>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Link
              href="/chat"
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold active:scale-95 transition-all duration-300 shadow-sm ${
                scrolled
                  ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:opacity-90'
                  : 'bg-white text-slate-900 hover:bg-white/95'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              Open Chat
            </Link>
            <ThemeToggle scrolled={scrolled} />
          </div>
        </div>
      </header>

      {/* ── Full Width Hero Video Section (Edge-to-Edge, Transparent Navbar Overlaid) ── */}
      <section className="w-full h-screen overflow-hidden relative bg-black">
        <video
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260319_055001_8e16d972-3b2b-441c-86ad-2901a54682f9.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover opacity-90 transition-opacity duration-500"
        />

        {/* Top Vignette (Ensures header readability on bright frames) */}
        <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black/35 to-transparent pointer-events-none" />

        {/* Simple & Clean Content Overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 bg-black/15 pointer-events-none">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="max-w-3xl space-y-8 pointer-events-auto"
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-medium tracking-tight text-white drop-shadow-md leading-[1.15] max-w-4xl mx-auto">
              Learn coding from <br className="hidden sm:inline" />
              <span className="font-serif italic font-light bg-gradient-to-r from-rose-200 via-purple-200 to-indigo-200 bg-clip-text text-transparent">
                the absolute best.
              </span>
            </h1>
            <p className="max-w-md mx-auto text-xs sm:text-sm text-slate-100/90 font-medium drop-shadow-xs leading-relaxed">
              Connect with interactive AI personas styled closely after India&rsquo;s most popular coding educators. Get personalized feedback, code reviews, and explanations.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
              <Link
                href="/chat"
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl bg-white text-slate-900 text-xs font-extrabold hover:bg-white/95 active:scale-95 transition-all duration-200 shadow-md"
              >
                Get Started <ArrowRight className="w-4 h-4 text-slate-900" />
              </Link>
              <Link
                href="#main-content"
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-bold hover:bg-white/20 active:scale-95 transition-all duration-200"
              >
                <BookOpen className="w-4 h-4 text-slate-200" /> Explore Mentors
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Bottom smooth blending gradient fading into the page's pastel/dark background */}
        <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-[#FFF5F2] dark:from-[#070708] via-[#FFF5F2]/75 dark:via-[#070708]/75 to-transparent pointer-events-none" />
      </section>

      {/* Main Content Area with Generous Spacing / Breathing Space */}
      <main id="main-content" className="relative max-w-6xl mx-auto px-6 py-24 md:py-36 space-y-28 md:space-y-40">

        {/* ── Stats ── */}
        <motion.section
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-80px' }}
          variants={stagger}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto"
        >
          <StatPill icon={MessageSquare} value={String(totalConvs)}       label="Total conversations" />
          <StatPill icon={Users}         value={`${mentorsUsed} / 4`}     label="Mentors explored" />
          <StatPill icon={Zap}           value={totalConvs > 0 ? `${totalConvs * 3}+` : '0'} label="AI responses" />
          <StatPill icon={BookOpen}      value="4"                         label="Knowledge sources" />
        </motion.section>

        {/* ── Mentor grid ── */}
        <section className="space-y-8 max-w-5xl mx-auto">
          <div className="flex items-end justify-between px-2 pb-2">
            <div>
              <h2 className="text-3xl font-serif font-bold text-slate-800 dark:text-slate-100 tracking-normal">Choose your mentor</h2>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-2">Each mentor has a unique teaching style & database</p>
            </div>
            <Link
              href="/chat"
              className="text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 flex items-center gap-1 transition-colors duration-150"
            >
              Open chat <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-60px' }}
            variants={stagger}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8"
          >
            {PERSONAS.map((p) => (
              <MentorCard key={p.id} persona={p} />
            ))}
          </motion.div>
        </section>

        {/* ── Recent conversations ── */}
        <motion.section
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-60px' }}
          variants={stagger}
          className="space-y-6 max-w-5xl mx-auto pb-12"
        >
          <motion.div variants={fadeUp} className="flex items-center justify-between px-2 pb-2">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-xl bg-white/50 dark:bg-zinc-900/50 border border-white/60 dark:border-zinc-800/60 flex items-center justify-center">
                <Clock className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
              </div>
              <h2 className="text-2xl font-serif font-bold text-slate-800 dark:text-slate-100 tracking-normal">Recent conversations</h2>
            </div>
            {recent.length > 0 && (
              <Link href="/chat" className="text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors duration-150 flex items-center gap-1">
                View all <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            )}
          </motion.div>

          <motion.div variants={fadeUp} className="rounded-3xl border border-white/50 dark:border-zinc-800/50 bg-white/50 dark:bg-zinc-950/20 backdrop-blur-md overflow-hidden shadow-[0_8px_32px_0_rgba(148,163,184,0.02)]">
            {loading ? (
              <div className="p-10 space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-12 rounded-xl bg-white/40 dark:bg-zinc-800/40 border border-white/60 dark:border-zinc-700/60 animate-shimmer" style={{ animationDelay: `${i * 0.15}s` }} />
                ))}
              </div>
            ) : recent.length === 0 ? (
              <div className="p-14 flex flex-col items-center gap-4 text-center">
                <div className="w-14 h-14 rounded-2xl bg-white/50 dark:bg-zinc-900/50 border border-white/60 dark:border-zinc-800/60 flex items-center justify-center">
                  <MessageSquare className="w-6 h-6 text-slate-400 dark:text-slate-500" />
                </div>
                <div>
                  <p className="text-sm font-extrabold text-slate-800 dark:text-slate-200">No conversations yet</p>
                  <p className="text-xs text-slate-500 dark:text-slate-455 mt-1">Pick a mentor above to start learning</p>
                </div>
                <Link
                  href="/chat"
                  className="mt-1 flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold hover:opacity-90 active:scale-95 transition-all duration-150 shadow-sm"
                >
                  Start your first chat <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ) : (
              <motion.div
                variants={stagger}
                className="p-2 divide-y divide-white/40 dark:divide-zinc-850"
              >
                {recent.map((c, i) => <ConvRow key={c.id} conv={c} index={i} />)}
              </motion.div>
            )}

            {recent.length > 0 && (
              <div className="border-t border-white/40 dark:border-zinc-800/40 p-3 text-center">
                <Link href="/chat" className="text-xs text-slate-500 dark:text-slate-455 hover:text-slate-800 dark:hover:text-slate-200 font-bold transition-colors">
                  View all conversations →
                </Link>
              </div>
            )}
          </motion.div>
        </motion.section>

      </main>
    </div>
  );
}
