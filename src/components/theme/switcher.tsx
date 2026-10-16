'use client';

import { useSyncExternalStore } from 'react';
import { useTheme } from 'next-themes';

import { SunMoonIcon } from 'lucide-react';

import { LazyMenu } from '@/components/common/lazy-menu';
import { themeById } from '@/components/theme/themes';
import { Button } from '@/components/ui/button';

const subscribeToNothing = () => () => {};
const loadMenu = () =>
  import('@/components/theme/switcher-menu').then((module) => module.default);

// The theme button in the navbar. Its menu loads on first use (see LazyMenu).
export function ThemeSwitcher({ className }: { className?: string }) {
  // False on the server and during hydration, true once the client has taken over
  const mounted = useSyncExternalStore(
    subscribeToNothing,
    () => true,
    () => false,
  );
  const { theme } = useTheme();

  // The server can't know the visitor's theme, so until the client takes over the button shows a neutral icon in
  // the same place and size, which keeps the layout from shifting
  if (!mounted) {
    return (
      <Button
        variant='outline'
        size='icon'
        className={className}
        disabled
        aria-label='Theme'
      >
        <SunMoonIcon className='size-4.5' />
      </Button>
    );
  }

  const current = themeById(theme);

  return (
    <LazyMenu
      load={loadMenu}
      props={{ className }}
      trigger={
        <Button
          variant='outline'
          size='icon'
          className={className}
          aria-label={`Theme: ${current.label}`}
        >
          <current.icon className='size-4.5' />
        </Button>
      }
    />
  );
}
