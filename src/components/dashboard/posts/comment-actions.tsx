'use client';

import { useState } from 'react';
import { toast } from 'sonner';

import {
  ClipboardCopyIcon,
  CornerDownRightIcon,
  EditIcon,
  MoreHorizontalIcon,
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
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function CommentActions({
  commentId,
  commentAuthorId,
  commentAuthorDiscordId,
  postSlug,
  userId,
  isAdmin,
  setEditingCommentIdAction,
  setShowReplyFormAction,
}: {
  commentId: string;
  commentAuthorId: string;
  commentAuthorDiscordId: string;
  postSlug: string;
  userId: string;
  isAdmin: boolean;
  setEditingCommentIdAction: (commentId: string | null) => void;
  setShowReplyFormAction: (show: boolean) => void;
}) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleDelete = () => {
    const formData = new FormData();
    formData.append('commentId', commentId);
    formData.append('postSlug', postSlug);

    deleteComment(formData)
      .then(() => {
        toast.success('Comment deleted successfully');
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
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant='ghost' size='icon-sm'>
            <MoreHorizontalIcon />
            <span className='sr-only'>Open comment actions menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end'>
          <DropdownMenuItem onClick={() => setShowReplyFormAction(true)}>
            <CornerDownRightIcon />
            Reply
          </DropdownMenuItem>

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
              Edit Comment
            </DropdownMenuItem>
          )}

          {(userId === commentAuthorId || isAdmin) && (
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
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this
              comment.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction variant='destructive' onClick={handleDelete}>
              Delete Comment
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
