import { SITE_METADATA } from '@/constants/metadata';
import { requireWriter } from '@/lib/auth';
import { getAuthorOptions } from '@/lib/authors';

import { NewProjectForm } from '@/components/dashboard/projects/new';
import { DashboardPageHeader } from '@/components/dashboard/shared/page-header';

export const { dashboardNewProject: metadata } = SITE_METADATA;

// Every dashboard page checks the session before it renders anything, so moving between them waits for the server.
// The layout's `instant = false` only covers arriving from outside the dashboard.
export const instant = false;

export default async function NewProjectPage() {
  const session = await requireWriter();
  const authorOptions = await getAuthorOptions();

  return (
    <>
      <DashboardPageHeader
        title='New project'
        description='Describe it, then save a draft or publish it.'
      />
      <NewProjectForm
        authorOptions={authorOptions}
        authorIds={[session.user.id]}
      />
    </>
  );
}
