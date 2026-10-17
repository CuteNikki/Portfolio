'use server';

import { revalidatePath, updateTag } from 'next/cache';

import { getWriterSession } from '@/lib/auth';
import {
  IMAGE_SIZE_NAMES,
  IMAGE_TYPES,
  type ImageSize,
  type ImageType,
} from '@/lib/images';
import prisma from '@/lib/prisma';
import {
  deleteImages,
  discardUnusedImages,
  isValidUploadSize,
  newUpload,
  ownImageKey,
  pictureUses,
  removeUnusedImages,
} from '@/lib/uploads';

/**
 * Upload links for one picture, one for each of its copies. The browser shrinks the picture first, then sends the
 * copies straight to storage.
 */
export async function requestImageUpload(
  type: string,
  bytes: Record<ImageSize, number>,
) {
  // Reasons go back as values: a production build hides a thrown error's message
  if (!(await getWriterSession())) {
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
  // Only a clean-up, which forms don't wait for, so anyone else just gets nothing done
  if (!(await getWriterSession())) return;
  await discardUnusedImages(urls);
}

/**
 * Deletes every picture in storage that no post or project uses, from the Media page. A picture someone has just
 * added in a form they haven't saved yet goes too, which the page warns about.
 */
export async function cleanUpImages(): Promise<
  { error: string } | { removed: number }
> {
  if (!(await getWriterSession())) {
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

/**
 * Deletes one picture nothing uses, from the Media page's list of unused pictures. If something has started using it
 * in the meantime, it stays.
 */
export async function deleteUnusedImage(
  url: string,
): Promise<{ error: string } | { removed: true }> {
  if (!(await getWriterSession())) {
    return { error: 'Only writers can delete pictures.' };
  }
  if (typeof url !== 'string' || !ownImageKey(url)) {
    return { error: 'That isn’t one of this site’s pictures.' };
  }

  try {
    if ((await discardUnusedImages([url])) === 0) {
      return { error: 'A post or project uses this picture now.' };
    }
    revalidatePath('/dashboard/media');
    return { removed: true };
  } catch (error) {
    console.error('Could not delete an unused picture:', error);
    return { error: 'Storage couldn’t be reached. Please try again.' };
  }
}

/**
 * Takes a picture off every post and project that shows it, as a cover, thumbnail, dark cover or project picture, then
 * deletes it from storage. A picture written into a post's or project's text stays, since removing it there would
 * leave a broken image in the middle of the text.
 */
export async function removePicture(
  url: string,
): Promise<{ error: string } | { removed: true }> {
  if (!(await getWriterSession())) {
    return { error: 'Only writers can delete pictures.' };
  }

  const uses = typeof url === 'string' ? await pictureUses(url) : null;
  if (!uses) return { error: 'That isn’t one of this site’s pictures.' };
  if (uses.inText.length > 0) {
    return {
      error: `It’s also in the text of ${uses.inText.map((title) => `“${title}”`).join(', ')}. Take it out there first.`,
    };
  }

  await prisma.$transaction([
    prisma.post.updateMany({
      where: { coverUrl: url },
      data: { coverUrl: null },
    }),
    prisma.post.updateMany({
      where: { thumbnailUrl: url },
      data: { thumbnailUrl: null },
    }),
    // Its colour came from the cover, so it goes with it
    prisma.project.updateMany({
      where: { coverUrl: url },
      data: { coverUrl: null, coverTone: null },
    }),
    prisma.project.updateMany({
      where: { coverDarkUrl: url },
      data: { coverDarkUrl: null },
    }),
    prisma.projectImage.deleteMany({ where: { url } }),
  ]);
  await deleteImages([url]);

  // The same pages a post's or project's own save refreshes
  if (uses.posts.length > 0) {
    updateTag('posts');
    revalidatePath('/posts');
    revalidatePath('/dashboard/posts');
  }
  if (uses.projects.length > 0) {
    updateTag('projects');
    revalidatePath('/projects');
    revalidatePath('/dashboard/projects');
  }
  for (const [kind, items] of [
    ['posts', uses.posts],
    ['projects', uses.projects],
  ] as const) {
    for (const { id, slug } of items) {
      for (const idOrSlug of slug ? [id, slug] : [id]) {
        revalidatePath(`/${kind}/${idOrSlug}`);
        revalidatePath(`/dashboard/${kind}/edit/${idOrSlug}`);
      }
    }
  }
  revalidatePath('/');
  revalidatePath('/dashboard/media');
  return { removed: true };
}
