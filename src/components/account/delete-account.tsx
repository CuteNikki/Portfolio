'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';

import { Trash2Icon } from 'lucide-react';
import { toast } from '@/lib/toast';

import { deleteAccount } from '@/actions/account';

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

// Deleting the account asks you to type your username first, since it can't be undone
export function DeleteAccount({
  username,
  commentCount,
}: {
  username: string;
  commentCount: number;
}) {
  const router = useRouter();
  const [typed, setTyped] = useState('');
  const [pending, startTransition] = useTransition();
  const matches = typed.trim().toLowerCase() === username.toLowerCase();

  // "Your profile, your 3 comments and all signed-in devices", leaving out comments when there are none
  const removed = [
    'Your profile',
    commentCount === 1
      ? 'your comment'
      : commentCount > 1
        ? `your ${commentCount} comments`
        : null,
  ]
    .filter(Boolean)
    .join(', ')
    .concat(' and all signed-in devices');

  const confirm = () =>
    startTransition(async () => {
      try {
        const { error } = await deleteAccount(typed);
        if (error) {
          toast.error("Your account couldn't be deleted", {
            description: error,
          });
          return;
        }
        toast.success('Your account is deleted');
        router.push('/');
        router.refresh();
      } catch (error) {
        toast.error("Your account couldn't be deleted", {
          description: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    });

  return (
    <AlertDialog onOpenChange={() => setTyped('')}>
      <AlertDialogTrigger asChild>
        <Button variant='destructive'>Delete</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogMedia className='bg-destructive/10 text-destructive'>
            <Trash2Icon />
          </AlertDialogMedia>
          <AlertDialogTitle>Delete your account?</AlertDialogTitle>
          <AlertDialogDescription>
            {removed} are removed straight away. You can sign in with Discord
            again later, but you'll start fresh.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <form
          className='flex flex-col gap-2'
          onSubmit={(event) => {
            event.preventDefault();
            if (matches) confirm();
          }}
        >
          <label htmlFor='confirm-username' className='text-[13px]'>
            Type <strong>{username}</strong> to confirm
          </label>
          <Input
            id='confirm-username'
            autoComplete='off'
            spellCheck={false}
            value={typed}
            onChange={(event) => setTyped(event.target.value)}
          />
          <AlertDialogFooter className='mt-2'>
            <AlertDialogCancel type='button'>Cancel</AlertDialogCancel>
            <Button
              type='submit'
              variant='destructive'
              disabled={!matches || pending}
            >
              Delete account
            </Button>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
