'use client';

import { useTheme } from 'next-themes';
import { Toaster } from 'sonner';

export function ToastProvider() {
  const { theme } = useTheme();

  return <Toaster richColors theme={isValidTheme(theme) ? theme : 'system'} />;
}

function isValidTheme(theme: unknown): theme is 'light' | 'dark' | 'system' {
  return ['light', 'dark', 'system'].includes(theme as string);
}
