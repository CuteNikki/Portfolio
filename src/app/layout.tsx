import type { Viewport } from 'next';
import { JetBrains_Mono } from 'next/font/google';

import './globals.css';

import { SITE_METADATA } from '@/constants/metadata';

import { ThemeProvider } from '@/providers/theme';
import { ToastProvider } from '@/providers/toast';

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
});

export const { root: metadata } = SITE_METADATA;

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#fbfaf8' },
    { media: '(prefers-color-scheme: dark)', color: '#0b0b0f' },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // Suppress hydration warning due to theme mismatch between server and client
    <html lang='en' data-scroll-behavior='smooth' suppressHydrationWarning>
      {/* always show scrollbar to avoid layout shift when switching between scrollable and non-scrollable pages */}
      <body
        className={`${jetbrainsMono.variable} overflow-y-scroll font-mono antialiased`}
      >
        <div id='top' />
        <ThemeProvider
          enableSystem
          disableTransitionOnChange
          defaultTheme='system'
          attribute='class'
          themes={[
            'light',
            'dark',
            'system',
            'catppuccin-latte',
            'catppuccin-macchiato',
          ]}
        >
          <ToastProvider />
          {children}
        </ThemeProvider>
        <div id='bottom' />
      </body>
    </html>
  );
}
