import { Suspense } from 'react';
import Link from 'next/link';

import { PlusIcon } from 'lucide-react';

import { requireWriter } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { cn, toExcerpt } from '@/lib/utils';

import { LINKS } from '@/constants/links';
import { SITE_METADATA } from '@/constants/metadata';

import { UserHover } from '@/components/common/user-hover';
import { ContentRow } from '@/components/dashboard/shared/content-row';
import { DashboardPageHeader } from '@/components/dashboard/shared/page-header';
import { Panel, PanelEmpty } from '@/components/dashboard/shared/panel';
import {
  StatTile,
  StorageTile,
  TILE_HEIGHT,
} from '@/components/dashboard/shared/stat-tile';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
        thumbnailUrl: true,
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
    // Posts show their thumbnail where there is one, as in the post lists
    ...recentPosts.map(({ thumbnailUrl, ...post }) => ({
      ...post,
      coverUrl: thumbnailUrl ?? post.coverUrl,
      kind: 'post' as const,
    })),
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
          <Suspense
            fallback={<Skeleton className={cn('rounded-xl', TILE_HEIGHT)} />}
          >
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
            <PanelEmpty>
              Nothing yet. Start with a post or a project.
            </PanelEmpty>
          ) : (
            <ul className='divide-y'>
              {recent.map((item) => (
                <ContentRow key={`${item.kind}-${item.id}`} item={item} />
              ))}
            </ul>
          )}
        </Panel>

        <div className='flex flex-col gap-4'>
          <Panel title='Most read posts'>
            {topPosts.length === 0 ? (
              <PanelEmpty>No published posts yet.</PanelEmpty>
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
              <PanelEmpty>No comments yet.</PanelEmpty>
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
                        <Link
                          href={
                            LINKS.dashboardUserWithId(comment.author.id).url
                          }
                          className='text-foreground hover:text-primary-text'
                        >
                          {comment.author.displayName ??
                            comment.author.username}
                        </Link>{' '}
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
