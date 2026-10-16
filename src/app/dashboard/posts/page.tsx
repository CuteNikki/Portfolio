import Link from 'next/link';

import { PlusIcon } from 'lucide-react';

import { LINKS } from '@/constants/links';
import { SITE_METADATA } from '@/constants/metadata';
import { requireWriter } from '@/lib/auth';
import { PUBLIC_USER_SELECT } from '@/lib/data';
import prisma from '@/lib/prisma';

import { columns } from '@/components/dashboard/posts/columns';
import { DashboardPageHeader } from '@/components/dashboard/shared/page-header';
import { DataTable } from '@/components/dashboard/shared/table';
import { Button } from '@/components/ui/button';

export const { dashboardPosts: metadata } = SITE_METADATA;

// Every dashboard page checks the session before it renders anything, so moving between them waits for the server.
// The layout's `instant = false` only covers arriving from outside the dashboard.
export const instant = false;

export default async function PostsPage() {
  await requireWriter();

  const { posts, hasError } = await prisma.post
    .findMany({
      orderBy: { updatedAt: 'desc' },
      include: {
        authors: {
          orderBy: { position: 'asc' },
          include: { user: { select: PUBLIC_USER_SELECT } },
        },
      },
    })
    .then((posts) => ({ posts, hasError: false }))
    .catch((error) => {
      console.error('Error fetching posts:', error);
      return { posts: [], hasError: true };
    });

  return (
    <div className='flex flex-col gap-6'>
      <DashboardPageHeader
        title='Posts'
        description='Every post and draft. Search, sort and edit them here.'
      >
        <Button asChild>
          <Link href={LINKS.dashboardPostNew.url}>
            <PlusIcon />
            New post
          </Link>
        </Button>
      </DashboardPageHeader>
      <DataTable
        columns={columns}
        data={posts}
        filterPlaceholder='Search posts'
        noun='post'
        hasError={hasError}
        defaultSorting={[{ id: 'updatedAt', desc: true }]}
      />
    </div>
  );
}
