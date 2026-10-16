import { Suspense } from 'react';
import Link from 'next/link';

import { requireWriter } from '@/lib/auth';
import prisma from '@/lib/prisma';

import { LINKS } from '@/constants/links';
import { SITE_METADATA } from '@/constants/metadata';

import { StoredImage } from '@/components/common/stored-image';
import { DashboardPageHeader } from '@/components/dashboard/shared/page-header';
import { StatTile, StorageTile } from '@/components/dashboard/shared/stat-tile';
import { Skeleton } from '@/components/ui/skeleton';

export const { dashboardMedia: metadata } = SITE_METADATA;

// Every dashboard page checks the session before it renders anything, so moving between them waits for the server.
// The layout's `instant = false` only covers arriving from outside the dashboard.
export const instant = false;

interface Picture {
  url: string;
  alt: string;
  usedBy: string;
  usage: string;
  editHref: string;
}

export default async function MediaPage() {
  await requireWriter();

  const [posts, projects, images] = await Promise.all([
    prisma.post.findMany({
      where: { coverUrl: { not: null } },
      select: { id: true, title: true, coverUrl: true },
    }),
    prisma.project.findMany({
      where: { coverUrl: { not: null } },
      select: { id: true, title: true, coverUrl: true },
    }),
    prisma.projectImage.findMany({
      orderBy: [{ projectId: 'asc' }, { position: 'asc' }],
      include: { project: { select: { id: true, title: true } } },
    }),
  ]);

  const projectCount = new Set(images.map(({ projectId }) => projectId)).size;

  const pictures: Picture[] = [
    ...posts.map((post) => ({
      url: post.coverUrl!,
      alt: `Cover of ${post.title}`,
      usedBy: post.title,
      usage: 'Post cover',
      editHref: LINKS.dashboardPostEditWithId(post.id).url,
    })),
    ...projects.map((project) => ({
      url: project.coverUrl!,
      alt: `Cover of ${project.title}`,
      usedBy: project.title,
      usage: 'Project cover',
      editHref: LINKS.dashboardProjectEditWithId(project.id).url,
    })),
    ...images.map((image) => ({
      url: image.url,
      alt: image.alt || `Picture from ${image.project.title}`,
      usedBy: image.project.title,
      usage: 'Project picture',
      editHref: LINKS.dashboardProjectEditWithId(image.project.id).url,
    })),
  ];

  return (
    <div className='flex flex-col gap-6'>
      <DashboardPageHeader
        title='Media'
        description='Every picture the site uses. Add, replace or remove them on their post or project.'
      />

      <dl className='grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3'>
        <div className='col-span-2 lg:col-span-1'>
          <Suspense fallback={<Skeleton className='h-27 rounded-xl' />}>
            <StorageTile />
          </Suspense>
        </div>
        <StatTile
          label='Covers'
          value={posts.length + projects.length}
          note={`${posts.length} on posts · ${projects.length} on projects`}
        />
        <StatTile
          label='Project pictures'
          value={images.length}
          note={`across ${projectCount} ${projectCount === 1 ? 'project' : 'projects'}`}
        />
      </dl>

      {pictures.length === 0 ? (
        <p className='text-muted-foreground rounded-xl border border-dashed px-6 py-16 text-center text-sm'>
          No pictures yet. Add a cover to a post or project to see it here.
        </p>
      ) : (
        <ul className='grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4'>
          {pictures.map((picture) => (
            <li key={picture.url}>
              <Link
                href={picture.editHref}
                className='group bg-card hover:border-line-strong flex flex-col overflow-hidden rounded-xl border transition-colors'
              >
                <span className='bg-muted relative aspect-16/10'>
                  <StoredImage
                    url={picture.url}
                    alt={picture.alt}
                    fill
                    sizes='(min-width: 1280px) 22vw, (min-width: 768px) 30vw, 46vw'
                    className='object-cover'
                  />
                </span>
                <span className='flex flex-col gap-0.5 px-3.5 py-3'>
                  <span className='group-hover:text-primary-text truncate text-[13px] font-semibold transition-colors'>
                    {picture.usedBy}
                  </span>
                  <span className='text-muted-foreground text-xs'>
                    {picture.usage}
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
