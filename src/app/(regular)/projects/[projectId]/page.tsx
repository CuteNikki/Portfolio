import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';

import { SiGithub } from '@icons-pack/react-simple-icons';
import { ArrowUpRightIcon, PencilLineIcon } from 'lucide-react';

import { toProjectCard } from '@/lib/cards';
import {
  authorsOf,
  getDraftProject,
  getPublishedProject,
  getPublishedProjects,
} from '@/lib/data';
import { headingsOf } from '@/lib/toc';
import { formatShortDate, toExcerpt } from '@/lib/utils';

import { LINKS } from '@/constants/links';
import { NO_INDEX } from '@/constants/metadata';

import { StoredImage } from '@/components/common/stored-image';
import { AuthorName } from '@/components/common/author-name';
import { WriterOnly } from '@/components/common/writer-only';
import { MarkdownViewer } from '@/components/dashboard/posts/markdown';
import { ShareButton } from '@/components/dashboard/posts/share';
import type { ProjectCardData } from '@/components/projects/project-card';
import { ProjectGallery } from '@/components/projects/project-gallery';
import { ProjectThumbnail } from '@/components/projects/project-thumbnail';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

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
    authors: authorsOf(project).map(({ name, url }) => ({
      name,
      url: url ?? undefined,
    })),
    alternates: { canonical: `/projects/${project.slug ?? project.id}` },
  };
}

export default function ProjectPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  return (
    <Suspense fallback={<ProjectSkeleton />}>
      <ProjectContent params={params} />
    </Suspense>
  );
}

// notFound() here runs after the page has started streaming, so an unknown project keeps a 200 status with noindex.
// Calling it before the stream would give a 404, but Next then sends an empty error page that renders only in the
// browser: no content without JavaScript, and the theme flashes.
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

  const authors = authorsOf(project);
  const date = project.publishedAt ?? project.createdAt;
  const headings = headingsOf(project.description);

  return (
    <article className='flex w-full flex-col gap-10'>
      <header className='relative isolate flex flex-col gap-6 pt-2 sm:pt-6'>
        <div
          aria-hidden
          className='grid-backdrop pointer-events-none absolute -top-16 left-1/2 -z-10 h-120 w-screen -translate-x-1/2 sm:-top-24'
        />
        <nav
          aria-label='Breadcrumb'
          className='animate-hero-in text-muted-foreground text-[13px]'
        >
          <ol className='flex flex-wrap items-center gap-2'>
            <li>
              <Link
                href={LINKS.projects.url}
                className='nav-underline hover:text-foreground lowercase transition-colors'
              >
                projects
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li aria-current='page' className='text-foreground lowercase'>
              {project.slug ?? project.title}
            </li>
          </ol>
        </nav>

        <div className='flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between'>
          <h1 className='animate-hero-in flex flex-wrap items-center gap-4 text-[44px] leading-[1.04] font-bold tracking-[-0.06em] text-balance delay-1 sm:text-[56px]'>
            {project.title}
            {!project.publishedAt && (
              <Badge variant='destructive' size='lg'>
                Unpublished
              </Badge>
            )}
          </h1>

          <div className='animate-hero-in flex flex-wrap items-center gap-2.5 delay-2'>
            {project.website && (
              <Button asChild>
                <a
                  href={project.website}
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  Visit site
                  <ArrowUpRightIcon className='group-hover/button:translate-x-0.5 group-hover/button:-translate-y-0.5' />
                </a>
              </Button>
            )}
            {project.repository && (
              <Button asChild variant='outline'>
                <a
                  href={project.repository}
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  <SiGithub title='' aria-hidden />
                  Source
                </a>
              </Button>
            )}
            <ShareButton
              path={LINKS.projectWithSlugOrId(project.slug ?? project.id).url}
              label='Project'
              size='default'
            />
            <WriterOnly>
              <Button asChild variant='outline'>
                <Link href={LINKS.dashboardProjectEditWithId(project.id).url}>
                  <PencilLineIcon />
                  Edit
                </Link>
              </Button>
            </WriterOnly>
          </div>
        </div>

        <dl className='animate-hero-in bg-card grid gap-x-8 gap-y-5 rounded-xl border p-6 text-[13px] delay-3 sm:grid-cols-2 lg:grid-cols-4'>
          <div className='flex flex-col gap-1.5'>
            <dt className='text-muted-foreground'>Published</dt>
            <dd>
              <time dateTime={date.toISOString()}>{formatShortDate(date)}</time>
            </dd>
          </div>
          {authors.length > 0 && (
            <div className='flex flex-col gap-1.5'>
              <dt className='text-muted-foreground'>
                {authors.length === 1 ? 'Author' : 'Authors'}
              </dt>
              <dd className='flex flex-wrap gap-x-3 gap-y-1.5'>
                {authors.map((author) => (
                  <AuthorName key={author.key} author={author} size='sm' />
                ))}
              </dd>
            </div>
          )}
          {project.technologies.length > 0 && (
            <div className='flex flex-col gap-1.5'>
              <dt className='text-muted-foreground'>Stack</dt>
              <dd>{project.technologies.join(', ')}</dd>
            </div>
          )}
          {project.tags.length > 0 && (
            <div className='flex flex-col gap-1.5'>
              <dt className='text-muted-foreground'>
                {project.tags.length === 1 ? 'Tag' : 'Tags'}
              </dt>
              <dd className='flex flex-wrap gap-1.5'>
                {project.tags.map((tag) => (
                  <Badge key={tag} variant='outline' className='rounded-md'>
                    {tag}
                  </Badge>
                ))}
              </dd>
            </div>
          )}
        </dl>
      </header>

      {project.coverUrl && (
        <div
          data-reveal=''
          style={{ '--reveal-index': 3 } as React.CSSProperties}
          className='bg-muted relative aspect-video overflow-hidden rounded-xl border sm:aspect-2/1'
        >
          <StoredImage
            url={project.coverUrl}
            alt={`${project.title}'s cover picture`}
            fill
            priority
            sizes='(min-width: 1200px) 1152px, calc(100vw - 32px)'
            className='object-cover'
          />
        </div>
      )}

      {project.images.length > 0 && (
        <section
          aria-labelledby='pictures-heading'
          data-reveal=''
          style={{ '--reveal-index': 4 } as React.CSSProperties}
        >
          <h2 id='pictures-heading' className='sr-only'>
            Pictures
          </h2>
          <ProjectGallery
            title={project.title}
            pictures={project.images.map(({ url, alt }) => ({ url, alt }))}
          />
        </section>
      )}

      <div
        data-reveal=''
        style={{ '--reveal-index': 5 } as React.CSSProperties}
        className='grid gap-10 lg:grid-cols-[minmax(0,1fr)_220px] lg:gap-16'
      >
        <div className='max-w-3xl min-w-0'>
          <MarkdownViewer content={project.description} />
        </div>
        {headings.length > 1 && (
          <nav aria-label='On this page' className='order-first lg:order-none'>
            <div className='flex flex-col gap-2.5 text-[13px] lg:sticky lg:top-28'>
              <span className='text-muted-foreground'>On this page</span>
              <ul className='flex flex-col gap-2'>
                {headings.map(({ id, text, level }) => (
                  <li key={id} className={level === 3 ? 'pl-3' : undefined}>
                    <a
                      href={`#${id}`}
                      className='text-body hover:text-primary-text transition-colors'
                    >
                      {text}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </nav>
        )}
      </div>

      {project.publishedAt && <Neighbours projectId={project.id} />}
    </article>
  );
}

// The newer and older project next to this one, as cards with a picture, so readers can carry on
async function Neighbours({ projectId }: { projectId: string }) {
  const projects = (await getPublishedProjects())
    .map(toProjectCard)
    .sort((a, b) => b.time - a.time);
  const index = projects.findIndex(({ id }) => id === projectId);
  if (index === -1) return null;

  const newer = projects[index - 1];
  const older = projects[index + 1];
  if (!newer && !older) return null;

  return (
    <nav aria-label='More projects' className='mt-10 grid gap-4 md:grid-cols-2'>
      {newer ? <NeighbourCard project={newer} direction='newer' /> : <div />}
      {older && <NeighbourCard project={older} direction='older' />}
    </nav>
  );
}

function NeighbourCard({
  project,
  direction,
}: {
  project: ProjectCardData;
  direction: 'newer' | 'older';
}) {
  return (
    <Link
      href={project.href}
      className='group bg-card hover:border-line-strong flex flex-col gap-4 rounded-xl border p-3 transition-colors sm:flex-row'
    >
      <ProjectThumbnail
        title={project.title}
        coverUrl={project.coverUrl}
        sizes='(min-width: 640px) 200px, calc(100vw - 56px)'
        className='aspect-16/10 shrink-0 rounded-lg sm:w-50'
      />
      <span className='flex min-w-0 flex-col gap-1 py-1 pr-2'>
        <span className='text-muted-foreground text-xs'>
          {direction === 'newer' ? '← Newer project' : 'Older project →'}
        </span>
        <span className='text-[17px] font-bold tracking-[-0.04em]'>
          {project.title}
        </span>
        <span className='text-body line-clamp-2 text-[13px] leading-relaxed'>
          {project.excerpt}
        </span>
        <span className='text-muted-foreground mt-auto pt-1.5 text-xs'>
          {[project.date, project.technologies.slice(0, 3).join(' · ')]
            .filter(Boolean)
            .join(' · ')}
        </span>
      </span>
    </Link>
  );
}

function ProjectSkeleton() {
  return (
    <div className='flex w-full flex-col gap-6 pt-6'>
      <Skeleton className='h-4 w-40' />
      <Skeleton className='h-14 w-2/3' />
      <Skeleton className='h-24 w-full rounded-xl' />
      <Skeleton className='aspect-2/1 w-full rounded-xl' />
    </div>
  );
}
