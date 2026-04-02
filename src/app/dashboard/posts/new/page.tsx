import { NewspaperIcon } from 'lucide-react';

import { SITE_METADATA } from '@/constants/metadata';

import { NewPostForm } from '@/components/dashboard/posts/new';
import { DashboardHeader } from '@/components/dashboard/shared/header';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export const { dashboardNewPost: metadata } = SITE_METADATA;

export default function NewPostPage() {
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
