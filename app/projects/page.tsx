import { Projects } from '@/components/sections/projects';
import { Suspense } from 'react';

export default function ProjectsPage() {
  return (
    <main className='relative overflow-hidden'>
      <Suspense fallback={<></>}>
        <Projects />
      </Suspense>
    </main>
  );
}
