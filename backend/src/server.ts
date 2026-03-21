import { app } from './app.js';
import { env } from './config/env.js';
import { prisma } from './db/prisma.js';

const server = app.listen(env.PORT, async () => {
  await prisma.$connect();
  console.log(`Backend listening on port ${env.PORT}`);
});

const shutdown = async () => {
  await prisma.$disconnect();
  server.close(() => process.exit(0));
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
