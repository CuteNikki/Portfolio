import { formatShortDate, toExcerpt } from '@/lib/utils';

import { LINKS } from '@/constants/links';

import type { ProjectCardData } from '@/components/projects/project-card';
import type { PostRowData } from '@/components/posts/post-row';

interface ProjectLike {
  id: string;
  slug: string | null;
  title: string;
  description: string;
  technologies: string[];
  tags: string[];
  publishedAt: Date | null;
  createdAt: Date;
  coverUrl?: string | null;
  coverDarkUrl?: string | null;
}

interface PostLike {
  id: string;
  slug: string | null;
  title: string;
  content: string;
  views: number;
  publishedAt: Date | null;
  createdAt: Date;
  coverUrl?: string | null;
}

// Turns database rows into the plain data the cards and rows render, which can also be handed to Client Components

export function toProjectCard(project: ProjectLike): ProjectCardData {
  // The project's own date from its form, not when it went up on this site
  const date = project.createdAt;

  return {
    id: project.id,
    href: LINKS.projectWithSlugOrId(project.slug ?? project.id).url,
    title: project.title,
    excerpt: toExcerpt(project.description, 180),
    date: formatShortDate(date),
    time: date.getTime(),
    technologies: project.technologies,
    tags: project.tags,
    coverUrl: project.coverUrl ?? null,
    coverDarkUrl: project.coverDarkUrl ?? null,
    isDraft: project.publishedAt === null,
  };
}

export function toPostRow(post: PostLike): PostRowData {
  const date = post.publishedAt ?? post.createdAt;

  return {
    id: post.id,
    href: LINKS.postWithSlugOrId(post.slug ?? post.id).url,
    title: post.title,
    excerpt: toExcerpt(post.content, 200),
    date: formatShortDate(date),
    time: date.getTime(),
    views: post.views,
    coverUrl: post.coverUrl ?? null,
    isDraft: post.publishedAt === null,
  };
}
