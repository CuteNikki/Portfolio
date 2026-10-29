import { PrismaPg } from '@prisma/adapter-pg';
import { attachDatabasePool } from '@vercel/functions';
import { Pool } from 'pg';
import { PrismaClient } from '@/generated/prisma/client';

const globalForPrisma = global as unknown as {
  prisma: PrismaClient;
};

// The database server is shared with other sites and services, so each pool stays small. A build prerenders pages in
// one worker per CPU, each with its own pool, so there each gets even fewer.
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: process.env.NEXT_PHASE === 'phase-production-build' ? 2 : 3,
  // Hands idle connections back quickly. The server also closes any left idle for two minutes (idle_session_timeout on
  // the portfolio role), which catches those of instances that were suspended before they could.
  idleTimeoutMillis: 5000,
});
// A connection the server closed while idle is dropped from the pool rather than crashing the process.
pool.on('error', (error) => console.warn('Idle database connection closed:', error.message));
// Lets Vercel close idle connections before it suspends the function, instead of leaving them open on the server.
attachDatabasePool(pool);

const adapter = new PrismaPg(pool);

const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    adapter,
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;
