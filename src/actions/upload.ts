'use server';

import { Role } from '@/generated/prisma/enums';

import { getCurrentSession } from '@/lib/auth';
import { IMAGE_TYPES, type ImageType } from '@/lib/images';
import prisma from '@/lib/prisma';
import {
  deleteImages,
  isValidUploadSize,
  newUpload,
  ownImageKey,
} from '@/lib/uploads';

async function requireWriterSession() {
  const session = await getCurrentSession();
  if (
    !session ||
    (session.user.role !== Role.ADMIN && session.user.role !== Role.WRITER)
  ) {
    throw new Error('Unauthorized: only writers can upload pictures.');
  }
  return session;
}

/**
 * Upload links for one picture, for its small and large copy. The browser shrinks the picture first, then sends
 * both copies straight to storage.
 */
export async function requestImageUpload(
  type: string,
  sizes: { small: number; large: number },
) {
  await requireWriterSession();

  if (!(type in IMAGE_TYPES)) {
    throw new Error('Pictures must be WebP or JPEG.');
  }
  if (!isValidUploadSize(sizes?.small) || !isValidUploadSize(sizes?.large)) {
    throw new Error('That picture is too large, even after shrinking.');
  }

  return newUpload(type as ImageType, {
    small: sizes.small,
    large: sizes.large,
  });
}

/**
 * Deletes pictures uploaded in a form that was then left without saving. Pictures a post or project uses stay.
 */
export async function discardImages(urls: string[]) {
  await requireWriterSession();

  const candidates = urls.filter((url) => ownImageKey(url) !== null);
  if (candidates.length === 0) return;

  const [posts, projects, images] = await Promise.all([
    prisma.post.findMany({
      where: { coverUrl: { in: candidates } },
      select: { coverUrl: true },
    }),
    prisma.project.findMany({
      where: { coverUrl: { in: candidates } },
      select: { coverUrl: true },
    }),
    prisma.projectImage.findMany({
      where: { url: { in: candidates } },
      select: { url: true },
    }),
  ]);
  const used = new Set([
    ...posts.map((p) => p.coverUrl),
    ...projects.map((p) => p.coverUrl),
    ...images.map((i) => i.url),
  ]);

  await deleteImages(candidates.filter((url) => !used.has(url)));
}
