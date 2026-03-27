'use client';

import { ColumnDef } from '@tanstack/react-table';
import Link from 'next/link';

import {
  ArrowDownIcon,
  ArrowUpDownIcon,
  ArrowUpIcon,
  ClipboardCopyIcon,
  EditIcon,
  ExternalLinkIcon,
  MoreHorizontalIcon,
  TrashIcon,
} from 'lucide-react';

import type { Post, User } from '../../../../generated/prisma/client'; // Adjust path

import { deletePost } from '@/actions/post';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';

type PostWithAuthor = Post & { author: User };

export const columns: ColumnDef<PostWithAuthor>[] = [
  {
    accessorKey: 'title',
    header: ({ column }) => (
      <Button
        variant='ghost'
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Title
        {column.getIsSorted() === 'asc' ? (
          <ArrowUpIcon className='h-4 w-4' />
        ) : column.getIsSorted() === 'desc' ? (
          <ArrowDownIcon className='h-4 w-4' />
        ) : (
          <ArrowUpDownIcon className='h-4 w-4 opacity-50' />
        )}
      </Button>
    ),
    cell: ({ row }) => <div className='truncate max-w-80'>{row.original.title}</div>,
  },
  {
    accessorKey: 'published',
    header: ({ column }) => (
      <Button
        variant='ghost'
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Status
        {column.getIsSorted() === 'asc' ? (
          <ArrowUpIcon className='h-4 w-4' />
        ) : column.getIsSorted() === 'desc' ? (
          <ArrowDownIcon className='h-4 w-4' />
        ) : (
          <ArrowUpDownIcon className='h-4 w-4 opacity-50' />
        )}
      </Button>
    ),
    cell: ({ row }) => {
      const isPublished = row.getValue('published') as boolean;
      return (
        <Badge variant={isPublished ? 'default' : 'secondary'}>
          {isPublished ? 'Published' : 'Draft'}
        </Badge>
      );
    },
  },
  {
    accessorKey: 'author.username',
    id: 'author',
    header: ({ column }) => (
      <Button
        variant='ghost'
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Author
        {column.getIsSorted() === 'asc' ? (
          <ArrowUpIcon className='h-4 w-4' />
        ) : column.getIsSorted() === 'desc' ? (
          <ArrowDownIcon className='h-4 w-4' />
        ) : (
          <ArrowUpDownIcon className='h-4 w-4 opacity-50' />
        )}
      </Button>
    ),
    cell: ({ row }) => row.original.author.username,
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
          <ArrowUpIcon className='h-4 w-4' />
        ) : column.getIsSorted() === 'desc' ? (
          <ArrowDownIcon className='h-4 w-4' />
        ) : (
          <ArrowUpDownIcon className='h-4 w-4 opacity-50' />
        )}
      </Button>
    ),
    cell: ({ row }) => {
      const date = new Date(row.getValue('createdAt'));
      return <span>{date.toLocaleDateString()}</span>;
    },
  },
  {
    id: 'actions',
    header: () => '',
    cell: ({ row }) => {
      const post = row.original;

      return (
        <div className='flex justify-end'>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='ghost' size='sm'>
                <span className='sr-only'>Open menu</span>
                <MoreHorizontalIcon className='h-4 w-4 shrink-0' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
              <DropdownMenuItem
                onClick={() => {
                  navigator.clipboard
                    .writeText(`${window.location.origin}/blog/${post.slug}`)
                    .then(() => {
                      toast.success('Post URL copied to clipboard!');
                    });
                }}
              >
                <ClipboardCopyIcon />
                Copy URL
              </DropdownMenuItem>

              {post.published && (
                <DropdownMenuItem asChild>
                  <Link href={`/blog/${post.slug}`} target='_blank'>
                    <ExternalLinkIcon />
                    View Post
                  </Link>
                </DropdownMenuItem>
              )}

              <DropdownMenuItem asChild>
                <Link href={`/dashboard/blog/edit/${post.id}`}>
                  <EditIcon />
                  Edit Post
                </Link>
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                variant='destructive'
                onClick={() => {
                  if (
                    confirm(
                      'Are you sure you want to delete this post? This action cannot be undone.',
                    )
                  ) {
                    const formData = new FormData();
                    formData.append('postId', post.id);
                    deletePost(formData)
                      .then(() => {
                        toast.success('Post deleted successfully!');
                      })
                      .catch((error) => {
                        toast.error('Failed to delete post', {
                          description:
                            error instanceof Error
                              ? error.message
                              : 'An unknown error occurred',
                        });
                      });
                  }
                }}
              >
                <TrashIcon />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];
