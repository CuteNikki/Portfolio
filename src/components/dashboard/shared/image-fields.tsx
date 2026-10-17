'use client';

import { useId, useRef, useState } from 'react';

import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ImageUpIcon,
  LoaderCircleIcon,
  RefreshCwIcon,
  Trash2Icon,
} from 'lucide-react';
import { toast } from '@/lib/toast';

import { discardImages } from '@/actions/upload';

import { imageUrl, MAX_GALLERY_PICTURES } from '@/lib/images';
import { uploadImage } from '@/lib/upload-image';
import { cn } from '@/lib/utils';

import { Button, buttonVariants } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export interface GalleryImage {
  url: string;
  alt: string;
}

// Picks picture files with a button, or by dropping them onto the area. `children` is what the area shows. As a
// `button`, it looks like the outline buttons next to it but still takes a dropped picture.
function DropArea({
  look = 'area',
  multiple,
  disabled,
  onFiles,
  className,
  children,
}: {
  look?: 'area' | 'button';
  multiple?: boolean;
  disabled?: boolean;
  onFiles: (files: File[]) => void;
  className?: string;
  children: React.ReactNode;
}) {
  const input = useRef<HTMLInputElement>(null);
  const [over, setOver] = useState(false);

  const pick = (list: FileList | null) => {
    const files = [...(list ?? [])].filter((file) =>
      file.type.startsWith('image/'),
    );
    if (files.length > 0) onFiles(multiple ? files : files.slice(0, 1));
  };

  return (
    <>
      <input
        ref={input}
        type='file'
        accept='image/*'
        multiple={multiple}
        hidden
        onChange={(event) => {
          pick(event.target.files);
          event.target.value = '';
        }}
      />
      <button
        type='button'
        disabled={disabled}
        onClick={() => input.current?.click()}
        onDragOver={(event) => {
          event.preventDefault();
          setOver(true);
        }}
        onDragLeave={() => setOver(false)}
        onDrop={(event) => {
          event.preventDefault();
          setOver(false);
          pick(event.dataTransfer.files);
        }}
        className={cn(
          look === 'button'
            ? buttonVariants({ variant: 'outline' })
            : 'text-muted-foreground hover:border-line-strong hover:text-foreground flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed text-[13px] transition-colors disabled:pointer-events-none',
          over && 'border-primary-text bg-primary-soft text-foreground',
          className,
        )}
      >
        {children}
      </button>
    </>
  );
}

function Progress({ value }: { value: number }) {
  return (
    <span className='flex flex-col items-center gap-2'>
      <LoaderCircleIcon className='size-5 animate-spin' />
      <span>Uploading {Math.round(value * 100)}%</span>
      <span className='bg-muted h-1 w-32 overflow-hidden rounded-full'>
        <span
          className='bg-primary block h-full transition-[width]'
          style={{ width: `${value * 100}%` }}
        />
      </span>
    </span>
  );
}

const message = (error: unknown) =>
  error instanceof Error ? error.message : 'Unknown error';

// The words and form field for each kind of cover picture
const COVER_KINDS = {
  cover: {
    field: 'coverUrl',
    label: 'Cover picture',
    upload: 'Upload a cover',
    hint: 'Drop a picture or click. Shown on cards and in link previews.',
  },
  // A project's cover for dark themes
  dark: {
    field: 'coverDarkUrl',
    label: 'Cover for dark themes',
    upload: 'Upload a dark cover',
    hint: 'Optional. Shown instead of the cover in dark themes.',
  },
  // A post's simpler picture for small places
  thumbnail: {
    field: 'thumbnailUrl',
    label: 'Thumbnail',
    upload: 'Upload a thumbnail',
    hint: 'Optional. Shown instead of the cover in post lists and link previews, where pictures are small.',
  },
} as const;

// A post's or project's cover picture, or one of its variants (see COVER_KINDS). The address goes to the form in a
// hidden field named after the kind.
export function CoverField({
  defaultValue,
  kind = 'cover',
}: {
  defaultValue: string | null;
  kind?: keyof typeof COVER_KINDS;
}) {
  const words = COVER_KINDS[kind];
  const [url, setUrl] = useState(defaultValue);
  const [progress, setProgress] = useState<number | null>(null);
  const labelId = useId();

  const upload = async ([file]: File[]) => {
    setProgress(0);
    try {
      const uploaded = await uploadImage(file, setProgress);
      // A cover uploaded in this form and then replaced was never saved, so it can go right away
      if (url && url !== defaultValue) void discardImages([url]);
      setUrl(uploaded);
    } catch (error) {
      toast.error("The picture couldn't be uploaded", {
        description: message(error),
      });
    } finally {
      setProgress(null);
    }
  };

  const remove = () => {
    if (url && url !== defaultValue) void discardImages([url]);
    setUrl(null);
  };

  return (
    <div className='flex flex-col gap-2'>
      <span id={labelId} className='text-sm font-medium'>
        {words.label}
      </span>
      <input type='hidden' name={words.field} value={url ?? ''} />
      {url && progress === null ? (
        <figure aria-labelledby={labelId} className='flex flex-col gap-2'>
          <div className='bg-muted relative aspect-2/1 overflow-hidden rounded-xl border'>
            {/* The small copy is plenty for a preview */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageUrl(url, 'thumb')}
              alt=''
              className='size-full object-cover object-top'
            />
          </div>
          <div className='grid grid-cols-2 gap-2'>
            <DropArea look='button' onFiles={upload}>
              <RefreshCwIcon />
              Replace
            </DropArea>
            <Button type='button' variant='destructive' onClick={remove}>
              <Trash2Icon />
              Remove
            </Button>
          </div>
        </figure>
      ) : (
        <DropArea
          disabled={progress !== null}
          onFiles={upload}
          className='bg-muted/30 aspect-2/1 w-full gap-1.5 px-6 py-5 text-center'
        >
          {progress !== null ? (
            <Progress value={progress} />
          ) : (
            <>
              <span className='bg-muted text-foreground grid size-10 place-items-center rounded-lg'>
                <ImageUpIcon className='size-5' />
              </span>
              <span className='text-foreground font-semibold'>
                {words.upload}
              </span>
              <span className='text-xs text-balance'>{words.hint}</span>
            </>
          )}
        </DropArea>
      )}
    </div>
  );
}

// A project's further pictures, each with a description for screen readers, in the order they're shown. They go to
// the form as JSON in a hidden `gallery` field.
export function GalleryField({
  defaultValue,
}: {
  defaultValue: GalleryImage[];
}) {
  const [images, setImages] = useState(defaultValue);
  const [progress, setProgress] = useState<number | null>(null);
  const saved = new Set(defaultValue.map(({ url }) => url));

  const upload = async (files: File[]) => {
    const room = MAX_GALLERY_PICTURES - images.length;
    if (files.length > room) {
      toast.warning(
        `A project can have ${MAX_GALLERY_PICTURES} pictures; the first ${room} are added.`,
      );
    }
    const batch = files.slice(0, room);

    for (const [index, file] of batch.entries()) {
      try {
        const url = await uploadImage(file, (p) =>
          setProgress((index + p) / batch.length),
        );
        setImages((current) => [...current, { url, alt: '' }]);
      } catch (error) {
        toast.error(`"${file.name}" couldn't be uploaded`, {
          description: message(error),
        });
      }
    }
    setProgress(null);
  };

  const move = (from: number, to: number) =>
    setImages((current) => {
      const next = [...current];
      const [image] = next.splice(from, 1);
      next.splice(to, 0, image);
      return next;
    });

  const remove = (index: number) => {
    const { url } = images[index];
    if (!saved.has(url)) void discardImages([url]);
    setImages((current) => current.filter((_, i) => i !== index));
  };

  return (
    <div className='flex flex-col gap-2'>
      <span className='text-sm font-medium'>More pictures</span>
      <input type='hidden' name='gallery' value={JSON.stringify(images)} />
      <ul className='grid gap-3 sm:grid-cols-2 lg:grid-cols-3'>
        {images.map((image, index) => (
          <li
            key={image.url}
            className='bg-card flex flex-col gap-2 rounded-xl border p-2'
          >
            <div className='bg-muted relative aspect-16/10 overflow-hidden rounded-lg'>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imageUrl(image.url, 'thumb')}
                alt=''
                className='size-full object-cover'
              />
            </div>
            <label className='sr-only' htmlFor={`gallery-alt-${index}`}>
              Description of picture {index + 1}
            </label>
            <Input
              id={`gallery-alt-${index}`}
              placeholder='What the picture shows'
              value={image.alt}
              onChange={(event) =>
                setImages((current) =>
                  current.map((img, i) =>
                    i === index ? { ...img, alt: event.target.value } : img,
                  ),
                )
              }
            />
            <div className='flex gap-1'>
              <Button
                type='button'
                variant='outline'
                size='icon-sm'
                aria-label={`Move picture ${index + 1} earlier`}
                disabled={index === 0}
                onClick={() => move(index, index - 1)}
              >
                <ArrowLeftIcon />
              </Button>
              <Button
                type='button'
                variant='outline'
                size='icon-sm'
                aria-label={`Move picture ${index + 1} later`}
                disabled={index === images.length - 1}
                onClick={() => move(index, index + 1)}
              >
                <ArrowRightIcon />
              </Button>
              <Button
                type='button'
                variant='destructive'
                size='icon-sm'
                className='ml-auto'
                aria-label={`Remove picture ${index + 1}`}
                onClick={() => remove(index)}
              >
                <Trash2Icon />
              </Button>
            </div>
          </li>
        ))}
        {images.length < MAX_GALLERY_PICTURES && (
          <li>
            <DropArea
              multiple
              disabled={progress !== null}
              onFiles={upload}
              className='bg-muted/30 aspect-16/10 h-full min-h-40 w-full gap-1.5 px-6 py-5 text-center'
            >
              {progress !== null ? (
                <Progress value={progress} />
              ) : (
                <>
                  <span className='bg-muted text-foreground grid size-10 place-items-center rounded-lg'>
                    <ImageUpIcon className='size-5' />
                  </span>
                  <span className='text-foreground font-semibold'>
                    Add pictures
                  </span>
                  <span className='text-xs'>Drop them here or click</span>
                </>
              )}
            </DropArea>
          </li>
        )}
      </ul>
    </div>
  );
}
