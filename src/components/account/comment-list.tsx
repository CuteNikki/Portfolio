'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';

import { Trash2Icon } from 'lucide-react';
import { toast } from 'sonner';

import { deleteComment } from '@/actions/post';

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

export interface OwnComment {
  id: string;
  excerpt: string;
  date: string;
  postTitle: string;
  postHref: string;
  postSlug: string;
  isReply: boolean;
}

// Your comments, newest first, each linking to its post, with a button to delete it after a confirmation
export function CommentList({ comments }: { comments: OwnComment[] }) {
  const [pending, startTransition] = useTransition();
  const [deleting, setDeleting] = useState<OwnComment | null>(null);

  if (comments.length === 0) {
    return (
      <p className='text-muted-foreground text-sm'>
        You haven’t commented yet.
      </p>
    );
  }

  const confirm = () => {
    const comment = deleting;
    if (!comment) return;
    startTransition(async () => {
      try {
        const formData = new FormData();
        formData.set('commentId', comment.id);
        formData.set('postSlug', comment.postSlug);
        await deleteComment(formData);
        toast.success('Comment deleted');
      } catch (error) {
        toast.error('The comment couldn’t be deleted', {
          description: error instanceof Error ? error.message : 'Unknown error',
        });
      } finally {
        setDeleting(null);
      }
    });
  };

  return (
    <>
      <ul className='flex flex-col divide-y'>
        {comments.map((comment) => (
          <li key={comment.id} className='flex items-start gap-4 py-3.5'>
            <div className='min-w-0 flex-1'>
              <p className='text-muted-foreground text-xs'>
                {comment.isReply ? 'Reply on ' : 'On '}
                <Link
                  href={comment.postHref}
                  className='text-foreground hover:text-primary-text'
                >
                  {comment.postTitle}
                </Link>{' '}
                · {comment.date}
              </p>
              <p className='text-body mt-1 text-sm wrap-break-word'>
                {comment.excerpt}
              </p>
            </div>
            <Button
              variant='destructive'
              size='icon-sm'
              aria-label={`Delete your comment on ${comment.postTitle}`}
              disabled={pending}
              onClick={() => setDeleting(comment)}
            >
              <Trash2Icon />
            </Button>
          </li>
        ))}
      </ul>

      <AlertDialog
        open={deleting !== null}
        onOpenChange={(open) => !open && setDeleting(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this comment?</AlertDialogTitle>
            <AlertDialogDescription>
              It’s removed from “{deleting?.postTitle}”, together with any
              replies to it.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant='destructive'
              onClick={confirm}
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
