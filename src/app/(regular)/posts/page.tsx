import { Suspense } from 'react';

import { toPostRow } from '@/lib/cards';
import { getDraftPosts, getPublishedPosts } from '@/lib/data';

import { SITE_METADATA } from '@/constants/metadata';

import { PageHeader } from '@/components/common/page-header';
import { PostBrowser } from '@/components/posts/post-browser';
import { PostRow } from '@/components/posts/post-row';

export const { posts: metadata } = SITE_METADATA;

export default function PostsPage() {
  return (
    <div className='flex w-full flex-col gap-10'>
      <PageHeader
        eyebrow='Notes & thinking'
        title='Writing.'
        description='Notes on building products, learning in public, and the details that make the work better.'
      />
      {/* Drafts read the session, so they stream in after the prerendered list */}
      <Suspense fallback={null}>
        <Drafts />
      </Suspense>
      <PublishedPosts />
    </div>
  );
}

async function PublishedPosts() {
  const posts = await getPublishedPosts();

  if (posts.length === 0) {
    return (
      <p className='text-muted-foreground py-20 text-center'>
        No posts yet. Check back later!
      </p>
    );
  }

  return <PostBrowser posts={posts.map(toPostRow)} />;
}

// Only writers see unpublished posts
async function Drafts() {
  const drafts = await getDraftPosts();
  if (drafts.length === 0) return null;

  return (
    <section aria-labelledby='drafts-heading' className='flex flex-col gap-2'>
      <h2 id='drafts-heading' className='text-lg font-bold tracking-[-0.03em]'>
        Drafts{' '}
        <span className='text-muted-foreground font-normal'>
          · only writers see these
        </span>
      </h2>
      <div className='flex flex-col gap-2'>
        {drafts.map((post) => (
          <PostRow key={post.id} post={toPostRow(post)} />
        ))}
      </div>
    </section>
  );
}
