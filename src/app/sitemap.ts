import type { MetadataRoute } from 'next';

import { getPublishedPosts, getPublishedProjects } from '@/lib/data';

import { SITE_URL } from '@/constants/metadata';

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
  const [posts, projects] = await Promise.all([
    getPublishedPosts(),
    getPublishedProjects(),
  ]);

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
