import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { ExternalLinkIcon } from 'lucide-react';

import { requireWriter } from '@/lib/auth';
import { getAuthorOptions } from '@/lib/authors';
import prisma from '@/lib/prisma';

import { LINKS } from '@/constants/links';

import { EditPostForm } from '@/components/dashboard/posts/edit';
import { DashboardPageHeader } from '@/components/dashboard/shared/page-header';
import { Button } from '@/components/ui/button';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ postId: string }>;
}): Promise<Metadata> {
  await requireWriter();

  const { postId } = await params;

  const post = await prisma.post
    .findFirst({
      where: {
        OR: [{ id: postId }, { slug: postId }],
      },
    })
    .then((post) => post)
    .catch(() => null);

  if (!post) return { title: 'Post Not Found' };

  return {
    title: `Edit: ${post.title}`,
    description: `Edit the post titled "${post.title}".`,
  };
}

// Every dashboard page checks the session before it renders anything, so moving between them waits for the server.
// The layout's `instant = false` only covers arriving from outside the dashboard.
export const instant = false;

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ postId: string }>;
}) {
  await requireWriter();

  const { postId } = await params;

  const post = await prisma.post
    .findFirst({
      where: {
        OR: [{ id: postId }, { slug: postId }],
      },
      include: { authors: { orderBy: { position: 'asc' } } },
    })
    .then((post) => post)
    .catch(() => null);

  if (!post) {
    notFound();
  }

  return (
    <>
      <DashboardPageHeader title='Edit post' description={post.title}>
        {post.publishedAt && (
          <Button asChild variant='outline'>
            <Link href={LINKS.postWithSlugOrId(post.slug ?? post.id).url}>
              <ExternalLinkIcon />
              View
            </Link>
          </Button>
        )}
      </DashboardPageHeader>
      <EditPostForm
        post={post}
        authorOptions={await getAuthorOptions()}
        authorIds={post.authors.map(({ userId }) => userId)}
      />
    </>
  );
}
