import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { UserRoundCogIcon } from 'lucide-react';

import { Role } from '@/generated/prisma/enums';

import { requireWriter } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { formatShortDate, proxiedAvatarUrl, toExcerpt } from '@/lib/utils';

import { LINKS } from '@/constants/links';
import { ROLE_LABELS } from '@/constants/roles';

import { CommentActions } from '@/components/dashboard/comments/columns';
import { ContentRow } from '@/components/dashboard/shared/content-row';
import { Panel, PanelEmpty } from '@/components/dashboard/shared/panel';
import { StatTile } from '@/components/dashboard/shared/stat-tile';
import { UserAdminActions } from '@/components/dashboard/users/admin-actions';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

// Every dashboard page checks the session before it renders anything, so moving between them waits for the server.
// The layout's `instant = false` only covers arriving from outside the dashboard.
export const instant = false;

// How many comments the page lists; the comments page has the rest
const COMMENT_LIMIT = 10;

const findUser = (id: string) =>
  prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      displayName: true,
      username: true,
      avatarUrl: true,
      role: true,
      createdAt: true,
    },
  });

export async function generateMetadata({
  params,
}: {
  params: Promise<{ userId: string }>;
}): Promise<Metadata> {
  await requireWriter();
  const user = await findUser((await params).userId);
  return {
    title: user ? (user.displayName ?? user.username) : 'User not found',
    robots: { index: false, follow: false },
  };
}

// Someone's posts, projects and comments in one place. Writers open it from an author or a comment; admins also get
// to change the role or delete the user here.
export default async function UserPage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const session = await requireWriter();
  const { userId } = await params;

  const user = await findUser(userId);
  if (!user) notFound();

  const byAuthor = { authors: { some: { userId } } };
  const contentSelect = {
    id: true,
    title: true,
    slug: true,
    coverUrl: true,
    publishedAt: true,
    updatedAt: true,
  } as const;

  const [posts, projects, comments, commentCount] = await Promise.all([
    prisma.post.findMany({
      where: byAuthor,
      orderBy: { updatedAt: 'desc' },
      select: contentSelect,
    }),
    prisma.project.findMany({
      where: byAuthor,
      orderBy: { updatedAt: 'desc' },
      select: contentSelect,
    }),
    prisma.comment.findMany({
      where: { authorId: userId },
      orderBy: { createdAt: 'desc' },
      take: COMMENT_LIMIT,
      include: { post: { select: { id: true, title: true, slug: true } } },
    }),
    prisma.comment.count({ where: { authorId: userId } }),
  ]);

  const name = user.displayName ?? user.username;
  const isSelf = user.id === session.user.id;
  const isAdmin = session.user.role === Role.ADMIN;
  const drafts = (items: { publishedAt: Date | null }[]) =>
    items.filter(({ publishedAt }) => !publishedAt).length;

  return (
    <div className='flex flex-col gap-6'>
      <header className='flex flex-wrap items-center justify-between gap-4'>
        <div className='flex min-w-0 items-center gap-4'>
          <Avatar className='size-16 rounded-2xl after:rounded-2xl'>
            <AvatarImage
              src={proxiedAvatarUrl(user.avatarUrl)}
              alt=''
              className='rounded-2xl'
            />
            <AvatarFallback className='rounded-2xl'>
              {user.username.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className='min-w-0'>
            <h1 className='truncate text-[28px] leading-tight font-bold tracking-[-0.05em]'>
              {name}
            </h1>
            <p className='text-muted-foreground mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-[13px]'>
              <span>@{user.username}</span>
              <Badge
                variant={user.role === Role.USER ? 'outline' : 'secondary'}
              >
                {ROLE_LABELS[user.role]}
              </Badge>
            </p>
          </div>
        </div>
        <div className='flex flex-wrap gap-2'>
          {isSelf ? (
            <Button asChild variant='outline'>
              <Link href={LINKS.account.url}>
                <UserRoundCogIcon />
                Account
              </Link>
            </Button>
          ) : (
            isAdmin && <UserAdminActions user={user} />
          )}
        </div>
      </header>

      <dl className='grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4'>
        <StatTile
          label='Posts'
          value={posts.length}
          note={plural(drafts(posts), 'draft')}
        />
        <StatTile
          label='Projects'
          value={projects.length}
          note={plural(drafts(projects), 'draft')}
        />
        <StatTile
          label='Comments'
          value={commentCount}
          note={
            comments[0]
              ? `latest ${formatShortDate(comments[0].createdAt)}`
              : 'none yet'
          }
        />
        {/* The year goes below, so the date fits a phone's half-width tile */}
        <StatTile
          label='Joined'
          value={formatDayMonth(user.createdAt)}
          note={String(user.createdAt.getUTCFullYear())}
        />
      </dl>

      <div className='grid grid-cols-1 gap-4 xl:grid-cols-2'>
        <Panel title='Posts'>
          {posts.length === 0 ? (
            <PanelEmpty>No posts by {name}.</PanelEmpty>
          ) : (
            <ul className='divide-y'>
              {posts.map((post) => (
                <ContentRow key={post.id} item={{ ...post, kind: 'post' }} />
              ))}
            </ul>
          )}
        </Panel>

        <Panel title='Projects'>
          {projects.length === 0 ? (
            <PanelEmpty>No projects by {name}.</PanelEmpty>
          ) : (
            <ul className='divide-y'>
              {projects.map((project) => (
                <ContentRow
                  key={project.id}
                  item={{ ...project, kind: 'project' }}
                />
              ))}
            </ul>
          )}
        </Panel>
      </div>

      <Panel
        title='Comments'
        href={
          commentCount > COMMENT_LIMIT ? LINKS.dashboardComments.url : undefined
        }
        linkLabel='all comments'
      >
        {comments.length === 0 ? (
          <PanelEmpty>{name} hasn’t commented yet.</PanelEmpty>
        ) : (
          <ul className='divide-y'>
            {comments.map((comment) => {
              const postHref = `${LINKS.postWithSlugOrId(comment.post.slug ?? comment.post.id).url}#comments`;
              return (
                <li
                  key={comment.id}
                  className='flex items-start gap-4 px-5 py-3.5'
                >
                  <div className='min-w-0 flex-1'>
                    <p className='text-muted-foreground truncate text-xs'>
                      {formatShortDate(comment.createdAt)}
                      {comment.parentId && ' · reply'} · on{' '}
                      <Link
                        href={postHref}
                        className='text-foreground hover:text-primary-text'
                      >
                        {comment.post.title}
                      </Link>
                    </p>
                    <p className='text-body mt-0.5 line-clamp-2 text-[13px]'>
                      {toExcerpt(comment.content, 200)}
                    </p>
                  </div>
                  <CommentActions
                    comment={{
                      id: comment.id,
                      author: name,
                      postTitle: comment.post.title,
                      postSlug: comment.post.slug ?? '',
                      postHref,
                    }}
                  />
                </li>
              );
            })}
          </ul>
        )}
      </Panel>
    </div>
  );
}

const plural = (count: number, word: string) =>
  `${count} ${word}${count === 1 ? '' : 's'}`;

// "16 Oct", from the same UTC date the rest of the dashboard shows
const formatDayMonth = (date: Date) =>
  formatShortDate(date).split(' ').slice(0, 2).join(' ');
