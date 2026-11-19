import Link from 'next/link';
import { Suspense } from 'react';

import { LINKS } from '@/constants/links';

import { cn } from '@/lib/utils';

import {
  AccountButton,
  AccountButtonPlaceholder,
} from '@/components/navigation/account-button';
import { AccountMenu } from '@/components/navigation/account-menu';
import {
  NavLinks,
  NavLinksPlaceholder,
} from '@/components/navigation/nav-links';
import { ThemeSwitcher } from '@/components/theme/switcher';

// `showAccount` adds the account menu, which reads the session. Leave it out only where the session can't be read.
// `wide` spans the whole window instead of the page column, so the dashboard's navbar lines up with its sidebar.
export function Navbar({
  showAccount = true,
  wide,
}: {
  showAccount?: boolean;
  wide?: boolean;
}) {
  return (
    <header className='sticky top-0 z-50 w-full border-b bg-background/85 backdrop-blur-md supports-backdrop-filter:bg-background/70'>
      <div
        className={cn(
          'mx-auto flex h-16 items-center justify-between gap-4 px-4 sm:px-6',
          wide ? 'lg:px-6' : 'container max-w-6xl lg:px-8'
        )}
      >
        <Link
          href={LINKS.home.url}
          className='text-[17px] font-bold tracking-[-0.04em] transition-opacity hover:opacity-80'
        >
          niso<span className='text-primary-text'>.moe</span>
        </Link>

        <nav aria-label='Main' className='hidden sm:block'>
          {/* Reads the path, which a page prerendered for a post or project the build didn't know about only has
              once it's asked for */}
          <Suspense fallback={<NavLinksPlaceholder />}>
            <NavLinks />
          </Suspense>
        </nav>

        <div className='flex items-center gap-2'>
          <ThemeSwitcher />
          {showAccount ? (
            // Reads the session, so it streams in after the prerendered page; placeholders of the same size hold
            // its place until then. On phones it is one button for both the page links and the account.
            <Suspense fallback={<AccountButtonPlaceholder />}>
              <AccountButton />
            </Suspense>
          ) : (
            <AccountMenu
              user={null}
              withPages
              showAccount={false}
              className='sm:hidden'
            />
          )}
        </div>
      </div>
    </header>
  );
}
