import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { cache } from 'react';

import { Role } from '@/generated/prisma/enums';

import prisma from '@/lib/prisma';

export const getCurrentSession = cache(async () => {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get('auth_session')?.value;

  if (!sessionToken) return null;

  try {
    const session = await prisma.session.findUnique({
      where: { sessionToken },
      include: { user: true },
    });

    if (!session) return null;

    if (session.expiresAt < new Date()) {
      await prisma.session.delete({ where: { id: session.id } });
      return null;
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

export async function isWriter() {
  const session = await getCurrentSession();
  return (
    session?.user.role === Role.ADMIN || session?.user.role === Role.WRITER
  );
}

export async function refreshDiscordToken(refreshToken: string) {
  const response = await fetch('https://discord.com/api/oauth2/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      client_id: process.env.DISCORD_CLIENT_ID!,
      client_secret: process.env.DISCORD_CLIENT_SECRET!,
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    }),
  });

  const data = await response.json();
  if (!response.ok)
    throw new Error(data.error_description || 'Failed to refresh token');

  return data;
}
