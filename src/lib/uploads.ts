import 'server-only';

import { createHash, randomUUID } from 'node:crypto';

import { IMAGE_TYPES, type ImageType, MAX_IMAGE_BYTES } from '@/lib/images';
import {
  deleteObject,
  IMAGE_PUBLIC_URL,
  listObjects,
  signUpload,
} from '@/lib/storage';

// Each database keeps its pictures in its own folder, so a local test database can never touch the live site's,
// and the plushies site's pictures in the same bucket are out of reach entirely.
function uploadFolder() {
  const database = new URL(process.env.DATABASE_URL ?? 'postgresql://unknown');
  const owner = createHash('sha256')
    .update(database.host + database.pathname)
    .digest('base64url')
    .slice(0, 12);

  return `portfolio/${owner}`;
}

/**
 * Two upload links for a new picture, one for its small and one for its large copy, and the address the picture
 * will have once both are sent.
 */
export async function newUpload(
  type: ImageType,
  sizes: { small: number; large: number },
) {
  const extension = IMAGE_TYPES[type];
  const key = `${uploadFolder()}/${randomUUID()}`;

  const [small, large] = await Promise.all([
    signUpload(`${key}/small.${extension}`, type, sizes.small),
    signUpload(`${key}/large.${extension}`, type, sizes.large),
  ]);

  return {
    url: `${IMAGE_PUBLIC_URL}/${key}/large.${extension}`,
    uploads: { small, large },
  };
}

export function isValidUploadSize(size: unknown): size is number {
  return (
    Number.isInteger(size) &&
    (size as number) > 0 &&
    (size as number) <= MAX_IMAGE_BYTES
  );
}

/**
 * The storage key of one of our pictures, e.g. "portfolio/abc/0f…/" for its folder, or null for any address that
 * isn't one of this site's uploads. Forms send addresses from the browser, so only these are saved or deleted.
 */
export function ownImageKey(url: unknown) {
  if (typeof url !== 'string' || !url.startsWith(`${IMAGE_PUBLIC_URL}/`))
    return null;

  const path = url.slice(IMAGE_PUBLIC_URL.length + 1);
  const folder = uploadFolder();
  const match = path.match(/^([\w/-]+)\/large\.(webp|jpg)$/);

  return match &&
    match[1].startsWith(`${folder}/`) &&
    match[1].split('/').length === 3
    ? match[1]
    : null;
}

/**
 * Deletes pictures that are no longer used, both copies of each. Failures are logged rather than thrown: the
 * change that removed them has already been saved.
 */
export async function deleteImages(urls: string[]) {
  const keys = urls
    .map(ownImageKey)
    .filter((key): key is string => key !== null);

  await Promise.all(
    keys.map(async (key) => {
      try {
        const files = await listObjects(`${key}/`);
        await Promise.all(files.map((file) => deleteObject(file.key)));
      } catch (error) {
        console.error(`Couldn't delete the picture ${key}:`, error);
      }
    }),
  );
}
