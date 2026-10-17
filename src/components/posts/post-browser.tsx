'use client';

import { useState } from 'react';

import {
  CalendarIcon,
  ClockArrowDownIcon,
  ClockArrowUpIcon,
  EyeIcon,
  XIcon,
} from 'lucide-react';

import {
  type DateQuery,
  describeDateQuery,
  matchesDateQuery,
  parseDateQuery,
  shortDateQuery,
} from '@/lib/date-query';
import { toneFor } from '@/lib/utils';

import { PostRow, type PostRowData } from '@/components/posts/post-row';
import {
  SearchBox,
  type SuggestionSection,
} from '@/components/search/search-box';
import { type SortOption, SortMenu } from '@/components/search/sort-menu';
import { Button } from '@/components/ui/button';

type Sort = 'new' | 'old' | 'views';

const SORTS: SortOption<Sort>[] = [
  {
    id: 'new',
    label: 'Newest first',
    short: 'Newest',
    icon: ClockArrowDownIcon,
  },
  { id: 'old', label: 'Oldest first', short: 'Oldest', icon: ClockArrowUpIcon },
  { id: 'views', label: 'Most read', short: 'Most read', icon: EyeIcon },
];

const plural = (n: number) => (n === 1 ? '1 post' : `${n} posts`);

// Search and sorting for the posts page. Suggestions only ever show posts and dates, never projects.
export function PostBrowser({ posts }: { posts: PostRowData[] }) {
  const [query, setQuery] = useState('');
  const [date, setDate] = useState<DateQuery | null>(null);
  const [sort, setSort] = useState<Sort>('new');

  const text = query.trim().toLowerCase();
  const dates = parseDateQuery(query);

  const shown = posts
    .filter(
      (p) =>
        (dates
          ? matchesDateQuery(p.time, dates)
          : !text || `${p.title} ${p.excerpt}`.toLowerCase().includes(text)) &&
        (!date || matchesDateQuery(p.time, [date])),
    )
    .sort((a, b) =>
      sort === 'views'
        ? b.views - a.views
        : sort === 'old'
          ? a.time - b.time
          : b.time - a.time,
    );

  const postItems = (list: PostRowData[]) =>
    list.map((p) => ({
      id: `post-${p.id}`,
      label: p.title,
      href: p.href,
      meta:
        text && !dates
          ? `${p.date} · ${p.title.toLowerCase().includes(text) ? 'in the title' : 'in the text'}`
          : p.date,
      icon: (
        <span
          aria-hidden
          className='h-7.5 w-12 shrink-0 rounded-md bg-[color-mix(in_oklab,var(--tone)_18%,var(--card))]'
          style={{ '--tone': toneFor(p.title) } as React.CSSProperties}
        />
      ),
    }));

  const sections: SuggestionSection[] = [];
  if (dates) {
    sections.push({
      id: 'date',
      heading: 'Date',
      layout: 'list',
      items: dates.map((d) => ({
        id: `date-${shortDateQuery(d)}`,
        label: `Published ${describeDateQuery(d)}`,
        count: posts.filter((p) => matchesDateQuery(p.time, [d])).length,
        icon: <CalendarIcon className='text-primary-text size-4' />,
        onSelect: () => {
          setDate(d);
          setQuery('');
        },
      })),
    });
  }
  sections.push({
    id: 'posts',
    heading: text ? 'Posts' : 'Recent posts',
    layout: 'list',
    items: postItems(
      text
        ? shown.slice(0, 4)
        : [...posts].sort((a, b) => b.time - a.time).slice(0, 3),
    ),
  });

  return (
    <div className='flex flex-col gap-4'>
      {/* The posts' titles are third-level headings, so the list needs one at the second level */}
      <h2 className='sr-only'>All posts</h2>
      <div className='flex items-center gap-2.5'>
        <div className='min-w-0 flex-1'>
          <SearchBox
            value={query}
            onChange={setQuery}
            label='Search posts'
            placeholder='Title, text or date'
            sections={sections}
            resultsLabel={plural(shown.length)}
            emptyText={`No posts or dates match "${query.trim()}".`}
          />
        </div>
        <SortMenu options={SORTS} value={sort} onChange={setSort} />
      </div>

      <div className='flex min-h-9 flex-wrap items-center justify-between gap-3'>
        <div className='flex gap-1.5'>
          {date && (
            <button
              type='button'
              aria-label={`Remove filter: published ${describeDateQuery(date)}`}
              onClick={() => setDate(null)}
              className='border-primary-text bg-primary-soft text-foreground flex h-9 items-center gap-2 rounded-lg border pr-2.5 pl-3 text-[13px] [&_svg]:size-3.5'
            >
              <CalendarIcon className='text-primary-text' />
              {shortDateQuery(date)}
              <XIcon className='text-muted-foreground' />
            </button>
          )}
        </div>
        <p role='status' className='text-muted-foreground text-[13px]'>
          {plural(shown.length)}
        </p>
      </div>

      {shown.length > 0 ? (
        <div className='flex flex-col gap-4'>
          {shown.map((post, index) => (
            <PostRow
              key={post.id}
              post={post}
              revealIndex={Math.min(index, 3)}
            />
          ))}
        </div>
      ) : (
        <div className='flex flex-col items-center gap-3 rounded-xl border border-dashed px-6 py-18 text-center'>
          <p className='font-bold'>No posts match your search.</p>
          <Button
            variant='outline'
            onClick={() => {
              setQuery('');
              setDate(null);
            }}
          >
            Clear filters
          </Button>
        </div>
      )}
    </div>
  );
}
