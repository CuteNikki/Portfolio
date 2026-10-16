import { NextResponse } from 'next/server';

import { getCurrentSession } from '@/lib/auth';
import prisma from '@/lib/prisma';

// Everything the site keeps about you, as a JSON file to download. Only for the signed-in user, and never cached.
export async function GET() {
  const session = await getCurrentSession();
  if (!session) {
    return NextResponse.json(
      { error: 'Sign in to download your data.' },
      { status: 401 },
    );
  }

  const userId = session.user.id;
  const [user, comments, sessions, posts, projects] = await Promise.all([
    prisma.user.findUniqueOrThrow({
      where: { id: userId },
      select: {
        discordId: true,
        username: true,
        displayName: true,
        avatarUrl: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    }),
    prisma.comment.findMany({
      where: { authorId: userId },
      orderBy: { createdAt: 'asc' },
      select: {
        content: true,
        createdAt: true,
        updatedAt: true,
        parentId: true,
        post: { select: { title: true, slug: true } },
      },
    }),
    prisma.session.findMany({
      where: { userId },
      orderBy: { lastSeenAt: 'desc' },
      select: {
        userAgent: true,
        createdAt: true,
        lastSeenAt: true,
        expiresAt: true,
      },
    }),
    prisma.postAuthor.findMany({
      where: { userId },
      select: { post: { select: { title: true, slug: true } } },
    }),
    prisma.projectAuthor.findMany({
      where: { userId },
      select: { project: { select: { title: true, slug: true } } },
    }),
  ]);

  const data = {
    exportedAt: new Date().toISOString(),
    profile: user,
    comments: comments.map(({ post, ...comment }) => ({
      ...comment,
      isReply: comment.parentId !== null,
      parentId: undefined,
      post,
    })),
    devices: sessions,
    authorOf: {
      posts: posts.map(({ post }) => post),
      projects: projects.map(({ project }) => project),
    },
  };

  return new NextResponse(JSON.stringify(data, null, 2), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Content-Disposition': `attachment; filename="niso-moe-${user.username}.json"`,
      'Cache-Control': 'private, no-store',
    },
  });
}
