const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { PrismaClient } = require('@prisma/client');
const { embed } = require('ai');
const { createGoogleGenerativeAI } = require('@ai-sdk/google');

require('dotenv').config();

if (!process.env.GEMINI_API_KEY) {
  console.error('Error: GEMINI_API_KEY is not defined in environment variables');
  process.exit(1);
}

const prisma = new PrismaClient();
const google = createGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY,
});
const embeddingModel = google.textEmbeddingModel('gemini-embedding-001');

// Simple chunking utility
function chunkText(text, chunkSize = 800, overlap = 150) {
  const chunks = [];
  let index = 0;
  const cleanText = text.replace(/\s+/g, ' ').trim();

  while (index < cleanText.length) {
    let end = index + chunkSize;
    if (end < cleanText.length) {
      const lastSentenceBoundary = Math.max(
        cleanText.lastIndexOf('. ', end),
        cleanText.lastIndexOf('? ', end),
        cleanText.lastIndexOf('! ', end)
      );
      if (lastSentenceBoundary > index) {
        end = lastSentenceBoundary + 1;
      } else {
        const lastSpace = cleanText.lastIndexOf(' ', end);
        if (lastSpace > index) {
          end = lastSpace;
        }
      }
    }

    const chunk = cleanText.slice(index, end).trim();
    if (chunk.length > 0) {
      chunks.push(chunk);
    }
    index = end - overlap;
    if (index >= cleanText.length || end >= cleanText.length) {
      break;
    }
  }
  return chunks;
}

// Helper to generate embedding using Vercel AI SDK
async function getEmbedding(text) {
  const { embedding } = await embed({
    model: embeddingModel,
    value: text.replace(/\n/g, ' '),
    providerOptions: {
      google: {
        outputDimensionality: 768, // Matryoshka Representation Learning dimension limit
      },
    },
  });
  return embedding;
}

// Realistic persona tutorials/lessons to seed database
const simulatedDocuments = [
  // Hitesh Choudhary
  {
    persona: 'Hitesh_chaudhary_sir',
    title: 'React State Explained Simply',
    source: 'YouTube Transcript',
    url: 'https://youtube.com/watch?v=mock-hitesh-1',
    topic: 'React Hooks',
    content: 'Hanji dosto, chaliye aaj baat karte hain React state ke baare mein. Dekhiye, simple si baat hai. State kya hota hai? State aapke component ki memory hoti hai. Jaise aapko subah yaad rehta hai ki aapne chai pi hai ya nahi, waise hi component ko bhi yaad rakhna padta hai ki button click hua ya nahi. Dhyan dijiye, useState hook jab hum use karte hain, toh hum React ko kehte hain ki "Bhaiya, is variable ki value ko yaad rakho." Ek kaam karte hain, ek counter project banaiye. Jab tak aap khud se code nahi likhenge aur project nahi banayenge, tab tak concepts clear nahi honge. Panic mat kijiye, official documentation zaroor padhiye aur coding karte rahiye.'
  },
  {
    persona: 'Hitesh_chaudhary_sir',
    title: 'Why Consistency Beats Intensity',
    source: 'Blog Post',
    url: 'https://hiteshchoudhary.com/consistency',
    topic: 'Career Advice',
    content: 'Hanji... Dekhiye, kai baar bachhe mujhse puchte hain, "Sir, main roz 10 ghante padhta hoon, phir bhi job nahi lag rahi." Simple si baat hai, coding ek dynamic field hai. Aap roz 10 ghante padhne ki jagah, roz sirf 1 ghante padhiye par daily bina miss kiye padhiye. Chaliye isko step by step samajhte hain. Jab aap consistency banate hain, toh aapka brain naye patterns seekhne lagta hai. Documentation zaroor padhiye kyunki framework ki specifications change hoti rehti hain, par aapke basics wahi rahenge. Code likhiye, projects banaiye, aur daily progress kijiye.'
  },

  // Piyush Garg
  {
    persona: 'Piyush_garg_sir',
    title: 'Scaling Next.js in Production',
    source: 'YouTube Transcript',
    url: 'https://youtube.com/watch?v=mock-piyush-1',
    topic: 'Next.js Production',
    content: 'Chat, dekho! Next.js app ko production mein scale karna is actually pretty cool, par isme hum log aksar over-engineer kar dete hain. Keep it simple. Production mein sabse important cheez hai caching aur database optimizations. Server action ke andar authentication check lagao aur check karo ki query execution time kitna hai. Let\'s build this: jab aap Neon PostgreSQL use kar rahe hain, toh connection pooling enable karna zaroori hai taaki database connections exhaust na hon. Debugging is a skill, aur logs are your best friend. Har micro-service ke logs metrics monitor karo aur scale tabhi karo jab metrics batayein.'
  },
  {
    persona: 'Piyush_garg_sir',
    title: 'System Design for Real-World Applications',
    source: 'Blog Post',
    url: 'https://piyushgarg.dev/system-design',
    topic: 'System Design',
    content: 'Essentially, system design mein sabse pehli cheez hoti hai trade-offs samajhna. Don\'t over-engineer. Basically, agar aapko fast read actions chahiye toh Redis use karo, and push writes to database. Let\'s implement this pattern step by step. Production mein security aur rate limiting zaroori hai. Real-world applications mein stateless architecture use karo taaki vertical aur horizontal scaling easily ho sake. Think like an engineer. Projects banao jo real production workload handle kar sakein, simple CRUD applications se aage badho aur load-test karo.'
  },

  // Suraj Jha
  {
    persona: 'Suraj_jha_sir',
    title: 'First Principles of Database Engineering',
    source: 'YouTube Transcript',
    url: 'https://youtube.com/watch?v=mock-suraj-1',
    topic: 'Database Engineering',
    content: 'Think about it this way: before writing code, let\'s understand the problem we are trying to solve. Why do databases use B-Trees instead of standard Hash Maps? Let\'s reason through it step by step. B-Trees range queries ko allow karti hain efficiently kyunki nodes sequential hoti hain. The interesting part is that framework use karna is not the important part. Aap Prisma use karein ya raw SQL, aapko SQL optimizer aur index structures ka pata hona chahiye. Simplicity wins. Master fundamentals before abstractions. Real-world applications are different from tutorials, so understand the trade-offs.'
  },
  {
    persona: 'Suraj_jha_sir',
    title: 'Continuous Learning as a Software Craftsman',
    source: 'LinkedIn Post',
    url: 'https://linkedin.com/in/mock-suraj-2',
    topic: 'Career Growth',
    content: 'Engineering is about trade-offs. Don\'t memorize syntax or APIs. Build your mental model first. The interesting part is how technologies evolve but basic computer science principles last forever. Focus on the fundamentals. Build something instead of just consuming content. Read research papers, understand TCP/IP, know how browsers work. This is where most developers get confused: they learn frameworks but miss how runtime loops function. Think beyond the code and question your assumptions.'
  },

  // Anirudh Jwala
  {
    persona: 'Anirudh_jwala',
    title: 'Clean Architecture in Modern Applications',
    source: 'Blog Post',
    url: 'https://anirudh.dev/clean-architecture',
    topic: 'Software Architecture',
    content: 'Let\'s think about this: clean architecture isn\'t about writing more files; it is about separation of concerns. Before writing code, let\'s understand the problem. The interesting part is how we decouple database logic from business domain. Production code is different from tutorial code. Write code that your future self will thank you for. This approach scales better because if we change the ORM or the database, our core logic remains untouched. Think about the trade-offs: decoupling increases boilerplate but makes testing simple.'
  },
  {
    persona: 'Anirudh_jwala',
    title: 'Premature Optimization and Trade-offs',
    source: 'YouTube Transcript',
    url: 'https://youtube.com/watch?v=mock-anirudh-2',
    topic: 'Optimization',
    content: 'Let\'s reason through it. Don\'t optimize prematurely. Keep it simple. Under-optimization leads to slow applications, but over-optimization leads to unreadable code. Engineering is about making good decisions. Understand the system, not just the framework. Think beyond the happy path: what happens when the network fails? What if the cache layer goes down? When building apps, structure them logically and use proven design patterns instead of quick hacks.'
  }
];

async function run() {
  console.log('Starting ingestion pipeline...');

  // Clean old chunks
  console.log('Cleaning old chunks...');
  await prisma.documentChunk.deleteMany();

  // 1. Process MDX files
  const personaDir = path.join(__dirname, '../public/persona');
  const mdxFiles = fs.readdirSync(personaDir).filter(f => f.endsWith('.mdx'));

  for (const file of mdxFiles) {
    const filePath = path.join(personaDir, file);
    const content = fs.readFileSync(filePath, 'utf-8');
    const personaName = file.replace('.mdx', ''); // e.g. Hitesh_chaudhary_sir

    console.log(`Processing file: ${file} (Persona: ${personaName})`);

    const chunks = chunkText(content, 600, 100);
    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      console.log(`Generating embedding for ${personaName} MDX chunk ${i+1}/${chunks.length}...`);
      const embedding = await getEmbedding(chunk);

      const id = crypto.randomUUID();
      const vectorString = `[${embedding.join(',')}]`;

      await prisma.$executeRawUnsafe(
        `INSERT INTO "DocumentChunk" (id, persona, title, source, url, topic, content, embedding)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8::vector)`,
        id,
        personaName,
        `${personaName} Core Guidelines Part ${i+1}`,
        'System Persona MDX',
        `file://public/persona/${file}`,
        'Core Guidelines & Personality',
        chunk,
        vectorString
      );
    }
  }

  // 2. Process Simulated Documents
  console.log('Processing simulated documents...');
  for (let i = 0; i < simulatedDocuments.length; i++) {
    const doc = simulatedDocuments[i];
    console.log(`Ingesting simulated doc: "${doc.title}" for ${doc.persona}...`);

    const chunks = chunkText(doc.content, 600, 100);
    for (let j = 0; j < chunks.length; j++) {
      const chunk = chunks[j];
      const embedding = await getEmbedding(chunk);

      const id = crypto.randomUUID();
      const vectorString = `[${embedding.join(',')}]`;

      await prisma.$executeRawUnsafe(
        `INSERT INTO "DocumentChunk" (id, persona, title, source, url, topic, content, embedding)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8::vector)`,
        id,
        doc.persona,
        doc.title,
        doc.source,
        doc.url,
        doc.topic,
        chunk,
        vectorString
      );
    }
  }

  console.log('All embeddings successfully generated and stored in Neon DB!');
}

run()
  .catch(e => {
    console.error('Error during ingestion:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
