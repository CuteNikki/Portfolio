import { NewspaperIcon, PlusIcon } from 'lucide-react';

import { columns } from '@/components/dashboard/posts/columns';
import { DataTable } from '@/components/dashboard/posts/table';
import { Button } from '@/components/ui/button';
import { LINKS } from '@/constants/links';
import { SITE_METADATA } from '@/constants/metadata';
import prisma from '@/lib/prisma';
import Link from 'next/link';

export const { dashboardPosts: metadata } = SITE_METADATA;

export default async function PostsPage() {
  const posts = await prisma.post.findMany({
    orderBy: { createdAt: 'desc' },
    include: { author: true },
  });

  return (
    <div className='flex w-full flex-col gap-4 border p-4 sm:p-8'>
      <div className='flex flex-col items-start justify-between gap-2 lg:flex-row lg:items-center'>
        <div className='flex flex-col gap-2'>
          <h1 className='text-primary-text flex items-center gap-2 text-xl font-semibold'>
            <NewspaperIcon className='shrink-0' /> Posts
          </h1>
          <p className='text-muted-foreground'>Manage posts and drafts.</p>
        </div>
        <Button asChild>
          <Link href={LINKS.dashboardPostNew.url}>
            <PlusIcon />
            {LINKS.dashboardPostNew.label}
          </Link>
        </Button>
      </div>
      <DataTable columns={columns} data={posts} />
    </div>
  );
}
