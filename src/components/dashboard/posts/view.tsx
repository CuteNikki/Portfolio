import { CalendarIcon, ClockIcon, EyeIcon } from 'lucide-react';
import Link from 'next/link';

import { LINKS } from '@/constants/links';
import { getDraftPosts, getPublishedPosts } from '@/lib/data';

import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

export async function PostList() {
  const posts = await getPublishedPosts();

  if (posts.length === 0) {
    return (
      <div className='text-muted-foreground py-20 text-center'>
        No posts found. Check back later!
      </div>
    );
  }

  return <PostGrid posts={posts} />;
}

// Only rendered for writers, so it streams in separately from the cached list
export async function DraftPostList() {
  const posts = await getDraftPosts();

  if (posts.length === 0) return null;

  return <PostGrid posts={posts} />;
}

function PostGrid({
  posts,
}: {
  posts: Awaited<ReturnType<typeof getPublishedPosts>>;
}) {
  return (
    <div className='grid w-full grid-cols-1 gap-4 md:grid-cols-2'>
      {posts.map((post, index) => (
        <Link
          href={LINKS.postWithSlugOrId(post.slug ?? post.id).url}
          key={post.id}
          data-reveal-item
          style={{ '--reveal-index': index } as React.CSSProperties}
          className='group hover:border-primary/50 hover:bg-muted/20 flex flex-col justify-between border p-5 transition-colors'
        >
          <div className='flex flex-col gap-2'>
            {!post.publishedAt && <Badge>Draft</Badge>}
            <h2 className='group-hover:text-primary-text truncate text-xl font-bold transition-colors'>
              {post.title}
            </h2>
            {/* Clean up content by stripping common Markdown chars for the preview */}
            <p className='text-muted-foreground line-clamp-3 text-sm text-ellipsis'>
              {post.content.replace(/[#*`]/g, '')}
            </p>
          </div>

          <div className='text-muted-foreground mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm'>
            <div className='flex items-center gap-2'>
              <CalendarIcon className='size-4 shrink-0' />
              {new Date(post.createdAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
                timeZone: 'UTC',
              })}
            </div>
            <div className='flex items-center gap-2'>
              <ClockIcon className='size-4 shrink-0' />
              {Math.max(
                1,
                Math.ceil(post.content.trim().split(/\s+/).length / 200),
              )}{' '}
              min read
            </div>
            <div className='flex items-center gap-2'>
              <EyeIcon className='size-4 shrink-0' />
              {post.views || 0} views
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

export function PostListSkeleton() {
  return (
    <div className='grid w-full grid-cols-1 gap-4 md:grid-cols-2'>
      {[...Array(4)].map((_, i) => (
        <div
          key={i}
          className='group hover:border-primary/50 hover:bg-muted/20 flex flex-col justify-between border p-5 transition-colors'
        >
          <div className='flex flex-col gap-2'>
            <Skeleton className='h-7 w-full' />
            <Skeleton className='h-15 w-full' />
          </div>

          <div className='mt-2 flex flex-wrap items-center gap-x-4 gap-y-2'>
            <Skeleton className='h-5 w-24' />
            <Skeleton className='h-5 w-24' />
            <Skeleton className='h-5 w-24' />
          </div>
        </div>
      ))}
    </div>
  );
}
