'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import {
  CircleUserRoundIcon,
  LayoutDashboardIcon,
  LogInIcon,
  LogOutIcon,
  MessageSquareIcon,
  SquarePenIcon,
  UserIcon,
} from 'lucide-react';

import type { Role } from '@/generated/prisma/enums';

import { LINKS } from '@/constants/links';

import { cn } from '@/lib/utils';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button, buttonVariants } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export interface AccountMenuUser {
  name: string;
  username: string;
  avatarUrl: string;
  role: Role;
  canWrite: boolean;
}

const ROLE_LABELS: Record<Role, string> = {
  USER: 'User',
  WRITER: 'Writer',
  ADMIN: 'Admin',
};

export function AccountMenu({ user }: { user: AccountMenuUser | null }) {
  const pathname = usePathname();

  if (!user) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant='outline' size='icon-lg' aria-label='Account'>
            <CircleUserRoundIcon className='size-4.5' />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end' className='w-72 p-3.5'>
          <p className='text-sm font-bold'>Not signed in</p>
          <p className='text-muted-foreground mt-1 mb-3.5 text-[13px] leading-relaxed'>
            Sign in with Discord to comment on posts and manage your account.
          </p>
          {/* A menu item styled as the primary button. The item's own focus highlight would replace the violet, so
              focus (which is also how the menu shows hover) gets the button's hover look instead. */}
          <DropdownMenuItem
            asChild
            className={cn(
              buttonVariants(),
              'focus:bg-primary focus:text-primary-foreground not-data-[variant=destructive]:focus:**:text-primary-foreground w-full cursor-pointer justify-center focus:-translate-y-px focus:shadow-[0_0_0_4px_color-mix(in_oklab,var(--primary)_28%,transparent)]',
            )}
          >
            {/* A plain link: a prefetch of the login route would start a new login and replace one in progress */}
            <a href={`/api/auth/login?next=${encodeURIComponent(pathname)}`}>
              <LogInIcon />
              Sign in
            </a>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  const initials = user.name.slice(0, 2).toUpperCase();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant='outline'
          size='icon-lg'
          aria-label={`Account menu for ${user.name}`}
        >
          <Avatar className='size-8 rounded-[9px] after:rounded-[9px]'>
            <AvatarImage
              src={user.avatarUrl}
              alt=''
              className='rounded-[9px]'
            />
            <AvatarFallback className='rounded-[9px] text-xs'>
              {initials}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='w-68'>
        <DropdownMenuLabel className='flex items-center gap-3 px-2.5 py-2.5 font-normal'>
          <Avatar className='size-10 rounded-[10px] after:rounded-[10px]'>
            <AvatarImage
              src={user.avatarUrl}
              alt=''
              className='rounded-[10px]'
            />
            <AvatarFallback className='rounded-[10px]'>
              {initials}
            </AvatarFallback>
          </Avatar>
          <span className='min-w-0 leading-snug'>
            <span className='text-foreground block truncate text-sm font-bold'>
              {user.name}
            </span>
            <span className='text-muted-foreground block truncate text-xs'>
              @{user.username} · {ROLE_LABELS[user.role]}
            </span>
          </span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {/* Writers and admins manage posts and projects in the dashboard */}
        {user.canWrite && (
          <>
            <DropdownMenuItem asChild>
              <Link href={LINKS.dashboard.url}>
                <LayoutDashboardIcon />
                Dashboard
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={LINKS.dashboardPostNew.url}>
                <SquarePenIcon />
                New post
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </>
        )}
        <DropdownMenuItem asChild>
          <Link href={LINKS.account.url}>
            <UserIcon />
            Account settings
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href={LINKS.accountComments.url}>
            <MessageSquareIcon />
            Your comments
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <form action='/api/auth/logout' method='POST'>
          <DropdownMenuItem asChild>
            <button type='submit' className='w-full'>
              <LogOutIcon />
              Sign out
            </button>
          </DropdownMenuItem>
        </form>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
