import { Suspense } from 'react';
import { ArrowUpRightIcon, NewspaperIcon } from 'lucide-react';
import { SITE_METADATA } from '@/constants/metadata';
import { PostList, PostListSkeleton } from '@/components/dashboard/posts/view';

export const { posts: metadata } = SITE_METADATA;

export default function PostsPage() {
  return <section className='animate-rise-in flex w-full flex-col gap-8'>
    <header className='flex flex-col gap-4 border-b pb-8 sm:flex-row sm:items-end sm:justify-between'>
      <div className='flex flex-col gap-3'><p className='text-muted-foreground flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em]'><NewspaperIcon className='size-4' /> Notes & thinking</p><h1 className='text-5xl font-bold tracking-[-0.05em] sm:text-7xl'>Writing<span className='text-muted-foreground'>.</span></h1><p className='text-muted-foreground max-w-xl text-pretty leading-relaxed'>Notes on building products, learning in public, and the details that make the work better.</p></div>
      <ArrowUpRightIcon className='text-muted-foreground hidden size-8 sm:block' />
    </header>
    <Suspense fallback={<PostListSkeleton />}><PostList /></Suspense>
  </section>;
}
