import { JetBrains_Mono } from 'next/font/google';

import './globals.css';

import { SITE_METADATA } from '@/constants/metadata';

import { ThemeProvider } from '@/providers/theme';
import { ToastProvider } from '@/providers/toast';

import { Footer } from '@/components/navigation/footer';
import { Navbar } from '@/components/navigation/navbar';

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
});

export const metadata = SITE_METADATA.root;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // Suppress hydration warning due to theme mismatch between server and client
    <html lang='en' suppressHydrationWarning>
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
          <div className='flex min-h-screen flex-col items-center justify-center'>
            <Navbar />
            <div className='flex w-full flex-1'>
              <main className='xs:py-8 xs:px-4 container mx-auto flex flex-col items-center justify-center gap-8 p-4 px-2'>
                {children}
              </main>
            </div>
            <Footer />
          </div>
        </ThemeProvider>
        <div id='bottom' />
      </body>
    </html>
  );
}
