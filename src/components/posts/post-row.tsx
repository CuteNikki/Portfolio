import Image from 'next/image';
import Link from 'next/link';

import { cn, toneFor } from '@/lib/utils';

export interface PostRowData {
  id: string;
  href: string;
  title: string;
  excerpt: string;
  date: string;
  time: number;
  views: number;
  coverUrl: string | null;
}

// A post in a list: its cover on the left, then the date, title and excerpt. The title's underline sweeps in on hover.
export function PostRow({ post }: { post: PostRowData }) {
  return (
    <Link
      href={post.href}
      className='group flex flex-col gap-5 border-b py-6 sm:flex-row sm:items-center sm:gap-8'
    >
      <div
        className={cn(
          'relative aspect-16/10 w-full shrink-0 overflow-hidden rounded-xl sm:w-60',
          'bg-[color-mix(in_oklab,var(--tone)_14%,var(--card))]',
        )}
        style={{ '--tone': toneFor(post.title) } as React.CSSProperties}
      >
        {post.coverUrl ? (
          <Image
            src={post.coverUrl}
            alt=''
            fill
            sizes='(min-width: 640px) 240px, 100vw'
            className='object-cover transition-transform duration-700 ease-(--ease-out-soft) group-hover:scale-[1.04]'
          />
        ) : (
          <span
            aria-hidden
            className='absolute inset-0 grid place-items-center text-4xl font-bold tracking-[-0.06em] text-(--tone) opacity-60 transition-transform duration-700 ease-(--ease-out-soft) group-hover:scale-[1.06]'
          >
            {post.title.slice(0, 1)}
          </span>
        )}
      </div>
      <div className='flex min-w-0 flex-col gap-2'>
        <time
          dateTime={new Date(post.time).toISOString()}
          className='text-muted-foreground text-xs'
        >
          {post.date}
        </time>
        <h3 className='text-xl leading-snug font-bold tracking-[-0.04em] text-balance'>
          <span className='title-sweep'>{post.title}</span>
        </h3>
        <p className='text-body max-w-2xl text-sm'>{post.excerpt}</p>
      </div>
    </Link>
  );
}
