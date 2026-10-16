import Link from 'next/link';

import { ArrowLeftIcon, SearchXIcon } from 'lucide-react';

import { LINKS } from '@/constants/links';

import { Button } from '@/components/ui/button';

// Shown inside the dashboard, next to its sidebar, for addresses that don't exist there and for posts or projects
// that were deleted
export default function DashboardNotFound() {
  return (
    <section className='bg-card flex flex-col items-start gap-5 rounded-xl border p-8 sm:p-10'>
      <span className='bg-muted text-muted-foreground grid size-12 place-items-center rounded-xl'>
        <SearchXIcon aria-hidden className='size-6' />
      </span>
      <div>
        <h1 className='text-[28px] leading-tight font-bold tracking-[-0.05em]'>
          Nothing here
        </h1>
        <p className='text-body mt-2 max-w-lg text-sm'>
          This page doesn’t exist, or the post or project it showed was deleted.
          The sidebar has everything else.
        </p>
      </div>
      <div className='flex flex-wrap gap-2'>
        <Button asChild>
          <Link href={LINKS.dashboardOverview.url}>
            <ArrowLeftIcon />
            Back to overview
          </Link>
        </Button>
        <Button asChild variant='outline'>
          <Link href={LINKS.dashboardPosts.url}>Posts</Link>
        </Button>
        <Button asChild variant='outline'>
          <Link href={LINKS.dashboardProjects.url}>Projects</Link>
        </Button>
      </div>
    </section>
  );
}
