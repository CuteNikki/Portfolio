import { AlertCircleIcon } from 'lucide-react';

import { HomeButton } from '@/components/common/home-button';
import { ScrollReveal } from '@/components/common/scroll-reveal';
import { Footer } from '@/components/navigation/footer';
import { Navbar } from '@/components/navigation/navbar';
import { SITE_METADATA } from '@/constants/metadata';

export const { notFound: metadata } = SITE_METADATA;

export default function NotFound() {
  return (
    <div className='flex min-h-screen flex-col'>
      <Navbar />
      <main className='container mx-auto flex w-full flex-1 items-center px-4 py-16 sm:px-6 lg:px-8'>
        <ScrollReveal className='scroll-reveal w-full max-w-3xl'>
          <section className='w-full'>
            <div
              data-reveal-item
              style={{ '--reveal-index': 0 } as React.CSSProperties}
              className='text-primary-text flex items-center gap-2 text-sm font-semibold tracking-[0.2em] uppercase'
            >
              <AlertCircleIcon className='size-4' /> Error 404
            </div>
            <h1
              data-reveal-item
              style={{ '--reveal-index': 1 } as React.CSSProperties}
              className='mt-6 max-w-2xl text-5xl font-bold tracking-[-0.06em] text-balance sm:text-7xl'
            >
              This page went somewhere else.
            </h1>
            <p
              data-reveal-item
              style={{ '--reveal-index': 2 } as React.CSSProperties}
              className='text-muted-foreground mt-6 max-w-xl text-lg leading-relaxed text-pretty'
            >
              The link may be outdated, or the page may have moved. Let&apos;s
              get you back to something useful.
            </p>
            <div
              data-reveal-item
              style={{ '--reveal-index': 3 } as React.CSSProperties}
              className='mt-8'
            >
              <HomeButton />
            </div>
          </section>
        </ScrollReveal>
      </main>
      <Footer />
    </div>
  );
}
