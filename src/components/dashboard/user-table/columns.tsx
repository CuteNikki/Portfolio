'use client';

import { ColumnDef } from '@tanstack/react-table';
import Image from 'next/image';
import { useState, useTransition } from 'react';
import { toast } from 'sonner';

import {
  ArrowDownIcon,
  ArrowUpDownIcon,
  ArrowUpIcon,
  LoaderCircleIcon,
  MoreHorizontalIcon,
} from 'lucide-react';

import type { Role, User } from '../../../../generated/prisma/client';

import { updateUserRole } from '@/actions/user';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const userColumn: ColumnDef<User> = {
  accessorKey: 'username',
  header: ({ column }) => (
    <Button
      variant='ghost'
      onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
    >
      User
      {column.getIsSorted() === 'asc' ? (
        <ArrowUpIcon className='h-4 w-4' />
      ) : column.getIsSorted() === 'desc' ? (
        <ArrowDownIcon className='h-4 w-4' />
      ) : (
        <ArrowUpDownIcon className='h-4 w-4 opacity-50' />
      )}
    </Button>
  ),
  cell: ({ row }) => (
    <div className='flex flex-row items-center gap-2'>
      <Image
        unoptimized
        src={row.original.avatarUrl}
        alt='Avatar'
        className='min-h-6 min-w-6 shrink-0 rounded-full'
        width={24}
        height={24}
      />
      <span>{row.original.username}</span>
    </div>
  ),
};

const nameColumn: ColumnDef<User> = {
  accessorKey: 'displayName',
  header: ({ column }) => (
    <Button
      variant='ghost'
      onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
    >
      Name
      {column.getIsSorted() === 'asc' ? (
        <ArrowUpIcon className='h-4 w-4' />
      ) : column.getIsSorted() === 'desc' ? (
        <ArrowDownIcon className='h-4 w-4' />
      ) : (
        <ArrowUpDownIcon className='h-4 w-4 opacity-50' />
      )}
    </Button>
  ),
};

const RoleSelectCell = ({ user }: { user: User }) => {
  const [isPending, startTransition] = useTransition();
  const [optimisticRole, setOptimisticRole] = useState(user.role);

  const handleRoleChange = (newRole: string) => {
    const previousRole = optimisticRole;

    setOptimisticRole(newRole as Role);

    startTransition(async () => {
      const formData = new FormData();
      formData.append('userId', user.id);
      formData.append('role', newRole);

      try {
        await updateUserRole(formData);
        toast.success('Role updated successfully!', {
          description: `${user.username} is now ${newRole}.`,
        });
      } catch (error) {
        toast.error('Failed to update role!', {
          description:
            error instanceof Error
              ? error.message
              : 'An unknown error occurred',
        });
        setOptimisticRole(previousRole);
      }
    });
  };

  return (
    <Select
      value={optimisticRole}
      onValueChange={handleRoleChange}
      disabled={isPending}
    >
      <SelectTrigger size='sm' className='w-40'>
        <SelectValue placeholder='Role' />
        {isPending && (
          <LoaderCircleIcon className='size-4 shrink-0 animate-spin' />
        )}
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem value={'USER'}>User</SelectItem>
          <SelectItem value={'AUTHOR'}>Author</SelectItem>
          <SelectItem value={'ADMIN'}>Admin</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

const roleColumn: ColumnDef<User> = {
  accessorKey: 'role',
  header: ({ column }) => (
    <Button
      variant='ghost'
      onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
    >
      Role
      {column.getIsSorted() === 'asc' ? (
        <ArrowUpIcon className='h-4 w-4' />
      ) : column.getIsSorted() === 'desc' ? (
        <ArrowDownIcon className='h-4 w-4' />
      ) : (
        <ArrowUpDownIcon className='h-4 w-4 opacity-50' />
      )}
    </Button>
  ),
  cell: ({ row }) => <RoleSelectCell user={row.original} />,
};

const actionsColumn: ColumnDef<User> = {
  id: 'actions',
  header: '',
  cell: ({ row }) => (
    <div className='flex justify-end'>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant='ghost' size='sm'>
            <span className='sr-only'>Open menu</span>
            <MoreHorizontalIcon className='h-4 w-4 shrink-0' />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='center'>
          <DropdownMenuItem
            onClick={() => {
              navigator.clipboard
                .writeText(row.original.discordId)
                .then(() => {
                  toast.success('User ID copied to clipboard');
                })
                .catch(() => {
                  toast.error('Failed to copy User ID');
                });
            }}
          >
            Copy ID
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  ),
};

const idColumn: ColumnDef<User> = {
  accessorKey: 'discordId',
  header: ({ column }) => (
    <Button
      variant='ghost'
      onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
    >
      ID
      {column.getIsSorted() === 'asc' ? (
        <ArrowUpIcon className='h-4 w-4' />
      ) : column.getIsSorted() === 'desc' ? (
        <ArrowDownIcon className='h-4 w-4' />
      ) : (
        <ArrowUpDownIcon className='h-4 w-4 opacity-50' />
      )}
    </Button>
  ),
};

export const columns: ColumnDef<User>[] = [
  userColumn,
  nameColumn,
  roleColumn,
  idColumn,
  actionsColumn,
];
