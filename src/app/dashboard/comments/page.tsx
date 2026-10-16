import { requireWriter } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { toExcerpt } from '@/lib/utils';

import { LINKS } from '@/constants/links';
import { SITE_METADATA } from '@/constants/metadata';

import { columns } from '@/components/dashboard/comments/columns';
import { DashboardPageHeader } from '@/components/dashboard/shared/page-header';
import { DataTable } from '@/components/dashboard/shared/table';

export const { dashboardComments: metadata } = SITE_METADATA;

// Every dashboard page checks the session before it renders anything, so moving between them waits for the server.
// The layout's `instant = false` only covers arriving from outside the dashboard.
export const instant = false;

export default async function CommentsPage() {
  await requireWriter();

  const { comments, hasError } = await prisma.comment
    .findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        author: {
          select: {
            id: true,
            displayName: true,
            username: true,
            avatarUrl: true,
          },
        },
        post: { select: { id: true, title: true, slug: true } },
      },
    })
    .then((comments) => ({ comments, hasError: false }))
    .catch((error) => {
      console.error('Error fetching comments:', error);
      return { comments: [], hasError: true };
    });

  return (
    <div className='flex flex-col gap-6'>
      <DashboardPageHeader
        title='Comments'
        description='Every comment on every post. Delete the ones that don’t belong.'
      />
      <DataTable
        columns={columns}
        data={comments.map((comment) => ({
          id: comment.id,
          excerpt: toExcerpt(comment.content, 140),
          isReply: comment.parentId !== null,
          author: comment.author.displayName ?? comment.author.username,
          authorHref: LINKS.dashboardUserWithId(comment.author.id).url,
          avatarUrl: comment.author.avatarUrl,
          postTitle: comment.post.title,
          postSlug: comment.post.slug ?? '',
          postHref: `${LINKS.postWithSlugOrId(comment.post.slug ?? comment.post.id).url}#comments`,
          createdAt: comment.createdAt,
        }))}
        hasError={hasError}
        filterPlaceholder='Search comments'
        defaultSorting={[{ id: 'createdAt', desc: true }]}
      />
    </div>
  );
}
