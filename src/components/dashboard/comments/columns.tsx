'use client';

import { useState, useTransition } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { EllipsisIcon, ExternalLinkIcon, Trash2Icon } from 'lucide-react';
import { toast } from 'sonner';

import { deleteComment } from '@/actions/post';

import { formatShortDate, proxiedAvatarUrl } from '@/lib/utils';

import { sortableHeader } from '@/components/dashboard/shared/column-parts';
import type { DashboardColumnDef } from '@/components/dashboard/shared/table-features';
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
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export interface CommentRow {
  id: string;
  excerpt: string;
  isReply: boolean;
  author: string;
  avatarUrl: string;
  postTitle: string;
  postSlug: string;
  postHref: string;
  createdAt: Date;
}

function CommentActions({ comment }: { comment: CommentRow }) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [pending, startTransition] = useTransition();

  const remove = () =>
    startTransition(async () => {
      const formData = new FormData();
      formData.set('commentId', comment.id);
      formData.set('postSlug', comment.postSlug);
      try {
        const { error } = await deleteComment(formData);
        if (error) {
          toast.error('The comment wasn’t deleted', { description: error });
          return;
        }
        toast.success('Comment deleted');
        router.refresh();
      } catch {
        toast.error('The comment wasn’t deleted. Please try again.');
      } finally {
        setConfirming(false);
      }
    });

  return (
    <div className='flex justify-end'>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant='ghost'
            size='icon-sm'
            aria-label={`More actions for ${comment.author}'s comment`}
          >
            <EllipsisIcon />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end' className='w-52'>
          <DropdownMenuItem asChild>
            <Link href={comment.postHref}>
              <ExternalLinkIcon />
              View on the post
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            variant='destructive'
            onSelect={() => setConfirming(true)}
          >
            <Trash2Icon />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={confirming} onOpenChange={setConfirming}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Delete {comment.author}’s comment?
            </AlertDialogTitle>
            <AlertDialogDescription>
              It’s removed from “{comment.postTitle}”, together with any replies
              to it.
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
    </div>
  );
}

export const columns: DashboardColumnDef<CommentRow>[] = [
  {
    accessorKey: 'author',
    header: sortableHeader('Author'),
    cell: ({ row }) => (
      <span className='flex items-center gap-2.5'>
        <Image
          src={proxiedAvatarUrl(row.original.avatarUrl)}
          alt=''
          width={24}
          height={24}
          className='size-6 shrink-0 rounded-md'
        />
        <span className='font-semibold'>{row.original.author}</span>
      </span>
    ),
  },
  {
    accessorKey: 'excerpt',
    header: () => 'Comment',
    cell: ({ row }) => (
      <span className='flex max-w-md items-center gap-2'>
        {row.original.isReply && <Badge variant='outline'>Reply</Badge>}
        <span className='text-body truncate'>{row.original.excerpt}</span>
      </span>
    ),
  },
  {
    accessorKey: 'postTitle',
    header: sortableHeader('Post'),
    cell: ({ row }) => (
      <Link
        href={row.original.postHref}
        className='hover:text-primary-text block max-w-56 truncate transition-colors'
      >
        {row.original.postTitle}
      </Link>
    ),
  },
  {
    accessorKey: 'createdAt',
    header: sortableHeader('Date'),
    cell: ({ row }) => (
      <span className='text-muted-foreground whitespace-nowrap'>
        {formatShortDate(row.original.createdAt)}
      </span>
    ),
  },
  {
    id: 'actions',
    header: () => <span className='sr-only'>Actions</span>,
    cell: ({ row }) => <CommentActions comment={row.original} />,
  },
];
