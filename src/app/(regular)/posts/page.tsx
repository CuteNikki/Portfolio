import {
  CalendarIcon,
  ClockIcon,
  NewspaperIcon,
  SendHorizontalIcon,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import { Role } from '@/generated/prisma/enums';

import { getCurrentSession } from '@/lib/auth';
import prisma from '@/lib/prisma';

import { LINKS } from '@/constants/links';
import { SITE_METADATA } from '@/constants/metadata';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export const { posts: metadata } = SITE_METADATA;

export default async function PostsPage() {
  const session = await getCurrentSession();
  const isAdmin =
    session?.user.role === Role.ADMIN || session?.user.role === Role.AUTHOR;

  const posts = await prisma.post.findMany({
    where: isAdmin ? {} : { published: true },
    orderBy: { createdAt: 'desc' },
    include: { author: true },
  });

  return (
    <div className='flex w-full max-w-5xl flex-col gap-6 border p-4 sm:p-8'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <h1 className='text-primary-text flex items-center gap-2 text-2xl font-bold'>
          <NewspaperIcon className='size-6 shrink-0' /> Posts
        </h1>
        {isAdmin && (
          <Button variant='outline' size='sm' asChild>
            <Link href={LINKS.dashboardPostNew.url}>
              {LINKS.dashboardPostNew.label}
            </Link>
          </Button>
        )}
      </div>

      {/* Auth Section */}
      <div className='flex w-fit flex-col border p-4'>
        {session ? (
          <div className='flex items-center gap-4'>
            {session.user.avatarUrl && (
              <Image
                src={session.user.avatarUrl}
                alt={session.user.username}
                width={56}
                height={56}
              />
            )}
            <div className='flex flex-col'>
              <p className='font-semibold'>
                {session.user.displayName || `@${session.user.username}`}
              </p>
              <form action='/api/auth/logout' method='POST'>
                <Button type='submit' variant='destructive' size='sm'>
                  Sign Out
                </Button>
              </form>
            </div>
          </div>
        ) : (
          <div className='flex flex-col items-start gap-2'>
            <p className='text-muted-foreground text-sm'>
              Join the conversation and leave a comment!
            </p>
            <Button asChild size='sm'>
              <Link href='/api/auth/login'>
                <SendHorizontalIcon className='mr-2 size-4' />
                Log in with Discord
              </Link>
            </Button>
          </div>
        )}
      </div>

      {/* Posts Grid */}
      <div className='grid w-full grid-cols-1 gap-4 sm:grid-cols-2'>
        {posts.map((post) => (
          <Link
            href={LINKS.postWithSlugOrId(post.slug ?? post.id).url}
            key={post.id}
            className='group hover:border-primary/50 hover:bg-muted/20 flex flex-col justify-between border p-5 transition-colors'
          >
            <div className='flex flex-col gap-2'>
              {!post.published && <Badge>Draft</Badge>}
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
    </div>
  );
}
