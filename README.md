# AI Mentor
##trial GenAI project
Chat with AI mentors inspired by India's best programming educators — built with Next.js 15, Google Gemini, and pgvector.

## Mentors

| Mentor | Style |
|---|---|
| 🔥 Hitesh Choudhary | Beginner-friendly, first principles, motivational |
| ⚡ Piyush Garg | Production systems, backend, scalability |
| 🧠 Suraj Jha | CS fundamentals, trade-offs, analytical |
| 🎨 Anirudh Jwala | Clean architecture, decoupling, design patterns |

## Stack

- **Next.js 15** (App Router) · **TypeScript** · **Tailwind CSS v4**
- **Vercel AI SDK** + **Google Gemini 3.1 flash preview Flash** (streaming)
- **Neon PostgreSQL** + **pgvector** (similarity search)
- **Prisma 6** ORM · **Framer Motion** animations

## Quick Start

```bash
# 1. Install
pnpm install

# 2. Set env vars
cp .env.example .env
# → Add DATABASE_URL, DIRECT_URL, GEMINI_API_KEY

# 3. Push schema & enable pgvector
pnpm prisma db push
node scripts/enable-vector.js

# 4. Seed persona embeddings
node scripts/generate-avatars.js
node scripts/ingest-personas.js

# 5. Run
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000)

## Env Variables

```env
DATABASE_URL="postgresql://...@pooler.neon.tech/neondb?sslmode=require"
DIRECT_URL="postgresql://...@direct.neon.tech/neondb?sslmode=require"
GEMINI_API_KEY="AIza..."
```

## Routes

| Route | Description |
|---|---|
| `/` | Dashboard — mentor cards, stats, recent chats |
| `/chat` | Chat interface (accepts `?persona=<id>`) |
| `/api/chat` | Streaming LLM endpoint |
| `/api/conversations` | CRUD for chat sessions |

> **Note:** The AI never claims to be the real person. It is clearly an AI assistant inspired by publicly available educational content.
