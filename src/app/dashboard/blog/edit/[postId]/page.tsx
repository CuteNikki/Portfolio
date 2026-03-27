import { notFound } from 'next/navigation';

import { PencilLineIcon } from 'lucide-react';

import prisma from '@/lib/prisma';

import { EditPostForm } from '@/components/dashboard/blog/edit-form';
import { Metadata } from 'next';

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
    description: `Edit the blog post titled "${post.title}".`,
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
    <div>
      <div className='flex w-full max-w-5xl flex-col gap-4 justify-self-center border p-4 sm:p-8'>
        <div className='flex flex-col gap-2'>
          <h1 className='text-primary-text flex items-center gap-2 text-xl font-semibold'>
            <PencilLineIcon className='shrink-0' />
            Edit Post
          </h1>
          <p className='text-muted-foreground'>
            Make changes to a blog post or update its publication status.
          </p>
        </div>
        <EditPostForm post={post} />
      </div>
    </div>
  );
}
