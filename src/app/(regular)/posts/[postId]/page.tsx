import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';

import {
  CalendarIcon,
  ChevronLeftIcon,
  PencilLineIcon,
  SendHorizontalIcon,
  UserIcon,
} from 'lucide-react';

import { LINKS } from '@/constants/links';
import { NO_INDEX, SITE_OPEN_GRAPH } from '@/constants/metadata';
import { PERSONAL_DETAILS } from '@/constants/personal';
import { getCurrentSession } from '@/lib/auth';
import { getDraftPost, getPublishedPost, getPublishedPosts } from '@/lib/data';
import { toExcerpt } from '@/lib/utils';

import { ScrollReveal } from '@/components/common/scroll-reveal';
import { UserHover } from '@/components/common/user-hover';
import { WriterOnly } from '@/components/common/writer-only';
import { CommentForm } from '@/components/dashboard/posts/comment-form';
import { CommentWrapper } from '@/components/dashboard/posts/comment-wrapper';
import { MarkdownViewer } from '@/components/dashboard/posts/markdown';
import { ShareButton } from '@/components/dashboard/posts/share';
import { ViewTracker } from '@/components/dashboard/posts/view-tracker';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

type Post = NonNullable<Awaited<ReturnType<typeof getPublishedPost>>>;

export async function generateStaticParams() {
  const posts = await getPublishedPosts();

  // Cache Components needs at least one param to prerender the route. The
  // placeholder renders as not found.
  if (posts.length === 0) return [{ postId: 'none' }];

  return posts.map((post) => ({ postId: post.slug ?? post.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ postId: string }>;
}): Promise<Metadata> {
  const { postId } = await params;
  const post = await getPublishedPost(postId);

  // Drafts and missing posts look the same here, so a draft's title never leaks
  if (!post) return { title: 'Post', robots: NO_INDEX };

  return {
    title: post.title,
    description: toExcerpt(post.content),
    alternates: { canonical: `/posts/${post.slug ?? post.id}` },
    openGraph: {
      ...SITE_OPEN_GRAPH,
      type: 'article',
      publishedTime: post.createdAt.toISOString(),
      modifiedTime: post.updatedAt.toISOString(),
      authors: [PERSONAL_DETAILS.fullName],
    },
  };
}

export default function PostPage({
  params,
}: {
  params: Promise<{ postId: string }>;
}) {
  return (
    <article className='mx-auto w-full max-w-3xl py-8'>
      {/* Back Button */}
      <Button variant='ghost' size='lg' asChild className='mb-4'>
        <Link href={LINKS.posts.url}>
          <ChevronLeftIcon />
          Back to Overview
        </Link>
      </Button>

      <Suspense fallback={<PostSkeleton />}>
        <PostContent params={params} />
      </Suspense>
    </article>
  );
}

async function PostContent({
  params,
}: {
  params: Promise<{ postId: string }>;
}) {
  const { postId } = await params;

  // Published posts come from the cache and are prerendered. Only unknown ids
  // fall through to the draft lookup, which reads the session.
  const post = (await getPublishedPost(postId)) ?? (await getDraftPost(postId));

  if (!post) {
    notFound();
  }

  return (
    <>
      <ViewTracker postId={post.id} />

      <ScrollReveal className='scroll-reveal'>
        {/* Title (Triggers instantly) */}
        <h1
          data-reveal-item
          style={{ '--reveal-index': 0 } as React.CSSProperties}
          className='mb-4 line-clamp-6 text-4xl font-extrabold tracking-tight text-ellipsis lg:text-5xl'
        >
          {post.title}
        </h1>

        {/* Metadata & Actions (Cascades next) */}
        <div
          data-reveal-item
          style={{ '--reveal-index': 1 } as React.CSSProperties}
          className='text-muted-foreground mb-10 flex flex-wrap items-center gap-4 border-b pb-8'
        >
          <UserHover user={post.writer}>
            <div className='flex items-center gap-2'>
              <UserIcon className='size-4' />
              <span className='text-foreground font-medium'>
                {post.writer.displayName || `@${post.writer.username}`}
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
            <WriterOnly>
              <Button variant='outline' size='xs' asChild>
                <Link href={LINKS.dashboardPostEditWithId(post.id).url}>
                  <PencilLineIcon />
                  Edit Post
                </Link>
              </Button>
            </WriterOnly>
            {!post.publishedAt && (
              <Badge variant='destructive' size='lg'>
                Unpublished
              </Badge>
            )}
          </div>
        </div>

        {/* Post Content Body (Cascades last with a distinct step) */}
        <div
          data-reveal-item
          style={{ '--reveal-index': 2 } as React.CSSProperties}
        >
          <MarkdownViewer content={post.content} />
        </div>
      </ScrollReveal>

      {/* Comments Section (Isolated ScrollReveal so it triggers when scrolled into view) */}
      <ScrollReveal className='scroll-reveal'>
        <div
          data-reveal-item
          style={{ '--reveal-index': 0 } as React.CSSProperties}
          className='mt-8 flex flex-col gap-4 border-t pt-10'
        >
          <Suspense fallback={<CommentsSkeleton />}>
            <Comments post={post} />
          </Suspense>
        </div>
      </ScrollReveal>
    </>
  );
}

// Depends on who is signed in, so it streams in after the prerendered post
async function Comments({ post }: { post: Post }) {
  const session = await getCurrentSession();
  const viewer = session
    ? { id: session.user.id, role: session.user.role }
    : null;

  return (
    <>
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
      <CommentWrapper
        post={{ slug: post.slug, comments: post.comments }}
        viewer={viewer}
      />
    </>
  );
}

function PostSkeleton() {
  return (
    <div className='flex flex-col gap-4'>
      <Skeleton className='h-12 w-3/4' />
      <Skeleton className='mb-10 h-6 w-1/2' />
      <Skeleton className='h-64 w-full' />
    </div>
  );
}

function CommentsSkeleton() {
  return (
    <div className='flex flex-col gap-2'>
      <Skeleton className='h-8 w-48' />
      <Skeleton className='h-24 w-full' />
    </div>
  );
}
