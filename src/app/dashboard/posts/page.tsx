import Link from 'next/link';

import { NewspaperIcon, PlusIcon } from 'lucide-react';

import { LINKS } from '@/constants/links';
import { SITE_METADATA } from '@/constants/metadata';
import prisma from '@/lib/prisma';

import { columns } from '@/components/dashboard/posts/columns';
import { DashboardHeader } from '@/components/dashboard/shared/header';
import { TableWrapper } from '@/components/dashboard/shared/table-wrapper';
import { Button } from '@/components/ui/button';

export const { dashboardPosts: metadata } = SITE_METADATA;

export default async function PostsPage() {
  const { posts, hasError } = await prisma.post
    .findMany({
      orderBy: { createdAt: 'desc' },
      include: { author: true },
    })
    .then((posts) => ({ posts, hasError: false }))
    .catch((error) => {
      console.error('Error fetching posts:', error);
      return { posts: [], hasError: true };
    });

  return (
    <div className='flex w-full flex-col gap-4 border p-4 sm:p-8'>
      <div className='flex flex-col items-start justify-between gap-2 lg:flex-row lg:items-center'>
        <DashboardHeader
          icon={NewspaperIcon}
          title={'Posts'}
          description={'Manage posts and drafts.'}
        />
        <Button asChild>
          <Link href={LINKS.dashboardPostNew.url}>
            <PlusIcon />
            {LINKS.dashboardPostNew.label}
          </Link>
        </Button>
      </div>
      <TableWrapper
        columns={columns}
        data={posts}
        filterPlaceholder='Filter Posts...'
        hasError={hasError}
      />
    </div>
  );
}
