import Image from 'next/image';

import { imageUrl } from '@/lib/images';
import { cn, toneFor } from '@/lib/utils';

// A project's cover image, or until it has one, a small drawing of a browser window in the project's own colour. The
// drawing (or image) rises a little while the surrounding card, which needs the `group` class, is hovered.
export function ProjectThumbnail({
  title,
  coverUrl,
  sizes,
  priority,
  large,
  className,
}: {
  title: string;
  coverUrl?: string | null;
  // Passed to the image so the browser picks a fitting width, e.g. "(min-width: 1024px) 66vw, 100vw"
  sizes: string;
  priority?: boolean;
  // Wide cards use the large copy of the cover, the rest the small one
  large?: boolean;
  className?: string;
}) {
  const tone = toneFor(title);

  return (
    <div
      className={cn(
        'relative overflow-hidden bg-[color-mix(in_oklab,var(--tone)_14%,var(--card))]',
        className,
      )}
      style={{ '--tone': tone } as React.CSSProperties}
    >
      {coverUrl ? (
        <Image
          src={imageUrl(coverUrl, large ? 'large' : 'small')}
          alt=''
          fill
          sizes={sizes}
          priority={priority}
          className='object-cover transition-transform duration-700 ease-(--ease-out-soft) group-hover:scale-[1.03]'
        />
      ) : (
        <div
          aria-hidden
          className='border-border bg-card absolute inset-x-[8%] top-[13%] -bottom-[10%] overflow-hidden rounded-lg border shadow-[0_16px_40px_rgb(0_0_0/0.12)] transition-transform duration-700 ease-(--ease-out-soft) group-hover:-translate-y-2'
        >
          <div className='border-border flex h-7 items-center gap-1.25 border-b px-3'>
            <span className='bg-line-strong size-1.75 rounded-full' />
            <span className='bg-line-strong size-1.75 rounded-full' />
            <span className='bg-line-strong size-1.75 rounded-full' />
          </div>
          <div className='flex flex-col gap-2.25 p-5'>
            <div className='h-3 w-[55%] rounded bg-(--tone)' />
            <div className='bg-border h-1.5 w-[80%] rounded-sm' />
            <div className='bg-border h-1.5 w-[62%] rounded-sm' />
          </div>
        </div>
      )}
    </div>
  );
}
