import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

import { hashSessionToken, SESSION_COOKIE } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function POST(req: NextRequest) {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get(SESSION_COOKIE)?.value;

  if (sessionToken) {
    await prisma.session.deleteMany({
      where: { sessionToken: hashSessionToken(sessionToken) },
    });
  }

  cookieStore.delete(SESSION_COOKIE);

  // 303 so the browser follows with a GET instead of repeating the POST on the home page
  return NextResponse.redirect(new URL('/', req.url), 303);
}
