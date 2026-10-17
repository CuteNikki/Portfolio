'use client';

import { RotateCwIcon } from 'lucide-react';

import { HomeButton } from '@/components/common/home-button';
import { GridBackdrop, PageHeader } from '@/components/common/page-header';
import { Button } from '@/components/ui/button';

// Shown when a page or a layout below the root one fails, such as the dashboard when the database can't be reached
// to check the session. It replaces the layouts too, so it has no navbar: that reads the session on the server, which
// a client component like this can't render. Try again loads the failed part once more.
export default function Error({ retry }: { retry: () => void }) {
  return (
    <main className='flex min-h-svh overflow-x-clip'>
      <div className='container mx-auto flex w-full max-w-6xl flex-1 flex-col gap-10 px-4 py-10 sm:px-6 sm:py-16 lg:px-8'>
        <div className='relative isolate flex w-full flex-1 flex-col justify-center gap-10'>
          <GridBackdrop />
          <PageHeader
            backdrop={false}
            eyebrow='Something went wrong'
            title='This page didn’t load.'
            description='Something on the server failed for a moment. Trying again usually fixes it, and nothing you saved is lost.'
          />
          <div className='animate-hero-in flex flex-wrap items-center gap-3 delay-3'>
            <Button size='lg' onClick={() => retry()}>
              <RotateCwIcon />
              Try again
            </Button>
            <HomeButton quiet />
          </div>
        </div>
      </div>
    </main>
  );
}
