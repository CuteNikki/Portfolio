'use client';

import { useSyncExternalStore } from 'react';
import { useTheme } from 'next-themes';

import {
  CoffeeIcon,
  type LucideIcon,
  MonitorIcon,
  MoonIcon,
  MoonStarIcon,
  SunIcon,
  SunMoonIcon,
} from 'lucide-react';

import { cn } from '@/lib/utils';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const THEMES: { id: string; label: string; icon: LucideIcon }[] = [
  { id: 'light', label: 'Light', icon: SunIcon },
  { id: 'dark', label: 'Dark', icon: MoonIcon },
  { id: 'system', label: 'System', icon: MonitorIcon },
  { id: 'catppuccin-latte', label: 'Catppuccin Latte', icon: CoffeeIcon },
  {
    id: 'catppuccin-macchiato',
    label: 'Catppuccin Macchiato',
    icon: MoonStarIcon,
  },
];

const subscribeToNothing = () => () => {};

export function ThemeSwitcher({ className }: { className?: string }) {
  // False on the server and during hydration, true once the client has taken over
  const mounted = useSyncExternalStore(
    subscribeToNothing,
    () => true,
    () => false,
  );
  const { theme, setTheme } = useTheme();

  // The server can't know the visitor's theme, so until the client takes over the button shows a neutral icon in
  // the same place and size, which keeps the layout from shifting
  if (!mounted) {
    return (
      <Button
        variant='outline'
        size='icon-lg'
        className={className}
        disabled
        aria-label='Theme'
      >
        <SunMoonIcon className='size-4.5' />
      </Button>
    );
  }

  const current = THEMES.find(({ id }) => id === theme) ?? THEMES[2];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant='outline'
          size='icon-lg'
          className={cn(className)}
          aria-label={`Theme: ${current.label}`}
        >
          <current.icon className='size-4.5' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='w-64'>
        <DropdownMenuLabel className='text-muted-foreground px-2.5 pt-1.5 pb-1 text-[11px] font-normal tracking-widest uppercase'>
          Theme
        </DropdownMenuLabel>
        <DropdownMenuRadioGroup value={current.id} onValueChange={setTheme}>
          {THEMES.map(({ id, label, icon: Icon }) => (
            <DropdownMenuRadioItem key={id} value={id}>
              <Icon className='text-muted-foreground' />
              {label}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
