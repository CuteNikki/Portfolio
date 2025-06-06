'use client';

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { FolderIcon, HomeIcon, Moon, MoonIcon, OrbitIcon, Sun, SunIcon, UserIcon } from 'lucide-react';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function AlternativeNavbar() {
  const pathname = usePathname();
  const { setTheme } = useTheme();

  const links = [
    { href: '/', label: 'Home', icon: HomeIcon },
    { href: '/about', label: 'About', icon: UserIcon },
    { href: '/projects', label: 'Projects', icon: FolderIcon },
  ];

  return (
    <header className='sticky bottom-0 z-50 px-2 py-4 sm:hidden'>
      <div className='bg-background/95 supports-[backdrop-filter]:bg-background/50 outline-foreground/10 mx-auto w-fit rounded-xl outline backdrop-blur'>
        <nav className='flex items-center gap-2 px-4 pt-2'>
          <DropdownMenu>
            <DropdownMenuTrigger className='cursor-pointer'>
              <Sun className='hover:text-foreground text-muted-foreground m-2 size-6 shrink-0 transition-all dark:hidden' />
              <Moon className='hover:text-foreground text-muted-foreground m-2 hidden size-6 shrink-0 transition-all dark:block' />
              <span className='sr-only'>Toggle theme</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='center' side='bottom'>
              <DropdownMenuItem className='justify-between' onClick={() => setTheme('light')}>
                Light <SunIcon />
              </DropdownMenuItem>
              <DropdownMenuItem className='justify-between' onClick={() => setTheme('dark')}>
                Dark <MoonIcon />
              </DropdownMenuItem>
              <DropdownMenuItem className='justify-between' onClick={() => setTheme('system')}>
                System <OrbitIcon />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link key={link.href} href={link.href} className='relative flex flex-col items-center rounded-md text-sm font-medium'>
                <link.icon
                  className={cn(
                    'hover:text-foreground m-2 size-6 shrink-0 transition-colors duration-300',
                    isActive ? 'text-foreground' : 'text-muted-foreground',
                  )}
                />
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
    </header>
  );
}
