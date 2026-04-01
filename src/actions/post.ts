'use server';

import { revalidatePath } from 'next/cache';

import { Role } from '@/generated/prisma/enums';

import { getCurrentSession } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function createPost(formData: FormData) {
  const session = await getCurrentSession();

  if (
    !session ||
    (session.user.role !== Role.ADMIN && session.user.role !== Role.AUTHOR)
  ) {
    throw new Error(
      'Unauthorized: You do not have permission to publish posts.',
    );
  }

  const title = formData.get('title') as string;
  const content = formData.get('content') as string;
  const slug = (formData.get('slug') || null) as string | null;

  const isPublished = formData.get('isPublished') === 'true';

  if (!title || !content) {
    throw new Error('Title and content are required.');
  }

  if (slug) {
    const existingPost = await prisma.post.findUnique({
      where: { slug },
    });

    if (existingPost) {
      throw new Error(
        'A post with this URL slug already exists. Please choose a different one.',
      );
    }
  }

  const createdPost = await prisma.post.create({
    data: {
      title,
      content,
      slug,
      published: isPublished,
      authorId: session.user.id,
    },
  });

  revalidatePostPaths(createdPost.id, createdPost.slug);
  return createdPost;
}

export async function deletePost(formData: FormData) {
  const session = await getCurrentSession();

  if (
    !session ||
    (session.user.role !== Role.ADMIN && session.user.role !== Role.AUTHOR)
  ) {
    throw new Error('Unauthorized');
  }

  const postId = formData.get('postId') as string;

  const deletedPost = await prisma.post.delete({
    where: { id: postId },
  });

  revalidatePostPaths(deletedPost.id, deletedPost.slug);
}

export async function updatePost(formData: FormData) {
  const session = await getCurrentSession();

  if (
    !session ||
    (session.user.role !== Role.ADMIN && session.user.role !== Role.AUTHOR)
  ) {
    throw new Error('Unauthorized');
  }

  const id = formData.get('postId') as string;
  const title = formData.get('title') as string;
  const slug = formData.get('slug') as string;
  const content = formData.get('content') as string;
  const isPublished = formData.get('isPublished') === 'true';

  if (!id || !title || !content) {
    throw new Error('All fields are required.');
  }

  if (slug) {
    const existingPost = await prisma.post.findFirst({
      where: {
        slug,
        NOT: { id },
      },
    });

    if (existingPost) {
      throw new Error('Another post is already using this URL slug.');
    }
  }

  await prisma.post.update({
    where: { id },
    data: {
      title,
      slug,
      content,
      published: isPublished,
    },
  });

  revalidatePostPaths(id, slug);
}

function revalidatePostPaths(postId: string, slug: string | null) {
  revalidatePath('/dashboard/posts');
  revalidatePath('/dashboard/posts/new');
  revalidatePath(`/dashboard/posts/edit/${postId}`);
  revalidatePath('/posts');
  revalidatePath(`/posts/${postId}`);
  if (slug) {
    revalidatePath(`/dashboard/posts/edit/${slug}`);
    revalidatePath(`/posts/${slug}`);
  }
}
