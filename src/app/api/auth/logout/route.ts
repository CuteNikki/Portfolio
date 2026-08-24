import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

import prisma from '@/lib/prisma';

export async function POST(req: NextRequest) {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get('auth_session')?.value;

  if (sessionToken) {
    await prisma.session.deleteMany({
      where: { sessionToken },
    });
  }

  cookieStore.delete('auth_session');

  return NextResponse.redirect(new URL('/', req.url));
}
