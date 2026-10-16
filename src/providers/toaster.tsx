'use client';

import { useEffect } from 'react';

import { useTheme } from 'next-themes';
import { Toaster } from 'sonner';

import { toasterMounted } from '@/lib/toast';

// Sonner only knows light and dark, so the Catppuccin themes map to the one they're based on
const TOAST_THEMES: Record<string, 'light' | 'dark'> = {
  light: 'light',
  dark: 'dark',
  'catppuccin-latte': 'light',
  'catppuccin-macchiato': 'dark',
};

export default function LoadedToaster() {
  const { resolvedTheme } = useTheme();

  // Runs after the Toaster's own effects, so it is listening by now
  useEffect(() => {
    toasterMounted();
  }, []);

  return (
    <Toaster
      richColors
      theme={(resolvedTheme && TOAST_THEMES[resolvedTheme]) || 'system'}
    />
  );
}
