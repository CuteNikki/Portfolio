'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useOptimistic, useRef, useState, useTransition } from 'react';
import { fadeOutRow } from '@/lib/row-motion';
import { toast } from '@/lib/toast';

import {
  ClipboardCopyIcon,
  LoaderCircleIcon,
  Trash2Icon,
  UserRoundIcon,
} from 'lucide-react';

import type { Role } from '@/generated/prisma/client';

import type { PublicUser as User } from '@/lib/data';
import { proxiedAvatarUrl } from '@/lib/utils';

import { LINKS } from '@/constants/links';

import { updateUserRole } from '@/actions/user';

import { sortableHeader } from '@/components/dashboard/shared/column-parts';
import type { DashboardColumnDef } from '@/components/dashboard/shared/table-features';
import { DeleteUserDialog } from '@/components/dashboard/users/delete-user';
import { NewTabItem } from '@/components/common/menu-at-point';
import { RowMenu } from '@/components/dashboard/shared/row-menu';
import {
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const userColumn: DashboardColumnDef<User> = {
  accessorKey: 'username',
  // Takes the room the other columns leave
  enableHiding: false,
  header: sortableHeader('User'),
  cell: ({ row }) => (
    <Link
      href={LINKS.dashboardUserWithId(row.original.id).url}
      className='group flex flex-row items-center gap-2.5'
    >
      <Image
        src={proxiedAvatarUrl(row.original.avatarUrl)}
        alt=''
        className='size-6 shrink-0 rounded-md'
        width={24}
        height={24}
      />
      <span className='group-hover:text-primary-text font-semibold transition-colors'>
        {row.original.username}
      </span>
    </Link>
  ),
};

const nameColumn: DashboardColumnDef<User> = {
  accessorKey: 'displayName',
  size: 220,
  meta: { label: 'Name' },
  header: sortableHeader('Name'),
};

// Changes someone's role right away; on the users table and on a user's page
export const RoleSelect = ({
  user,
  size = 'sm',
}: {
  user: Pick<User, 'id' | 'username' | 'role'>;
  // Small in table rows, button height on a user's page
  size?: 'sm' | 'default';
}) => {
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
        const { error } = await updateUserRole(formData);
        if (error) {
          toast.error("The role wasn't changed", { description: error });
          return;
        }
        toast.success('Role updated', {
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
        size={size}
        className={size === 'sm' ? 'w-24' : 'w-28'}
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

// Admins first, then writers, then everyone else
const ROLE_RANK: Record<Role, number> = { ADMIN: 0, WRITER: 1, USER: 2 };

const roleColumn: DashboardColumnDef<User> = {
  accessorKey: 'role',
  size: 140,
  meta: { label: 'Role' },
  sortFn: (a, b) => ROLE_RANK[a.original.role] - ROLE_RANK[b.original.role],
  header: sortableHeader('Role'),
  cell: ({ row }) => <RoleSelect user={row.original} />,
};

const UserActions = ({ user }: { user: User }) => {
  const [confirming, setConfirming] = useState(false);
  const actions = useRef<HTMLDivElement>(null);

  const copyId = () =>
    navigator.clipboard
      .writeText(user.discordId)
      .then(() => toast.success('Discord ID copied'))
      .catch(() => toast.error("The ID couldn't be copied"));

  return (
    <div ref={actions} className='flex justify-end'>
      <RowMenu label={`More actions for ${user.username}`}>
        <DropdownMenuItem asChild>
          <Link href={LINKS.dashboardUserWithId(user.id).url}>
            <UserRoundIcon />
            Open
          </Link>
        </DropdownMenuItem>
        <NewTabItem href={LINKS.dashboardUserWithId(user.id).url} />
        <DropdownMenuItem onSelect={copyId}>
          <ClipboardCopyIcon />
          Copy Discord ID
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          variant='destructive'
          onSelect={() => setConfirming(true)}
        >
          <Trash2Icon />
          Delete
        </DropdownMenuItem>
      </RowMenu>

      <DeleteUserDialog
        user={user}
        open={confirming}
        onOpenChange={setConfirming}
        onDeleted={() => fadeOutRow(actions.current)}
      />
    </div>
  );
};

const actionsColumn: DashboardColumnDef<User> = {
  id: 'actions',
  size: 64,
  minSize: 64,
  enableResizing: false,
  enableHiding: false,
  header: () => <span className='sr-only'>Actions</span>,
  cell: ({ row }) => <UserActions user={row.original} />,
};

const idColumn: DashboardColumnDef<User> = {
  accessorKey: 'discordId',
  size: 220,
  meta: { label: 'Discord ID' },
  header: sortableHeader('ID'),
};

export const columns: DashboardColumnDef<User>[] = [
  userColumn,
  nameColumn,
  roleColumn,
  idColumn,
  actionsColumn,
];
