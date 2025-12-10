import { Geist, Geist_Mono } from 'next/font/google';

import { DEFAULT_METADATA } from '@/constants/metadata';

import { DesktopNavbar, MobileNavbar } from '@/components/navigation/navbar';
import { NextThemeProvider } from '@/components/theme/provider';
import { Toaster } from '@/components/ui/sonner';

import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata = DEFAULT_METADATA;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' suppressHydrationWarning>
      {/* Permanently show scrollbar to prevent layout shift */}
      <body className={`${geistSans.variable} ${geistMono.variable} flex min-h-screen flex-col overflow-y-scroll antialiased`}>
        {/* Apply system theme */}
        <NextThemeProvider attribute='class' defaultTheme='system' enableSystem disableTransitionOnChange>
          <Toaster richColors />

          {/* Navbar */}
          <DesktopNavbar />

          {/* Page Content and anchors */}
          <div id='top' />
          <main className='flex flex-1 flex-col'>{children}</main>
          <div id='bottom' className='p-4' />

          {/* Navbar */}
          <MobileNavbar />
        </NextThemeProvider>
      </body>
    </html>
  );
}
