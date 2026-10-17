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
import { RemovePictureButton } from '@/components/dashboard/media/remove-picture';
import { UnusedPictures as UnusedPictureList } from '@/components/dashboard/media/unused-pictures';
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
      where: {
        OR: [{ coverUrl: { not: null } }, { thumbnailUrl: { not: null } }],
      },
      select: { id: true, title: true, coverUrl: true, thumbnailUrl: true },
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
  // Thumbnails and dark theme covers count as covers too
  const postCovers = posts.reduce(
    (sum, { coverUrl, thumbnailUrl }) =>
      sum + (coverUrl ? 1 : 0) + (thumbnailUrl ? 1 : 0),
    0,
  );
  const projectCovers = projects.reduce(
    (sum, { coverUrl, coverDarkUrl }) =>
      sum + (coverUrl ? 1 : 0) + (coverDarkUrl ? 1 : 0),
    0,
  );

  const pictures: Picture[] = [
    ...posts.flatMap((post) => [
      ...(post.coverUrl
        ? [
            {
              url: post.coverUrl,
              alt: `Cover of ${post.title}`,
              usedBy: post.title,
              usage: 'Post cover',
              editHref: LINKS.dashboardPostEditWithId(post.id).url,
            },
          ]
        : []),
      ...(post.thumbnailUrl
        ? [
            {
              url: post.thumbnailUrl,
              alt: `Thumbnail of ${post.title}`,
              usedBy: post.title,
              usage: 'Post thumbnail',
              editHref: LINKS.dashboardPostEditWithId(post.id).url,
            },
          ]
        : []),
    ]),
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
          value={postCovers + projectCovers}
          note={`${postCovers} on posts · ${projectCovers} on projects`}
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
        <ul className='grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4'>
          {pictures.map((picture) => (
            <li key={picture.url} className='group/picture relative'>
              <Link
                href={picture.editHref}
                className='group bg-card hover:border-line-strong flex flex-col overflow-hidden rounded-xl border transition-colors'
              >
                <span className='bg-muted relative aspect-2/1'>
                  <StoredImage
                    url={picture.url}
                    alt={picture.alt}
                    fill
                    sizes='(min-width: 1280px) 22vw, (min-width: 768px) 30vw, (min-width: 640px) 46vw, 100vw'
                    className='object-cover object-top'
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
              <RemovePictureButton
                url={picture.url}
                usedBy={picture.usedBy}
                editHref={picture.editHref}
                usage={picture.usage}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// Pictures in storage that no post or project uses, e.g. uploaded in a form that was never saved, to delete all at
// once or one by one. Shows nothing when there are none or storage isn't set up.
async function UnusedPictures() {
  const unused = await findUnusedImages().catch((error) => {
    console.error('Could not look for unused pictures:', error);
    return null;
  });
  if (!unused || unused.items.length === 0) return null;

  return <UnusedPictureList pictures={unused.items} />;
}
