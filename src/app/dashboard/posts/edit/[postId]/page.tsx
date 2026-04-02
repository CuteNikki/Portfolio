import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { PencilLineIcon } from 'lucide-react';

import prisma from '@/lib/prisma';

import { EditPostForm } from '@/components/dashboard/posts/edit';
import { DashboardHeader } from '@/components/dashboard/shared/header';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

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
    description: `Edit the post titled "${post.title}".`,
  };
}

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ postId: string }>;
}) {
  const { postId } = await params;

  const post = await prisma.post.findFirst({
    where: {
      OR: [{ id: postId }, { slug: postId }],
    },
  });

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
        <EditPostForm post={post} />
      </CardContent>
    </Card>
  );
}
