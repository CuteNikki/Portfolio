// Pictures for posts and projects, stored on our own Garage server at images.niso.moe next to the plushies site's.
// The browser saves each one in three sizes before upload, so every place can load a copy close to the size it's shown
// at: a thumbnail for small previews, a small copy for cards and phones and a large one for big screens. This file is
// shared by the browser and the server.

export const IMAGE_TYPES = {
  'image/webp': 'webp',
  'image/jpeg': 'jpg',
} as const;

export type ImageType = keyof typeof IMAGE_TYPES;

// The longest side of each copy, in pixels. Pictures are never scaled up.
export const IMAGE_SIZES = { thumb: 400, small: 960, large: 2000 } as const;

export type ImageSize = keyof typeof IMAGE_SIZES;

export const IMAGE_SIZE_NAMES = Object.keys(IMAGE_SIZES) as ImageSize[];

// The most a single copy may weigh after shrinking
export const MAX_IMAGE_BYTES = 8 * 1024 * 1024;

// How many pictures a project can have after its cover
export const MAX_GALLERY_PICTURES = 12;

/**
 * The address of one copy of a stored picture. The database keeps the large copy's address.
 *
 * @param url - The large copy's address.
 * @param size - Which copy to point to.
 */
export function imageUrl(url: string, size: ImageSize) {
  return size === 'large'
    ? url
    : url.replace(/\/large\.(webp|jpg)$/, `/${size}.$1`);
}
