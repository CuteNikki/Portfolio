import Link from 'next/link';

import { PlusIcon, PresentationIcon } from 'lucide-react';

import { LINKS } from '@/constants/links';
import { SITE_METADATA } from '@/constants/metadata';
import prisma from '@/lib/prisma';

import { columns } from '@/components/dashboard/projects/columns';
import { DashboardHeader } from '@/components/dashboard/shared/header';
import { DataTable } from '@/components/dashboard/shared/table';
import { Button } from '@/components/ui/button';

export const { dashboardProjects: metadata } = SITE_METADATA;

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
    <div className='flex w-full flex-col gap-4 border p-4 sm:p-8'>
      <div className='flex flex-col items-start justify-between gap-2 lg:flex-row lg:items-center'>
        <DashboardHeader
          icon={PresentationIcon}
          title={'Projects'}
          description={'Manage projects and drafts.'}
        />
        <Button asChild>
          <Link href={LINKS.dashboardProjectNew.url}>
            <PlusIcon />
            {LINKS.dashboardProjectNew.label}
          </Link>
        </Button>
      </div>
      <DataTable
        columns={columns}
        data={projects}
        filterPlaceholder='Filter Projects...'
        hasError={hasError}
      />
    </div>
  );
}
