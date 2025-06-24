// lib/prisma.ts
import { PrismaClient } from '@prisma/client';

declare global {
  // Allow global `var` to be shared across hot reloads in development
  // Prevents TypeScript error on `globalThis.prisma`
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

// Only create a new PrismaClient if one doesn't already exist
const prisma =
  global.prisma ||
  new PrismaClient({
    log: ['query', 'error', 'warn'], // Optional: log queries in terminal
  });

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}

export default prisma;
