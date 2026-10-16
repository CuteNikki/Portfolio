import { createHash } from 'node:crypto';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { after, connection } from 'next/server';
import { cache } from 'react';

import { Role } from '@/generated/prisma/enums';

import prisma from '@/lib/prisma';

export const SESSION_COOKIE = 'auth_session';
export const OAUTH_STATE_COOKIE = 'oauth_state';
export const RETURN_TO_COOKIE = 'auth_return_to';

const LAST_SEEN_INTERVAL_MS = 15 * 60 * 1000;

// Where to send someone after signing in. Only paths on this site count, so a crafted link can't use the login to
// send people elsewhere ("//evil.example" and "/\\evil.example" are other hosts to a browser).
export function safeReturnPath(value: string | null | undefined) {
  if (
    !value ||
    !value.startsWith('/') ||
    value.startsWith('//') ||
    value.startsWith('/\\')
  ) {
    return null;
  }
  if (value.startsWith('/api/')) return null;
  return value;
}

// The database keeps only a hash of each session token, so a leaked copy of it can't be used to sign in
export function hashSessionToken(token: string) {
  return createHash('sha256').update(token).digest('hex');
}

export const getCurrentSession = cache(async () => {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get(SESSION_COOKIE)?.value;

  if (!sessionToken) return null;

  // With Partial Prefetching, cookies() resolves while the App Shell is prerendered, so without this the session
  // lookup would run there too. The database driver's random values aren't allowed in a prerender, and a session
  // check shouldn't be cached anyway, so it waits for the request.
  await connection();

  try {
    const session = await prisma.session.findUnique({
      where: { sessionToken: hashSessionToken(sessionToken) },
      include: { user: true },
    });

    if (!session) return null;

    if (session.expiresAt < new Date()) {
      await prisma.session.delete({ where: { id: session.id } });
      return null;
    }

    // The account page shows when each device was last used. A few minutes off is fine, so it's written at most every
    // quarter of an hour, and only after the response is sent.
    if (Date.now() - session.lastSeenAt.getTime() > LAST_SEEN_INTERVAL_MS) {
      after(() =>
        prisma.session
          .update({
            where: { id: session.id },
            data: { lastSeenAt: new Date() },
          })
          .catch(() => {}),
      );
    }

    return session;
  } catch (error) {
    console.error('Error fetching session:', error);
    return null;
  }
});

// Next.js renders layouts and pages in parallel, so a check in the dashboard
// layout alone doesn't stop a page from rendering its data. Call this at the
// top of every dashboard page, before loading anything.
export async function requireAdmin() {
  const session = await getCurrentSession();

  if (!session || session.user.role !== Role.ADMIN) {
    redirect('/');
  }

  return session;
}

// The dashboard is for writers and admins, who both manage every post and project there. Only admins see the users
// page. Like requireAdmin, call it at the top of every dashboard page.
export async function requireWriter() {
  const session = await getCurrentSession();

  if (
    !session ||
    (session.user.role !== Role.ADMIN && session.user.role !== Role.WRITER)
  ) {
    redirect('/');
  }

  return session;
}

export async function isWriter() {
  const session = await getCurrentSession();
  return (
    session?.user.role === Role.ADMIN || session?.user.role === Role.WRITER
  );
}
