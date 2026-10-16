'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { LogInIcon, LogOutIcon, MenuIcon } from 'lucide-react';

import { NAVBAR_LINKS } from '@/constants/links';

import { cn } from '@/lib/utils';

import {
  accountLinkGroups,
  type AccountMenuUser,
  ROLE_LABELS,
  SIGN_IN_ITEM_CLASS,
  useLoginHref,
  UserAvatar,
} from '@/components/navigation/account-menu';
import { isCurrent } from '@/components/navigation/nav-links';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// On phones one button opens both the page links and the account, in the same dropdown the account uses on larger
// screens. Signed in, the button shows the avatar. `showAccount` is false where the session can't be read, such as
// the global 404 page.
export function MobileMenu({
  user,
  showAccount = true,
  className,
}: {
  user: AccountMenuUser | null;
  showAccount?: boolean;
  className?: string;
}) {
  const pathname = usePathname();
  const loginHref = useLoginHref();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant='outline'
          size='icon-lg'
          aria-label={user ? `Menu and account for ${user.name}` : 'Menu'}
          className={className}
        >
          {user ? (
            <UserAvatar user={user} className='size-8' />
          ) : (
            <MenuIcon className='size-5' />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='w-68'>
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

        {showAccount && <DropdownMenuSeparator />}

        {showAccount && !user && (
          <div className='p-2'>
            <p className='text-sm font-bold'>Not signed in</p>
            <p className='text-muted-foreground mt-1 mb-3 text-[13px] leading-relaxed'>
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
            {accountLinkGroups(user)
              .flat()
              .map(({ label, url, icon: Icon }) => (
                <DropdownMenuItem key={url} asChild>
                  <Link href={url}>
                    <Icon />
                    {label}
                  </Link>
                </DropdownMenuItem>
              ))}
            <DropdownMenuSeparator />
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
