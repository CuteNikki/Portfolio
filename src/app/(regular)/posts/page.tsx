import { Suspense } from 'react';

import { NewspaperIcon } from 'lucide-react';

import { SITE_METADATA } from '@/constants/metadata';

import { ScrollReveal } from '@/components/common/scroll-reveal';
import { PostList, PostListSkeleton } from '@/components/dashboard/posts/view';

export const { posts: metadata } = SITE_METADATA;

export default function PostsPage() {
  return (
    <section className='animate-rise-in flex w-full flex-col gap-8'>
      <header className='flex flex-col gap-4 border-b pb-8 sm:flex-row sm:items-end sm:justify-between'>
        <div className='flex flex-col gap-2'>
          <p className='text-primary-text flex items-center gap-2 text-sm font-semibold tracking-widest uppercase'>
            <NewspaperIcon className='size-4 shrink-0' /> Notes & thinking
          </p>
          <h1 className='text-5xl font-bold tracking-tighter sm:text-7xl'>
            Writing<span className='text-primary-text'>.</span>
          </h1>
          <p className='text-muted-foreground max-w-xl leading-relaxed text-pretty'>
            Notes on building products, learning in public, and the details that
            make the work better.
          </p>
        </div>
      </header>
      <ScrollReveal className='scroll-reveal'>
        <Suspense fallback={<PostListSkeleton />}>
          <PostList />
        </Suspense>
      </ScrollReveal>
    </section>
  );
}
