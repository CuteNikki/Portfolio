import type { MetadataRoute } from 'next';

import prisma from '@/lib/prisma';

import { SITE_URL } from '@/constants/metadata';

// Query the database on request instead of at build time, so new posts and
// projects show up without a rebuild
export const dynamic = 'force-dynamic';

const STATIC_ROUTES = [
  '',
  '/projects',
  '/posts',
  '/contact',
  '/privacy',
  '/datenschutz',
  '/imprint',
  '/impressum',
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const published = {
    where: { publishedAt: { not: null } },
    select: { id: true, slug: true, updatedAt: true },
  };

  const [posts, projects] = await Promise.all([
    prisma.post.findMany(published),
    prisma.project.findMany(published),
  ]).catch(() => [[], []]);

  return [
    ...STATIC_ROUTES.map((route) => ({ url: `${SITE_URL}${route}` })),
    ...posts.map((post) => ({
      url: `${SITE_URL}/posts/${post.slug ?? post.id}`,
      lastModified: post.updatedAt,
    })),
    ...projects.map((project) => ({
      url: `${SITE_URL}/projects/${project.slug ?? project.id}`,
      lastModified: project.updatedAt,
    })),
  ];
}
