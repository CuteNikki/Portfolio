import { PresentationIcon } from 'lucide-react';

import { SITE_METADATA } from '@/constants/metadata';

import { NewProjectForm } from '@/components/dashboard/projects/new';
import { DashboardHeader } from '@/components/dashboard/shared/header';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export const { dashboardNewProject: metadata } = SITE_METADATA;

export default function NewProjectPage() {
  return (
    <Card className='w-full max-w-5xl'>
      <CardHeader>
        <DashboardHeader
          icon={PresentationIcon}
          title={'Create new Project'}
          description={'Draft and publish a new project.'}
        />
      </CardHeader>
      <CardContent>
        <NewProjectForm />
      </CardContent>
    </Card>
  );
}
