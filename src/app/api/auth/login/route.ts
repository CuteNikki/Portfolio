import { cookies } from 'next/headers';
import { connection, NextRequest, NextResponse } from 'next/server';

import {
  OAUTH_STATE_COOKIE,
  RETURN_TO_COOKIE,
  safeReturnPath,
} from '@/lib/auth';

export async function GET(req: NextRequest) {
  // Each login needs its own state, so this can't be prerendered
  await connection();

  const CLIENT_ID = process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID;
  const REDIRECT_URI = process.env.NEXT_PUBLIC_DISCORD_REDIRECT_URI;

  if (!CLIENT_ID || !REDIRECT_URI) {
    return NextResponse.json(
      { error: 'Missing Discord OAuth Configuration' },
      { status: 500 },
    );
  }

  const scopes = ['identify'];

  // The callback only accepts a login this browser started, so nobody can send someone a link that signs them in to
  // another account
  const state = crypto.randomUUID();
  const cookieStore = await cookies();
  cookieStore.set(OAUTH_STATE_COOKIE, state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 10 * 60,
    path: '/api/auth',
    sameSite: 'lax',
  });

  // Signing in from a post brings you back to that post
  const returnTo = safeReturnPath(req.nextUrl.searchParams.get('next'));
  if (returnTo) {
    cookieStore.set(RETURN_TO_COOKIE, returnTo, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 10 * 60,
      path: '/api/auth',
      sameSite: 'lax',
    });
  } else {
    cookieStore.delete({ name: RETURN_TO_COOKIE, path: '/api/auth' });
  }

  // "Refresh" on the account page signs in again to pick up a new Discord name or picture. Someone who already allowed
  // the site skips Discord's Authorize screen then.
  const prompt =
    req.nextUrl.searchParams.get('refresh') === '1' ? '&prompt=none' : '';

  const discordAuthUrl = `https://discord.com/api/oauth2/authorize?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=code&scope=${encodeURIComponent(scopes.join(' '))}&state=${state}${prompt}`;

  return NextResponse.redirect(discordAuthUrl);
}
