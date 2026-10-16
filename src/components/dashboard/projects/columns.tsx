'use client';

import type { Project } from '@/generated/prisma/browser';

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

type Row = Project & { authors: { user: PublicUser }[] };

export const columns: DashboardColumnDef<Row>[] = [
  {
    accessorKey: 'title',
    header: sortableHeader('Title'),
    cell: ({ row }) => (
      <TitleCell
        title={row.original.title}
        coverUrl={row.original.coverUrl}
        editHref={LINKS.dashboardProjectEditWithId(row.original.id).url}
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
    accessorFn: (row) => row.authors[0]?.user.username ?? '',
    header: sortableHeader('Authors'),
    cell: ({ row }) => (
      <AuthorsCell authors={row.original.authors.map(({ user }) => user)} />
    ),
  },
  {
    id: 'tags',
    accessorFn: (row) => [...row.tags, ...row.technologies].join(' '),
    header: () => 'Tags',
    cell: ({ row }) => (
      <span className='text-muted-foreground block max-w-48 truncate'>
        {[...row.original.tags, ...row.original.technologies].join(' · ') ||
          '—'}
      </span>
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
        kind='project'
        id={row.original.id}
        title={row.original.title}
        isPublished={!!row.original.publishedAt}
        editHref={LINKS.dashboardProjectEditWithId(row.original.id).url}
        publicHref={
          LINKS.projectWithSlugOrId(row.original.slug ?? row.original.id).url
        }
      />
    ),
  },
];
