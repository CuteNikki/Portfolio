import Link from 'next/link';

import { PlusIcon } from 'lucide-react';

import { LINKS } from '@/constants/links';
import { SITE_METADATA } from '@/constants/metadata';
import { requireWriter } from '@/lib/auth';
import { PUBLIC_USER_SELECT } from '@/lib/data';
import prisma from '@/lib/prisma';

import { columns } from '@/components/dashboard/projects/columns';
import { DashboardPageHeader } from '@/components/dashboard/shared/page-header';
import { DataTable } from '@/components/dashboard/shared/table';
import { Button } from '@/components/ui/button';

export const { dashboardProjects: metadata } = SITE_METADATA;

// Every dashboard page checks the session before it renders anything, so moving between them waits for the server.
// The layout's `instant = false` only covers arriving from outside the dashboard.
export const instant = false;

export default async function ProjectsPage() {
  await requireWriter();

  const projects = await prisma.project.findMany({
    orderBy: { updatedAt: 'desc' },
    include: {
      authors: {
        orderBy: { position: 'asc' },
        include: { user: { select: PUBLIC_USER_SELECT } },
      },
    },
  });

  return (
    <div className='flex flex-col gap-6'>
      <DashboardPageHeader
        title='Projects'
        description='Every project and draft. Search, sort and edit them here.'
      >
        <Button asChild>
          <Link href={LINKS.dashboardProjectNew.url}>
            <PlusIcon />
            New project
          </Link>
        </Button>
      </DashboardPageHeader>
      <DataTable
        storageKey='projects'
        columns={columns}
        data={projects}
        filterPlaceholder='Search projects'
        noun='project'
        defaultSorting={[{ id: 'updatedAt', desc: true }]}
      />
    </div>
  );
}
