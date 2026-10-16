'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import {
  CircleUserRoundIcon,
  LayoutDashboardIcon,
  LogInIcon,
  LogOutIcon,
  type LucideIcon,
  MenuIcon,
  MessageSquareIcon,
  SquarePenIcon,
  UserIcon,
} from 'lucide-react';

import type { Role } from '@/generated/prisma/enums';

import { LINKS, NAVBAR_LINKS } from '@/constants/links';
import { ROLE_LABELS } from '@/constants/roles';

import { cn } from '@/lib/utils';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { isCurrent } from '@/components/navigation/nav-links';
import { Button, buttonVariants } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
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

// The account links, in groups that menus separate with a line. Writers and admins also get the dashboard.
export function accountLinkGroups(user: AccountMenuUser) {
  const groups: { label: string; url: string; icon: LucideIcon }[][] = [];

  if (user.canWrite) {
    groups.push([
      {
        label: 'Dashboard',
        url: LINKS.dashboard.url,
        icon: LayoutDashboardIcon,
      },
      {
        label: 'New post',
        url: LINKS.dashboardPostNew.url,
        icon: SquarePenIcon,
      },
    ]);
  }
  groups.push([
    {
      label: 'Account settings',
      url: LINKS.account.url,
      icon: UserIcon,
    },
    {
      label: 'Your comments',
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

// The site's page links as one group of menu items, for the phone menu where the navbar has no room for them
function PageItems() {
  const pathname = usePathname();

  return (
    <DropdownMenuGroup>
      {NAVBAR_LINKS.map(({ url, label, icon: Icon }) => {
        const current = isCurrent(pathname, url);
        return (
          <DropdownMenuItem
            key={url}
            asChild
            className={cn(current && 'bg-primary-soft')}
          >
            <Link href={url} aria-current={current ? 'page' : undefined}>
              {Icon && <Icon />}
              <span className='lowercase'>{label}</span>
            </Link>
          </DropdownMenuItem>
        );
      })}
    </DropdownMenuGroup>
  );
}

// The account dropdown. On phones (`withPages`) the same menu also holds the page links, in their own group under the
// account's name. `showAccount` is false where the session can't be read, such as the global 404 page.
export function AccountMenu({
  user,
  withPages,
  showAccount = true,
  className,
}: {
  user: AccountMenuUser | null;
  withPages?: boolean;
  showAccount?: boolean;
  className?: string;
}) {
  const loginHref = useLoginHref();

  const label = user
    ? withPages
      ? `Menu and account for ${user.name}`
      : `Account menu for ${user.name}`
    : withPages
      ? 'Menu'
      : 'Account';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant='outline'
          size='icon-lg'
          aria-label={label}
          className={className}
        >
          {user && showAccount ? (
            <UserAvatar user={user} className='size-8' />
          ) : withPages ? (
            <MenuIcon className='size-5' />
          ) : (
            <CircleUserRoundIcon className='size-4.5' />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='w-72'>
        {showAccount && user && (
          <>
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
          </>
        )}

        {withPages && (
          <>
            <PageItems />
            {showAccount && <DropdownMenuSeparator />}
          </>
        )}

        {showAccount && !user && (
          <div className='p-2'>
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
          </div>
        )}

        {showAccount && user && (
          <>
            {accountLinkGroups(user).map((group) => (
              <DropdownMenuGroup key={group[0].url}>
                {group.map(({ label, url, icon: Icon }) => (
                  <DropdownMenuItem key={url} asChild>
                    <Link href={url}>
                      <Icon />
                      {label}
                    </Link>
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
              </DropdownMenuGroup>
            ))}
            <form action='/api/auth/logout' method='POST'>
              <DropdownMenuItem asChild variant='destructive'>
                <button type='submit' className='w-full'>
                  <LogOutIcon />
                  Sign out
                </button>
              </DropdownMenuItem>
            </form>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
