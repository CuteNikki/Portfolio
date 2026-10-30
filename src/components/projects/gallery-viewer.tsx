'use client';

import { ChevronLeftIcon, ChevronRightIcon, XIcon } from 'lucide-react';
import { Dialog } from 'radix-ui';

import { imageUrl } from '@/lib/images';
import { cn } from '@/lib/utils';

import type { GalleryPicture } from '@/components/projects/project-gallery';
import { Button } from '@/components/ui/button';

// The full-size viewer of ProjectGallery, loaded the first time someone opens or points at a picture. The arrow keys
// and buttons move between pictures and Escape closes it.
export default function GalleryViewer({
  pictures,
  title,
  open,
  setOpen,
  opener,
  describe,
}: {
  pictures: GalleryPicture[];
  title: string;
  open: number | null;
  setOpen: React.Dispatch<React.SetStateAction<number | null>>;
  // The thumbnail the viewer was opened from, to give focus back to on closing
  opener: React.RefObject<HTMLButtonElement | null>;
  describe: (picture: GalleryPicture, index: number) => string;
}) {
  const count = pictures.length;
  const current = open === null ? null : pictures[open];

  const step = (by: number) =>
    setOpen((index) => (index === null ? null : (index + by + count) % count));

  return (
    <Dialog.Root
      open={open !== null}
      onOpenChange={(isOpen) => !isOpen && setOpen(null)}
    >
      <Dialog.Portal>
        <Dialog.Overlay className='data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0 fixed inset-0 z-50 bg-black/80 backdrop-blur-sm' />
        <Dialog.Content
          onCloseAutoFocus={(event) => {
            event.preventDefault();
            opener.current?.focus();
          }}
          onKeyDown={(event) => {
            if (count < 2) return;
            if (event.key === 'ArrowLeft') step(-1);
            if (event.key === 'ArrowRight') step(1);
          }}
          className='data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 fixed inset-0 z-50 flex flex-col items-center justify-center gap-4 p-4 outline-none sm:p-10'
        >
          {current && open !== null && (
            <>
              <Dialog.Title className='sr-only'>
                {title}: picture {open + 1} of {count}
              </Dialog.Title>
              <Dialog.Description className='sr-only'>
                {describe(current, open)}
              </Dialog.Description>
              <figure className='flex max-h-full w-full max-w-6xl flex-col items-center gap-3'>
                {/* The large copy at its own size, fitted into the window, in the version for the theme */}
                {[current.url, current.darkUrl].map(
                  (url, version) =>
                    url && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        key={url}
                        src={imageUrl(url, 'large')}
                        alt={describe(current, open)}
                        className={cn(
                          'max-h-[calc(100svh-9rem)] w-auto max-w-full rounded-xl object-contain shadow-2xl',
                          current.darkUrl &&
                            (version === 0
                              ? 'dark:hidden'
                              : 'hidden dark:block'),
                        )}
                      />
                    ),
                )}
                <figcaption className='flex w-full items-center justify-between gap-4 text-sm text-white/85'>
                  <span>{current.alt}</span>
                  <span className='shrink-0 tabular-nums'>
                    {open + 1} / {count}
                  </span>
                </figcaption>
              </figure>

              {count > 1 && (
                <>
                  <Button
                    variant='outline'
                    size='icon-lg'
                    aria-label='Previous picture'
                    onClick={() => step(-1)}
                    className='absolute top-1/2 left-3 -translate-y-1/2 border-white/15 bg-black/50 text-white hover:bg-black/70 hover:text-white sm:left-6'
                  >
                    <ChevronLeftIcon />
                  </Button>
                  <Button
                    variant='outline'
                    size='icon-lg'
                    aria-label='Next picture'
                    onClick={() => step(1)}
                    className='absolute top-1/2 right-3 -translate-y-1/2 border-white/15 bg-black/50 text-white hover:bg-black/70 hover:text-white sm:right-6'
                  >
                    <ChevronRightIcon />
                  </Button>
                </>
              )}
              <Dialog.Close asChild>
                <Button
                  variant='outline'
                  size='icon-lg'
                  aria-label='Close'
                  className='absolute top-3 right-3 border-white/15 bg-black/50 text-white hover:bg-black/70 hover:text-white sm:top-6 sm:right-6'
                >
                  <XIcon />
                </Button>
              </Dialog.Close>
            </>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
