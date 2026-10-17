'use server';

import { revalidatePath, updateTag } from 'next/cache';
import { after } from 'next/server';
import { headers } from 'next/headers';

import {
  type ActionResult,
  type CreateResult,
  fail,
} from '@/lib/action-result';
import { getCurrentSession, getWriterSession } from '@/lib/auth';
import { authorRows, readAuthors } from '@/lib/authors';
import { commentsTag } from '@/lib/data';
import { readDate } from '@/lib/form-date';
import { readCover, removedImages } from '@/lib/form-images';
import { deleteImages } from '@/lib/uploads';
import prisma from '@/lib/prisma';
import { hit, visitorHash } from '@/lib/rate-limit';
import { resolveSlug } from '@/lib/slug';

import { MAX_COMMENT_DEPTH, MAX_COMMENT_LENGTH } from '@/constants/comments';
import { canWrite } from '@/constants/roles';

function isPostSlugTaken(exceptId?: string) {
  return async (slug: string) =>
    (await prisma.post.count({
      where: exceptId ? { slug, NOT: { id: exceptId } } : { slug },
    })) > 0;
}

export async function createPost(formData: FormData): Promise<CreateResult> {
  const session = await getWriterSession();
  if (!session) return fail('Only writers and admins can do that.');

  const title = formData.get('title') as string;
  const content = formData.get('content') as string;

  const isPublished = formData.get('isPublished') === 'true';

  if (!title || !content) {
    return fail('Title and content are required.');
  }

  // The post's own date, shown on the site; today when left empty
  const createdAt = readDate(formData.get('date'));
  if (createdAt === null) return fail('Please enter a valid date.');

  const resolved = await resolveSlug(
    formData.get('slug'),
    title,
    isPostSlugTaken(),
  );
  if ('error' in resolved) return fail(resolved.error);
  const { slug } = resolved;

  const createdPost = await prisma.post.create({
    data: {
      title,
      content,
      slug,
      coverUrl: readCover(formData) ?? null,
      thumbnailUrl: readCover(formData, 'thumbnailUrl') ?? null,
      createdAt,
      publishedAt: isPublished ? new Date() : null,
      // The picked authors, or else whoever creates it
      authors: {
        create: authorRows(
          (await readAuthors(formData)) ?? [{ userId: session.user.id }],
        ),
      },
    },
  });

  revalidatePostPaths(createdPost.id, createdPost.slug);
  return { id: createdPost.id, slug: createdPost.slug };
}

export async function deletePost(formData: FormData): Promise<ActionResult> {
  if (!(await getWriterSession())) {
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

  // Its cover and thumbnail go too, once the response is sent
  const pictures = [deletedPost.coverUrl, deletedPost.thumbnailUrl].filter(
    (url): url is string => !!url,
  );
  if (pictures.length > 0) after(() => deleteImages(pictures));

  revalidatePostPaths(deletedPost.id, deletedPost.slug);
  return {};
}

export async function updatePost(formData: FormData): Promise<ActionResult> {
  if (!(await getWriterSession())) {
    return fail('Only writers and admins can do that.');
  }

  const id = formData.get('postId') as string;
  const title = formData.get('title') as string;
  const content = formData.get('content') as string;
  const isPublished = formData.get('isPublished') === 'true';

  if (!id || !title || !content) {
    return fail('All fields are required.');
  }

  // The post's own date; a form without a date field keeps the current one
  const createdAt = readDate(formData.get('date'));
  if (createdAt === null) return fail('Please enter a valid date.');

  const currentPost = await prisma.post.findFirst({
    where: { id },
    select: { publishedAt: true, coverUrl: true, thumbnailUrl: true },
  });

  if (!currentPost) {
    return fail('Post not found.');
  }

  const resolved = await resolveSlug(
    formData.get('slug'),
    title,
    isPostSlugTaken(id),
  );
  if ('error' in resolved) return fail(resolved.error);
  const { slug } = resolved;

  // A form without authors or a cover field keeps the current ones
  const authors = await readAuthors(formData);
  const coverUrl = readCover(formData);
  const thumbnailUrl = readCover(formData, 'thumbnailUrl');

  await prisma.post.update({
    where: { id },
    data: {
      ...(authors && {
        authors: { deleteMany: {}, create: authorRows(authors) },
      }),
      ...(coverUrl !== undefined && { coverUrl }),
      ...(thumbnailUrl !== undefined && { thumbnailUrl }),
      title,
      slug,
      content,
      createdAt,
      // Keep the original publish date when updating an already published post
      publishedAt: isPublished ? (currentPost.publishedAt ?? new Date()) : null,
    },
  });

  // A replaced or removed cover or thumbnail goes once the response is sent
  const removed = removedImages(
    [currentPost.coverUrl, currentPost.thumbnailUrl],
    [
      coverUrl === undefined ? currentPost.coverUrl : coverUrl,
      thumbnailUrl === undefined ? currentPost.thumbnailUrl : thumbnailUrl,
    ],
  );
  if (removed.length > 0) after(() => deleteImages(removed));

  revalidatePostPaths(id, slug);
  return {};
}

// A comment's text as it's kept: trimmed, with runs of blank lines shortened to one
function readCommentContent(formData: FormData) {
  return String(formData.get('content') ?? '')
    .trim()
    .replace(/(?:\r?\n){3,}/g, '\n\n');
}

// How many replies deep a comment is: 0 for a comment on the post itself
async function depthOf(commentId: string) {
  let depth = 0;
  let parentId: string | null = commentId;
  while (parentId && depth <= MAX_COMMENT_DEPTH) {
    const parent: { parentId: string | null } | null =
      await prisma.comment.findUnique({
        where: { id: parentId },
        select: { parentId: true },
      });
    if (!parent) break;
    parentId = parent.parentId;
    if (parentId) depth += 1;
  }
  return depth;
}

export async function createComment(formData: FormData): Promise<ActionResult> {
  const session = await getCurrentSession();

  if (!session) {
    return fail('Sign in to comment.');
  }

  const postId = String(formData.get('postId') ?? '');
  const parentId = (formData.get('parentId') || null) as string | null;
  const content = readCommentContent(formData);

  if (!postId || !content) {
    return fail('Write something first.');
  }

  if (content.length > MAX_COMMENT_LENGTH) {
    return fail(`A comment can be ${MAX_COMMENT_LENGTH} characters at most.`);
  }

  // Only published posts take comments, from anyone, and drafts from the people who write them
  const post = await prisma.post.findFirst({
    where: {
      id: postId,
      ...(canWrite(session.user.role) ? {} : { publishedAt: { not: null } }),
    },
    select: { id: true },
  });
  if (!post) return fail('That post doesn’t exist any more.');

  // A reply answers a comment on the same post, and nests no deeper than the page shows
  if (parentId) {
    const parent = await prisma.comment.findUnique({
      where: { id: parentId },
      select: { postId: true },
    });
    if (!parent || parent.postId !== post.id) {
      return fail('The comment you replied to doesn’t exist any more.');
    }
    if ((await depthOf(parentId)) >= MAX_COMMENT_DEPTH) {
      return fail('Replies can’t go any deeper here.');
    }
  }

  // Enough for a conversation, not for flooding a post
  if ((await hit(`comment:${session.user.id}`, 10 * 60)) > 10) {
    return fail('That’s a lot of comments at once. Please wait a few minutes.');
  }

  await prisma.comment.create({
    data: {
      content,
      postId: post.id,
      parentId,
      authorId: session.user.id,
    },
  });

  updateTag(commentsTag(post.id));
  return {};
}

export async function deleteComment(formData: FormData): Promise<ActionResult> {
  const session = await getCurrentSession();

  if (!session) {
    return fail('Sign in to delete comments.');
  }

  const commentId = String(formData.get('commentId') ?? '');

  if (!commentId) {
    return fail('Comment ID is required.');
  }

  const comment = await prisma.comment.findUnique({
    where: { id: commentId },
    select: { authorId: true, postId: true },
  });

  if (!comment) {
    return fail('Comment not found.');
  }

  // A comment's author can delete it, and so can writers and admins, who look after the posts
  if (comment.authorId !== session.user.id && !canWrite(session.user.role)) {
    return fail('You can only delete your own comments.');
  }

  await prisma.comment.delete({
    where: { id: commentId },
  });

  updateTag(commentsTag(comment.postId));
  return {};
}

export async function editComment(formData: FormData): Promise<ActionResult> {
  const session = await getCurrentSession();

  if (!session) {
    return fail('Sign in to edit comments.');
  }

  const commentId = String(formData.get('commentId') ?? '');
  const content = readCommentContent(formData);

  if (!commentId || !content) {
    return fail('Write something first.');
  }

  if (content.length > MAX_COMMENT_LENGTH) {
    return fail(`A comment can be ${MAX_COMMENT_LENGTH} characters at most.`);
  }

  const comment = await prisma.comment.findUnique({
    where: { id: commentId },
    select: { authorId: true, postId: true },
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

  updateTag(commentsTag(comment.postId));
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
  if (canWrite(session?.user.role) || NOT_A_READER.test(userAgent)) {
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

/**
 * Publishes a post or takes it back to a draft without opening it, e.g. from a row's menu. The post keeps its own date.
 */
export async function setPostPublished(
  postId: string,
  published: boolean,
): Promise<ActionResult> {
  if (!(await getWriterSession())) {
    return fail('Only writers and admins can do that.');
  }

  const post = await prisma.post.findUnique({
    where: { id: postId },
    select: { slug: true, publishedAt: true },
  });
  if (!post) return fail('That post doesn’t exist any more.');

  // Already as asked, e.g. after a second click in another tab
  if (!!post.publishedAt === published) return {};

  await prisma.post.update({
    where: { id: postId },
    data: { publishedAt: published ? new Date() : null },
  });

  revalidatePostPaths(postId, post.slug);
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
