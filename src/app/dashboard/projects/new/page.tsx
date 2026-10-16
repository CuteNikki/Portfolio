import { PresentationIcon } from 'lucide-react';

import { SITE_METADATA } from '@/constants/metadata';
import { requireWriter } from '@/lib/auth';
import { getAuthorOptions } from '@/lib/authors';

import { NewProjectForm } from '@/components/dashboard/projects/new';
import { DashboardHeader } from '@/components/dashboard/shared/header';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export const { dashboardNewProject: metadata } = SITE_METADATA;

// Every dashboard page checks the session before it renders anything, so moving between them waits for the server.
// The layout's `instant = false` only covers arriving from outside the dashboard.
export const instant = false;

export default async function NewProjectPage() {
  const session = await requireWriter();
  const authorOptions = await getAuthorOptions();

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
        <NewProjectForm
          authorOptions={authorOptions}
          authorIds={[session.user.id]}
        />
      </CardContent>
    </Card>
  );
}
