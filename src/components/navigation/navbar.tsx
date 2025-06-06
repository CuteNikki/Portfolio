'use client';

import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

import { FolderIcon, HomeIcon, Moon, MoonIcon, OrbitIcon, Sun, SunIcon, UserIcon } from 'lucide-react';

import { cn, useIndicatorPosition } from '@/lib/utils';

import { ThemeButton } from '@/components/theme/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

const links = [
  { href: '/', label: 'Home', icon: HomeIcon },
  { href: '/about', label: 'About', icon: UserIcon },
  { href: '/projects', label: 'Projects', icon: FolderIcon },
];

export function DesktopNavbar() {
  const [mounted, setMounted] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  const pathname = usePathname();
  const navRef = useRef<HTMLElement | null>(null);
  const indicatorStyle = useIndicatorPosition(navRef, pathname, mounted);

  useEffect(() => {
    setMounted(true);

    function onResize() {
      setIsDesktop(window.innerWidth >= 640);
    }

    onResize();

    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  if (!isDesktop) return null;

  return (
    <header className='sticky top-0 z-50 hidden px-2 py-4 sm:block'>
      <div className='bg-background/95 supports-[backdrop-filter]:bg-background/50 outline-foreground/10 mx-auto w-full max-w-6xl rounded-xl outline backdrop-blur'>
        <div className='flex items-center justify-between px-4 py-2'>
          <Link href='#top' className='hover:text-primary px-2 text-sm font-medium text-gray-600 transition-colors dark:text-gray-300 dark:hover:text-white'>
            Nikki
          </Link>

          <div className='flex gap-2'>
            <ThemeButton />
            <nav ref={navRef} className='relative hidden items-center space-x-1 sm:flex'>
              {links.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    data-active={pathname === link.href ? 'true' : undefined}
                    className={cn(
                      'relative flex-nowrap rounded-md px-3 py-2 text-sm font-medium transition-colors',
                      isActive ? 'text-primary' : 'hover:text-primary text-gray-600 dark:text-gray-300 dark:hover:text-white',
                    )}
                  >
                    {link.label}
                  </Link>
                );
              })}
              <motion.div
                className='bg-primary absolute bottom-0 h-0.5'
                animate={{
                  left: mounted ? indicatorStyle.left : 0,
                  width: mounted ? indicatorStyle.width : 0,
                }}
                transition={{ type: 'spring', stiffness: 350, damping: 30 }}
              />
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
}

export function MobileNavbar() {
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const pathname = usePathname();
  const { setTheme } = useTheme();

  const navRef = useRef<HTMLElement | null>(null);
  const indicatorStyle = useIndicatorPosition(navRef, pathname, mounted);

  useEffect(() => {
    setMounted(true);

    function onResize() {
      setIsMobile(window.innerWidth < 640);
    }

    onResize();

    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  if (!isMobile) return null;

  return (
    <header className='sticky bottom-0 z-50 px-2 py-4 sm:hidden'>
      <div className='bg-background/95 supports-[backdrop-filter]:bg-background/50 outline-foreground/10 mx-auto w-fit rounded-xl outline backdrop-blur'>
        <nav ref={navRef} suppressHydrationWarning className='relative flex items-center gap-2 px-4 pt-2'>
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
              <Link
                key={link.href}
                href={link.href}
                data-active={pathname === link.href ? 'true' : undefined}
                aria-label={link.label || 'unknown'}
                className='relative flex flex-col flex-nowrap items-center rounded-md text-sm font-medium'
              >
                <link.icon
                  className={cn(
                    'hover:text-foreground m-2 size-6 shrink-0 transition-colors duration-300',
                    isActive ? 'text-foreground' : 'text-muted-foreground',
                  )}
                />
              </Link>
            );
          })}
          <motion.div
            className='bg-primary absolute bottom-0 h-0.5 rounded-full'
            animate={{
              left: mounted ? indicatorStyle.left : 0,
              width: mounted ? indicatorStyle.width : 0,
            }}
            transition={{ type: 'spring', stiffness: 350, damping: 30 }}
          />
        </nav>
      </div>
    </header>
  );
}
