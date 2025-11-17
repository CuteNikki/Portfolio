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
        <Button variant='ghost' size='icon'>
          <Sun className='h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0' />
          <Moon className='absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100' />
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
