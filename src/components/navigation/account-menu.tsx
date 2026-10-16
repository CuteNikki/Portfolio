'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import {
  CircleUserRoundIcon,
  LayoutDashboardIcon,
  LogInIcon,
  LogOutIcon,
  type LucideIcon,
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

export const ROLE_LABELS: Record<Role, string> = {
  USER: 'User',
  WRITER: 'Writer',
  ADMIN: 'Admin',
};

// The account links, in groups that menus separate with a line. Writers and admins also get the dashboard.
export function accountLinkGroups(user: AccountMenuUser) {
  // `short` labels fit the two-column grid in the phone menu
  const groups: {
    label: string;
    short: string;
    url: string;
    icon: LucideIcon;
  }[][] = [];

  if (user.canWrite) {
    groups.push([
      {
        label: 'Dashboard',
        short: 'Dashboard',
        url: LINKS.dashboard.url,
        icon: LayoutDashboardIcon,
      },
      {
        label: 'New post',
        short: 'New post',
        url: LINKS.dashboardPostNew.url,
        icon: SquarePenIcon,
      },
    ]);
  }
  groups.push([
    {
      label: 'Account settings',
      short: 'Account',
      url: LINKS.account.url,
      icon: UserIcon,
    },
    {
      label: 'Your comments',
      short: 'Comments',
      url: LINKS.accountComments.url,
      icon: MessageSquareIcon,
    },
  ]);

  return groups;
}

// A menu item styled as the primary button. The item's own focus highlight would replace the violet, so focus
// (which is also how menus show hover) gets the button's hover look instead.
export const SIGN_IN_ITEM_CLASS = cn(
  buttonVariants(),
  'focus:bg-primary focus:text-primary-foreground not-data-[variant=destructive]:focus:**:text-primary-foreground w-full cursor-pointer justify-center focus:-translate-y-px focus:shadow-[0_0_0_4px_color-mix(in_oklab,var(--primary)_28%,transparent)]',
);

// Signing in returns to the page it started from
export function useLoginHref() {
  const pathname = usePathname();
  return `/api/auth/login?next=${encodeURIComponent(pathname)}`;
}

export function UserAvatar({
  user,
  className,
}: {
  user: AccountMenuUser;
  className?: string;
}) {
  return (
    <Avatar className={cn('rounded-[9px] after:rounded-[inherit]', className)}>
      <AvatarImage src={user.avatarUrl} alt='' className='rounded-[inherit]' />
      <AvatarFallback className='rounded-[inherit] text-xs'>
        {user.name.slice(0, 2).toUpperCase()}
      </AvatarFallback>
    </Avatar>
  );
}

// The account dropdown on larger screens. On phones the mobile menu holds the same links.
export function AccountMenu({
  user,
  className,
}: {
  user: AccountMenuUser | null;
  className?: string;
}) {
  const loginHref = useLoginHref();

  if (!user) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant='outline'
            size='icon-lg'
            aria-label='Account'
            className={className}
          >
            <CircleUserRoundIcon className='size-4.5' />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end' className='w-72 p-3.5'>
          <p className='text-sm font-bold'>Not signed in</p>
          <p className='text-muted-foreground mt-1 mb-3.5 text-[13px] leading-relaxed'>
            Sign in with Discord to comment on posts and manage your account.
          </p>
          <DropdownMenuItem asChild className={SIGN_IN_ITEM_CLASS}>
            {/* A plain link: a prefetch of the login route would start a new login and replace one in progress */}
            <a href={loginHref}>
              <LogInIcon />
              Sign in
            </a>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant='outline'
          size='icon-lg'
          aria-label={`Account menu for ${user.name}`}
          className={className}
        >
          <UserAvatar user={user} className='size-8' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='w-68'>
        <DropdownMenuLabel className='flex items-center gap-3 px-2.5 py-2.5 font-normal'>
          <UserAvatar user={user} className='size-10 rounded-[10px]' />
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
        {accountLinkGroups(user).map((group) => (
          <div key={group[0].url}>
            {group.map(({ label, url, icon: Icon }) => (
              <DropdownMenuItem key={url} asChild>
                <Link href={url}>
                  <Icon />
                  {label}
                </Link>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
          </div>
        ))}
        <form action='/api/auth/logout' method='POST'>
          <DropdownMenuItem asChild variant='destructive'>
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
