import Link from 'next/link';

import { PlusIcon, PresentationIcon } from 'lucide-react';

import { LINKS } from '@/constants/links';
import { SITE_METADATA } from '@/constants/metadata';
import prisma from '@/lib/prisma';

import { columns } from '@/components/dashboard/projects/columns';
import { DashboardHeader } from '@/components/dashboard/shared/header';
import { DataTable } from '@/components/dashboard/shared/table';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
} from '@/components/ui/card';

export const { dashboardProjects: metadata } = SITE_METADATA;

export const dynamic = 'force-dynamic';

export default async function ProjectsPage() {
  const { projects, hasError } = await prisma.project
    .findMany({
      orderBy: { createdAt: 'desc' },
      include: { writer: true },
    })
    .then((projects) => ({ projects, hasError: false }))
    .catch((error) => {
      console.error('Error fetching projects:', error);
      return { projects: [], hasError: true };
    });

  return (
    <Card className='w-full'>
      <CardHeader>
        <DashboardHeader
          icon={PresentationIcon}
          title={'Projects'}
          description={'Manage projects and drafts.'}
        />
        <CardAction>
          <Button asChild>
            <Link href={LINKS.dashboardProjectNew.url}>
              <PlusIcon />
              {LINKS.dashboardProjectNew.label}
            </Link>
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <DataTable
          columns={columns}
          data={projects}
          filterPlaceholder='Filter Projects...'
          hasError={hasError}
        />
      </CardContent>
    </Card>
  );
}
