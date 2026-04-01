import { PresentationIcon } from 'lucide-react';

import { SITE_METADATA } from '@/constants/metadata';

import {
  ProjectList,
  ProjectListSkeleton,
} from '@/components/dashboard/projects/view';
import { Suspense } from 'react';

export const { projects: metadata } = SITE_METADATA;

export default function ProjectsPage() {
  return (
    <div className='flex w-full max-w-5xl flex-col gap-6 border p-4 sm:p-8'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <h1 className='text-primary-text flex items-center gap-2 text-2xl font-bold'>
          <PresentationIcon className='size-6 shrink-0' /> Projects
        </h1>
      </div>

      <Suspense fallback={<ProjectListSkeleton />}>
        <ProjectList />
      </Suspense>
    </div>
  );
}
