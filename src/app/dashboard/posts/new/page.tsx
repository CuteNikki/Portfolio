import { NewspaperIcon } from 'lucide-react';

import { SITE_METADATA } from '@/constants/metadata';
import { requireWriter } from '@/lib/auth';
import { getAuthorOptions } from '@/lib/authors';

import { NewPostForm } from '@/components/dashboard/posts/new';
import { DashboardHeader } from '@/components/dashboard/shared/header';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export const { dashboardNewPost: metadata } = SITE_METADATA;

// Every dashboard page checks the session before it renders anything, so moving between them waits for the server.
// The layout's `instant = false` only covers arriving from outside the dashboard.
export const instant = false;

export default async function NewPostPage() {
  const session = await requireWriter();
  const authorOptions = await getAuthorOptions();

  return (
    <Card className='w-full max-w-5xl'>
      <CardHeader>
        <DashboardHeader
          icon={NewspaperIcon}
          title={'Create new Post'}
          description={'Draft and publish a new post.'}
        />
      </CardHeader>
      <CardContent>
        <NewPostForm
          authorOptions={authorOptions}
          authorIds={[session.user.id]}
        />
      </CardContent>
    </Card>
  );
}
