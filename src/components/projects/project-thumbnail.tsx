import { cn, toneFor } from '@/lib/utils';

import { StoredImage } from '@/components/common/stored-image';

// A project's cover in a little browser window on a panel tinted in the project's own colour, or until it has a cover,
// a drawing of one. Screenshots come in all sorts of light and dark, and the window and panel make them sit the same
// way in every theme. The picture always shows its full width, cut off at the bottom, so no text at its sides is lost.
// The window rises a little while the surrounding card, which needs the `group` class, is hovered.
export function ProjectThumbnail({
  title,
  coverUrl,
  coverDarkUrl,
  tone = toneFor(title),
  sizes,
  priority,
  className,
}: {
  title: string;
  coverUrl?: string | null;
  // Shown instead in dark themes
  coverDarkUrl?: string | null;
  // The project's colour (see projectTone); one from its title when left out
  tone?: string;
  // Passed to the image so the browser picks a fitting width, e.g. "(min-width: 1024px) 66vw, 100vw"
  sizes: string;
  priority?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'relative overflow-hidden bg-[color-mix(in_oklab,var(--tone)_14%,var(--card))]',
        className,
      )}
      style={{ '--tone': tone } as React.CSSProperties}
    >
      <div
        aria-hidden
        className='border-border bg-card absolute inset-x-[7%] top-[11%] -bottom-[12%] flex flex-col overflow-hidden rounded-lg border shadow-[0_16px_40px_rgb(0_0_0/0.14)] transition-transform duration-700 ease-(--ease-out-soft) group-hover:-translate-y-1.5'
      >
        <div className='border-border flex h-6 shrink-0 items-center gap-1.25 border-b px-3'>
          <span className='bg-line-strong size-1.75 rounded-full' />
          <span className='bg-line-strong size-1.75 rounded-full' />
          <span className='bg-line-strong size-1.75 rounded-full' />
        </div>
        {coverUrl ? (
          <StoredImage
            url={coverUrl}
            darkUrl={coverDarkUrl}
            alt=''
            sizes={sizes}
            priority={priority}
            className='block h-auto w-full'
          />
        ) : (
          <div className='flex flex-col gap-2.25 p-5'>
            <div className='h-3 w-[55%] rounded bg-(--tone)' />
            <div className='bg-border h-1.5 w-[80%] rounded-sm' />
            <div className='bg-border h-1.5 w-[62%] rounded-sm' />
          </div>
        )}
      </div>
    </div>
  );
}
