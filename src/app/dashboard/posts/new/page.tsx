import { NewspaperIcon } from 'lucide-react';

import { SITE_METADATA } from '@/constants/metadata';
import { requireAdmin } from '@/lib/auth';

import { NewPostForm } from '@/components/dashboard/posts/new';
import { DashboardHeader } from '@/components/dashboard/shared/header';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export const { dashboardNewPost: metadata } = SITE_METADATA;

export default async function NewPostPage() {
  await requireAdmin();

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
        <NewPostForm />
      </CardContent>
    </Card>
  );
}
