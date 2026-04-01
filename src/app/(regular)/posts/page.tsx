import { NewspaperIcon } from 'lucide-react';

import { SITE_METADATA } from '@/constants/metadata';

import { PostList, PostListSkeleton } from '@/components/dashboard/posts/view';
import { Suspense } from 'react';

export const { posts: metadata } = SITE_METADATA;

export default function PostsPage() {
  return (
    <div className='flex w-full max-w-5xl flex-col gap-6 border p-4 sm:p-8'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <h1 className='text-primary-text flex items-center gap-2 text-2xl font-bold'>
          <NewspaperIcon className='size-6 shrink-0' /> Posts
        </h1>
      </div>

      <Suspense fallback={<PostListSkeleton />}>
        <PostList />
      </Suspense>
    </div>
  );
}
