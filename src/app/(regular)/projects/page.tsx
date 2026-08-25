import { Suspense } from 'react';

import { PresentationIcon } from 'lucide-react';

import { SITE_METADATA } from '@/constants/metadata';

import { ScrollReveal } from '@/components/common/scroll-reveal';
import {
  ProjectList,
  ProjectListSkeleton,
} from '@/components/dashboard/projects/view';

export const { projects: metadata } = SITE_METADATA;

export default function ProjectsPage() {
  return (
    <section className='animate-rise-in flex w-full flex-col gap-8'>
      <header className='flex flex-col gap-4 border-b pb-8 sm:flex-row sm:items-end sm:justify-between'>
        <div className='flex flex-col gap-2'>
          <p className='text-primary-text flex items-center gap-2 text-sm font-semibold tracking-widest uppercase'>
            <PresentationIcon className='size-4 shrink-0' /> Selected work
          </p>
          <h1 className='text-5xl font-bold tracking-tighter sm:text-7xl'>
            Projects.
          </h1>
          <p className='text-muted-foreground max-w-xl leading-relaxed text-pretty'>
            A collection of products, experiments, and systems I&apos;ve helped
            bring to life.
          </p>
        </div>
      </header>
      <ScrollReveal className='scroll-reveal'>
        <Suspense fallback={<ProjectListSkeleton />}>
          <ProjectList />
        </Suspense>
      </ScrollReveal>
    </section>
  );
}
