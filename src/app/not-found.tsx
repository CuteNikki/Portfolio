import { AlertCircleIcon } from 'lucide-react';

import { SITE_METADATA } from '@/constants/metadata';

import { HomeButton } from '@/components/common/home-button';
import { ScrollReveal } from '@/components/common/scroll-reveal';
import { Footer } from '@/components/navigation/footer';
import { Navbar } from '@/components/navigation/navbar';

export const { notFound: metadata } = SITE_METADATA;

export default function NotFound() {
  return (
    <div className='site-shell flex min-h-svh flex-col'>
      <Navbar />
      <main className='flex flex-1'>
        <div className='container mx-auto flex w-full max-w-6xl flex-1 flex-col items-center justify-center gap-10 px-4 py-10 sm:px-6 sm:py-16 lg:px-8'>
          <ScrollReveal className='scroll-reveal'>
            <section>
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
        </div>
      </main>
      <Footer />
    </div>
  );
}
