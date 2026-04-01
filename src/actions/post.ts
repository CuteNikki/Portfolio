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

export async function commentOnPost(formData: FormData) {
  const session = await getCurrentSession();

  if (!session) {
    throw new Error('Unauthorized: You must be logged in to comment.');
  }

  const postId = formData.get('postId') as string;
  const rawContent = formData.get('content') as string;
  const postSlug = formData.get('postSlug') as string | null;

  const content = rawContent.trim().replace(/(?:\r?\n){3,}/g, '\n\n');

  if (!postId || !content) {
    throw new Error('Post ID and comment content are required.');
  }

  if (content.length > 1000) {
    throw new Error('Comment content cannot exceed 1000 characters.');
  }

  await prisma.comment.create({
    data: {
      content,
      postId,
      authorId: session.user.id,
    },
  });

  revalidatePostPaths(postId, postSlug);
}

export async function deleteComment(formData: FormData) {
  const session = await getCurrentSession();

  if (!session) {
    throw new Error('Unauthorized: You must be logged in to delete a comment.');
  }

  const commentId = formData.get('commentId') as string;
  const postSlug = formData.get('postSlug') as string | null;

  if (!commentId) {
    throw new Error('Comment ID is required.');
  }

  const comment = await prisma.comment.findUnique({
    where: { id: commentId },
  });

  if (!comment) {
    throw new Error('Comment not found.');
  }

  // Only allow deletion if the user is the comment author or an admin
  if (
    comment.authorId !== session.user.id &&
    session.user.role !== Role.ADMIN
  ) {
    throw new Error(
      'Unauthorized: You do not have permission to delete this comment.',
    );
  }

  await prisma.comment.delete({
    where: { id: commentId },
  });

  revalidatePostPaths(comment.postId, postSlug);
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
