import Link from 'next/link';

import { MenuIcon } from 'lucide-react';

import { LINKS, NAVBAR_LINKS } from '@/constants/links';

import { ProtectedNavLinks } from '@/components/navigation/protected-links';
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

export function Navbar() {
  const publicLinks = NAVBAR_LINKS.filter((link) => !link.requiresAuth);

  return (
    <nav className='bg-background/95 supports-backdrop-filter:bg-background/70 sticky top-0 z-50 w-full border-b backdrop-blur-md'>
      <div className='container mx-auto flex items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8'>
        <div className='flex items-center gap-2'>
          <Link
            href={LINKS.home.url}
            className='text-lg font-bold tracking-[-0.04em] transition-opacity hover:opacity-80'
          >
            niso<span className='text-primary-text'>.moe</span>
          </Link>
        </div>
        <ul className='hidden items-center gap-6 text-sm font-medium sm:flex'>
          {publicLinks.map(({ url, label }) => (
            <li key={url}>
              <Link
                href={url}
                className='hover:text-primary-text text-muted-foreground lowercase transition-colors'
              >
                {label}
              </Link>
            </li>
          ))}
          <ProtectedNavLinks />
        </ul>

        <div className='flex items-center gap-2'>
          {/* MOBILE NAV */}
          <Sheet>
            <SheetTrigger className='sm:hidden' asChild>
              <Button size='icon' variant='outline'>
                <MenuIcon className='h-5 w-5' />
                <span className='sr-only'>Open menu</span>
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
                <ul className='flex flex-col gap-4 py-4'>
                  {publicLinks.map(({ url, label, icon: Icon }) => (
                    <li key={url}>
                      <Link
                        href={url}
                        className='hover:text-primary-text active:text-primary-text focus:text-primary-text flex items-center gap-2 text-lg font-medium lowercase transition-colors'
                      >
                        {Icon && <Icon className='size-5 shrink-0' />}
                        {label}
                      </Link>
                    </li>
                  ))}
                  <ProtectedNavLinks isMobile />
                </ul>
              </SheetBody>
            </SheetContent>
          </Sheet>
          <ThemeSwitcher />
        </div>
      </div>
    </nav>
  );
}
