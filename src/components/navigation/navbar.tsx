'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { MenuIcon } from 'lucide-react';

import { cn } from '@/lib/utils';

import { ThemeButton } from '@/components/theme/button';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

const links = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/projects', label: 'Projects' },
];

export function NavigationBar() {
  const pathname = usePathname();

  return (
    <header className='sticky top-0 z-50 px-2 py-4'>
      <div className='bg-background/95 supports-[backdrop-filter]:bg-background/50 outline-foreground/10 mx-auto w-full max-w-6xl rounded-xl outline backdrop-blur'>
        <div className='flex items-center justify-between px-4 py-2'>
          <Link href='#top' className='hover:text-primary text-sm font-medium text-gray-600 transition-colors dark:text-gray-300 dark:hover:text-white'>
            Nikki
          </Link>

          <div className='flex gap-2'>
            <ThemeButton />
            {/* Desktop navigation */}
            <nav className='hidden items-center space-x-1 sm:flex'>
              {links.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      'relative rounded-md px-3 py-2 text-sm font-medium transition-colors',
                      isActive ? 'text-primary' : 'hover:text-primary text-gray-600 dark:text-gray-300 dark:hover:text-white',
                    )}
                  >
                    {link.label}
                    {isActive && (
                      <motion.div
                        className='bg-primary absolute right-0 bottom-0 left-0 h-0.5'
                        layoutId='navbar-indicator'
                        transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                      />
                    )}
                  </Link>
                );
              })}
            </nav>
            {/* Mobile navigation */}
            <div className='sm:hidden'>
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant='ghost' size='icon'>
                    <MenuIcon />
                    <span className='sr-only'>Open navigation menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent className='flex justify-between'>
                  <SheetHeader>
                    <SheetTitle className='sr-only'>Navigation menu</SheetTitle>
                    <SheetDescription className='sr-only'>Select a page to navigate to.</SheetDescription>
                  </SheetHeader>
                  <nav className='flex flex-col items-center justify-center gap-2'>
                    {links.map((link) => {
                      const isActive = pathname === link.href;
                      return (
                        <Link
                          key={link.href}
                          href={link.href}
                          className={cn(
                            'relative w-full rounded-md px-4 py-2 text-center text-sm font-medium transition-colors',
                            isActive ? 'text-primary' : 'hover:text-primary text-gray-600 dark:text-gray-300 dark:hover:text-white',
                          )}
                        >
                          {link.label}
                          {isActive && (
                            <motion.div
                              className='bg-primary absolute top-0 left-0 h-full w-0.5'
                              layoutId='navbar-indicator'
                              transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                            />
                          )}
                        </Link>
                      );
                    })}
                  </nav>
                  <div></div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
