import { CalendarIcon, ClockIcon } from 'lucide-react';
import Link from 'next/link';

import { Role } from '@/generated/prisma/enums';

import { LINKS } from '@/constants/links';
import { getCurrentSession } from '@/lib/auth';
import prisma from '@/lib/prisma';

import { ErrorToast } from '@/components/common/error-toast';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

export async function PostList() {
  const session = await getCurrentSession();
  const isAdmin =
    session?.user.role === Role.ADMIN || session?.user.role === Role.WRITER;

  const { posts, hasError } = await prisma.post
    .findMany({
      where: isAdmin ? {} : { publishedAt: { not: null } },
      orderBy: { createdAt: 'desc' },
      include: { writer: true },
    })
    .then((posts) => ({ posts, hasError: false }))
    .catch((error) => {
      console.error('Error fetching posts:', error);
      return { posts: [], hasError: true };
    });

  return (
    <div className='grid w-full grid-cols-1 gap-4 sm:grid-cols-2'>
      {hasError && (
        <ErrorToast
          title='Failed to load latest posts.'
          description='The database is currently unreachable. Please try again later.'
        />
      )}
      {posts.map((post) => (
        <Link
          href={LINKS.postWithSlugOrId(post.slug ?? post.id).url}
          key={post.id}
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

          <div className='text-muted-foreground mt-6 flex items-center gap-4 text-xs'>
            <div className='flex items-center gap-1'>
              <CalendarIcon className='size-3' />
              {new Date(post.createdAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </div>
            <div className='flex items-center gap-1'>
              <ClockIcon className='size-3' />
              {Math.max(
                1,
                Math.ceil(post.content.trim().split(/\s+/).length / 200),
              )}{' '}
              min read
            </div>
          </div>
        </Link>
      ))}
      {posts.length === 0 && (
        <div className='text-muted-foreground col-span-full py-20 text-center'>
          No posts found. Check back later!
        </div>
      )}
    </div>
  );
}

export function PostListSkeleton() {
  return (
    <div className='grid w-full grid-cols-1 gap-4 sm:grid-cols-2'>
      {[...Array(4)].map((_, i) => (
        <div
          key={i}
          className='group hover:border-primary/50 hover:bg-muted/20 flex flex-col justify-between border p-5 transition-colors'
        >
          <div className='flex flex-col gap-2'>
            <Skeleton className='h-7 w-full' />
            <Skeleton className='h-15 w-full' />
          </div>

          <div className='mt-6 flex items-center gap-4'>
            <Skeleton className='h-4 w-24' />
            <Skeleton className='h-4 w-24' />
          </div>
        </div>
      ))}
    </div>
  );
}
