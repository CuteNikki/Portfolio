import Link from 'next/link';

import { MenuIcon } from 'lucide-react';

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

import { NAVBAR_LINKS } from '@/constants/links';

export function Navbar() {
  return (
    <nav className='bg-background/95 supports-backdrop-filter:bg-background/60 sticky top-0 z-50 w-full border-b backdrop-blur'>
      <div className='container mx-auto flex items-center justify-between gap-4 p-4'>
        <div className='flex items-center gap-2'>
          <Link
            href='/#top'
            className='font-bold tracking-tight hover:opacity-80'
          >
            niso<span className='text-primary-text'>.moe</span>
          </Link>
        </div>
        <ul className='hidden items-center gap-6 text-sm font-medium sm:flex'>
          {NAVBAR_LINKS.map(({ url, label }) => (
            <li key={url}>
              <Link
                href={url}
                className='hover:text-primary-text text-muted-foreground lowercase transition-colors'
              >
                {label}
              </Link>
            </li>
          ))}
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
                  {NAVBAR_LINKS.map(({ url, label }) => (
                    <li key={url}>
                      <Link
                        href={url}
                        className='hover:text-primary-text active:text-primary-text focus:text-primary-text text-lg font-medium lowercase transition-colors'
                      >
                        {label}
                      </Link>
                    </li>
                  ))}
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
