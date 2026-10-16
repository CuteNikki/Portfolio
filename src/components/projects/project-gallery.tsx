'use client';

import { useRef, useState } from 'react';

import { StoredImage } from '@/components/common/stored-image';

export interface GalleryPicture {
  url: string;
  alt: string;
}

// A project's further pictures as a grid. Each opens full size in a viewer (see GalleryViewer).
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

  // The viewer's code loads on first interest, so the page doesn't download it up front
  const [Viewer, setViewer] = useState<
    typeof import('@/components/projects/gallery-viewer').default | null
  >(null);
  const loading = useRef(false);
  const loadViewer = () => {
    if (loading.current) return;
    loading.current = true;
    import('@/components/projects/gallery-viewer').then(
      (module) => setViewer(() => module.default),
      // Tried again on the next click
      () => {
        loading.current = false;
      },
    );
  };

  const describe = (picture: GalleryPicture, index: number) =>
    picture.alt || `${title}, picture ${index + 1} of ${count}`;

  return (
    <>
      <ul
        onPointerEnter={loadViewer}
        onFocus={loadViewer}
        className='grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4'
      >
        {pictures.map((picture, index) => (
          <li key={picture.url}>
            <button
              type='button'
              onClick={(event) => {
                opener.current = event.currentTarget;
                loadViewer();
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

      {Viewer && (
        <Viewer
          pictures={pictures}
          title={title}
          open={open}
          setOpen={setOpen}
          opener={opener}
          describe={describe}
        />
      )}
    </>
  );
}
