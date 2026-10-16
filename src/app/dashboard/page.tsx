import { Suspense } from 'react';
import Link from 'next/link';

import { PlusIcon } from 'lucide-react';

import { requireWriter } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { formatShortDate, toExcerpt } from '@/lib/utils';

import { LINKS } from '@/constants/links';
import { SITE_METADATA } from '@/constants/metadata';

import { StoredImage } from '@/components/common/stored-image';
import { UserHover } from '@/components/common/user-hover';
import { ContentActions } from '@/components/dashboard/shared/content-actions';
import { DashboardPageHeader } from '@/components/dashboard/shared/page-header';
import { StatTile, StorageTile } from '@/components/dashboard/shared/stat-tile';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

export const { dashboard: metadata } = SITE_METADATA;

// Every dashboard page checks the session before it renders anything, so moving between them waits for the server.
// The layout's `instant = false` only covers arriving from outside the dashboard.
export const instant = false;

const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

// The page renders on every request, so "this week" is counted from the moment of each one
function aWeekAgo() {
  return new Date(Date.now() - WEEK_MS);
}

export default async function DashboardPage() {
  await requireWriter();

  const weekAgo = aWeekAgo();
  const [
    posts,
    projects,
    views,
    comments,
    commentsThisWeek,
    topPosts,
    recentPosts,
    recentProjects,
    latestComments,
  ] = await Promise.all([
    prisma.post.groupBy({ by: ['publishedAt'], _count: true }).then((rows) => ({
      published: rows
        .filter((row) => row.publishedAt)
        .reduce((sum, row) => sum + row._count, 0),
      drafts: rows.find((row) => !row.publishedAt)?._count ?? 0,
    })),
    prisma.project
      .groupBy({ by: ['publishedAt'], _count: true })
      .then((rows) => ({
        published: rows
          .filter((row) => row.publishedAt)
          .reduce((sum, row) => sum + row._count, 0),
        drafts: rows.find((row) => !row.publishedAt)?._count ?? 0,
      })),
    prisma.post
      .aggregate({ _sum: { views: true } })
      .then(({ _sum }) => _sum.views ?? 0),
    prisma.comment.count(),
    prisma.comment.count({ where: { createdAt: { gte: weekAgo } } }),
    prisma.post.findMany({
      where: { publishedAt: { not: null } },
      orderBy: { views: 'desc' },
      take: 5,
      select: { id: true, title: true, slug: true, views: true },
    }),
    prisma.post.findMany({
      orderBy: { updatedAt: 'desc' },
      take: 6,
      select: {
        id: true,
        title: true,
        slug: true,
        coverUrl: true,
        publishedAt: true,
        updatedAt: true,
      },
    }),
    prisma.project.findMany({
      orderBy: { updatedAt: 'desc' },
      take: 6,
      select: {
        id: true,
        title: true,
        slug: true,
        coverUrl: true,
        publishedAt: true,
        updatedAt: true,
      },
    }),
    prisma.comment.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: {
        author: {
          select: {
            id: true,
            discordId: true,
            displayName: true,
            username: true,
            avatarUrl: true,
            role: true,
            createdAt: true,
          },
        },
        post: { select: { id: true, title: true, slug: true } },
      },
    }),
  ]);

  // Posts and projects together, most recently changed first
  const recent = [
    ...recentPosts.map((post) => ({ ...post, kind: 'post' as const })),
    ...recentProjects.map((project) => ({
      ...project,
      kind: 'project' as const,
    })),
  ]
    .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
    .slice(0, 6);

  const mostViews = Math.max(1, ...topPosts.map(({ views }) => views));

  return (
    <div className='flex flex-col gap-6'>
      <DashboardPageHeader
        title='Overview'
        description='Views, drafts and new comments across the site.'
      >
        <Button asChild variant='outline'>
          <Link href={LINKS.dashboardProjectNew.url}>
            <PlusIcon />
            Project
          </Link>
        </Button>
        <Button asChild>
          <Link href={LINKS.dashboardPostNew.url}>
            <PlusIcon />
            Post
          </Link>
        </Button>
      </DashboardPageHeader>

      <dl className='grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-5'>
        <StatTile
          label='Published posts'
          value={posts.published}
          note={plural(posts.drafts, 'draft')}
        />
        <StatTile
          label='Published projects'
          value={projects.published}
          note={plural(projects.drafts, 'draft')}
        />
        <StatTile label='Post views' value={views} note='all time' />
        <StatTile
          label='Comments'
          value={comments}
          note={`${commentsThisWeek} this week`}
        />
        {/* Spans the row on phones and tablets, where the tiles sit two by two */}
        <div className='col-span-2 xl:col-span-1'>
          <Suspense fallback={<Skeleton className='h-27 rounded-xl' />}>
            <StorageTile />
          </Suspense>
        </div>
      </dl>

      <div className='grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,22rem)]'>
        <Panel
          title='Recently updated'
          href={LINKS.dashboardPosts.url}
          linkLabel='all posts'
        >
          {recent.length === 0 ? (
            <Empty>Nothing yet. Start with a post or a project.</Empty>
          ) : (
            <ul className='divide-y'>
              {recent.map((item) => {
                const isPost = item.kind === 'post';
                const slugOrId = item.slug ?? item.id;
                return (
                  <li
                    key={`${item.kind}-${item.id}`}
                    className='flex items-center gap-4 px-5 py-3'
                  >
                    <span className='bg-muted relative h-9 w-14 shrink-0 overflow-hidden rounded-md'>
                      {item.coverUrl && (
                        <StoredImage
                          url={item.coverUrl}
                          alt=''
                          sizes='56px'
                          fill
                          className='object-cover'
                        />
                      )}
                    </span>
                    <span className='min-w-0 flex-1'>
                      <Link
                        href={
                          isPost
                            ? LINKS.dashboardPostEditWithId(item.id).url
                            : LINKS.dashboardProjectEditWithId(item.id).url
                        }
                        className='hover:text-primary-text block truncate text-sm font-semibold transition-colors'
                      >
                        {item.title}
                      </Link>
                      <span className='text-muted-foreground text-xs'>
                        {isPost ? 'Post' : 'Project'} · updated{' '}
                        {formatShortDate(item.updatedAt)}
                      </span>
                    </span>
                    <Badge
                      variant={item.publishedAt ? 'secondary' : 'outline'}
                      className='hidden sm:inline-flex'
                    >
                      {item.publishedAt ? 'Published' : 'Draft'}
                    </Badge>
                    <ContentActions
                      kind={item.kind}
                      id={item.id}
                      title={item.title}
                      isPublished={!!item.publishedAt}
                      editHref={
                        isPost
                          ? LINKS.dashboardPostEditWithId(item.id).url
                          : LINKS.dashboardProjectEditWithId(item.id).url
                      }
                      publicHref={
                        isPost
                          ? LINKS.postWithSlugOrId(slugOrId).url
                          : LINKS.projectWithSlugOrId(slugOrId).url
                      }
                    />
                  </li>
                );
              })}
            </ul>
          )}
        </Panel>

        <div className='flex flex-col gap-4'>
          <Panel title='Most read posts'>
            {topPosts.length === 0 ? (
              <Empty>No published posts yet.</Empty>
            ) : (
              <ol className='flex flex-col gap-3.5 px-5 py-4'>
                {topPosts.map((post) => (
                  <li key={post.id} className='flex flex-col gap-1.5'>
                    <span className='flex items-baseline justify-between gap-3 text-[13px]'>
                      <Link
                        href={LINKS.postWithSlugOrId(post.slug ?? post.id).url}
                        className='hover:text-primary-text truncate transition-colors'
                      >
                        {post.title}
                      </Link>
                      <span className='text-muted-foreground shrink-0 tabular-nums'>
                        {post.views}
                      </span>
                    </span>
                    <span
                      aria-hidden
                      className='bg-muted h-1.5 overflow-hidden rounded-full'
                    >
                      <span
                        className='bg-primary block h-full rounded-full'
                        style={{ width: `${(post.views / mostViews) * 100}%` }}
                      />
                    </span>
                  </li>
                ))}
              </ol>
            )}
          </Panel>

          <Panel
            title='New comments'
            href={LINKS.dashboardComments.url}
            linkLabel='all comments'
          >
            {latestComments.length === 0 ? (
              <Empty>No comments yet.</Empty>
            ) : (
              <ul className='divide-y'>
                {latestComments.map((comment) => (
                  <li key={comment.id} className='flex gap-3 px-5 py-3.5'>
                    <UserHover user={comment.author}>
                      <Avatar className='size-8 rounded-lg after:rounded-lg'>
                        <AvatarImage
                          src={comment.author.avatarUrl}
                          alt=''
                          className='rounded-lg'
                        />
                        <AvatarFallback className='rounded-lg text-[10px]'>
                          {comment.author.username.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </UserHover>
                    <div className='min-w-0'>
                      <p className='text-muted-foreground truncate text-xs'>
                        <span className='text-foreground'>
                          {comment.author.displayName ??
                            comment.author.username}
                        </span>{' '}
                        on{' '}
                        <Link
                          href={`${LINKS.postWithSlugOrId(comment.post.slug ?? comment.post.id).url}#comments`}
                          className='hover:text-primary-text'
                        >
                          {comment.post.title}
                        </Link>
                      </p>
                      <p className='text-body mt-0.5 line-clamp-2 text-[13px]'>
                        {toExcerpt(comment.content, 140)}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </Panel>
        </div>
      </div>
    </div>
  );
}

const plural = (count: number, word: string) =>
  `${count} ${word}${count === 1 ? '' : 's'}`;

function Panel({
  title,
  href,
  linkLabel,
  children,
}: {
  title: string;
  href?: string;
  linkLabel?: string;
  children: React.ReactNode;
}) {
  return (
    <section className='bg-card min-w-0 overflow-hidden rounded-xl border'>
      <div className='flex items-center justify-between gap-3 border-b px-5 py-3.5'>
        <h2 className='text-[15px] font-bold'>{title}</h2>
        {href && (
          <Link
            href={href}
            className='nav-underline text-muted-foreground hover:text-foreground text-xs transition-colors'
          >
            {linkLabel}
          </Link>
        )}
      </div>
      {children}
    </section>
  );
}

function Empty({ children }: { children: React.ReactNode }) {
  return (
    <p className='text-muted-foreground px-5 py-6 text-[13px]'>{children}</p>
  );
}
