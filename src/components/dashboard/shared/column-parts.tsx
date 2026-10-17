'use client';

import Link from 'next/link';

import { ArrowDownIcon, ArrowUpDownIcon, ArrowUpIcon } from 'lucide-react';

import type { Author } from '@/lib/author-list';
import { proxiedAvatarUrl } from '@/lib/utils';

import { LINKS } from '@/constants/links';

import { StoredImage } from '@/components/common/stored-image';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

// Pieces the dashboard's post and project tables share

interface SortableColumn {
  getIsSorted: () => false | 'asc' | 'desc';
  toggleSorting: (desc?: boolean) => void;
}

// The column itself stays the same object when the sorting changes, so the React Compiler would skip re-rendering
// a component that only receives it. Reading the direction in the header function, which the table calls on every
// render, hands the button a value that does change.
export function sortableHeader(label: string) {
  // Not a named component on purpose: the compiler would memoize that on the unchanged column too
  // eslint-disable-next-line react/display-name
  return ({ column }: { column: SortableColumn }) => (
    <SortableHeader
      label={label}
      sorted={column.getIsSorted()}
      onToggle={() => column.toggleSorting(column.getIsSorted() === 'asc')}
    />
  );
}

function SortableHeader({
  label,
  sorted,
  onToggle,
}: {
  label: string;
  sorted: false | 'asc' | 'desc';
  onToggle: () => void;
}) {
  return (
    <Button
      variant='ghost'
      size='sm'
      className='-ml-3'
      onClick={onToggle}
      aria-label={`Sort by ${label.toLowerCase()}`}
    >
      {label}
      {sorted === 'asc' ? (
        <ArrowUpIcon />
      ) : sorted === 'desc' ? (
        <ArrowDownIcon />
      ) : (
        <ArrowUpDownIcon className='opacity-50' />
      )}
    </Button>
  );
}

// The title with a small copy of the cover, linking to the edit page
export function TitleCell({
  title,
  coverUrl,
  editHref,
}: {
  title: string;
  coverUrl: string | null;
  editHref: string;
}) {
  return (
    <Link href={editHref} className='group flex min-w-0 items-center gap-3'>
      <span className='bg-muted rounded-thumb relative h-6 w-12 shrink-0 overflow-hidden'>
        {coverUrl && (
          <StoredImage
            url={coverUrl}
            alt=''
            sizes='48px'
            fill
            className='object-cover object-top'
          />
        )}
      </span>
      <span className='group-hover:text-primary-text truncate font-semibold transition-colors'>
        {title}
      </span>
    </Link>
  );
}

export function StatusBadge({ published }: { published: boolean }) {
  return (
    <Badge variant={published ? 'secondary' : 'outline'}>
      {published ? 'Published' : 'Draft'}
    </Badge>
  );
}

export function AuthorsCell({ authors }: { authors: Author[] }) {
  if (authors.length === 0)
    return <span className='text-muted-foreground'>—</span>;

  // People who signed in open their dashboard page; others have none
  const hrefOf = (author: Author) =>
    author.user ? LINKS.dashboardUserWithId(author.user.id).url : null;
  const first = authors[0];
  const firstHref = hrefOf(first);

  return (
    <div className='flex items-center gap-2'>
      <div className='flex -space-x-2'>
        {authors.slice(0, 3).map((author) => {
          const avatar = (
            <Avatar className='ring-card size-6 rounded-md ring-2 after:rounded-md'>
              {author.avatarUrl && (
                <AvatarImage
                  src={proxiedAvatarUrl(author.avatarUrl)}
                  alt=''
                  className='rounded-md'
                />
              )}
              <AvatarFallback className='rounded-md text-[9px]'>
                {author.name.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          );
          const href = hrefOf(author);
          return href ? (
            <Link
              key={author.key}
              href={href}
              aria-label={author.name}
              title={author.name}
              className='relative shrink-0 rounded-md hover:z-10'
            >
              {avatar}
            </Link>
          ) : (
            <span key={author.key} title={author.name} className='shrink-0'>
              {avatar}
            </span>
          );
        })}
      </div>
      <span className='truncate'>
        {firstHref ? (
          <Link
            href={firstHref}
            className='hover:text-primary-text transition-colors'
          >
            {first.name}
          </Link>
        ) : (
          first.name
        )}
        {authors.length > 1 && (
          <span className='text-muted-foreground'> +{authors.length - 1}</span>
        )}
      </span>
    </div>
  );
}
