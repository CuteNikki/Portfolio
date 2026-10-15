'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useSyncExternalStore } from 'react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const subscribeToNothing = () => () => {};

export function ThemeSwitcher({ className }: { className?: string }) {
  // False on the server and during hydration, true once the client has taken over
  const mounted = useSyncExternalStore(
    subscribeToNothing,
    () => true,
    () => false,
  );
  const { setTheme } = useTheme();

  // During SSR and the initial client hydration, render a non-interactive fallback
  // that looks identical to the actual trigger button to prevent layout shift.
  if (!mounted) {
    return (
      <Button variant='outline' size='icon' className={className} disabled>
        <Sun className='h-[1.2rem] w-[1.2rem] scale-100 rotate-0 opacity-50 transition-all dark:scale-0 dark:-rotate-90' />
        <Moon className='absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 opacity-50 transition-all dark:scale-100 dark:rotate-0' />
        <span className='sr-only'>Toggle theme</span>
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className={className} asChild>
        <Button variant='outline' size='icon'>
          <Sun className='h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90' />
          <Moon className='absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0' />
          <span className='sr-only'>Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        <DropdownMenuItem onClick={() => setTheme('light')}>
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('dark')}>
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('system')}>
          System
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('catppuccin-latte')}>
          Catppuccin Latte
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('catppuccin-macchiato')}>
          Catppuccin Macchiato
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
