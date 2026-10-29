import { cacheLife, cacheTag } from 'next/cache';

import type { Prisma } from '@/generated/prisma/client';

import { isWriter } from '@/lib/auth';
import prisma from '@/lib/prisma';

// The user fields that are safe to show publicly
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

// A post's or project's authors in the order they're shown, with only their public fields
const AUTHORS = {
  orderBy: { position: 'asc' },
  include: { user: { select: PUBLIC_USER_SELECT } },
} as const;

const POST_INCLUDE = { authors: AUTHORS } satisfies Prisma.PostInclude;

const PROJECT_INCLUDE = {
  authors: AUTHORS,
  images: { orderBy: { position: 'asc' } },
} satisfies Prisma.ProjectInclude;

// Kept in a file without server code, since the dashboard's tables use it in the browser too
export { type Author, authorsOf } from '@/lib/author-list';

const bySlugOrId = (idOrSlug: string) => ({
  OR: [{ id: idOrSlug }, { slug: idOrSlug }],
});

// Published posts and projects look the same for every visitor, so they are
// cached and prerendered. The post and project actions refresh them through
// their tag, and `cacheLife` picks up view counts and profile changes.
// Remote, so every function instance shares one copy: otherwise each new
// instance, and each one after a save refreshes the tag, asks the database
// again, a few connections each.

export async function getPublishedPosts() {
  'use cache: remote';
  cacheTag('posts');
  cacheLife('hours');

  return prisma.post.findMany({
    where: { publishedAt: { not: null } },
    orderBy: { createdAt: 'desc' },
    include: { authors: AUTHORS },
  });
}

export async function getPublishedPost(idOrSlug: string) {
  'use cache: remote';
  cacheTag('posts');
  cacheLife('hours');

  return prisma.post.findFirst({
    where: { ...bySlugOrId(idOrSlug), publishedAt: { not: null } },
    include: POST_INCLUDE,
  });
}

export const commentsTag = (postId: string) => `comments:${postId}`;

// A post's comments, newest first. They're cached apart from the post, so a new comment only refreshes these (through
// the post's comments tag), not every page that shows the post. Deleting a user refreshes them all (`comments`).
export async function getComments(postId: string) {
  'use cache: remote';
  cacheTag('comments', commentsTag(postId));
  cacheLife('hours');

  return prisma.comment.findMany({
    where: { postId },
    include: { author: { select: PUBLIC_USER_SELECT } },
    orderBy: { createdAt: 'desc' },
  });
}

export async function getPublishedProjects() {
  'use cache: remote';
  cacheTag('projects');
  cacheLife('hours');

  return prisma.project.findMany({
    where: { publishedAt: { not: null } },
    orderBy: { createdAt: 'desc' },
    include: PROJECT_INCLUDE,
  });
}

export async function getPublishedProject(idOrSlug: string) {
  'use cache: remote';
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
    include: { authors: AUTHORS },
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
