'use client';

import { useTransition } from 'react';
import { toast } from '@/lib/toast';

import { deleteUser } from '@/actions/user';

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

// Asks before deleting someone, from the users table or their page
export function DeleteUserDialog({
  user,
  open,
  onOpenChange,
  onDeleted,
}: {
  user: { id: string; username: string };
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDeleted?: () => void;
}) {
  const [pending, startTransition] = useTransition();

  const remove = () =>
    startTransition(async () => {
      const formData = new FormData();
      formData.append('userId', user.id);
      try {
        const { error } = await deleteUser(formData);
        if (error) {
          toast.error('The user wasn’t deleted', { description: error });
          return;
        }
        toast.success(`${user.username} deleted`);
        onDeleted?.();
      } catch {
        toast.error('The user wasn’t deleted. Please try again.');
      } finally {
        onOpenChange(false);
      }
    });

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete {user.username}?</AlertDialogTitle>
          <AlertDialogDescription>
            Their comments and the replies to them are deleted, and they’re
            taken off author lists. Posts and projects stay. This can’t be
            undone.
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
  );
}
