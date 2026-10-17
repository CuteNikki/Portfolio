'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';

import { LoaderCircleIcon, Trash2Icon } from 'lucide-react';
import { toast } from '@/lib/toast';

import { removePicture } from '@/actions/upload';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';

// Takes a picture off the post or project that uses it and deletes it from storage, after asking. Sits in the corner
// of the picture's card on the Media page, and shows while the card is hovered or the button has focus.
export function RemovePictureButton({
  url,
  usedBy,
  usage,
}: {
  url: string;
  usedBy: string;
  // What the picture is, e.g. "Post cover"
  usage: string;
}) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [pending, startTransition] = useTransition();

  const remove = () =>
    startTransition(async () => {
      try {
        const result = await removePicture(url);
        if ('error' in result) {
          toast.error("The picture wasn't deleted", {
            description: result.error,
          });
          return;
        }
        toast.success('Picture deleted', {
          description: `It's no longer on "${usedBy}".`,
        });
        router.refresh();
      } catch {
        toast.error("The picture wasn't deleted. Please try again.");
      } finally {
        setConfirming(false);
      }
    });

  return (
    <>
      <Button
        variant='outline'
        size='icon-sm'
        aria-label={`Delete the ${usage.toLowerCase()} of ${usedBy}`}
        onClick={() => setConfirming(true)}
        disabled={pending}
        className='bg-card/95 text-destructive hover:bg-card hover:text-destructive absolute top-2 right-2 shadow-sm backdrop-blur-sm transition-opacity group-hover/picture:opacity-100 focus-visible:opacity-100 [@media(hover:hover)]:opacity-0'
      >
        {pending ? (
          <LoaderCircleIcon className='animate-spin' />
        ) : (
          <Trash2Icon />
        )}
      </Button>
      <AlertDialog open={confirming} onOpenChange={setConfirming}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this picture?</AlertDialogTitle>
            <AlertDialogDescription>
              It's the {usage.toLowerCase()} of "{usedBy}". It will be taken off
              there and deleted from storage, and this can't be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant='destructive'
              onClick={remove}
              disabled={pending}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
