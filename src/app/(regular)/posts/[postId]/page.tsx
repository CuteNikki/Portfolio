import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';

import { LogInIcon, PencilLineIcon } from 'lucide-react';

import { LINKS } from '@/constants/links';
import { NO_INDEX, SITE_OPEN_GRAPH } from '@/constants/metadata';
import { getCurrentSession } from '@/lib/auth';
import {
  getDraftPost,
  getPublishedPost,
  getPublishedPosts,
  authorsOf,
} from '@/lib/data';
import { headingsOf } from '@/lib/toc';
import { formatShortDate, readingMinutes, toDescription } from '@/lib/utils';

import { ScrollReveal } from '@/components/common/scroll-reveal';
import { TableOfContents } from '@/components/common/table-of-contents';
import { StoredImage } from '@/components/common/stored-image';
import { AuthorName } from '@/components/common/author-name';
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

  const path = `/posts/${post.slug ?? post.id}`;

  return {
    title: post.title,
    description: toDescription(post.content),
    alternates: { canonical: path },
    openGraph: {
      ...SITE_OPEN_GRAPH,
      type: 'article',
      title: post.title,
      url: path,
      publishedTime: post.createdAt.toISOString(),
      modifiedTime: post.updatedAt.toISOString(),
      authors: authorsOf(post).map(({ name }) => name),
    },
  };
}

export default function PostPage({
  params,
}: {
  params: Promise<{ postId: string }>;
}) {
  return (
    <Suspense fallback={<PostSkeleton />}>
      <PostContent params={params} />
    </Suspense>
  );
}

// notFound() here runs after the page has started streaming, so an unknown post keeps a 200 status with noindex.
// Calling it before the stream would give a 404, but Next then sends an empty error page that renders only in the
// browser: no content without JavaScript, and the theme flashes.
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

  const authors = authorsOf(post);
  // The post's own date from its form, not when it went up on this site
  const date = post.createdAt;
  const headings = headingsOf(post.content);
  const path = LINKS.postWithSlugOrId(post.slug ?? post.id).url;

  return (
    <article className='flex w-full flex-col gap-10'>
      {/* Drafts aren't read by anyone but their writers, so they don't count views */}
      {post.publishedAt && <ViewTracker postId={post.id} />}

      <header className='relative isolate mx-auto flex w-full max-w-3xl flex-col gap-6 pt-2 sm:pt-6'>
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
                href={LINKS.posts.url}
                className='nav-underline hover:text-foreground lowercase transition-colors'
              >
                posts
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li
              aria-current='page'
              className='text-foreground truncate lowercase'
            >
              {post.slug ?? post.title}
            </li>
          </ol>
        </nav>

        <h1 className='animate-hero-in text-[36px] leading-[1.1] font-bold tracking-[-0.05em] text-balance delay-1 sm:text-5xl'>
          {post.title}
        </h1>

        <div className='animate-hero-in flex flex-col gap-5 delay-2 sm:flex-row sm:items-center sm:justify-between'>
          <div className='text-muted-foreground flex flex-wrap items-center gap-x-5 gap-y-2 text-[13px]'>
            {authors.length > 0 && (
              <span className='flex flex-wrap items-center gap-x-3 gap-y-1.5'>
                {authors.map((author) => (
                  <span key={author.key} className='text-foreground'>
                    <AuthorName author={author} />
                  </span>
                ))}
              </span>
            )}
            <time dateTime={date.toISOString()}>{formatShortDate(date)}</time>
            <span>{readingMinutes(post.content)} min read</span>
            {post.publishedAt && (
              <span>
                {post.views} {post.views === 1 ? 'view' : 'views'}
              </span>
            )}
            {!post.publishedAt && (
              <Badge variant='destructive' size='lg'>
                Unpublished
              </Badge>
            )}
          </div>
          <div className='flex flex-wrap items-center gap-2.5'>
            <ShareButton path={path} label='Post' size='default' />
            <WriterOnly>
              <Button asChild variant='outline'>
                <Link href={LINKS.dashboardPostEditWithId(post.id).url}>
                  <PencilLineIcon />
                  Edit
                </Link>
              </Button>
            </WriterOnly>
          </div>
        </div>
      </header>

      {post.coverUrl && (
        <div
          data-reveal=''
          style={{ '--reveal-index': 3 } as React.CSSProperties}
          className='bg-muted relative mx-auto aspect-2/1 w-full max-w-4xl overflow-hidden rounded-xl border'
        >
          <StoredImage
            url={post.coverUrl}
            alt={`${post.title}'s cover picture`}
            fill
            priority
            sizes='(min-width: 928px) 896px, calc(100vw - 32px)'
            className='object-cover object-top'
          />
        </div>
      )}

      <div
        data-reveal=''
        style={{ '--reveal-index': 4 } as React.CSSProperties}
        className='mx-auto grid w-full max-w-3xl gap-10 xl:max-w-none xl:grid-cols-[1fr_minmax(0,48rem)_1fr]'
      >
        <div className='min-w-0 xl:col-start-2'>
          <MarkdownViewer content={post.content} />
        </div>
        {headings.length > 1 && (
          // Beside the text on wide screens only; narrower ones just read on. The column beside the centered text is
          // narrow, so the list is a little wider than it and reaches into the page's margin.
          <div className='hidden xl:col-start-3 xl:block'>
            <TableOfContents items={headings} className='sticky top-28 w-52' />
          </div>
        )}
      </div>

      <ScrollReveal className='mx-auto w-full max-w-4xl'>
        <section
          aria-labelledby='comments-heading'
          className='bg-card mt-2 flex flex-col gap-6 rounded-xl border p-5 sm:mt-4 sm:p-8 lg:mt-6'
        >
          <h2
            id='comments-heading'
            className='text-2xl font-bold tracking-[-0.04em]'
          >
            Comments{' '}
            <span className='text-muted-foreground font-normal'>
              {post.comments.length}
            </span>
          </h2>
          <Suspense fallback={<CommentsSkeleton />}>
            <Comments post={post} path={path} />
          </Suspense>
        </section>
      </ScrollReveal>
    </article>
  );
}

// Depends on who is signed in, so it streams in after the prerendered post
async function Comments({ post, path }: { post: Post; path: string }) {
  const session = await getCurrentSession();
  const viewer = session
    ? { id: session.user.id, role: session.user.role }
    : null;

  return (
    <>
      {session?.user ? (
        <div className='flex flex-col gap-3'>
          <p className='text-muted-foreground flex items-center gap-2 text-[13px]'>
            <Avatar className='size-6 rounded-md after:rounded-md'>
              <AvatarImage
                src={session.user.avatarUrl}
                alt=''
                className='rounded-md'
              />
              <AvatarFallback className='rounded-md text-[10px]'>
                {session.user.username.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            Commenting as{' '}
            <span className='text-foreground'>
              {session.user.displayName || `@${session.user.username}`}
            </span>
          </p>
          <CommentForm postId={post.id} slug={post.slug || ''} />
        </div>
      ) : (
        <div className='bg-background flex flex-col items-start justify-between gap-4 rounded-xl border p-5 sm:flex-row sm:items-center'>
          <p className='text-body text-sm'>
            Sign in with Discord to join the conversation.
          </p>
          <Button asChild>
            {/* A plain link: a prefetch of the login route would start a new login and replace one in progress */}
            <a href={`/api/auth/login?next=${encodeURIComponent(path)}`}>
              <LogInIcon />
              Sign in
            </a>
          </Button>
        </div>
      )}

      <CommentWrapper
        post={{ slug: post.slug, comments: post.comments }}
        viewer={viewer}
      />
    </>
  );
}

function PostSkeleton() {
  return (
    <div className='mx-auto flex w-full max-w-3xl flex-col gap-6 pt-6'>
      <Skeleton className='h-4 w-40' />
      <Skeleton className='h-12 w-3/4' />
      <Skeleton className='h-6 w-1/2' />
      <Skeleton className='h-64 w-full rounded-xl' />
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
