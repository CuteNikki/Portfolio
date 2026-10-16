import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { PencilLineIcon } from 'lucide-react';

import { requireWriter } from '@/lib/auth';
import { getAuthorOptions } from '@/lib/authors';
import prisma from '@/lib/prisma';

import { EditPostForm } from '@/components/dashboard/posts/edit';
import { DashboardHeader } from '@/components/dashboard/shared/header';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

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
    <Card className='w-full max-w-5xl'>
      <CardHeader>
        <DashboardHeader
          icon={PencilLineIcon}
          title={'Edit Post'}
          description={
            'Make changes to a post or update its publication status.'
          }
        />
      </CardHeader>
      <CardContent>
        <EditPostForm
          post={post}
          authorOptions={await getAuthorOptions()}
          authorIds={post.authors.map(({ userId }) => userId)}
        />
      </CardContent>
    </Card>
  );
}
