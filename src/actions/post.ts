'use server';

import { revalidatePath, updateTag } from 'next/cache';
import { headers } from 'next/headers';

import { Role } from '@/generated/prisma/enums';

import { getCurrentSession } from '@/lib/auth';
import { authorRows, readAuthors } from '@/lib/authors';
import prisma from '@/lib/prisma';
import { hit, visitorHash } from '@/lib/rate-limit';
import { resolveSlug } from '@/lib/slug';

function isPostSlugTaken(exceptId?: string) {
  return async (slug: string) =>
    (await prisma.post.count({
      where: exceptId ? { slug, NOT: { id: exceptId } } : { slug },
    })) > 0;
}

export async function createPost(formData: FormData) {
  const session = await getCurrentSession();

  if (
    !session ||
    (session.user.role !== Role.ADMIN && session.user.role !== Role.WRITER)
  ) {
    throw new Error(
      'Unauthorized: You do not have permission to publish posts.',
    );
  }

  const title = formData.get('title') as string;
  const content = formData.get('content') as string;

  const isPublished = formData.get('isPublished') === 'true';

  if (!title || !content) {
    throw new Error('Title and content are required.');
  }

  const slug = await resolveSlug(
    formData.get('slug'),
    title,
    isPostSlugTaken(),
  );

  const createdPost = await prisma.post.create({
    data: {
      title,
      content,
      slug,
      publishedAt: isPublished ? new Date() : null,
      // The picked authors, or else whoever creates it
      authors: {
        create: authorRows((await readAuthors(formData)) ?? [session.user.id]),
      },
    },
  });

  revalidatePostPaths(createdPost.id, createdPost.slug);
  return createdPost;
}

export async function deletePost(formData: FormData) {
  const session = await getCurrentSession();

  if (
    !session ||
    (session.user.role !== Role.ADMIN && session.user.role !== Role.WRITER)
  ) {
    throw new Error('Unauthorized');
  }

  const postId = formData.get('postId') as string;

  const post = await prisma.post.findFirst({
    where: { id: postId },
    select: { id: true },
  });

  if (!post) {
    throw new Error('Post not found.');
  }

  const deletedPost = await prisma.post.delete({
    where: { id: post.id },
  });

  revalidatePostPaths(deletedPost.id, deletedPost.slug);
}

export async function updatePost(formData: FormData) {
  const session = await getCurrentSession();

  if (
    !session ||
    (session.user.role !== Role.ADMIN && session.user.role !== Role.WRITER)
  ) {
    throw new Error('Unauthorized');
  }

  const id = formData.get('postId') as string;
  const title = formData.get('title') as string;
  const content = formData.get('content') as string;
  const isPublished = formData.get('isPublished') === 'true';

  if (!id || !title || !content) {
    throw new Error('All fields are required.');
  }

  const currentPost = await prisma.post.findFirst({
    where: { id },
    select: { publishedAt: true },
  });

  if (!currentPost) {
    throw new Error('Post not found.');
  }

  const slug = await resolveSlug(
    formData.get('slug'),
    title,
    isPostSlugTaken(id),
  );

  // A form without authors keeps the current ones
  const authors = await readAuthors(formData);

  await prisma.post.update({
    where: { id },
    data: {
      ...(authors && {
        authors: { deleteMany: {}, create: authorRows(authors) },
      }),
      title,
      slug,
      content,
      // Keep the original publish date when updating an already published post
      publishedAt: isPublished ? (currentPost.publishedAt ?? new Date()) : null,
    },
  });

  revalidatePostPaths(id, slug);
}

export async function createComment(formData: FormData) {
  const session = await getCurrentSession();

  if (!session) {
    throw new Error('Unauthorized: You must be logged in to comment.');
  }

  const postId = formData.get('postId') as string;
  const rawContent = formData.get('content') as string;
  const postSlug = (formData.get('postSlug') || null) as string | null;
  const parentId = (formData.get('parentId') || null) as string | null;

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
      parentId,
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

export async function editComment(formData: FormData) {
  const session = await getCurrentSession();

  if (!session) {
    throw new Error('Unauthorized: You must be logged in to edit a comment.');
  }

  const commentId = formData.get('commentId') as string;
  const postSlug = formData.get('postSlug') as string | null;
  const rawContent = formData.get('content') as string;

  const content = rawContent.trim().replace(/(?:\r?\n){3,}/g, '\n\n');

  if (!commentId || !content) {
    throw new Error('Comment ID and content are required.');
  }

  if (content.length > 1000) {
    throw new Error('Comment content cannot exceed 1000 characters.');
  }

  const comment = await prisma.comment.findUnique({
    where: { id: commentId },
  });

  if (!comment) {
    throw new Error('Comment not found.');
  }

  if (comment.authorId !== session.user.id) {
    throw new Error(
      'Unauthorized: You do not have permission to edit this comment.',
    );
  }

  await prisma.comment.update({
    where: { id: commentId },
    data: { content },
  });

  revalidatePostPaths(comment.postId, postSlug);
}

// Matches crawlers and link previews that run scripts, and audit tools like Lighthouse
const NOT_A_READER = /bot|crawl|spider|slurp|preview|lighthouse|headless/i;

export async function addView(formData: FormData) {
  const postId = formData.get('postId');

  if (typeof postId !== 'string' || !postId) return;

  const [session, headerList] = await Promise.all([
    getCurrentSession(),
    headers(),
  ]);
  const userAgent = headerList.get('user-agent') ?? '';

  // Writers and admins checking their own blog aren't readers
  if (
    session?.user.role === Role.ADMIN ||
    session?.user.role === Role.WRITER ||
    NOT_A_READER.test(userAgent)
  ) {
    return;
  }

  // Drafts don't count, and an unknown id shouldn't leave a rate-limit row behind
  const isPublished = await prisma.post.count({
    where: { id: postId, publishedAt: { not: null } },
  });
  if (!isPublished) return;

  // One view per visitor and post a day, however often they reload. The visitor includes the browser, so people sharing
  // a network count separately, and the cap per network keeps a script that changes its user agent from counting up.
  const [network, visitor] = await Promise.all([
    visitorHash(),
    visitorHash(userAgent),
  ]);
  if (
    (await hit(`view-network:${network}`, 24 * 60 * 60)) > 100 ||
    (await hit(`view:${postId}:${visitor}`, 24 * 60 * 60)) > 1
  ) {
    return;
  }

  // Raw SQL, because Prisma's update would also move updatedAt, which the sitemap reports as the post's last change
  await prisma.$executeRaw`UPDATE "Post" SET "views" = "views" + 1 WHERE "id" = ${postId}`;
}

function revalidatePostPaths(postId: string, slug: string | null) {
  updateTag('posts');
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
