import Link from 'next/link';

import { AlertCircleIcon, ChevronLeftIcon } from 'lucide-react';

import { LINKS } from '@/constants/links';

import { ScrollReveal } from '@/components/common/scroll-reveal';
import { Button } from '@/components/ui/button';

export default function ProjectNotFound() {
  return (
    <ScrollReveal className='mx-auto w-full max-w-3xl py-8'>
      <section>
        <p
          data-reveal-item
          style={{ '--reveal-index': 0 } as React.CSSProperties}
          className='text-primary-text flex items-center gap-2 text-sm font-semibold tracking-[0.2em] uppercase'
        >
          <AlertCircleIcon className='size-4' /> Error 404
        </p>
        <h1
          data-reveal-item
          style={{ '--reveal-index': 1 } as React.CSSProperties}
          className='mt-6 text-4xl font-bold tracking-tight text-balance sm:text-5xl'
        >
          This project doesn&apos;t exist.
        </h1>
        <p
          data-reveal-item
          style={{ '--reveal-index': 2 } as React.CSSProperties}
          className='text-muted-foreground mt-6 max-w-xl text-lg leading-relaxed text-pretty'
        >
          It may have been renamed, unpublished or removed. Every other project
          is still here.
        </p>
        <div
          data-reveal-item
          style={{ '--reveal-index': 3 } as React.CSSProperties}
          className='mt-8'
        >
          <Button size='lg' asChild>
            <Link href={LINKS.projects.url}>
              <ChevronLeftIcon className='shrink-0' />
              Browse all projects
            </Link>
          </Button>
        </div>
      </section>
    </ScrollReveal>
  );
}
