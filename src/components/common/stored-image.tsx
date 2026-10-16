import { IMAGE_SIZE_NAMES, IMAGE_SIZES, imageUrl } from '@/lib/images';
import { cn } from '@/lib/utils';

// One of our stored pictures, with all its copies in `srcset` so the browser downloads the one closest to the size it's
// shown at. A plain <img>, because Next's image
// component only builds a `srcset` when it optimizes images itself, which this site turns off.
export function StoredImage({
  url,
  alt,
  sizes,
  priority,
  fill,
  className,
}: {
  // The large copy's address, as saved in the database
  url: string;
  alt: string;
  // How wide the picture is shown, e.g. "(min-width: 1024px) 380px, 100vw"
  sizes: string;
  // For the picture at the top of a page: loads first instead of when scrolled near
  priority?: boolean;
  // Fills its positioned parent
  fill?: boolean;
  className?: string;
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={imageUrl(url, 'large')}
      srcSet={IMAGE_SIZE_NAMES.map(
        (size) => `${imageUrl(url, size)} ${IMAGE_SIZES[size]}w`,
      ).join(', ')}
      sizes={sizes}
      alt={alt}
      loading={priority ? 'eager' : 'lazy'}
      fetchPriority={priority ? 'high' : undefined}
      decoding='async'
      className={cn(fill && 'absolute inset-0 size-full', className)}
    />
  );
}
