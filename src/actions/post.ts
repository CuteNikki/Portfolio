'use server';

import { revalidatePath } from 'next/cache';

import { Role } from '../../generated/prisma/enums';

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
  const slug = formData.get('slug') as string;

  const isPublished = formData.get('isPublished') === 'true';

  if (!title || !content || !slug) {
    throw new Error('Title, content, and slug are required.');
  }

  const existingPost = await prisma.post.findUnique({
    where: { slug },
  });

  if (existingPost) {
    throw new Error(
      'A post with this URL slug already exists. Please choose a different one.',
    );
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

  revalidateBlogPaths(createdPost.id, createdPost.slug);
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

  revalidateBlogPaths(deletedPost.id, deletedPost.slug);
}

// Add this to app/actions/post.ts

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

  if (!id || !title || !slug || !content) {
    throw new Error('All fields are required.');
  }

  const existingPost = await prisma.post.findFirst({
    where: {
      slug,
      NOT: { id },
    },
  });

  if (existingPost) {
    throw new Error('Another post is already using this URL slug.');
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

  revalidateBlogPaths(id, slug);
}

function revalidateBlogPaths(postId: string, slug: string) {
  revalidatePath('/dashboard/blog');
  revalidatePath('/dashboard/blog/new');
  revalidatePath(`/dashboard/blog/edit/${postId}`);
  revalidatePath(`/dashboard/blog/edit/${slug}`);
  revalidatePath('/blog');
  revalidatePath(`/blog/${postId}`);
  revalidatePath(`/blog/${slug}`);
}
