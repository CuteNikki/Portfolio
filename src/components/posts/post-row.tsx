import Link from 'next/link';

import { cn, toneFor } from '@/lib/utils';

import { StoredImage } from '@/components/common/stored-image';
import { Badge } from '@/components/ui/badge';

export interface PostRowData {
  id: string;
  href: string;
  title: string;
  excerpt: string;
  date: string;
  time: number;
  views: number;
  // Reading time
  minutes: number;
  coverUrl: string | null;
  // Unpublished posts only writers see
  isDraft: boolean;
}

// A post in a list, in a card like the projects': its cover on the left, then the date, title and excerpt. The title's
// underline sweeps in on hover.
export function PostRow({
  post,
  revealIndex,
}: {
  post: PostRowData;
  // Rows near the top rise in one after another; leave out where a section already does
  revealIndex?: number;
}) {
  return (
    <Link
      href={post.href}
      data-reveal={revealIndex === undefined ? undefined : ''}
      style={
        revealIndex === undefined
          ? undefined
          : ({ '--reveal-index': revealIndex } as React.CSSProperties)
      }
      className='card-lift group bg-card flex flex-col gap-5 rounded-xl border p-3 sm:flex-row sm:items-center sm:gap-7'
    >
      <div
        className={cn(
          'relative aspect-16/10 w-full shrink-0 overflow-hidden rounded-lg sm:w-60',
          'bg-[color-mix(in_oklab,var(--tone)_14%,var(--card))]',
        )}
        style={{ '--tone': toneFor(post.title) } as React.CSSProperties}
      >
        {post.coverUrl ? (
          <StoredImage
            url={post.coverUrl}
            alt=''
            fill
            sizes='(min-width: 640px) 240px, calc(100vw - 32px)'
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
      <div className='flex min-w-0 flex-col gap-2 px-2 pb-2 sm:px-0 sm:pr-4 sm:pb-0'>
        <span className='text-muted-foreground flex flex-wrap items-center gap-x-2 gap-y-1.5 text-xs'>
          {post.isDraft && <Badge>Draft</Badge>}
          <time dateTime={new Date(post.time).toISOString()}>{post.date}</time>
          <span aria-hidden>·</span>
          <span>{post.minutes} min read</span>
          {!post.isDraft && (
            <>
              <span aria-hidden>·</span>
              <span>
                {post.views} {post.views === 1 ? 'view' : 'views'}
              </span>
            </>
          )}
        </span>
        <h3 className='text-xl leading-snug font-bold tracking-[-0.04em] text-balance'>
          <span className='title-sweep'>{post.title}</span>
        </h3>
        <p className='text-body max-w-2xl text-sm'>{post.excerpt}</p>
      </div>
    </Link>
  );
}
