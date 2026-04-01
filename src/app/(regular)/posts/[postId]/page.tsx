import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';

import {
  CalendarIcon,
  ChevronLeftIcon,
  PencilLineIcon,
  SendHorizontalIcon,
  UserIcon,
} from 'lucide-react';

import { Role } from '@/generated/prisma/enums';

import { LINKS } from '@/constants/links';
import { getCurrentSession } from '@/lib/auth';
import prisma from '@/lib/prisma';

import { UserHover } from '@/components/common/user-hover';
import { CommentForm } from '@/components/dashboard/posts/comment-form';
import { CommentWrapper } from '@/components/dashboard/posts/comment-wrapper';
import { MarkdownViewer } from '@/components/dashboard/posts/markdown';
import { ShareButton } from '@/components/dashboard/posts/share';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ postId: string }>;
}): Promise<Metadata> {
  const { postId } = await params;

  const post = await prisma.post.findFirst({
    where: {
      OR: [{ id: postId }, { slug: postId }],
    },
  });

  if (!post) return { title: 'Post Not Found' };

  return {
    title: `niso.moe | ${post.title}`,
    description: post.content.substring(0, 160).concat('...'),
  };
}

export default async function PostsPage({
  params,
}: {
  params: Promise<{ postId: string }>;
}) {
  const { postId } = await params;

  const { post, hasError } = await prisma.post
    .findFirst({
      where: {
        OR: [{ id: postId }, { slug: postId }],
      },
      include: {
        author: true,
        comments: {
          include: { author: true, replies: { include: { author: true } } },
          orderBy: { createdAt: 'desc' },
        },
      },
    })
    .then((post) => ({ post, hasError: false }))
    .catch(() => ({ post: null, hasError: true }));

  if (!post || hasError) {
    redirect('/404');
  }

  const session = await getCurrentSession();
  if (!post.published) {
    if (
      !session ||
      (session.user.role !== Role.ADMIN && session.user.role !== Role.AUTHOR)
    ) {
      notFound();
    }
  }

  return (
    <article className='mx-auto w-full max-w-3xl py-8'>
      {/* Back Button */}
      <Button variant='ghost' size='lg' asChild className='mb-4'>
        <Link href={LINKS.posts.url}>
          <ChevronLeftIcon />
          Back to Overview
        </Link>
      </Button>

      {/* Header Section */}
      <header className='mb-10 flex flex-col gap-4 border-b pb-8'>
        <h1 className='line-clamp-6 text-4xl font-extrabold tracking-tight text-ellipsis lg:text-5xl'>
          {post.title}
        </h1>

        <div className='text-muted-foreground flex flex-wrap items-center gap-4'>
          <UserHover user={post.author}>
            <div className='flex items-center gap-2'>
              <UserIcon className='size-4' />
              <span className='text-foreground font-medium'>
                {post.author.displayName || `@${post.author.username}`}
              </span>
            </div>
          </UserHover>
          <div className='flex items-center gap-2'>
            <CalendarIcon className='size-4' />
            <time dateTime={post.createdAt.toISOString()}>
              {new Date(post.createdAt).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}
            </time>
          </div>

          <div className='ml-auto flex items-center gap-2'>
            <ShareButton postId={post.id} />
            {(session?.user.role === Role.ADMIN ||
              session?.user.role === Role.AUTHOR) && (
              <Button variant='outline' size='xs' asChild>
                <Link href={LINKS.dashboardPostEditWithId(post.id).url}>
                  <PencilLineIcon />
                  Edit Post
                </Link>
              </Button>
            )}
            {!post.published && (
              <Badge variant='destructive' size='lg'>
                Unpublished
              </Badge>
            )}
          </div>
        </div>
      </header>

      {/* Post Content */}
      <div className='prose dark:prose-invert catppuccin-macchiato:prose-invert prose-lg min-h-100 max-w-none wrap-break-word'>
        <MarkdownViewer content={post.content} />
      </div>

      {/* Comments Section */}
      <div className='mt-8 flex flex-col gap-4 border-t pt-10'>
        {/* Write a Comment */}
        {session?.user ? (
          <div className='flex flex-col gap-2'>
            <h2 className='text-2xl font-bold'>Write a comment</h2>
            <div className='flex items-center gap-2'>
              <Avatar className='h-6 w-6'>
                <AvatarImage
                  src={session.user.avatarUrl}
                  alt={session.user.username}
                />
                <AvatarFallback>
                  {session.user.username.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className='flex items-center gap-4'>
                <span className='text-sm'>
                  Signed in as{' '}
                  {session.user.displayName || `@${session.user.username}`}
                </span>
                <form action='/api/auth/logout' method='POST'>
                  <Button type='submit' variant='destructive' size='xs'>
                    Sign Out
                  </Button>
                </form>
              </div>
            </div>
            <CommentForm postId={post.id} slug={post.slug || ''} />
          </div>
        ) : (
          <div>
            <h2 className='text-2xl font-bold'>Write a comment</h2>
            <div className='flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-center'>
              <p className='text-muted-foreground'>
                You must be logged in to post a comment.
              </p>
              <Button asChild>
                <Link href='/api/auth/login'>
                  <SendHorizontalIcon className='mr-2 size-4' />
                  Log In
                </Link>
              </Button>
            </div>
          </div>
        )}

        {/* Comments List */}
        <CommentWrapper post={post} session={session} />
      </div>
    </article>
  );
}
