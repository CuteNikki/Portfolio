'use server';

import { revalidatePath, updateTag } from 'next/cache';
import { after } from 'next/server';
import { headers } from 'next/headers';

import { Role } from '@/generated/prisma/enums';

import type { ActionResult } from '@/lib/action-result';
import { getCurrentSession } from '@/lib/auth';
import { authorRows, readAuthors } from '@/lib/authors';
import { readCover, removedImages } from '@/lib/form-images';
import { deleteImages } from '@/lib/uploads';
import prisma from '@/lib/prisma';
import { hit, visitorHash } from '@/lib/rate-limit';
import { resolveSlug } from '@/lib/slug';

// Messages go back as values, since a production build hides a thrown error's message (see action-result.ts)
const fail = (error: string) => ({ error });
type CreateResult = ActionResult & { id?: string; slug?: string | null };

function isPostSlugTaken(exceptId?: string) {
  return async (slug: string) =>
    (await prisma.post.count({
      where: exceptId ? { slug, NOT: { id: exceptId } } : { slug },
    })) > 0;
}

export async function createPost(formData: FormData): Promise<CreateResult> {
  const session = await getCurrentSession();

  if (
    !session ||
    (session.user.role !== Role.ADMIN && session.user.role !== Role.WRITER)
  ) {
    return fail('Only writers and admins can do that.');
  }

  const title = formData.get('title') as string;
  const content = formData.get('content') as string;

  const isPublished = formData.get('isPublished') === 'true';

  if (!title || !content) {
    return fail('Title and content are required.');
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
      coverUrl: readCover(formData) ?? null,
      publishedAt: isPublished ? new Date() : null,
      // The picked authors, or else whoever creates it
      authors: {
        create: authorRows((await readAuthors(formData)) ?? [session.user.id]),
      },
    },
  });

  revalidatePostPaths(createdPost.id, createdPost.slug);
  return { id: createdPost.id, slug: createdPost.slug };
}

export async function deletePost(formData: FormData): Promise<ActionResult> {
  const session = await getCurrentSession();

  if (
    !session ||
    (session.user.role !== Role.ADMIN && session.user.role !== Role.WRITER)
  ) {
    return fail('Only writers and admins can do that.');
  }

  const postId = formData.get('postId') as string;

  const post = await prisma.post.findFirst({
    where: { id: postId },
    select: { id: true },
  });

  if (!post) {
    return fail('Post not found.');
  }

  const deletedPost = await prisma.post.delete({
    where: { id: post.id },
  });

  // Its cover goes too, once the response is sent
  if (deletedPost.coverUrl) {
    const { coverUrl } = deletedPost;
    after(() => deleteImages([coverUrl]));
  }

  revalidatePostPaths(deletedPost.id, deletedPost.slug);
  return {};
}

export async function updatePost(formData: FormData): Promise<ActionResult> {
  const session = await getCurrentSession();

  if (
    !session ||
    (session.user.role !== Role.ADMIN && session.user.role !== Role.WRITER)
  ) {
    return fail('Only writers and admins can do that.');
  }

  const id = formData.get('postId') as string;
  const title = formData.get('title') as string;
  const content = formData.get('content') as string;
  const isPublished = formData.get('isPublished') === 'true';

  if (!id || !title || !content) {
    return fail('All fields are required.');
  }

  const currentPost = await prisma.post.findFirst({
    where: { id },
    select: { publishedAt: true, coverUrl: true },
  });

  if (!currentPost) {
    return fail('Post not found.');
  }

  const slug = await resolveSlug(
    formData.get('slug'),
    title,
    isPostSlugTaken(id),
  );

  // A form without authors or a cover field keeps the current ones
  const authors = await readAuthors(formData);
  const coverUrl = readCover(formData);

  await prisma.post.update({
    where: { id },
    data: {
      ...(authors && {
        authors: { deleteMany: {}, create: authorRows(authors) },
      }),
      ...(coverUrl !== undefined && { coverUrl }),
      title,
      slug,
      content,
      // Keep the original publish date when updating an already published post
      publishedAt: isPublished ? (currentPost.publishedAt ?? new Date()) : null,
    },
  });

  // A replaced or removed cover goes once the response is sent
  if (coverUrl !== undefined) {
    const removed = removedImages([currentPost.coverUrl], [coverUrl]);
    if (removed.length > 0) after(() => deleteImages(removed));
  }

  revalidatePostPaths(id, slug);
  return {};
}

export async function createComment(formData: FormData): Promise<ActionResult> {
  const session = await getCurrentSession();

  if (!session) {
    return fail('Sign in to comment.');
  }

  const postId = formData.get('postId') as string;
  const rawContent = formData.get('content') as string;
  const postSlug = (formData.get('postSlug') || null) as string | null;
  const parentId = (formData.get('parentId') || null) as string | null;

  const content = rawContent.trim().replace(/(?:\r?\n){3,}/g, '\n\n');

  if (!postId || !content) {
    return fail('Post ID and comment content are required.');
  }

  if (content.length > 1000) {
    return fail('Comment content cannot exceed 1000 characters.');
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
  return {};
}

export async function deleteComment(formData: FormData): Promise<ActionResult> {
  const session = await getCurrentSession();

  if (!session) {
    return fail('Sign in to delete comments.');
  }

  const commentId = formData.get('commentId') as string;
  const postSlug = formData.get('postSlug') as string | null;

  if (!commentId) {
    return fail('Comment ID is required.');
  }

  const comment = await prisma.comment.findUnique({
    where: { id: commentId },
  });

  if (!comment) {
    return fail('Comment not found.');
  }

  // A comment's author can delete it, and so can writers and admins, who look after the posts
  if (
    comment.authorId !== session.user.id &&
    session.user.role !== Role.ADMIN &&
    session.user.role !== Role.WRITER
  ) {
    return fail('You can only delete your own comments.');
  }

  await prisma.comment.delete({
    where: { id: commentId },
  });

  revalidatePostPaths(comment.postId, postSlug);
  return {};
}

export async function editComment(formData: FormData): Promise<ActionResult> {
  const session = await getCurrentSession();

  if (!session) {
    return fail('Sign in to edit comments.');
  }

  const commentId = formData.get('commentId') as string;
  const postSlug = formData.get('postSlug') as string | null;
  const rawContent = formData.get('content') as string;

  const content = rawContent.trim().replace(/(?:\r?\n){3,}/g, '\n\n');

  if (!commentId || !content) {
    return fail('Comment ID and content are required.');
  }

  if (content.length > 1000) {
    return fail('Comment content cannot exceed 1000 characters.');
  }

  const comment = await prisma.comment.findUnique({
    where: { id: commentId },
  });

  if (!comment) {
    return fail('Comment not found.');
  }

  if (comment.authorId !== session.user.id) {
    return fail('You can only edit your own comments.');
  }

  await prisma.comment.update({
    where: { id: commentId },
    data: { content },
  });

  revalidatePostPaths(comment.postId, postSlug);
  return {};
}

// Matches crawlers and link previews that run scripts, and audit tools like Lighthouse
const NOT_A_READER = /bot|crawl|spider|slurp|preview|lighthouse|headless/i;

export async function addView(formData: FormData): Promise<ActionResult> {
  const postId = formData.get('postId');

  if (typeof postId !== 'string' || !postId) return {};

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
    return {};
  }

  // Drafts don't count, and an unknown id shouldn't leave a rate-limit row behind
  const isPublished = await prisma.post.count({
    where: { id: postId, publishedAt: { not: null } },
  });
  if (!isPublished) return {};

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
    return {};
  }

  // Raw SQL, because Prisma's update would also move updatedAt, which the sitemap reports as the post's last change
  await prisma.$executeRaw`UPDATE "Post" SET "views" = "views" + 1 WHERE "id" = ${postId}`;
  return {};
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
