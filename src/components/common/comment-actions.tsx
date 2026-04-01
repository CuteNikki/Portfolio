'use client';

import {
  ClipboardCopyIcon,
  EditIcon,
  EllipsisVerticalIcon,
  Trash2Icon,
} from 'lucide-react';

import { deleteComment } from '@/actions/post';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';

export function CommentActions({
  commentId,
  commentAuthorId,
  commentAuthorDiscordId,
  postSlug,
  userId,
  isAdmin,
}: {
  commentId: string;
  commentAuthorId: string;
  commentAuthorDiscordId: string;
  postSlug: string;
  userId: string;
  isAdmin: boolean;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' size='icon-sm'>
          <EllipsisVerticalIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
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
              // @todo: Implement edit comment functionality
              toast.warning(
                'Edit comment functionality is not implemented yet',
              );
            }}
          >
            <EditIcon />
            Edit Comment
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        {(userId === commentAuthorId || isAdmin) && (
          <DropdownMenuItem
            onClick={() => {
              const formData = new FormData();
              formData.append('commentId', commentId);
              formData.append('postSlug', postSlug);

              deleteComment(formData)
                .then(() => toast.success('Comment deleted successfully'))
                .catch((error) => {
                  console.error('Error deleting comment:', error);
                  toast.error('Failed to delete comment');
                });
            }}
            variant='destructive'
          >
            <Trash2Icon />
            Delete
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
