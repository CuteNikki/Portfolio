'use client';

import { useTheme } from 'next-themes';
import { Toaster } from 'sonner';

// Sonner only knows light and dark, so the Catppuccin themes map to the one they're based on
const TOAST_THEMES: Record<string, 'light' | 'dark'> = {
  light: 'light',
  dark: 'dark',
  'catppuccin-latte': 'light',
  'catppuccin-macchiato': 'dark',
};

export function ToastProvider() {
  const { resolvedTheme } = useTheme();

  return (
    <Toaster
      richColors
      theme={(resolvedTheme && TOAST_THEMES[resolvedTheme]) || 'system'}
    />
  );
}
