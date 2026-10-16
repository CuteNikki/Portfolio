'use client';

import { toast } from '@/lib/toast';

// The "#" before a heading that copies a link to it. The rest of the markdown renders on the server, so this is the
// only part that ships to the browser.
export function HeadingLink({ id }: { id: string }) {
  const copyLink = () => {
    const url = `${window.location.href.split('#')[0]}#${id}`;
    navigator.clipboard
      .writeText(url)
      .then(() => toast.success('Section link copied!'))
      .catch(() => toast.error('Failed to copy link'));
  };

  return (
    <button
      type='button'
      onClick={copyLink}
      // Sits in the margin left of the heading. Small screens have no margin to spare and no hover, so it's left out there.
      className='text-muted-foreground hover:text-primary-text focus-visible:text-primary-text absolute right-full cursor-pointer pr-3 font-normal opacity-0 transition-opacity select-none group-hover:opacity-100 focus-visible:opacity-100 max-sm:hidden'
      title='Copy link to section'
      aria-label='Copy link to section'
    >
      #
    </button>
  );
}
