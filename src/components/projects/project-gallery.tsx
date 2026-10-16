'use client';

import { useRef, useState } from 'react';

import { ChevronLeftIcon, ChevronRightIcon, XIcon } from 'lucide-react';
import { Dialog } from 'radix-ui';

import { imageUrl } from '@/lib/images';

import { StoredImage } from '@/components/common/stored-image';
import { Button } from '@/components/ui/button';

export interface GalleryPicture {
  url: string;
  alt: string;
}

// A project's further pictures as a grid. Each opens full size in a viewer, where the arrow keys and buttons move
// between them and Escape closes it.
export function ProjectGallery({
  pictures,
  title,
}: {
  pictures: GalleryPicture[];
  // The project's title, for the viewer's label and pictures without a description
  title: string;
}) {
  const [open, setOpen] = useState<number | null>(null);
  // The thumbnail the viewer was opened from, to give focus back to on closing
  const opener = useRef<HTMLButtonElement | null>(null);
  const count = pictures.length;
  const current = open === null ? null : pictures[open];

  const step = (by: number) =>
    setOpen((index) => (index === null ? null : (index + by + count) % count));

  const describe = (picture: GalleryPicture, index: number) =>
    picture.alt || `${title}, picture ${index + 1} of ${count}`;

  return (
    <>
      <ul className='grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4'>
        {pictures.map((picture, index) => (
          <li key={picture.url}>
            <button
              type='button'
              onClick={(event) => {
                opener.current = event.currentTarget;
                setOpen(index);
              }}
              aria-label={`Open picture ${index + 1}: ${describe(picture, index)}`}
              className='bg-muted ring-foreground/0 hover:ring-foreground/20 focus-visible:ring-ring relative block aspect-16/10 w-full cursor-zoom-in overflow-hidden rounded-xl ring-1 transition-shadow ring-inset'
            >
              <StoredImage
                url={picture.url}
                alt=''
                fill
                sizes='(min-width: 1200px) 276px, (min-width: 1024px) calc(25vw - 28px), calc(50vw - 24px)'
                className='object-cover'
              />
            </button>
          </li>
        ))}
      </ul>

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
                  {/* The large copy at its own size, fitted into the window */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    key={current.url}
                    src={imageUrl(current.url, 'large')}
                    alt={describe(current, open)}
                    className='max-h-[calc(100svh-9rem)] w-auto max-w-full rounded-xl object-contain shadow-2xl'
                  />
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
    </>
  );
}
