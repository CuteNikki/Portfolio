import { PresentationIcon } from 'lucide-react';

import { SITE_METADATA } from '@/constants/metadata';

export const { projects: metadata } = SITE_METADATA;

export default function Projects() {
  return (
    <div>
      <div className='flex w-full max-w-5xl flex-col gap-4 border p-4 sm:p-8'>
        <h1 className='text-primary-text flex items-center gap-2 text-xl font-semibold'>
          <PresentationIcon className='shrink-0' /> Projects
        </h1>
      </div>
      <div>
        {/* {projects.map((project) => (
          <div key={project.id} className='rounded-md border p-4'></div>
        ))} */}
      </div>
    </div>
  );
}
