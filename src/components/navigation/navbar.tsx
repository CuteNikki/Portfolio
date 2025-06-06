'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { cn } from '@/lib/utils';

import { ThemeButton } from '@/components/theme/button';

const links = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/projects', label: 'Projects' },
];

export function NavigationBar() {
  const pathname = usePathname();

  return (
    <header className='sticky top-0 z-50 hidden px-2 py-4 sm:block'>
      <div className='bg-background/95 supports-[backdrop-filter]:bg-background/50 outline-foreground/10 mx-auto w-full max-w-6xl rounded-xl outline backdrop-blur'>
        <div className='flex items-center justify-between px-4 py-2'>
          <Link href='#top' className='hover:text-primary px-2 text-sm font-medium text-gray-600 transition-colors dark:text-gray-300 dark:hover:text-white'>
            Nikki
          </Link>

          <div className='flex gap-2'>
            <ThemeButton />
            <nav className='flex items-center space-x-1'>
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
          </div>
        </div>
      </div>
    </header>
  );
}
