import { after } from 'next/server';
import { Suspense } from 'react';
import Link from 'next/link';

import { requireWriter } from '@/lib/auth';
import { findUnusedImages, sweepUnusedImages } from '@/lib/uploads';
import prisma from '@/lib/prisma';
import { cn } from '@/lib/utils';

import { LINKS } from '@/constants/links';
import { SITE_METADATA } from '@/constants/metadata';

import { StoredImage } from '@/components/common/stored-image';
import { CleanUpButton } from '@/components/dashboard/media/clean-up';
import { DashboardPageHeader } from '@/components/dashboard/shared/page-header';
import {
  StatTile,
  StorageTile,
  TILE_HEIGHT,
} from '@/components/dashboard/shared/stat-tile';
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

  // Clears out pictures left behind by forms closed without saving, once the page is sent
  after(sweepUnusedImages);

  const [posts, projects, images] = await Promise.all([
    prisma.post.findMany({
      where: { coverUrl: { not: null } },
      select: { id: true, title: true, coverUrl: true },
    }),
    prisma.project.findMany({
      where: {
        OR: [{ coverUrl: { not: null } }, { coverDarkUrl: { not: null } }],
      },
      select: { id: true, title: true, coverUrl: true, coverDarkUrl: true },
    }),
    prisma.projectImage.findMany({
      orderBy: [{ projectId: 'asc' }, { position: 'asc' }],
      include: { project: { select: { id: true, title: true } } },
    }),
  ]);

  const projectCount = new Set(images.map(({ projectId }) => projectId)).size;
  // Dark theme covers count as covers too
  const projectCovers = projects.reduce(
    (sum, { coverUrl, coverDarkUrl }) =>
      sum + (coverUrl ? 1 : 0) + (coverDarkUrl ? 1 : 0),
    0,
  );

  const pictures: Picture[] = [
    ...posts.map((post) => ({
      url: post.coverUrl!,
      alt: `Cover of ${post.title}`,
      usedBy: post.title,
      usage: 'Post cover',
      editHref: LINKS.dashboardPostEditWithId(post.id).url,
    })),
    ...projects.flatMap((project) => [
      ...(project.coverUrl
        ? [
            {
              url: project.coverUrl,
              alt: `Cover of ${project.title}`,
              usedBy: project.title,
              usage: 'Project cover',
              editHref: LINKS.dashboardProjectEditWithId(project.id).url,
            },
          ]
        : []),
      ...(project.coverDarkUrl
        ? [
            {
              url: project.coverDarkUrl,
              alt: `Dark theme cover of ${project.title}`,
              usedBy: project.title,
              usage: 'Project cover, dark themes',
              editHref: LINKS.dashboardProjectEditWithId(project.id).url,
            },
          ]
        : []),
    ]),
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
          <Suspense
            fallback={<Skeleton className={cn('rounded-xl', TILE_HEIGHT)} />}
          >
            <StorageTile />
          </Suspense>
        </div>
        <StatTile
          label='Covers'
          value={posts.length + projectCovers}
          note={`${posts.length} on posts · ${projectCovers} on projects`}
        />
        <StatTile
          label='Project pictures'
          value={images.length}
          note={`across ${projectCount} ${projectCount === 1 ? 'project' : 'projects'}`}
        />
      </dl>

      <Suspense>
        <UnusedPictures />
      </Suspense>

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

// Pictures in storage that no post or project uses, e.g. uploaded in a form that was never saved, with a button to
// delete them. Shows nothing when there are none or storage isn't set up.
async function UnusedPictures() {
  const unused = await findUnusedImages().catch((error) => {
    console.error('Could not look for unused pictures:', error);
    return null;
  });
  if (!unused || unused.urls.length === 0) return null;

  const count = unused.urls.length;
  return (
    <section className='bg-card flex flex-wrap items-center gap-4 rounded-xl border px-5 py-4'>
      <ul className='flex -space-x-3' aria-hidden>
        {unused.previews.slice(0, 4).map((url) => (
          <li
            key={url}
            className='bg-muted ring-card relative h-10 w-14 overflow-hidden rounded-md ring-2'
          >
            <StoredImage
              url={url}
              alt=''
              fill
              sizes='56px'
              className='object-cover'
            />
          </li>
        ))}
      </ul>
      <div className='min-w-0 flex-1'>
        <h2 className='text-[15px] font-bold'>
          {count === 1 ? '1 unused picture' : `${count} unused pictures`}
        </h2>
        <p className='text-muted-foreground mt-0.5 text-xs'>
          In storage but on no post or project, e.g. from a form that was left
          without saving. They are cleared out after a day.
        </p>
      </div>
      <CleanUpButton count={count} />
    </section>
  );
}
