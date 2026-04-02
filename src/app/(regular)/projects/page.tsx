import { Suspense } from 'react';

import { PresentationIcon } from 'lucide-react';

import { SITE_METADATA } from '@/constants/metadata';

import {
  ProjectList,
  ProjectListSkeleton,
} from '@/components/dashboard/projects/view';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const { projects: metadata } = SITE_METADATA;

export default function ProjectsPage() {
  return (
    <Card className='w-full max-w-5xl'>
      <CardHeader>
        <CardTitle className='text-primary-text flex items-center gap-2'>
          <PresentationIcon className='size-6 shrink-0' /> Projects
        </CardTitle>
      </CardHeader>

      <CardContent>
        <Suspense fallback={<ProjectListSkeleton />}>
          <ProjectList />
        </Suspense>
      </CardContent>
    </Card>
  );
}
