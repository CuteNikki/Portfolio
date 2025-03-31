'use client';

import { Moon, MoonIcon, OrbitIcon, Sun, SunIcon } from 'lucide-react';
import { useTheme } from 'next-themes';

import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

export function ThemeButton() {
  const { setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='outline' size='icon'>
          <Sun className='h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90' />
          <Moon className='absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0' />
          <span className='sr-only'>Toggle theme</span>
        </Button>
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
  );
}
