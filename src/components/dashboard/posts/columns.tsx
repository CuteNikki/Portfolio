'use client';

import type { Post } from '@/generated/prisma/browser';

import { authorsOf } from '@/lib/author-list';
import type { PublicUser } from '@/lib/data';
import { formatShortDate } from '@/lib/utils';

import { LINKS } from '@/constants/links';

import {
  AuthorsCell,
  sortableHeader,
  StatusBadge,
  TitleCell,
} from '@/components/dashboard/shared/column-parts';
import { ContentActions } from '@/components/dashboard/shared/content-actions';
import type { DashboardColumnDef } from '@/components/dashboard/shared/table-features';

type Row = Post & {
  authors: {
    id: string;
    name: string | null;
    url: string | null;
    user: PublicUser | null;
  }[];
};

export const columns: DashboardColumnDef<Row>[] = [
  {
    accessorKey: 'title',
    header: sortableHeader('Title'),
    cell: ({ row }) => (
      <TitleCell
        title={row.original.title}
        coverUrl={row.original.thumbnailUrl ?? row.original.coverUrl}
        editHref={LINKS.dashboardPostEditWithId(row.original.id).url}
      />
    ),
  },
  {
    accessorKey: 'publishedAt',
    header: sortableHeader('Status'),
    cell: ({ row }) => <StatusBadge published={!!row.original.publishedAt} />,
  },
  {
    id: 'authors',
    // Sorts and searches by the first author's name
    accessorFn: (row) => authorsOf(row)[0]?.name ?? '',
    header: sortableHeader('Authors'),
    cell: ({ row }) => <AuthorsCell authors={authorsOf(row.original)} />,
  },
  {
    accessorKey: 'views',
    header: sortableHeader('Views'),
    cell: ({ row }) => (
      <span className='tabular-nums'>{row.original.views}</span>
    ),
  },
  {
    accessorKey: 'updatedAt',
    header: sortableHeader('Updated'),
    cell: ({ row }) => (
      <span className='text-muted-foreground whitespace-nowrap'>
        {formatShortDate(row.original.updatedAt)}
      </span>
    ),
  },
  {
    id: 'actions',
    header: () => <span className='sr-only'>Actions</span>,
    cell: ({ row }) => (
      <ContentActions
        kind='post'
        id={row.original.id}
        title={row.original.title}
        isPublished={!!row.original.publishedAt}
        editHref={LINKS.dashboardPostEditWithId(row.original.id).url}
        publicHref={
          LINKS.postWithSlugOrId(row.original.slug ?? row.original.id).url
        }
      />
    ),
  },
];
