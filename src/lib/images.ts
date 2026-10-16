// Pictures for posts and projects, stored on our own Garage server at images.niso.moe next to the plushies site's.
// Each one is saved twice by the browser before upload: a small copy for cards and lists and a large one for pages.
// This file is shared by the browser and the server.

export const IMAGE_TYPES = {
  'image/webp': 'webp',
  'image/jpeg': 'jpg',
} as const;

export type ImageType = keyof typeof IMAGE_TYPES;

// The longest side of each copy, in pixels. Pictures are never scaled up.
export const IMAGE_SIZES = { small: 720, large: 2000 } as const;

export type ImageSize = keyof typeof IMAGE_SIZES;

// The most a single copy may weigh after shrinking
export const MAX_IMAGE_BYTES = 8 * 1024 * 1024;

/**
 * The address of one copy of a stored picture. The database keeps the large copy's address.
 *
 * @param url - The large copy's address.
 * @param size - Which copy to point to.
 */
export function imageUrl(url: string, size: ImageSize) {
  return size === 'large'
    ? url
    : url.replace(/\/large\.(webp|jpg)$/, '/small.$1');
}
