import Link from 'next/link';

import { ArrowUpRightIcon } from 'lucide-react';

import { WriterMenu } from '@/components/common/writer-menu';

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
  // Shown instead in dark themes
  coverDarkUrl: string | null;
  // Unpublished posts only writers see
  isDraft: boolean;
}

// A post in a list, in a card like the projects': its cover on the left, then the date, title and excerpt. An arrow
// slides in at the top right on hover, as on the project cards.
export function PostRow({
  post,
  revealIndex,
}: {
  post: PostRowData;
  // Rows near the top rise in one after another; leave out where a section already does
  revealIndex?: number;
}) {
  return (
    <WriterMenu
      kind='post'
      id={post.id}
      title={post.title}
      href={post.href}
      isDraft={post.isDraft}
    >
      <Link
        href={post.href}
        data-reveal={revealIndex === undefined ? undefined : ''}
        style={
          revealIndex === undefined
            ? undefined
            : ({ '--reveal-index': revealIndex } as React.CSSProperties)
        }
        className='card-lift group bg-card flex flex-col gap-5 rounded-xl border p-3 md:flex-row md:items-center md:gap-7'
      >
        <div
          className={cn(
            'relative aspect-2/1 w-full shrink-0 overflow-hidden rounded-lg md:w-64',
            'bg-[color-mix(in_oklab,var(--tone)_14%,var(--card))]',
          )}
          style={{ '--tone': toneFor(post.title) } as React.CSSProperties}
        >
          {post.coverUrl ? (
            <StoredImage
              url={post.coverUrl}
              darkUrl={post.coverDarkUrl}
              alt=''
              fill
              sizes='(min-width: 768px) 256px, calc(100vw - 32px)'
              className='reveal-picture object-cover object-top transition-transform duration-700 ease-(--ease-out-soft) group-hover:scale-[1.04]'
            />
          ) : (
            <span
              aria-hidden
              className='reveal-picture absolute inset-0 grid place-items-center text-4xl font-bold tracking-[-0.06em] text-(--tone) opacity-60 transition-transform duration-700 ease-(--ease-out-soft) group-hover:scale-[1.06]'
            >
              {post.title.slice(0, 1)}
            </span>
          )}
        </div>
        <div className='flex min-w-0 flex-1 flex-col gap-2 px-2 pb-2 md:px-0 md:pr-4 md:pb-0'>
          <div className='flex items-start justify-between gap-4'>
            <span className='text-muted-foreground flex flex-wrap items-center gap-x-2 gap-y-1.5 text-xs'>
              {post.isDraft && <Badge>Draft</Badge>}
              <time dateTime={new Date(post.time).toISOString()}>
                {post.date}
              </time>
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
            <ArrowUpRightIcon
              aria-hidden
              className='text-primary-text size-4 shrink-0 -translate-x-1 translate-y-1 opacity-0 transition-[opacity,translate] duration-300 group-hover:translate-0 group-hover:opacity-100 group-focus-visible:translate-0 group-focus-visible:opacity-100'
            />
          </div>
          <h3 className='text-xl leading-snug font-bold tracking-[-0.04em] text-balance'>
            {post.title}
          </h3>
          <p className='text-body max-w-2xl text-sm'>{post.excerpt}</p>
        </div>
      </Link>
    </WriterMenu>
  );
}
