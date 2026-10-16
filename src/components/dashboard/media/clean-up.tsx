'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';

import { LoaderCircleIcon, Trash2Icon } from 'lucide-react';
import { toast } from '@/lib/toast';

import { cleanUpImages } from '@/actions/upload';

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

// Deletes the pictures in storage that nothing uses, after asking
export function CleanUpButton({ count }: { count: number }) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [pending, startTransition] = useTransition();

  const cleanUp = () =>
    startTransition(async () => {
      try {
        const result = await cleanUpImages();
        if ('error' in result) {
          toast.error('The pictures weren’t deleted', {
            description: result.error,
          });
          return;
        }
        toast.success(
          result.removed === 1
            ? '1 unused picture deleted'
            : `${result.removed} unused pictures deleted`,
        );
        router.refresh();
      } catch {
        toast.error('The pictures weren’t deleted. Please try again.');
      } finally {
        setConfirming(false);
      }
    });

  return (
    <>
      <Button
        variant='destructive'
        onClick={() => setConfirming(true)}
        disabled={pending}
      >
        {pending ? (
          <LoaderCircleIcon className='animate-spin' />
        ) : (
          <Trash2Icon />
        )}
        Clean up
      </Button>
      <AlertDialog open={confirming} onOpenChange={setConfirming}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Delete{' '}
              {count === 1 ? 'the unused picture' : `${count} unused pictures`}?
            </AlertDialogTitle>
            <AlertDialogDescription>
              No post or project uses {count === 1 ? 'it' : 'them'}. A picture
              someone is adding in a form they haven’t saved yet counts as
              unused too, so save open forms first.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant='destructive'
              onClick={cleanUp}
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
