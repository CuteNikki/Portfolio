'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { cn } from '@/lib/utils';

const links = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/projects', label: 'Projects' },
];

export function NavigationBar() {
  const pathname = usePathname();

  return (
    <header className='bg-background/95 supports-[backdrop-filter]:bg-background/60 border-background sticky top-0 z-50 w-full border-b backdrop-blur'>
      <div className='container mx-auto flex items-center justify-between px-4 py-3'>
        <Link href='/' className='text-primary text-xl font-bold'>
          Nikki
        </Link>

        {/* Desktop navigation */}
        <nav className='hidden items-center space-x-1 md:flex'>
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

      {/* Mobile navigation */}
      {/* @todo: add sheet component */}
    </header>
  );
}
