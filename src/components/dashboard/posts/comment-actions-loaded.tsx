'use client';

import { useState } from 'react';
import { toast } from '@/lib/toast';

import {
  ClipboardCopyIcon,
  CornerDownRightIcon,
  EditIcon,
  Trash2Icon,
} from 'lucide-react';

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
import {
  CommentActionsTrigger,
  type CommentActionsProps,
} from '@/components/dashboard/posts/comment-actions';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// The comment menu itself, loaded on first use by CommentActions
export default function CommentActionsLoaded({
  commentId,
  commentAuthorId,
  commentAuthorDiscordId,
  postSlug,
  userId,
  canModerate,
  setEditingCommentIdAction,
  setShowReplyFormAction,
  defaultOpen,
}: CommentActionsProps & { defaultOpen?: boolean }) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleDelete = () => {
    const formData = new FormData();
    formData.append('commentId', commentId);
    formData.append('postSlug', postSlug);

    deleteComment(formData)
      .then(({ error }) => {
        if (error)
          toast.error("The comment wasn't deleted", { description: error });
        else toast.success('Comment deleted');
        setShowDeleteDialog(false);
      })
      .catch((error) => {
        console.error('Error deleting comment:', error);
        toast.error('Failed to delete comment');
        setShowDeleteDialog(false);
      });
  };

  return (
    <>
      <DropdownMenu defaultOpen={defaultOpen}>
        <DropdownMenuTrigger asChild>
          <CommentActionsTrigger />
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end'>
          {setShowReplyFormAction && (
            <DropdownMenuItem onClick={() => setShowReplyFormAction(true)}>
              <CornerDownRightIcon />
              Reply
            </DropdownMenuItem>
          )}

          <DropdownMenuItem
            onClick={() =>
              navigator.clipboard
                .writeText(commentAuthorDiscordId)
                .then(() => {
                  toast.success('User ID copied to clipboard');
                })
                .catch((error) => {
                  console.error('Error copying User ID:', error);
                  toast.error('Failed to copy User ID');
                })
            }
          >
            <ClipboardCopyIcon />
            Copy User ID
          </DropdownMenuItem>

          {userId === commentAuthorId && (
            <DropdownMenuItem
              onClick={() => {
                setEditingCommentIdAction(commentId);
              }}
            >
              <EditIcon />
              Edit
            </DropdownMenuItem>
          )}

          {(userId === commentAuthorId || canModerate) && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                variant='destructive'
                onSelect={(e) => {
                  e.preventDefault();
                  setShowDeleteDialog(true);
                }}
              >
                <Trash2Icon />
                Delete
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this comment?</AlertDialogTitle>
            <AlertDialogDescription>
              It's removed together with any replies to it. This can't be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction variant='destructive' onClick={handleDelete}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
