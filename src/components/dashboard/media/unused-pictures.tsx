'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';

import {
  ChevronDownIcon,
  ImageOffIcon,
  LoaderCircleIcon,
  Trash2Icon,
} from 'lucide-react';
import { toast } from '@/lib/toast';
import { cn } from '@/lib/utils';

import { deleteUnusedImage } from '@/actions/upload';

import { ContextMenuFor } from '@/components/common/menu-at-point';
import { StoredImage } from '@/components/common/stored-image';
import { CleanUpButton } from '@/components/dashboard/media/clean-up';
import { PictureMenuItems } from '@/components/dashboard/media/picture-menu-items';
import { Button } from '@/components/ui/button';
import {
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';

export interface UnusedPicture {
  url: string;
  // Milliseconds since 1970
  uploadedAt: number;
  // Whether every copy exists, so a thumbnail can be shown
  complete: boolean;
}

// The Media page's strip of pictures nothing uses, with Clean up for all of them and View all to see and delete them
// one by one
export function UnusedPictures({ pictures }: { pictures: UnusedPicture[] }) {
  const [open, setOpen] = useState(false);
  const count = pictures.length;
  const previews = pictures.filter(({ complete }) => complete).slice(0, 4);

  return (
    <section className='bg-card flex flex-col rounded-xl border'>
      <div className='flex flex-col gap-4 px-5 py-4 sm:flex-row sm:items-center'>
        {/* A glimpse of them beside the text; on phones the text needs the room, and View all shows them */}
        <ul className='hidden -space-x-3 sm:flex' aria-hidden>
          {previews.map(({ url }) => (
            <li
              key={url}
              className='bg-muted ring-card rounded-thumb relative h-7 w-14 overflow-hidden ring-2'
            >
              <StoredImage
                url={url}
                alt=''
                fill
                sizes='56px'
                className='object-cover object-top'
              />
            </li>
          ))}
        </ul>
        <div className='min-w-0 flex-1'>
          <h2 className='text-[15px] font-bold'>
            {count === 1 ? '1 unused picture' : `${count} unused pictures`}
          </h2>
          <p className='text-muted-foreground mt-0.5 text-xs'>
            In storage but on no post or project, e.g. from a form that was left
            without saving. They are cleared out after a day.
          </p>
        </div>
        <div className='grid grid-cols-2 gap-2 sm:flex'>
          <Button
            variant='outline'
            aria-expanded={open}
            aria-controls='unused-pictures'
            onClick={() => setOpen((value) => !value)}
          >
            {open ? 'Hide' : 'View all'}
            <ChevronDownIcon
              className={cn('transition-transform', open && 'rotate-180')}
            />
          </Button>
          <CleanUpButton count={count} />
        </div>
      </div>

      {open && (
        <ul
          id='unused-pictures'
          className='grid gap-3 border-t p-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'
        >
          {pictures.map((picture) => (
            <UnusedPictureCard key={picture.url} picture={picture} />
          ))}
        </ul>
      )}
    </section>
  );
}

const relativeTime = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });

// "3 hours ago", "yesterday", "2 weeks ago"
function uploadedAgo(time: number) {
  const seconds = (time - Date.now()) / 1000;
  const units = [
    ['year', 365 * 24 * 3600],
    ['month', 30 * 24 * 3600],
    ['week', 7 * 24 * 3600],
    ['day', 24 * 3600],
    ['hour', 3600],
    ['minute', 60],
  ] as const;
  for (const [unit, length] of units) {
    if (Math.abs(seconds) >= length) {
      return relativeTime.format(Math.round(seconds / length), unit);
    }
  }
  return 'just now';
}

// One unused picture, with when it was uploaded and a button that deletes it right away. Nothing uses it, so nothing
// changes on the site. Right-clicking it can also open or copy the picture.
function UnusedPictureCard({ picture }: { picture: UnusedPicture }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const remove = () =>
    startTransition(async () => {
      try {
        const result = await deleteUnusedImage(picture.url);
        if ('error' in result) {
          toast.error("The picture wasn't deleted", {
            description: result.error,
          });
          return;
        }
        router.refresh();
      } catch {
        toast.error("The picture wasn't deleted. Please try again.");
      }
    });

  return (
    <li
      className={cn(
        'bg-background flex flex-col overflow-hidden rounded-lg border transition-opacity',
        pending && 'opacity-50',
      )}
    >
      <ContextMenuFor>
        {picture.complete && (
          <>
            <PictureMenuItems url={picture.url} />
            <DropdownMenuSeparator />
          </>
        )}
        <DropdownMenuItem
          variant='destructive'
          disabled={pending}
          onSelect={remove}
        >
          <Trash2Icon />
          Delete
        </DropdownMenuItem>
      </ContextMenuFor>
      <span className='bg-muted relative aspect-2/1'>
        {picture.complete ? (
          <StoredImage
            url={picture.url}
            alt=''
            fill
            sizes='(min-width: 1280px) 16vw, (min-width: 1024px) 20vw, (min-width: 768px) 28vw, (min-width: 640px) 44vw, 100vw'
            className='object-cover object-top'
          />
        ) : (
          // An upload that never finished has no thumbnail to show
          <span className='text-muted-foreground absolute inset-0 grid place-items-center'>
            <ImageOffIcon className='size-5' />
          </span>
        )}
      </span>
      <span className='flex items-center justify-between gap-2 py-1.5 pr-1.5 pl-3'>
        <span className='text-muted-foreground truncate text-xs'>
          Uploaded {uploadedAgo(picture.uploadedAt)}
        </span>
        <Button
          variant='destructive'
          size='icon-xs'
          aria-label='Delete this unused picture'
          onClick={remove}
          disabled={pending}
          className='shrink-0'
        >
          {pending ? (
            <LoaderCircleIcon className='animate-spin' />
          ) : (
            <Trash2Icon />
          )}
        </Button>
      </span>
    </li>
  );
}
