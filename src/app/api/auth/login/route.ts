import { NextResponse } from 'next/server';

export async function GET() {
  const CLIENT_ID = process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID;
  const REDIRECT_URI = process.env.NEXT_PUBLIC_DISCORD_REDIRECT_URI;

  if (!CLIENT_ID || !REDIRECT_URI) {
    return NextResponse.json(
      { error: 'Missing Discord OAuth Configuration' },
      { status: 500 },
    );
  }

  const scopes = ['identify'];

  const discordAuthUrl = `https://discord.com/api/oauth2/authorize?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=code&scope=${encodeURIComponent(scopes.join(' '))}`;

  return NextResponse.redirect(discordAuthUrl);
}
