import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { PencilLineIcon } from 'lucide-react';

import { requireWriter } from '@/lib/auth';
import { getAuthorOptions } from '@/lib/authors';
import prisma from '@/lib/prisma';

import { EditProjectForm } from '@/components/dashboard/projects/edit';
import { DashboardHeader } from '@/components/dashboard/shared/header';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ projectId: string }>;
}): Promise<Metadata> {
  await requireWriter();

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
    title: `Edit: ${project.title}`,
    description: `Edit the project titled "${project.title}".`,
  };
}

// Every dashboard page checks the session before it renders anything, so moving between them waits for the server.
// The layout's `instant = false` only covers arriving from outside the dashboard.
export const instant = false;

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  await requireWriter();

  const { projectId } = await params;

  const project = await prisma.project
    .findFirst({
      where: {
        OR: [{ id: projectId }, { slug: projectId }],
      },
      include: {
        authors: { orderBy: { position: 'asc' } },
        images: { orderBy: { position: 'asc' } },
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
        <EditProjectForm
          project={project}
          gallery={project.images.map(({ url, alt }) => ({ url, alt }))}
          authorOptions={await getAuthorOptions()}
          authorIds={project.authors.map(({ userId }) => userId)}
        />
      </CardContent>
    </Card>
  );
}
