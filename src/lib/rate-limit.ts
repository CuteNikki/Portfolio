import { createHash } from 'node:crypto';
import { headers } from 'next/headers';

import prisma from '@/lib/prisma';

// Counts a hit for `key` in a fixed window of `windowSeconds` and returns how many hits the window has seen, this one
// included. A window that has run out starts over. Times come from the database clock in UTC, the same way Prisma
// stores DateTime.
export async function hit(key: string, windowSeconds: number) {
  const [row] = await prisma.$queryRaw<{ count: number }[]>`
    INSERT INTO "RateLimit" ("key", "count", "expiresAt")
    VALUES (${key}, 1, (now() AT TIME ZONE 'UTC') + ${windowSeconds}::int * interval '1 second')
    ON CONFLICT ("key") DO UPDATE SET
      "count" = CASE WHEN "RateLimit"."expiresAt" < (now() AT TIME ZONE 'UTC') THEN 1 ELSE "RateLimit"."count" + 1 END,
      "expiresAt" = CASE WHEN "RateLimit"."expiresAt" < (now() AT TIME ZONE 'UTC') THEN EXCLUDED."expiresAt" ELSE "RateLimit"."expiresAt" END
    RETURNING "count"`;

  // Clearing old windows on every hit would lock rows across concurrent requests, so only every 50th hit does it
  if (Math.random() < 0.02) {
    await prisma.$executeRaw`DELETE FROM "RateLimit" WHERE "expiresAt" < (now() AT TIME ZONE 'UTC')`;
  }

  return row.count;
}

// How many hits `key` has in its current window, without counting one
export async function hitsSoFar(key: string) {
  const [row] = await prisma.$queryRaw<{ count: number }[]>`
    SELECT "count" FROM "RateLimit" WHERE "key" = ${key} AND "expiresAt" >= (now() AT TIME ZONE 'UTC')`;

  return row?.count ?? 0;
}

// Identifies the visitor by a hash of their IP, so rate limits never store the address itself. Vercel sets
// x-forwarded-for itself, so visitors can't choose it.
export async function visitorHash(...extra: string[]) {
  const headerList = await headers();
  const ip =
    headerList.get('x-forwarded-for')?.split(',')[0].trim() ||
    headerList.get('x-real-ip') ||
    'unknown';

  return createHash('sha256')
    .update([ip, ...extra].join('\n'))
    .digest('hex')
    .slice(0, 32);
}
