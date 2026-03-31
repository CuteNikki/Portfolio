import { NewspaperIcon } from 'lucide-react';

import { SITE_METADATA } from '@/constants/metadata';

import { NewPostForm } from '@/components/dashboard/posts/new';
import { DashboardHeader } from '@/components/dashboard/shared/header';

export const { dashboardNewPost: metadata } = SITE_METADATA;

export default function NewPostPage() {
  return (
    <div className='flex w-full max-w-5xl flex-col gap-4 justify-self-center border p-4 sm:p-8'>
      <DashboardHeader
        icon={NewspaperIcon}
        title={'Create new Post'}
        description={'Draft and publish a new post.'}
      />
      <NewPostForm />
    </div>
  );
}
