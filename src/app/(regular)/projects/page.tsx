import { Suspense } from 'react';
import { ArrowUpRightIcon, PresentationIcon } from 'lucide-react';
import { SITE_METADATA } from '@/constants/metadata';
import { ProjectList, ProjectListSkeleton } from '@/components/dashboard/projects/view';

export const { projects: metadata } = SITE_METADATA;

export default function ProjectsPage() {
  return <section className='animate-rise-in flex w-full flex-col gap-8'>
    <header className='flex flex-col gap-4 border-b pb-8 sm:flex-row sm:items-end sm:justify-between'>
      <div className='flex flex-col gap-3'><p className='text-muted-foreground flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em]'><PresentationIcon className='size-4' /> Selected work</p><h1 className='text-5xl font-bold tracking-[-0.05em] sm:text-7xl'>Projects<span className='text-muted-foreground'>.</span></h1><p className='text-muted-foreground max-w-xl text-pretty leading-relaxed'>A collection of products, experiments, and systems I&apos;ve helped bring to life.</p></div>
      <ArrowUpRightIcon className='text-muted-foreground hidden size-8 sm:block' />
    </header>
    <Suspense fallback={<ProjectListSkeleton />}><ProjectList /></Suspense>
  </section>;
}
