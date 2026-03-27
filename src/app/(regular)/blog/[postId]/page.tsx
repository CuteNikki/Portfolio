import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import {
  CalendarIcon,
  ChevronLeftIcon,
  PencilLineIcon,
  UserIcon,
} from 'lucide-react';

import { Role } from '../../../../../generated/prisma/enums';

import { LINKS } from '@/constants/links';
import { getCurrentSession } from '@/lib/auth';
import prisma from '@/lib/prisma';

import { MarkdownViewer } from '@/components/dashboard/blog/markdown';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';

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

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ postId: string }>;
}) {
  const { postId } = await params;

  const post = await prisma.post.findFirst({
    where: {
      OR: [{ id: postId }, { slug: postId }],
    },
    include: { author: true },
  });

  if (!post) {
    notFound();
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
      <Button variant='ghost' size='lg' asChild className='mb-8'>
        <Link href='/blog'>
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
          <HoverCard>
            <HoverCardTrigger>
              <div className='flex items-center gap-2'>
                <UserIcon className='size-4' />
                <span className='text-foreground font-medium'>
                  {post.author.displayName || `@${post.author.username}`}
                </span>
              </div>
            </HoverCardTrigger>
            <HoverCardContent className='flex items-center gap-2'>
              <Avatar>
                <AvatarImage
                  src={post.author.avatarUrl}
                  alt={post.author.username}
                />
                <AvatarFallback>
                  {post.author.username.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className='flex flex-col'>
                <p className='font-medium'>
                  {post.author.displayName
                    ? `${post.author.displayName} (@${post.author.username})`
                    : `@${post.author.username}`}
                </p>
                <div className='flex items-center gap-2'>
                  <p className='capitalize'>{post.author.role.toLowerCase()}</p>
                  -
                  <p>
                    Joined{' '}
                    {new Date(post.author.createdAt).toLocaleDateString(
                      'en-US',
                      {
                        month: 'long',
                        year: 'numeric',
                      },
                    )}
                  </p>
                </div>
              </div>
            </HoverCardContent>
          </HoverCard>
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

      <div className='prose dark:prose-invert catppuccin-macchiato:prose-invert prose-lg min-h-100 max-w-none wrap-break-word'>
        <MarkdownViewer content={post.content} />
      </div>
    </article>
  );
}
