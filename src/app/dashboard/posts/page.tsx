import Link from 'next/link';

import { NewspaperIcon, PlusIcon } from 'lucide-react';

import { LINKS } from '@/constants/links';
import { SITE_METADATA } from '@/constants/metadata';
import prisma from '@/lib/prisma';

import { columns } from '@/components/dashboard/posts/columns';
import { DashboardHeader } from '@/components/dashboard/shared/header';
import { DataTable } from '@/components/dashboard/shared/table';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
} from '@/components/ui/card';

export const { dashboardPosts: metadata } = SITE_METADATA;

export default async function PostsPage() {
  const { posts, hasError } = await prisma.post
    .findMany({
      orderBy: { createdAt: 'desc' },
      include: { writer: true },
    })
    .then((posts) => ({ posts, hasError: false }))
    .catch((error) => {
      console.error('Error fetching posts:', error);
      return { posts: [], hasError: true };
    });

  return (
    <Card className='w-full'>
      <CardHeader>
        <DashboardHeader
          icon={NewspaperIcon}
          title={'Posts'}
          description={'Manage posts and drafts.'}
        />
        <CardAction>
          <Button asChild>
            <Link href={LINKS.dashboardPostNew.url}>
              <PlusIcon />
              {LINKS.dashboardPostNew.label}
            </Link>
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <DataTable
          columns={columns}
          data={posts}
          filterPlaceholder='Filter Posts...'
          hasError={hasError}
        />
      </CardContent>
    </Card>
  );
}
