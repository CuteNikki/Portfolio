import 'server-only';

import { MAX_GALLERY_PICTURES } from '@/lib/images';
import { ownImageKey } from '@/lib/uploads';

const MAX_ALT_LENGTH = 300;

/**
 * The cover picture a dashboard form sent: its address if it's one of this site's uploads, null if it was removed,
 * or undefined if the form had no cover field (then the saved one stays).
 */
export function readCover(
  formData: FormData,
  // `coverDarkUrl` for a project's cover for dark themes, `thumbnailUrl` for a post's thumbnail
  field: 'coverUrl' | 'coverDarkUrl' | 'thumbnailUrl' = 'coverUrl',
): string | null | undefined {
  if (!formData.has(field)) return undefined;
  const url = formData.get(field);
  return ownImageKey(url) ? (url as string) : null;
}

/**
 * The gallery a project form sent, in order, keeping only this site's uploads; undefined if the form had none.
 */
export function readGallery(formData: FormData) {
  if (!formData.has('gallery')) return undefined;

  let images: unknown;
  try {
    images = JSON.parse(String(formData.get('gallery')));
  } catch {
    return [];
  }
  if (!Array.isArray(images)) return [];

  const seen = new Set<string>();
  return images
    .filter(
      (image): image is { url: string; darkUrl?: unknown; alt?: unknown } =>
        ownImageKey(image?.url) !== null,
    )
    .filter(({ url }) => !seen.has(url) && !!seen.add(url))
    .slice(0, MAX_GALLERY_PICTURES)
    .map(({ url, darkUrl, alt }, position) => ({
      url,
      darkUrl: ownImageKey(darkUrl) ? (darkUrl as string) : null,
      alt: typeof alt === 'string' ? alt.trim().slice(0, MAX_ALT_LENGTH) : '',
      position,
    }));
}

/**
 * The pictures that were saved before but aren't any more, so they can be deleted once the change is saved.
 */
export function removedImages(
  before: (string | null)[],
  after: (string | null)[],
) {
  const kept = new Set(after.filter(Boolean));
  return before.filter((url): url is string => !!url && !kept.has(url));
}
