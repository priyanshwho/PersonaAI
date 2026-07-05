const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('Enabling vector extension...');
  await prisma.$executeRawUnsafe('CREATE EXTENSION IF NOT EXISTS vector;');
  console.log('Vector extension enabled successfully!');
}

main()
  .catch((e) => {
    console.error('Failed to enable vector extension:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
