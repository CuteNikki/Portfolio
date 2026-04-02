'use client';

import { ColumnDef } from '@tanstack/react-table';
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

import { Project, User } from '@/generated/prisma/browser';

import { deleteProject } from '@/actions/project';
import { LINKS } from '@/constants/links';

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

type ProjectWithWriter = Project & { writer: User };

const ProjectActions = ({ project }: { project: ProjectWithWriter }) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleDelete = () => {
    const formData = new FormData();
    formData.append('projectId', project.id);

    deleteProject(formData)
      .then(() => {
        toast.success('Project deleted successfully!');
        setShowDeleteDialog(false);
      })
      .catch((error) => {
        toast.error('Failed to delete project', {
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
            <MoreHorizontalIcon className='shrink-0' />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end'>
          <DropdownMenuItem
            onClick={() => {
              navigator.clipboard
                .writeText(
                  `${window.location.origin}${LINKS.projectWithSlugOrId(project.id).url}`,
                )
                .then(() => {
                  toast.success('Project URL copied to clipboard!');
                });
            }}
          >
            <ClipboardCopyIcon />
            Copy URL
          </DropdownMenuItem>

          <DropdownMenuItem asChild>
            <Link href={LINKS.projectWithSlugOrId(project.id).url}>
              <ExternalLinkIcon />
              View
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem asChild>
            <Link href={LINKS.dashboardProjectEditWithId(project.id).url}>
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
              project &quot;{project.title}&quot;.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction variant='destructive' onClick={handleDelete}>
              Delete Project
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export const columns: ColumnDef<ProjectWithWriter>[] = [
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
    accessorKey: 'published',
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
      const isPublished = row.getValue('published') as boolean;
      return (
        <Badge variant={isPublished ? 'default' : 'secondary'}>
          {isPublished ? 'Published' : 'Draft'}
        </Badge>
      );
    },
  },
  {
    accessorKey: 'writer.username',
    id: 'writer',
    header: ({ column }) => (
      <Button
        variant='ghost'
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Writer
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
      <div className='flex flex-row items-center gap-2'>
        <Image
          unoptimized
          src={row.original.writer.avatarUrl}
          alt='Avatar'
          className='min-h-6 min-w-6 shrink-0 rounded-full'
          width={24}
          height={24}
        />
        <span>{row.original.writer.username}</span>
      </div>
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
      return <span>{date.toLocaleDateString()}</span>;
    },
  },
  {
    id: 'actions',
    header: () => '',
    cell: ({ row }) => <ProjectActions project={row.original} />,
  },
];
