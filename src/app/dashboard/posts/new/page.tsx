import { SITE_METADATA } from '@/constants/metadata';
import { requireWriter } from '@/lib/auth';
import { getAuthorOptions } from '@/lib/authors';

import { NewPostForm } from '@/components/dashboard/posts/new';
import { DashboardPageHeader } from '@/components/dashboard/shared/page-header';

export const { dashboardNewPost: metadata } = SITE_METADATA;

// Every dashboard page checks the session before it renders anything, so moving between them waits for the server.
// The layout's `instant = false` only covers arriving from outside the dashboard.
export const instant = false;

export default async function NewPostPage() {
  const session = await requireWriter();
  const authorOptions = await getAuthorOptions();

  return (
    <>
      <DashboardPageHeader
        title='New post'
        description='Write it, then save a draft or publish it.'
      />
      <NewPostForm
        authorOptions={authorOptions}
        authors={[{ userId: session.user.id }]}
      />
    </>
  );
}
