import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';

import {
  CalendarIcon,
  ChevronLeftIcon,
  GlobeIcon,
  PencilLineIcon,
} from 'lucide-react';

import { LINKS } from '@/constants/links';
import { NO_INDEX } from '@/constants/metadata';
import {
  getDraftProject,
  getPublishedProject,
  getPublishedProjects,
} from '@/lib/data';
import { toExcerpt } from '@/lib/utils';

import { ScrollReveal } from '@/components/common/scroll-reveal';
import { WriterOnly } from '@/components/common/writer-only';
import { MarkdownViewer } from '@/components/dashboard/posts/markdown';
import { ShareButton } from '@/components/dashboard/posts/share';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { SiGit } from '@icons-pack/react-simple-icons';

export async function generateStaticParams() {
  const projects = await getPublishedProjects();

  // Cache Components needs at least one param to prerender the route. The
  // placeholder renders as not found.
  if (projects.length === 0) return [{ projectId: 'none' }];

  return projects.map((project) => ({
    projectId: project.slug ?? project.id,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ projectId: string }>;
}): Promise<Metadata> {
  const { projectId } = await params;
  const project = await getPublishedProject(projectId);

  // Drafts and missing projects look the same here, so a draft's title never leaks
  if (!project) return { title: 'Project', robots: NO_INDEX };

  return {
    title: project.title,
    description: toExcerpt(project.description),
    keywords: [...project.technologies, ...project.tags],
    alternates: { canonical: `/projects/${project.slug ?? project.id}` },
  };
}

export default function ProjectPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  return (
    <article className='mx-auto w-full max-w-3xl py-8'>
      {/* Back Button */}
      <Button variant='ghost' size='lg' asChild className='mb-4'>
        <Link href={LINKS.projects.url}>
          <ChevronLeftIcon />
          Back to Overview
        </Link>
      </Button>

      <Suspense fallback={<ProjectSkeleton />}>
        <ProjectContent params={params} />
      </Suspense>
    </article>
  );
}

async function ProjectContent({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;

  // Published projects come from the cache and are prerendered. Only unknown
  // ids fall through to the draft lookup, which reads the session.
  const project =
    (await getPublishedProject(projectId)) ??
    (await getDraftProject(projectId));

  if (!project) {
    notFound();
  }

  return (
    <>
      {/* Unified ScrollReveal for Title, Meta, and Body */}
      <ScrollReveal className='scroll-reveal'>
        <header className='mb-10 flex flex-col gap-4 border-b pb-8'>
          <h1
            data-reveal-item
            style={{ '--reveal-index': 0 } as React.CSSProperties}
            className='line-clamp-6 text-4xl font-extrabold tracking-tight text-ellipsis lg:text-5xl'
          >
            {project.title}
          </h1>

          <div
            data-reveal-item
            style={{ '--reveal-index': 1 } as React.CSSProperties}
            className='text-muted-foreground flex flex-wrap items-center gap-4'
          >
            <div className='flex items-center gap-2'>
              <CalendarIcon className='size-4' />
              <time dateTime={project.createdAt.toISOString()}>
                {new Date(project.createdAt).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </time>
            </div>

            <div className='ml-auto flex flex-wrap items-center gap-2'>
              <ShareButton postId={project.id} />
              <WriterOnly>
                <Button variant='outline' size='xs' asChild>
                  <Link href={LINKS.dashboardProjectEditWithId(project.id).url}>
                    <PencilLineIcon />
                    Edit Project
                  </Link>
                </Button>
              </WriterOnly>
              {!project.publishedAt && (
                <Badge variant='destructive' size='lg'>
                  Unpublished
                </Badge>
              )}
            </div>
          </div>

          {project.tags.length > 0 || project.technologies.length > 0 ? (
            <div
              data-reveal-item
              style={{ '--reveal-index': 2 } as React.CSSProperties}
              className='flex flex-col gap-2 pt-2'
            >
              {project.tags.length > 0 && (
                <div className='flex flex-wrap items-center gap-2'>
                  <span>Tags:</span>
                  {project.tags.map((tag) => (
                    <Badge key={tag} variant='secondary'>
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
              {project.technologies.length > 0 && (
                <div className='flex flex-wrap items-center gap-2'>
                  <span>Technologies:</span>
                  {project.technologies.map((tech) => (
                    <Badge key={tech} variant='secondary'>
                      {tech}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          ) : null}

          <div
            data-reveal-item
            style={{ '--reveal-index': 3 } as React.CSSProperties}
            className='flex flex-wrap items-center gap-2'
          >
            {project.website && (
              <Button asChild>
                <Link
                  href={project.website}
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  <GlobeIcon />
                  Visit Website
                </Link>
              </Button>
            )}
            {project.repository && (
              <Button asChild>
                <Link
                  href={project.repository}
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  <SiGit />
                  View Source
                </Link>
              </Button>
            )}
          </div>
        </header>

        {/* Project Description Body (Staggered to appear after the header) */}
        <div
          data-reveal-item
          style={{ '--reveal-index': 4 } as React.CSSProperties}
        >
          <MarkdownViewer content={project.description} />
        </div>
      </ScrollReveal>
    </>
  );
}

function ProjectSkeleton() {
  return (
    <div className='flex flex-col gap-4'>
      <Skeleton className='h-12 w-3/4' />
      <Skeleton className='mb-10 h-6 w-1/2' />
      <Skeleton className='h-64 w-full' />
    </div>
  );
}
