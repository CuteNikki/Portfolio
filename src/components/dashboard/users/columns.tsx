'use client';

import Image from 'next/image';
import { useOptimistic, useState, useTransition } from 'react';
import { toast } from 'sonner';

import {
  ArrowDownIcon,
  ArrowUpDownIcon,
  ArrowUpIcon,
  ClipboardCopyIcon,
  LoaderCircleIcon,
  MoreHorizontalIcon,
  TrashIcon,
} from 'lucide-react';

import type { Role, User as UserModel } from '@/generated/prisma/client';

import { proxiedAvatarUrl } from '@/lib/utils';

import { deleteUser, updateUserRole } from '@/actions/user';

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
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
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

// The users page leaves out the Discord tokens
type User = Omit<UserModel, 'accessToken' | 'refreshToken' | 'tokenExpiresAt'>;

const userColumn: DashboardColumnDef<User> = {
  accessorKey: 'username',
  header: ({ column }) => (
    <Button
      variant='ghost'
      onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
    >
      User
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
        src={proxiedAvatarUrl(row.original.avatarUrl)}
        alt='Avatar'
        className='min-h-6 min-w-6 shrink-0 rounded-full'
        width={24}
        height={24}
      />
      <span>{row.original.username}</span>
    </div>
  ),
};

const nameColumn: DashboardColumnDef<User> = {
  accessorKey: 'displayName',
  header: ({ column }) => (
    <Button
      variant='ghost'
      onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
    >
      Name
      {column.getIsSorted() === 'asc' ? (
        <ArrowUpIcon />
      ) : column.getIsSorted() === 'desc' ? (
        <ArrowDownIcon />
      ) : (
        <ArrowUpDownIcon className='opacity-50' />
      )}
    </Button>
  ),
};

const RoleSelectCell = ({ user }: { user: User }) => {
  const [isPending, startTransition] = useTransition();
  // Shows the picked role while it saves, then the role from the server, so a failed change goes back by itself
  const [optimisticRole, setOptimisticRole] = useOptimistic(user.role);

  const handleRoleChange = (newRole: string) => {
    startTransition(async () => {
      setOptimisticRole(newRole as Role);

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
      }
    });
  };

  return (
    <Select
      value={optimisticRole}
      onValueChange={handleRoleChange}
      disabled={isPending}
    >
      <SelectTrigger
        size='sm'
        className='w-24'
        aria-label={`Role of ${user.username}`}
      >
        <SelectValue placeholder='Role' />
        {isPending && (
          <LoaderCircleIcon className='size-4 shrink-0 animate-spin' />
        )}
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem value={'USER'}>User</SelectItem>
          <SelectItem value={'WRITER'}>Writer</SelectItem>
          <SelectItem value={'ADMIN'}>Admin</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

const roleColumn: DashboardColumnDef<User> = {
  accessorKey: 'role',
  header: ({ column }) => (
    <Button
      variant='ghost'
      onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
    >
      Role
      {column.getIsSorted() === 'asc' ? (
        <ArrowUpIcon />
      ) : column.getIsSorted() === 'desc' ? (
        <ArrowDownIcon />
      ) : (
        <ArrowUpDownIcon className='opacity-50' />
      )}
    </Button>
  ),
  cell: ({ row }) => <RoleSelectCell user={row.original} />,
};

const UserActions = ({ user }: { user: User }) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleDelete = () => {
    const formData = new FormData();
    formData.append('userId', user.id);

    deleteUser(formData)
      .then(() => {
        toast.success('User deleted successfully!');
        setShowDeleteDialog(false);
      })
      .catch((error) => {
        toast.error('Failed to delete user', {
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
                .writeText(user.discordId)
                .then(() => {
                  toast.success('User ID copied to clipboard');
                })
                .catch(() => {
                  toast.error('Failed to copy User ID');
                });
            }}
          >
            <ClipboardCopyIcon />
            Copy ID
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            variant='destructive'
            onSelect={(e) => {
              e.preventDefault();
              setShowDeleteDialog(true);
            }}
          >
            <TrashIcon />
            Delete User
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              user{' '}
              <span className='text-foreground font-semibold'>
                {user.username}
              </span>{' '}
              and remove their access to the system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction variant='destructive' onClick={handleDelete}>
              Delete User
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

const actionsColumn: DashboardColumnDef<User> = {
  id: 'actions',
  header: () => <span className='sr-only'>Actions</span>,
  cell: ({ row }) => <UserActions user={row.original} />,
};

const idColumn: DashboardColumnDef<User> = {
  accessorKey: 'discordId',
  header: ({ column }) => (
    <Button
      variant='ghost'
      onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
    >
      ID
      {column.getIsSorted() === 'asc' ? (
        <ArrowUpIcon />
      ) : column.getIsSorted() === 'desc' ? (
        <ArrowDownIcon />
      ) : (
        <ArrowUpDownIcon className='opacity-50' />
      )}
    </Button>
  ),
};

export const columns: DashboardColumnDef<User>[] = [
  userColumn,
  nameColumn,
  roleColumn,
  idColumn,
  actionsColumn,
];
