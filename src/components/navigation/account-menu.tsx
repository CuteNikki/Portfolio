'use client';

import { useEffect } from 'react';

import { CircleUserRoundIcon, MenuIcon } from 'lucide-react';

import type { Role } from '@/generated/prisma/enums';

import { setCanWrite } from '@/lib/can-write';
import { cn } from '@/lib/utils';

import { LazyMenu } from '@/components/common/lazy-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

export interface AccountMenuUser {
  name: string;
  username: string;
  avatarUrl: string;
  role: Role;
  canWrite: boolean;
}

export interface AccountMenuProps {
  user: AccountMenuUser | null;
  // On phones the same menu also holds the page links
  withPages?: boolean;
  // False where the session can't be read, such as the global 404 page
  showAccount?: boolean;
  className?: string;
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

// The menu's button, the same before and after the menu has loaded
export function AccountTrigger({
  user,
  withPages,
  showAccount = true,
  className,
  ...props
}: AccountMenuProps & React.ComponentProps<'button'>) {
  const label = user
    ? withPages
      ? `Menu and account for ${user.name}`
      : `Account menu for ${user.name}`
    : withPages
      ? 'Menu'
      : 'Account';

  return (
    <Button
      variant='outline'
      size='icon'
      aria-label={label}
      className={className}
      {...props}
    >
      {user && showAccount ? (
        <UserAvatar user={user} className='size-8' />
      ) : withPages ? (
        <MenuIcon className='size-5' />
      ) : (
        <CircleUserRoundIcon className='size-4.5' />
      )}
    </Button>
  );
}

const loadMenu = () =>
  import('@/components/navigation/account-menu-loaded').then(
    (module) => module.default,
  );

// The account dropdown. On phones (`withPages`) the same menu also holds the page links, in their own group under the
// account's name. Its menu loads on first use (see LazyMenu).
export function AccountMenu(props: AccountMenuProps) {
  // The writer menus on cards and pages (see WriterMenu) only appear for writers and admins
  const canWrite = !!props.user?.canWrite;
  useEffect(() => setCanWrite(canWrite), [canWrite]);

  return (
    <LazyMenu
      load={loadMenu}
      props={props}
      trigger={<AccountTrigger {...props} />}
    />
  );
}
