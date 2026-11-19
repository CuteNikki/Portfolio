import Link from 'next/link';

import { ArrowRightIcon } from 'lucide-react';

import { LINKS } from '@/constants/links';

import { HomeButton } from '@/components/common/home-button';
import { GridBackdrop, PageHeader } from '@/components/common/page-header';
import { Button } from '@/components/ui/button';

// The body of the 404 page, with the same header and grid as the site's other pages. The text is centred in the space
// between the navbar and the footer, while the grid stays at the top as on every other page.
export function NotFoundContent() {
  return (
    <div className='relative isolate flex w-full flex-1 flex-col justify-center gap-10'>
      <GridBackdrop />
      <PageHeader
        backdrop={false}
        eyebrow='Error 404'
        title='This page went somewhere else.'
        description="The link may be outdated, or the page may have moved. Let's get you back to something useful."
      />
      <div className='animate-hero-in flex flex-wrap items-center gap-3 delay-3'>
        <HomeButton />
        <Button asChild variant='outline' size='lg'>
          <Link href={LINKS.projects.url}>
            View projects
            <ArrowRightIcon className='group-hover/button:translate-x-0.75' />
          </Link>
        </Button>
      </div>
    </div>
  );
}
