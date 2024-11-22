import { Metadata } from 'next';
import { Suspense } from 'react';

import { Projects } from '@/components/sections/projects';

export const metadata: Metadata = {
  title: "Nikki's Projects",
  description:
    "Looking for my work? You've come to the righ place!\nHere are some of my projects.",
};

export default function ProjectsPage() {
  return (
    <main className='relative overflow-hidden'>
      <Suspense fallback={<></>}>
        <Projects />
      </Suspense>
    </main>
  );
}
