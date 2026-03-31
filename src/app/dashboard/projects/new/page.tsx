import { PresentationIcon } from 'lucide-react';

import { SITE_METADATA } from '@/constants/metadata';

import { NewProjectForm } from '@/components/dashboard/projects/new';
import { DashboardHeader } from '@/components/dashboard/shared/header';

export const { dashboardNewProject: metadata } = SITE_METADATA;

export default function NewProjectPage() {
  return (
    <div className='flex w-full max-w-5xl flex-col gap-4 justify-self-center border p-4 sm:p-8'>
      <DashboardHeader
        icon={PresentationIcon}
        title={'Create new Project'}
        description={'Draft and publish a new project.'}
      />
      <NewProjectForm />
    </div>
  );
}
