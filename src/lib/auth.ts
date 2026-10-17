import { createHash } from 'node:crypto';
import { cookies } from 'next/headers';
import { redirect, unstable_rethrow } from 'next/navigation';
import { after, connection } from 'next/server';
import { cache } from 'react';

import { Role } from '@/generated/prisma/enums';

import prisma from '@/lib/prisma';

export const SESSION_COOKIE = 'auth_session';
export const OAUTH_STATE_COOKIE = 'oauth_state';
export const RETURN_TO_COOKIE = 'auth_return_to';

const LAST_SEEN_INTERVAL_MS = 15 * 60 * 1000;

// Where to send someone after signing in. Only paths on this site count, so a crafted link can't use the login to
// send people elsewhere. The path is resolved the way the redirect resolves it, because URL parsing skips tabs and
// line breaks and reads "\" as "/": "/\t/evil.example" and "/\evil.example" both lead to another host.
export function safeReturnPath(value: string | null | undefined) {
  if (!value?.startsWith('/')) return null;

  const base = 'https://placeholder.invalid';
  let url: URL;
  try {
    url = new URL(value, base);
  } catch {
    return null;
  }
  if (url.origin !== base || url.pathname.startsWith('/api/')) return null;

  return url.pathname + url.search + url.hash;
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

  const session = await findSession(hashSessionToken(sessionToken));

  if (!session) return null;

  if (session.expiresAt < new Date()) {
    // Signed out either way; a session left behind is only cleaned up later
    await prisma.session.delete({ where: { id: session.id } }).catch(() => {});
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
});

// A failed lookup must not pass for "signed out": the dashboard would then send a writer home mid-save, and the rest
// of that render (cache() keeps the result per request) would show them signed out. A connection the database closed
// while it sat in the pool fails the first query on it, so the lookup is tried once more before the error is thrown.
async function findSession(hashedToken: string) {
  const lookup = () =>
    prisma.session.findUnique({
      where: { sessionToken: hashedToken },
      include: { user: true },
    });

  try {
    return await lookup();
  } catch (error) {
    console.warn('Session lookup failed, trying again:', error);
    return await lookup();
  }
}

// For UI that only shows who is signed in, such as the navbar. If the session can't be read, it shows signed out
// rather than breaking the page. Checks that let someone in or keep them out use getCurrentSession, which throws then.
export async function getDisplaySession() {
  try {
    return await getCurrentSession();
  } catch (error) {
    // Next's own signals, such as the one that stops a prerender at the request, still go through
    unstable_rethrow(error);
    console.error('Error fetching session:', error);
    return null;
  }
}

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
