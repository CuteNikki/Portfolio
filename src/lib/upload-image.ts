'use client';

import { requestImageUpload } from '@/actions/upload';

import {
  IMAGE_SIZE_NAMES,
  IMAGE_SIZES,
  type ImageSize,
  type ImageType,
} from '@/lib/images';

// Redraws a picture so its longest side is at most `size` pixels, as WebP, or JPEG where the browser can't write
// WebP. EXIF rotation is applied, and an animated GIF keeps its first frame.
async function shrink(bitmap: ImageBitmap, size: number, type: ImageType) {
  const scale = Math.min(1, size / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);

  const context = canvas.getContext('2d');
  if (!context)
    throw new Error('This browser can’t prepare pictures for upload.');
  context.imageSmoothingQuality = 'high';
  context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, type, 0.85),
  );
  if (!blob) throw new Error('This picture couldn’t be prepared for upload.');
  return blob;
}

async function shrinkAll(file: File) {
  const bitmap = await createImageBitmap(file, {
    imageOrientation: 'from-image',
  });

  try {
    let type: ImageType = 'image/webp';
    let thumb = await shrink(bitmap, IMAGE_SIZES.thumb, type);
    // Browsers without a WebP encoder quietly hand back PNG, so every copy is made as JPEG instead
    if (thumb.type !== type) {
      type = 'image/jpeg';
      thumb = await shrink(bitmap, IMAGE_SIZES.thumb, type);
    }
    const small = await shrink(bitmap, IMAGE_SIZES.small, type);
    const large = await shrink(bitmap, IMAGE_SIZES.large, type);

    const copies: Record<ImageSize, Blob> = { thumb, small, large };
    return { type, copies };
  } finally {
    bitmap.close();
  }
}

// XHR rather than fetch, because only XHR reports how much of an upload has been sent
function put(url: string, blob: Blob, onProgress: (sent: number) => void) {
  return new Promise<void>((resolve, reject) => {
    const request = new XMLHttpRequest();
    request.open('PUT', url);
    request.setRequestHeader('Content-Type', blob.type);
    request.upload.onprogress = (event) => onProgress(event.loaded);
    request.onload = () =>
      request.status >= 200 && request.status < 300
        ? resolve()
        : reject(new Error(`The upload failed (${request.status}).`));
    request.onerror = () =>
      reject(new Error('The upload failed. Check your connection.'));
    request.send(blob);
  });
}

/**
 * Shrinks a picture into its copies and uploads them straight to storage.
 *
 * @param file - The picture the writer picked.
 * @param onProgress - Called with how much has been sent, from 0 to 1.
 * @returns The address of the stored picture's large copy.
 */
export async function uploadImage(
  file: File,
  onProgress: (progress: number) => void,
) {
  const { type, copies } = await shrinkAll(file);
  const sizes = Object.fromEntries(
    IMAGE_SIZE_NAMES.map((size) => [size, copies[size].size]),
  ) as Record<ImageSize, number>;
  const total = IMAGE_SIZE_NAMES.reduce((sum, size) => sum + sizes[size], 0);

  const { url, uploads } = await requestImageUpload(type, sizes);

  let done = 0;
  for (const size of IMAGE_SIZE_NAMES) {
    await put(uploads[size], copies[size], (sent) =>
      onProgress((done + sent) / total),
    );
    done += copies[size].size;
  }
  onProgress(1);

  return url;
}
