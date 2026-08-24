import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import {
  CalendarIcon,
  ChevronLeftIcon,
  GlobeIcon,
  PencilLineIcon,
} from 'lucide-react';

import { Role } from '@/generated/prisma/enums';

import { LINKS } from '@/constants/links';
import { getCurrentSession } from '@/lib/auth';
import prisma from '@/lib/prisma';

import { ScrollReveal } from '@/components/common/scroll-reveal';
import { ShareButton } from '@/components/dashboard/posts/share';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { SiGit } from '@icons-pack/react-simple-icons';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ projectId: string }>;
}): Promise<Metadata> {
  const { projectId } = await params;

  const project = await prisma.project
    .findFirst({
      where: {
        OR: [{ id: projectId }, { slug: projectId }],
      },
    })
    .then((project) => project)
    .catch(() => null);

  if (!project) return { title: 'Project Not Found' };

  return {
    title: `niso.moe | ${project.title}`,
    description: project.description.substring(0, 160).concat('...'),
  };
}

export default async function ProjectsPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;

  const { project, hasError } = await prisma.project
    .findFirst({
      where: {
        OR: [{ id: projectId }, { slug: projectId }],
      },
    })
    .then((project) => ({ project, hasError: false }))
    .catch(() => ({ project: null, hasError: true }));

  if (!project || hasError) {
    notFound();
  }

  const session = await getCurrentSession();
  if (!project.publishedAt) {
    if (
      !session ||
      (session.user.role !== Role.ADMIN && session.user.role !== Role.WRITER)
    ) {
      notFound();
    }
  }

  return (
    <article className='mx-auto w-full max-w-3xl py-8'>
      {/* Back Button */}
      <Button variant='ghost' size='lg' asChild className='mb-4'>
        <Link href={LINKS.projects.url}>
          <ChevronLeftIcon />
          Back to Overview
        </Link>
      </Button>

      <ScrollReveal className='scroll-reveal'>
      {/* Header Section */}
      <header
        data-reveal-item
        style={{ '--reveal-index': 0 } as React.CSSProperties}
        className='mb-10 flex flex-col gap-4 border-b pb-8'
      >
        <h1 className='line-clamp-6 text-4xl font-extrabold tracking-tight text-ellipsis lg:text-5xl'>
          {project.title}
        </h1>

        <div className='text-muted-foreground flex flex-wrap items-center gap-4'>
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
            {(session?.user.role === Role.ADMIN ||
              session?.user.role === Role.WRITER) && (
              <Button variant='outline' size='xs' asChild>
                <Link href={LINKS.dashboardProjectEditWithId(project.id).url}>
                  <PencilLineIcon />
                  Edit Project
                </Link>
              </Button>
            )}
            {!project.publishedAt && (
              <Badge variant='destructive' size='lg'>
                Unpublished
              </Badge>
            )}
          </div>
        </div>

        {project.tags.length > 0 || project.technologies.length > 0 ? (
          <div className='flex flex-col gap-2'>
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
      </header>
      <div data-reveal-item style={{ '--reveal-index': 1 } as React.CSSProperties}>
        {project.description}
      </div>
      <div
        data-reveal-item
        style={{ '--reveal-index': 2 } as React.CSSProperties}
        className='flex flex-wrap items-center gap-2 py-8'
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
              View Repository
            </Link>
          </Button>
        )}
      </div>
      </ScrollReveal>
    </article>
  );
}
