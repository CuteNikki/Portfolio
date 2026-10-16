'use client';

import { ArrowUpIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';

export function ScrollToTopButton() {
  return (
    <Button
      size='lg'
      // No behavior here: the page's CSS scrolls smoothly, except for people who asked for reduced motion
      onClick={() => window.scrollTo({ top: 0 })}
    >
      <ArrowUpIcon className='shrink-0' />
      Scroll to Top
    </Button>
  );
}
