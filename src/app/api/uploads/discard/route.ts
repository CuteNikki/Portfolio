import { NextResponse } from 'next/server';

import { getWriterSession } from '@/lib/auth';
import { discardUnusedImages } from '@/lib/uploads';

// Pictures uploaded in a dashboard form whose tab is closing without saving. The browser sends them with
// navigator.sendBeacon as the page goes away, which can't wait for a server action. Pictures still in use stay.
export async function POST(request: Request) {
  if (!(await getWriterSession())) {
    return new NextResponse(null, { status: 401 });
  }

  let urls: unknown;
  try {
    ({ urls } = await request.json());
  } catch {
    return new NextResponse(null, { status: 400 });
  }
  if (!Array.isArray(urls)) return new NextResponse(null, { status: 400 });

  await discardUnusedImages(
    urls.filter((url): url is string => typeof url === 'string').slice(0, 50),
  );
  return new NextResponse(null, { status: 204 });
}
