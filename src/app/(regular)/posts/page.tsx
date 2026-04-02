import { Suspense } from 'react';

import { NewspaperIcon } from 'lucide-react';

import { SITE_METADATA } from '@/constants/metadata';

import { PostList, PostListSkeleton } from '@/components/dashboard/posts/view';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const { posts: metadata } = SITE_METADATA;

export default function PostsPage() {
  return (
    <Card className='w-full max-w-5xl'>
      <CardHeader>
        <CardTitle className='text-primary-text flex items-center gap-2'>
          <NewspaperIcon className='size-6 shrink-0' /> Posts
        </CardTitle>
      </CardHeader>

      <CardContent>
        <Suspense fallback={<PostListSkeleton />}>
          <PostList />
        </Suspense>
      </CardContent>
    </Card>
  );
}
