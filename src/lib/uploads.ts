import 'server-only';

import { createHash, randomUUID } from 'node:crypto';

import {
  IMAGE_SIZE_NAMES,
  IMAGE_TYPES,
  type ImageSize,
  type ImageType,
  MAX_IMAGE_BYTES,
} from '@/lib/images';
import prisma from '@/lib/prisma';
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
 * An upload link for each copy of a new picture, and the address the picture will have once they are sent.
 */
export async function newUpload(
  type: ImageType,
  bytes: Record<ImageSize, number>,
) {
  const extension = IMAGE_TYPES[type];
  const key = `${uploadFolder()}/${randomUUID()}`;

  const links = await Promise.all(
    IMAGE_SIZE_NAMES.map(
      async (size) =>
        [
          size,
          await signUpload(`${key}/${size}.${extension}`, type, bytes[size]),
        ] as const,
    ),
  );

  return {
    url: `${IMAGE_PUBLIC_URL}/${key}/large.${extension}`,
    uploads: Object.fromEntries(links) as Record<ImageSize, string>,
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

// The bucket's quota on the Garage server, shared with the plushies site's photos
export const STORAGE_QUOTA_BYTES = 10 * 1024 ** 3;

/**
 * How much this site's pictures take up in storage, and how many there are. Null when storage isn't set up or can't
 * be reached, e.g. locally without keys.
 */
export async function storageUsage() {
  if (!process.env.STORAGE_ACCESS_KEY_ID) return null;

  try {
    const files = await listObjects(`${uploadFolder()}/`);
    const pictures = new Set(
      files.map(({ key }) => key.split('/').slice(0, 3).join('/')),
    );
    return {
      bytes: files.reduce((sum, file) => sum + file.size, 0),
      pictures: pictures.size,
    };
  } catch (error) {
    console.error('Could not read storage usage:', error);
    return null;
  }
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

// The given pictures that something still uses: a cover (a project's dark one too), a project's picture, or an address
// written into a text
async function usedImages(urls: string[]) {
  const keys = urls.flatMap((url) => ownImageKey(url) ?? []);
  const inText = (field: 'content' | 'description') =>
    keys.map((key) => ({ [field]: { contains: key } }));

  const [posts, projects, images, postTexts, projectTexts] = await Promise.all([
    prisma.post.findMany({
      where: { coverUrl: { in: urls } },
      select: { coverUrl: true },
    }),
    prisma.project.findMany({
      where: {
        OR: [{ coverUrl: { in: urls } }, { coverDarkUrl: { in: urls } }],
      },
      select: { coverUrl: true, coverDarkUrl: true },
    }),
    prisma.projectImage.findMany({
      where: { url: { in: urls } },
      select: { url: true },
    }),
    prisma.post.findMany({
      where: { OR: inText('content') },
      select: { content: true },
    }),
    prisma.project.findMany({
      where: { OR: inText('description') },
      select: { description: true },
    }),
  ]);

  const texts = [
    ...postTexts.map(({ content }) => content),
    ...projectTexts.map(({ description }) => description),
  ];
  return new Set([
    ...posts.map(({ coverUrl }) => coverUrl),
    ...projects.flatMap(({ coverUrl, coverDarkUrl }) => [
      coverUrl,
      coverDarkUrl,
    ]),
    ...images.map(({ url }) => url),
    ...urls.filter((url) => {
      const key = ownImageKey(url);
      return key && texts.some((text) => text.includes(key));
    }),
  ]);
}

/**
 * Deletes the given pictures unless something still uses them, e.g. ones uploaded in a form that was then left
 * without saving. Addresses that aren't this site's uploads are ignored. Returns how many were deleted.
 */
export async function discardUnusedImages(urls: string[]) {
  const candidates = [...new Set(urls)].filter(
    (url) => ownImageKey(url) !== null,
  );
  if (candidates.length === 0) return 0;

  const used = await usedImages(candidates);
  const unused = candidates.filter((url) => !used.has(url));
  await deleteImages(unused);
  return unused.length;
}

// Uploads younger than this may belong to a form someone is still filling in
const SWEEP_AFTER_MS = 24 * 60 * 60 * 1000;
// A sweep lists the whole folder, so one an hour per server is plenty
const SWEEP_EVERY_MS = 60 * 60 * 1000;
let lastSweep = 0;

/**
 * The pictures in storage that no post or project uses, uploaded at least `minAgeMs` ago: their addresses, and the
 * files of uploads that never finished, which nothing can point at. Null when storage isn't set up.
 */
export async function findUnusedImages(minAgeMs = 0) {
  if (!process.env.STORAGE_ACCESS_KEY_ID) return null;
  const now = Date.now();
  const files = await listObjects(`${uploadFolder()}/`);

  // Each picture is a folder of copies; its age is its newest copy's
  const folders = new Map<
    string,
    { newest: number; copies: Set<string>; large?: string }
  >();
  for (const file of files) {
    const folder = file.key.split('/').slice(0, 3).join('/');
    const entry = folders.get(folder) ?? { newest: 0, copies: new Set() };
    entry.newest = Math.max(entry.newest, file.lastModified.getTime());
    entry.copies.add(file.key.slice(folder.length + 1).split('.')[0]);
    if (/\/large\.(webp|jpg)$/.test(file.key)) entry.large = file.key;
    folders.set(folder, entry);
  }

  const old = [...folders].filter(([, { newest }]) => now - newest >= minAgeMs);
  const unfinished = old
    .filter(([, { large }]) => !large)
    .map(([folder]) => folder);
  const urls = old.flatMap(([, { large }]) =>
    large ? [`${IMAGE_PUBLIC_URL}/${large}`] : [],
  );
  const used = urls.length > 0 ? await usedImages(urls) : new Set<string>();
  // Pictures with every copy, which can be shown as a thumbnail
  const complete = new Set(
    old
      .filter(([, { copies }]) =>
        IMAGE_SIZE_NAMES.every((size) => copies.has(size)),
      )
      .flatMap(([, { large }]) =>
        large ? [`${IMAGE_PUBLIC_URL}/${large}`] : [],
      ),
  );

  const unused = urls.filter((url) => !used.has(url));
  const uploadedAt = new Map<string, number>(
    old.flatMap(([, { newest, large }]) =>
      large ? [[`${IMAGE_PUBLIC_URL}/${large}`, newest]] : [],
    ),
  );
  return {
    urls: unused,
    previews: unused.filter((url) => complete.has(url)),
    // Each unused picture with when it was uploaded, newest first, and whether it has every copy for a thumbnail
    items: unused
      .map((url) => ({
        url,
        uploadedAt: uploadedAt.get(url)!,
        complete: complete.has(url),
      }))
      .sort((a, b) => b.uploadedAt - a.uploadedAt),
    unfinishedFiles: files
      .filter((file) =>
        unfinished.some((folder) => file.key.startsWith(`${folder}/`)),
      )
      .map((file) => file.key),
  };
}

/**
 * Deletes every picture nothing uses, however new, and returns how many went. For the Media page's Clean up button.
 */
export async function removeUnusedImages(minAgeMs = 0) {
  const unused = await findUnusedImages(minAgeMs);
  if (!unused) return 0;

  await Promise.all(
    unused.unfinishedFiles.map((key) =>
      deleteObject(key).catch((error) =>
        console.error(`Couldn't delete ${key}:`, error),
      ),
    ),
  );
  await deleteImages(unused.urls);
  return unused.urls.length;
}

/**
 * Deletes pictures nothing uses that were uploaded over a day ago: left behind when a tab closed mid-edit, or by
 * uploads that never finished. Run it after a response, e.g. when the Media page opens.
 */
export async function sweepUnusedImages() {
  const now = Date.now();
  if (now - lastSweep < SWEEP_EVERY_MS) return;
  lastSweep = now;

  try {
    await removeUnusedImages(SWEEP_AFTER_MS);
  } catch (error) {
    console.error('Could not sweep unused pictures:', error);
  }
}
