import Link from 'next/link';

import { formatShortDate } from '@/lib/utils';

import { LINKS } from '@/constants/links';

import { StoredImage } from '@/components/common/stored-image';
import { ContentActions } from '@/components/dashboard/shared/content-actions';
import { Badge } from '@/components/ui/badge';

export interface ContentRowItem {
  kind: 'post' | 'project';
  id: string;
  title: string;
  slug: string | null;
  coverUrl: string | null;
  publishedAt: Date | null;
  updatedAt: Date;
}

// A post or project in a dashboard list: its cover, title and status, with the edit button and ⋯ menu
export function ContentRow({ item }: { item: ContentRowItem }) {
  const isPost = item.kind === 'post';
  const slugOrId = item.slug ?? item.id;
  const editHref = isPost
    ? LINKS.dashboardPostEditWithId(item.id).url
    : LINKS.dashboardProjectEditWithId(item.id).url;

  return (
    <li className='flex items-center gap-4 px-5 py-3'>
      <span className='bg-muted relative h-9 w-14 shrink-0 overflow-hidden rounded-md'>
        {item.coverUrl && (
          <StoredImage
            url={item.coverUrl}
            alt=''
            sizes='56px'
            fill
            className='object-cover'
          />
        )}
      </span>
      <span className='min-w-0 flex-1'>
        <Link
          href={editHref}
          className='hover:text-primary-text block truncate text-sm font-semibold transition-colors'
        >
          {item.title}
        </Link>
        <span className='text-muted-foreground text-xs'>
          {isPost ? 'Post' : 'Project'} · updated{' '}
          {formatShortDate(item.updatedAt)}
        </span>
      </span>
      <Badge
        variant={item.publishedAt ? 'secondary' : 'outline'}
        className='hidden sm:inline-flex'
      >
        {item.publishedAt ? 'Published' : 'Draft'}
      </Badge>
      <ContentActions
        kind={item.kind}
        id={item.id}
        title={item.title}
        isPublished={!!item.publishedAt}
        editHref={editHref}
        publicHref={
          isPost
            ? LINKS.postWithSlugOrId(slugOrId).url
            : LINKS.projectWithSlugOrId(slugOrId).url
        }
      />
    </li>
  );
}
