import { AlertCircleIcon } from 'lucide-react';

import { HomeButton } from '@/components/common/home-button';
import { Footer } from '@/components/navigation/footer';
import { Navbar } from '@/components/navigation/navbar';
import { SITE_METADATA } from '@/constants/metadata';

export const { notFound: metadata } = SITE_METADATA;

export default function NotFound() {
  return (
    <div className='flex min-h-screen flex-col'>
      <Navbar />
      <main className='container mx-auto flex w-full flex-1 items-center px-4 py-16 sm:px-6 lg:px-8'>
        <section className='w-full max-w-3xl border-t border-border pt-8'>
          <div className='flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-primary-text'>
            <AlertCircleIcon className='size-4' /> Error 404
          </div>
          <h1 className='mt-6 max-w-2xl text-balance text-5xl font-bold tracking-[-0.06em] sm:text-7xl'>
            This page went somewhere else.
          </h1>
          <p className='text-muted-foreground mt-6 max-w-xl text-pretty text-lg leading-relaxed'>
            The link may be outdated, or the page may have moved. Let&apos;s get you back to something useful.
          </p>
          <div className='mt-8'>
            <HomeButton />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
