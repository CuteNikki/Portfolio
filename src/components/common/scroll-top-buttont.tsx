'use client';

import { ArrowUpIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';

export function ScrollToTopButton() {
  return (
    <Button
      size='lg'
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
    >
      <ArrowUpIcon className='shrink-0' />
      Scroll to Top
    </Button>
  );
}
