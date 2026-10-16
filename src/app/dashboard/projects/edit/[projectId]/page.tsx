import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { ExternalLinkIcon } from 'lucide-react';

import { requireWriter } from '@/lib/auth';
import { getAuthorOptions } from '@/lib/authors';
import prisma from '@/lib/prisma';

import { LINKS } from '@/constants/links';

import { EditProjectForm } from '@/components/dashboard/projects/edit';
import { DashboardPageHeader } from '@/components/dashboard/shared/page-header';
import { Button } from '@/components/ui/button';

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
    <>
      <DashboardPageHeader title='Edit project' description={project.title}>
        {project.publishedAt && (
          <Button asChild variant='outline'>
            <Link
              href={LINKS.projectWithSlugOrId(project.slug ?? project.id).url}
            >
              <ExternalLinkIcon />
              View
            </Link>
          </Button>
        )}
      </DashboardPageHeader>
      <EditProjectForm
        project={project}
        gallery={project.images.map(({ url, alt }) => ({ url, alt }))}
        authorOptions={await getAuthorOptions()}
        authorIds={project.authors.map(({ userId }) => userId)}
      />
    </>
  );
}
