'use client';

import { useEffect, useEffectEvent, useId, useRef, useState } from 'react';

import {
  ImageUpIcon,
  MoonIcon,
  RefreshCwIcon,
  SunIcon,
  Trash2Icon,
} from 'lucide-react';

import { discardImages } from '@/actions/upload';

import { imageUrl } from '@/lib/images';
import { pictureMarkdown } from '@/lib/markdown-edit';
import { toast } from '@/lib/toast';
import { uploadImage } from '@/lib/upload-image';

import { DropArea, Progress } from '@/components/dashboard/shared/image-fields';
import { Button, buttonVariants } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

const message = (error: unknown) =>
  error instanceof Error ? error.message : 'Unknown error';

type Slot = { url: string | null; progress: number | null };
const EMPTY: Slot = { url: null, progress: null };

// One of the picture's two versions: a place to drop or pick it, then a preview with Replace and Remove. It keeps the
// same size throughout, so nothing below it moves while a picture uploads.
function PictureSlot({
  kind,
  slot,
  onFiles,
  onRemove,
}: {
  kind: 'light' | 'dark';
  slot: Slot;
  onFiles: (files: File[]) => void;
  onRemove: () => void;
}) {
  const labelId = useId();
  const Icon = kind === 'light' ? SunIcon : MoonIcon;
  const label = kind === 'light' ? 'Picture' : 'For dark themes';
  const hint =
    kind === 'light'
      ? 'Drop a picture or click.'
      : 'Optional. Shown instead in dark themes.';

  return (
    <div className='flex min-w-0 flex-col gap-2'>
      <span
        id={labelId}
        className='flex items-center gap-1.5 text-sm font-medium'
      >
        <Icon className='size-3.5 text-muted-foreground' />
        {label}
      </span>
      {slot.url && slot.progress === null ? (
        <figure
          aria-labelledby={labelId}
          className='relative aspect-16/10 overflow-hidden rounded-xl border bg-muted'
        >
          {/* eslint-disable-next-line @next/next/no-img-element -- the small copy is plenty for a preview */}
          <img
            src={imageUrl(slot.url, 'thumb')}
            alt=''
            className='size-full object-cover'
          />
          {/* Over the picture rather than under it, so the slot is the same size with or without one */}
          <div className='absolute inset-x-2 bottom-2 flex justify-end gap-2'>
            <DropArea
              look='button'
              onFiles={onFiles}
              className={buttonVariants({ variant: 'outline', size: 'sm' })}
            >
              <RefreshCwIcon />
              Replace
            </DropArea>
            <Button
              type='button'
              variant='outline'
              size='sm'
              // Solid, unlike the destructive style, so it reads over the picture
              className='text-destructive hover:text-destructive'
              onClick={onRemove}
            >
              <Trash2Icon />
              Remove
            </Button>
          </div>
        </figure>
      ) : (
        <DropArea
          disabled={slot.progress !== null}
          onFiles={onFiles}
          className='aspect-16/10 w-full gap-1.5 bg-muted/30 px-4 py-3 text-center'
        >
          {slot.progress !== null ? (
            <Progress value={slot.progress} />
          ) : (
            <>
              <span className='grid size-10 place-items-center rounded-lg bg-muted text-foreground'>
                <ImageUpIcon className='size-5' />
              </span>
              <span className='text-xs text-balance'>{hint}</span>
            </>
          )}
        </DropArea>
      )}
    </div>
  );
}

/**
 * Adds a picture to a post's or project's text: a picture, optionally a version of it for dark themes, a description
 * for screen readers and an optional caption. `file` starts the picture off with one that was pasted or dropped into
 * the text. Pictures uploaded here but not inserted are deleted again when the dialog closes.
 */
export function PictureDialog({
  open,
  file,
  onOpenChange,
  onInsert,
}: {
  open: boolean;
  file: File | null;
  onOpenChange: (open: boolean) => void;
  onInsert: (markdown: string) => void;
}) {
  const [light, setLight] = useState<Slot>(EMPTY);
  const [dark, setDark] = useState<Slot>(EMPTY);
  const [alt, setAlt] = useState('');
  const [caption, setCaption] = useState('');
  // Every picture uploaded while the dialog is open, so the ones not inserted can go when it closes
  const uploaded = useRef<string[]>([]);
  const started = useRef<File | null>(null);
  const altId = useId();
  const captionId = useId();

  const upload = async (
    [picked]: File[],
    current: Slot,
    set: (slot: Slot) => void
  ) => {
    set({ url: current.url, progress: 0 });
    try {
      const url = await uploadImage(picked, (progress) =>
        set({ url: current.url, progress })
      );
      uploaded.current.push(url);
      // The one it replaces was only ever in this dialog
      if (current.url) void discardImages([current.url]);
      set({ url, progress: null });
    } catch (error) {
      toast.error("The picture couldn't be uploaded", {
        description: message(error),
      });
      set(current);
    }
  };

  // A picture pasted or dropped into the text goes straight into the first slot
  const startWith = useEffectEvent((picked: File) => {
    started.current = picked;
    void upload([picked], EMPTY, setLight);
  });
  useEffect(() => {
    if (open && file && started.current !== file) startWith(file);
  }, [open, file]);

  const close = (inserted: string[] = []) => {
    const unused = uploaded.current.filter((url) => !inserted.includes(url));
    if (unused.length > 0) void discardImages(unused);
    uploaded.current = [];
    started.current = null;
    setLight(EMPTY);
    setDark(EMPTY);
    setAlt('');
    setCaption('');
    onOpenChange(false);
  };

  const busy = light.progress !== null || dark.progress !== null;
  const ready = !!light.url && alt.trim() !== '' && !busy;

  const insert = () => {
    if (!light.url || !ready) return;
    onInsert(
      pictureMarkdown({ url: light.url, darkUrl: dark.url, alt, caption })
    );
    close([light.url, dark.url ?? '']);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) close();
      }}
    >
      <DialogContent className='sm:max-w-2xl'>
        <DialogHeader>
          <DialogTitle>Add a picture</DialogTitle>
          <DialogDescription>
            It goes in at the cursor, as its own paragraph.
          </DialogDescription>
        </DialogHeader>

        <form
          className='flex flex-col gap-5'
          onSubmit={(event) => {
            event.preventDefault();
            // React passes events up through the dialog's portal, and this mustn't submit the post's form around it
            event.stopPropagation();
            insert();
          }}
        >
          <div className='grid gap-4 sm:grid-cols-2'>
            <PictureSlot
              kind='light'
              slot={light}
              onFiles={(files) => upload(files, light, setLight)}
              onRemove={() => {
                if (light.url) void discardImages([light.url]);
                setLight(EMPTY);
              }}
            />
            <PictureSlot
              kind='dark'
              slot={dark}
              onFiles={(files) => upload(files, dark, setDark)}
              onRemove={() => {
                if (dark.url) void discardImages([dark.url]);
                setDark(EMPTY);
              }}
            />
          </div>

          <div className='flex flex-col gap-2'>
            <label htmlFor={altId} className='text-sm font-medium'>
              Description
            </label>
            <Input
              id={altId}
              value={alt}
              onChange={(event) => setAlt(event.target.value)}
              placeholder='What the picture shows, for screen readers'
              required
            />
          </div>

          <div className='flex flex-col gap-2'>
            <label htmlFor={captionId} className='text-sm font-medium'>
              Caption
            </label>
            <Input
              id={captionId}
              value={caption}
              onChange={(event) => setCaption(event.target.value)}
              placeholder='Optional. Shown under the picture'
            />
          </div>

          <DialogFooter>
            <Button type='button' variant='outline' onClick={() => close()}>
              Cancel
            </Button>
            <Button type='submit' disabled={!ready}>
              Insert picture
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
