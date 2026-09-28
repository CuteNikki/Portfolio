import { cacheLife, cacheTag } from 'next/cache';

import type { Prisma } from '@/generated/prisma/client';

import { isWriter } from '@/lib/auth';
import prisma from '@/lib/prisma';

// The user fields that are safe to show publicly. Never send a full user to
// the page: it includes the user's Discord access and refresh tokens.
export const PUBLIC_USER_SELECT = {
  id: true,
  discordId: true,
  displayName: true,
  username: true,
  avatarUrl: true,
  role: true,
  createdAt: true,
} satisfies Prisma.UserSelect;

export type PublicUser = Prisma.UserGetPayload<{
  select: typeof PUBLIC_USER_SELECT;
}>;

const POST_INCLUDE = {
  writer: { select: PUBLIC_USER_SELECT },
  comments: {
    include: { author: { select: PUBLIC_USER_SELECT } },
    orderBy: { createdAt: 'desc' },
  },
} satisfies Prisma.PostInclude;

const PROJECT_INCLUDE = {
  writer: { select: PUBLIC_USER_SELECT },
} satisfies Prisma.ProjectInclude;

const bySlugOrId = (idOrSlug: string) => ({
  OR: [{ id: idOrSlug }, { slug: idOrSlug }],
});

// Published posts and projects look the same for every visitor, so they are
// cached and prerendered. The post and project actions refresh them through
// their tag, and `cacheLife` picks up view counts and profile changes.

export async function getPublishedPosts() {
  'use cache';
  cacheTag('posts');
  cacheLife('hours');

  return prisma.post.findMany({
    where: { publishedAt: { not: null } },
    orderBy: { createdAt: 'desc' },
    include: { writer: { select: PUBLIC_USER_SELECT } },
  });
}

export async function getPublishedPost(idOrSlug: string) {
  'use cache';
  cacheTag('posts');
  cacheLife('hours');

  return prisma.post.findFirst({
    where: { ...bySlugOrId(idOrSlug), publishedAt: { not: null } },
    include: POST_INCLUDE,
  });
}

export async function getPublishedProjects() {
  'use cache';
  cacheTag('projects');
  cacheLife('hours');

  return prisma.project.findMany({
    where: { publishedAt: { not: null } },
    orderBy: { createdAt: 'desc' },
    include: PROJECT_INCLUDE,
  });
}

export async function getPublishedProject(idOrSlug: string) {
  'use cache';
  cacheTag('projects');
  cacheLife('hours');

  return prisma.project.findFirst({
    where: { ...bySlugOrId(idOrSlug), publishedAt: { not: null } },
    include: PROJECT_INCLUDE,
  });
}

// Drafts are only visible to writers, so these read the session and are never
// cached. Call them inside a <Suspense> boundary.

export async function getDraftPosts() {
  if (!(await isWriter())) return [];

  return prisma.post.findMany({
    where: { publishedAt: null },
    orderBy: { createdAt: 'desc' },
    include: { writer: { select: PUBLIC_USER_SELECT } },
  });
}

export async function getDraftPost(idOrSlug: string) {
  if (!(await isWriter())) return null;

  return prisma.post.findFirst({
    where: { ...bySlugOrId(idOrSlug), publishedAt: null },
    include: POST_INCLUDE,
  });
}

export async function getDraftProjects() {
  if (!(await isWriter())) return [];

  return prisma.project.findMany({
    where: { publishedAt: null },
    orderBy: { createdAt: 'desc' },
    include: PROJECT_INCLUDE,
  });
}

export async function getDraftProject(idOrSlug: string) {
  if (!(await isWriter())) return null;

  return prisma.project.findFirst({
    where: { ...bySlugOrId(idOrSlug), publishedAt: null },
    include: PROJECT_INCLUDE,
  });
}
