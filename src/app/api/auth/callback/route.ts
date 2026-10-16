import { timingSafeEqual } from 'node:crypto';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

import {
  hashSessionToken,
  OAUTH_STATE_COOKIE,
  SESSION_COOKIE,
} from '@/lib/auth';
import prisma from '@/lib/prisma';
import { getUserAvatarUrl } from '@/lib/utils';

import { LINKS } from '@/constants/links';

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const code = searchParams.get('code');
  const error = searchParams.get('error');
  const state = searchParams.get('state');

  // Only finish a login this browser started (see the login route). The state is single use.
  const cookieStore = await cookies();
  const expectedState = cookieStore.get(OAUTH_STATE_COOKIE)?.value;
  cookieStore.delete({ name: OAUTH_STATE_COOKIE, path: '/api/auth' });

  if (!state || !expectedState || !isSameString(state, expectedState)) {
    return NextResponse.json(
      { error: 'Login expired or was started elsewhere. Please try again.' },
      { status: 400 },
    );
  }

  if (error) {
    console.error('OAuth Callback Error:', error);

    return NextResponse.json(
      { error: `OAuth Error: ${error}` },
      { status: 400 },
    );
  }

  if (!code) {
    console.error('OAuth Callback Error: No code provided in query parameters');

    return NextResponse.json(
      { error: 'No authorization code provided' },
      { status: 400 },
    );
  }

  const REDIRECT_URI = process.env.NEXT_PUBLIC_DISCORD_REDIRECT_URI;
  const CLIENT_ID = process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID;
  const CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET;

  if (!REDIRECT_URI || !CLIENT_ID || !CLIENT_SECRET) {
    console.error('Missing Discord OAuth Configuration:', {
      REDIRECT_URI,
      CLIENT_ID,
      CLIENT_SECRET: !!CLIENT_SECRET,
    });

    return NextResponse.json(
      { error: 'Missing Discord OAuth Configuration' },
      { status: 500 },
    );
  }

  try {
    // 1. Exchange the code for an Access Token
    const tokenResponse = await fetch('https://discord.com/api/oauth2/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        grant_type: 'authorization_code',
        code,
        redirect_uri: REDIRECT_URI,
      }),
    });

    const tokenData = await tokenResponse.json();

    if (!tokenResponse.ok) {
      console.error('Discord Token Error:', tokenData);

      return NextResponse.json(
        { error: 'Failed to exchange code for token' },
        { status: 400 },
      );
    }

    // 2. Fetch the user's Discord profile
    const userResponse = await fetch('https://discord.com/api/users/@me', {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    });

    const userData = await userResponse.json();

    if (!userResponse.ok) {
      console.error('Discord User Error:', userData);

      return NextResponse.json(
        { error: 'Failed to fetch user profile' },
        { status: 400 },
      );
    }

    const avatarUrl = getUserAvatarUrl(
      userData.id,
      userData.discriminator,
      userData.avatar,
    );

    // 3. Upsert the user in your database (Update if exists, Create if new). The Discord tokens aren't kept: the profile
    // is all we need, and only at login. Clearing them also removes ones stored before.
    const user = await prisma.user.upsert({
      where: { discordId: userData.id },
      update: {
        displayName: userData.global_name,
        username: userData.username,
        avatarUrl,

        accessToken: null,
        refreshToken: null,
        tokenExpiresAt: null,
      },
      create: {
        discordId: userData.id,
        displayName: userData.global_name,
        username: userData.username,
        avatarUrl,
      },
    });

    // 4. Create a new Session. The cookie gets the token, the database only its hash.
    const sessionToken = crypto.randomUUID(); // Native secure random string
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days from now

    await prisma.$transaction([
      // Sessions nobody comes back to are otherwise never removed
      prisma.session.deleteMany({ where: { expiresAt: { lt: new Date() } } }),
      prisma.session.create({
        data: {
          sessionToken: hashSessionToken(sessionToken),
          userId: user.id,
          expiresAt,
        },
      }),
    ]);

    // 5. Set the HTTP-Only cookie so the browser remembers them
    cookieStore.set(SESSION_COOKIE, sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      expires: expiresAt,
      path: '/',
      sameSite: 'lax',
    });

    // 6. Redirect back!
    return NextResponse.redirect(new URL(LINKS.home.url, req.url));
  } catch (error) {
    console.error('OAuth Callback Exception:', error);

    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }
}

function isSameString(a: string, b: string) {
  const bufferA = Buffer.from(a);
  const bufferB = Buffer.from(b);
  return bufferA.length === bufferB.length && timingSafeEqual(bufferA, bufferB);
}
