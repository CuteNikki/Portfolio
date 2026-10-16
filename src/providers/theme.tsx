'use client';

import { ThemeProvider as NextThemesProvider } from 'next-themes';

// next-themes sets the theme with an inline script before the page paints. It only runs from the server's HTML; when
// React renders the provider in the browser instead, as on 404 pages, it warns about the script. Marking it as plain
// text there tells React it is data, not code, and the server's HTML keeps it runnable. The script already accepts a
// different attribute between the two, as next-themes does the same for its nonce.
const SCRIPT_PROPS = {
  type: typeof window === 'undefined' ? 'text/javascript' : 'text/plain',
};

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return (
    <NextThemesProvider scriptProps={SCRIPT_PROPS} {...props}>
      {children}
    </NextThemesProvider>
  );
}
