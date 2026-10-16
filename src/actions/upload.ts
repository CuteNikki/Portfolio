'use server';

import { revalidatePath } from 'next/cache';

import { Role } from '@/generated/prisma/enums';

import { getCurrentSession } from '@/lib/auth';
import {
  IMAGE_SIZE_NAMES,
  IMAGE_TYPES,
  type ImageSize,
  type ImageType,
} from '@/lib/images';
import {
  discardUnusedImages,
  isValidUploadSize,
  newUpload,
  removeUnusedImages,
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
 * Upload links for one picture, one for each of its copies. The browser shrinks the picture first, then sends the
 * copies straight to storage.
 */
export async function requestImageUpload(
  type: string,
  bytes: Record<ImageSize, number>,
) {
  // Reasons go back as values: a production build hides a thrown error's message
  const session = await getCurrentSession();
  if (
    !session ||
    (session.user.role !== Role.ADMIN && session.user.role !== Role.WRITER)
  ) {
    return { error: 'Only writers can upload pictures.' } as const;
  }
  if (!(type in IMAGE_TYPES)) {
    return { error: 'Pictures must be WebP or JPEG.' } as const;
  }
  if (!IMAGE_SIZE_NAMES.every((size) => isValidUploadSize(bytes?.[size]))) {
    return {
      error: 'That picture is too large, even after shrinking.',
    } as const;
  }

  // Only the expected sizes go on, whatever else the browser sent
  const checked = Object.fromEntries(
    IMAGE_SIZE_NAMES.map((size) => [size, bytes[size]]),
  ) as Record<ImageSize, number>;

  return newUpload(type as ImageType, checked);
}

/**
 * Deletes pictures uploaded in a form that was then left without saving. Pictures a post or project uses stay.
 */
export async function discardImages(urls: string[]) {
  await requireWriterSession();
  await discardUnusedImages(urls);
}

/**
 * Deletes every picture in storage that no post or project uses, from the Media page. A picture someone has just
 * added in a form they haven't saved yet goes too, which the page warns about.
 */
export async function cleanUpImages(): Promise<
  { error: string } | { removed: number }
> {
  const session = await getCurrentSession();
  if (
    !session ||
    (session.user.role !== Role.ADMIN && session.user.role !== Role.WRITER)
  ) {
    return { error: 'Only writers can clean up pictures.' };
  }

  try {
    const removed = await removeUnusedImages();
    revalidatePath('/dashboard/media');
    return { removed };
  } catch (error) {
    console.error('Could not clean up pictures:', error);
    return { error: 'Storage couldn’t be reached. Please try again.' };
  }
}
