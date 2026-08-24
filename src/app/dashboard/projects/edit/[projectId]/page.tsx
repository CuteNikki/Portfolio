import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { PencilLineIcon } from 'lucide-react';

import prisma from '@/lib/prisma';

import { EditProjectForm } from '@/components/dashboard/projects/edit';
import { DashboardHeader } from '@/components/dashboard/shared/header';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ projectId: string }>;
}): Promise<Metadata> {
  const { projectId } = await params;

  const project = await prisma.project
    .findFirst({
      where: {
        OR: [{ id: projectId }, { slug: projectId }],
      },
    })
    .then((project) => project)
    .catch(() => null);

  if (!project) return { title: 'Project Not Found' };

  return {
    title: `niso.moe | ${project.title}`,
    description: `Edit the project titled "${project.title}".`,
  };
}

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;

  const project = await prisma.project
    .findFirst({
      where: {
        OR: [{ id: projectId }, { slug: projectId }],
      },
    })
    .then((project) => project)
    .catch(() => null);

  if (!project) {
    notFound();
  }

  return (
    <Card className='w-full max-w-5xl'>
      <CardHeader>
        <DashboardHeader
          icon={PencilLineIcon}
          title={'Edit Project'}
          description={
            'Make changes to a project or update its publication status.'
          }
        />
      </CardHeader>
      <CardContent>
        <EditProjectForm project={project} />
      </CardContent>
    </Card>
  );
}
