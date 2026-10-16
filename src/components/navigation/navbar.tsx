import { Suspense } from 'react';
import Link from 'next/link';

import { MenuIcon } from 'lucide-react';

import { LINKS } from '@/constants/links';

import {
  AccountButton,
  AccountButtonPlaceholder,
} from '@/components/navigation/account-button';
import { NavLinks } from '@/components/navigation/nav-links';
import { ThemeSwitcher } from '@/components/theme/switcher';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetBody,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

// `showAccount` adds the account menu, which reads the session. The global 404 page leaves it out: it also renders
// for missing dashboard pages, where Next checks it can show without waiting on the session.
export function Navbar({ showAccount = true }: { showAccount?: boolean }) {
  return (
    <header className='bg-background/85 supports-backdrop-filter:bg-background/70 sticky top-0 z-50 w-full border-b backdrop-blur-md'>
      <div className='container mx-auto flex h-17 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8'>
        <Link
          href={LINKS.home.url}
          className='text-[17px] font-bold tracking-[-0.04em] transition-opacity hover:opacity-80'
        >
          niso<span className='text-primary-text'>.moe</span>
        </Link>

        <nav aria-label='Main' className='hidden sm:block'>
          <NavLinks />
        </nav>

        <div className='flex items-center gap-2'>
          <ThemeSwitcher />
          {showAccount && (
            // The account menu reads the session, so it streams in after the prerendered page. Until then a
            // placeholder of the same size holds its place.
            <Suspense fallback={<AccountButtonPlaceholder />}>
              <AccountButton />
            </Suspense>
          )}

          <Sheet>
            <SheetTrigger className='sm:hidden' asChild>
              <Button size='icon-lg' variant='outline' aria-label='Open menu'>
                <MenuIcon className='size-5' />
              </Button>
            </SheetTrigger>
            <SheetContent side='left'>
              <SheetHeader>
                <SheetTitle>
                  niso<span className='text-primary-text'>.moe</span>
                </SheetTitle>
                <SheetDescription>
                  Navigate to different sections
                </SheetDescription>
              </SheetHeader>
              <SheetBody>
                <nav aria-label='Main'>
                  <NavLinks isMobile />
                </nav>
              </SheetBody>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
