'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'sonner';

import {
  ArrowDownIcon,
  ArrowUpDownIcon,
  ArrowUpIcon,
  ClipboardCopyIcon,
  EditIcon,
  ExternalLinkIcon,
  MoreHorizontalIcon,
  Trash2Icon,
} from 'lucide-react';

import type { Post } from '@/generated/prisma/client';

import type { PublicUser } from '@/lib/data';
import { proxiedAvatarUrl } from '@/lib/utils';

import { deletePost } from '@/actions/post';
import { LINKS } from '@/constants/links';

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

type PostWithWriter = Post & { authors: { user: PublicUser }[] };

const PostActions = ({ post }: { post: PostWithWriter }) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleDelete = () => {
    const formData = new FormData();
    formData.append('postId', post.id);

    deletePost(formData)
      .then(() => {
        toast.success('Post deleted successfully!');
        setShowDeleteDialog(false);
      })
      .catch((error) => {
        toast.error('Failed to delete post', {
          description:
            error instanceof Error
              ? error.message
              : 'An unknown error occurred',
        });
        setShowDeleteDialog(false);
      });
  };

  return (
    <div className='flex justify-end'>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant='ghost' size='sm'>
            <span className='sr-only'>Open menu</span>
            <MoreHorizontalIcon />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end'>
          <DropdownMenuItem
            onClick={() => {
              navigator.clipboard
                .writeText(
                  `${window.location.origin}${LINKS.postWithSlugOrId(post.id).url}`,
                )
                .then(() => toast.success('Post URL copied to clipboard!'))
                .catch(() => toast.error('Failed to copy Post URL'));
            }}
          >
            <ClipboardCopyIcon />
            Copy URL
          </DropdownMenuItem>

          <DropdownMenuItem asChild>
            <Link href={LINKS.postWithSlugOrId(post.id).url} target='_blank'>
              <ExternalLinkIcon />
              View
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem asChild>
            <Link href={LINKS.dashboardPostEditWithId(post.id).url}>
              <EditIcon />
              Edit
            </Link>
          </DropdownMenuItem>

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
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              post &quot;{post.title}&quot;.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction variant='destructive' onClick={handleDelete}>
              Delete Post
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export const columns: DashboardColumnDef<PostWithWriter>[] = [
  {
    accessorKey: 'title',
    header: ({ column }) => (
      <Button
        variant='ghost'
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Title
        {column.getIsSorted() === 'asc' ? (
          <ArrowUpIcon />
        ) : column.getIsSorted() === 'desc' ? (
          <ArrowDownIcon />
        ) : (
          <ArrowUpDownIcon className='opacity-50' />
        )}
      </Button>
    ),
    cell: ({ row }) => (
      <div className='max-w-80 truncate'>{row.original.title}</div>
    ),
  },
  {
    accessorKey: 'publishedAt',
    header: ({ column }) => (
      <Button
        variant='ghost'
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Status
        {column.getIsSorted() === 'asc' ? (
          <ArrowUpIcon />
        ) : column.getIsSorted() === 'desc' ? (
          <ArrowDownIcon />
        ) : (
          <ArrowUpDownIcon className='opacity-50' />
        )}
      </Button>
    ),
    cell: ({ row }) => {
      const isPublished = row.getValue('publishedAt') !== null;
      return (
        <Badge variant={isPublished ? 'default' : 'secondary'}>
          {isPublished ? 'Published' : 'Draft'}
        </Badge>
      );
    },
  },
  {
    id: 'authors',
    // Sorts by the first author's name
    accessorFn: (row) => row.authors[0]?.user.username ?? '',
    header: ({ column }) => (
      <Button
        variant='ghost'
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Authors
        {column.getIsSorted() === 'asc' ? (
          <ArrowUpIcon />
        ) : column.getIsSorted() === 'desc' ? (
          <ArrowDownIcon />
        ) : (
          <ArrowUpDownIcon className='opacity-50' />
        )}
      </Button>
    ),
    cell: ({ row }) => {
      const authors = row.original.authors.map(({ user }) => user);
      if (authors.length === 0)
        return <span className='text-muted-foreground'>—</span>;

      return (
        <div className='flex flex-row items-center gap-2'>
          <div className='flex -space-x-2'>
            {authors.slice(0, 3).map((author) => (
              <Image
                key={author.id}
                src={proxiedAvatarUrl(author.avatarUrl)}
                alt=''
                className='ring-card min-h-6 min-w-6 shrink-0 rounded-full ring-2'
                width={24}
                height={24}
              />
            ))}
          </div>
          <span>
            {authors[0].username}
            {authors.length > 1 && (
              <span className='text-muted-foreground'>
                {' '}
                +{authors.length - 1}
              </span>
            )}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: 'views',
    header: ({ column }) => (
      <Button
        variant='ghost'
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Views
        {column.getIsSorted() === 'asc' ? (
          <ArrowUpIcon />
        ) : column.getIsSorted() === 'desc' ? (
          <ArrowDownIcon />
        ) : (
          <ArrowUpDownIcon className='opacity-50' />
        )}
      </Button>
    ),
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => (
      <Button
        variant='ghost'
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Created
        {column.getIsSorted() === 'asc' ? (
          <ArrowUpIcon />
        ) : column.getIsSorted() === 'desc' ? (
          <ArrowDownIcon />
        ) : (
          <ArrowUpDownIcon className='opacity-50' />
        )}
      </Button>
    ),
    cell: ({ row }) => {
      const date = new Date(row.getValue('createdAt'));
      return (
        <span>{date.toLocaleDateString('en-US', { timeZone: 'UTC' })}</span>
      );
    },
  },
  {
    id: 'actions',
    header: () => <span className='sr-only'>Actions</span>,
    cell: ({ row }) => <PostActions post={row.original} />,
  },
];
