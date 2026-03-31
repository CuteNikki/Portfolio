import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { PencilLineIcon } from 'lucide-react';

import prisma from '@/lib/prisma';

import { EditProjectForm } from '@/components/dashboard/projects/edit';
import { DashboardHeader } from '@/components/dashboard/shared/header';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ projectId: string }>;
}): Promise<Metadata> {
  const { projectId } = await params;

  const project = await prisma.project.findFirst({
    where: {
      OR: [{ id: projectId }, { slug: projectId }],
    },
  });

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

  const project = await prisma.project.findFirst({
    where: {
      OR: [{ id: projectId }, { slug: projectId }],
    },
  });

  if (!project) {
    notFound();
  }

  return (
    <div className='flex w-full max-w-5xl flex-col gap-4 justify-self-center border p-4 sm:p-8'>
      <DashboardHeader
        icon={PencilLineIcon}
        title={'Edit Project'}
        description={
          'Make changes to a project or update its publication status.'
        }
      />
      <EditProjectForm project={project} />
    </div>
  );
}
