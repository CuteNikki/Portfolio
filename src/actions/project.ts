'use server';

import { revalidatePath } from 'next/cache';

import { Role } from '@/generated/prisma/enums';

import { getCurrentSession } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function createProject(formData: FormData) {
  const session = await getCurrentSession();

  if (!session || session.user.role !== Role.ADMIN) {
    throw new Error(
      'Unauthorized: You do not have permission to publish projects.',
    );
  }

  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  const slug = (formData.get('slug') || null) as string | null;
  const repository = formData.get('repository') as string;
  const website = formData.get('website') as string;
  const tags =
    (formData.get('tags') as string)?.split(',').map((tag) => tag.trim()) || [];
  const technologies =
    (formData.get('technologies') as string)
      ?.split(',')
      .map((tech) => tech.trim()) || [];

  const isPublished = formData.get('isPublished') === 'true';
  if (!title || !description) {
    throw new Error('Title and description are required.');
  }

  if (slug) {
    const existingProject = await prisma.project.findUnique({
      where: { slug },
    });

    if (existingProject) {
      throw new Error(
        'A project with this URL slug already exists. Please choose a different one.',
      );
    }
  }

  const createdProject = await prisma.project.create({
    data: {
      title,
      slug,
      description,
      repository,
      website,
      technologies,
      tags,
      published: isPublished,
    },
  });

  revalidateProjectPaths(createdProject.id, createdProject.slug);
  return createdProject;
}

export async function deleteProject(formData: FormData) {
  const session = await getCurrentSession();

  if (!session || session.user.role !== Role.ADMIN) {
    throw new Error('Unauthorized');
  }

  const projectId = formData.get('projectId') as string;

  const deletedProject = await prisma.project.delete({
    where: { id: projectId },
  });

  revalidateProjectPaths(deletedProject.id, deletedProject.slug);
}

export async function updateProject(formData: FormData) {
  const session = await getCurrentSession();

  if (!session || session.user.role !== Role.ADMIN) {
    throw new Error('Unauthorized');
  }

  const id = formData.get('projectId') as string;
  const title = formData.get('title') as string;
  const slug = formData.get('slug') as string;
  const description = formData.get('description') as string;
  const repository = formData.get('repository') as string;
  const website = formData.get('website') as string;
  const tags =
    (formData.get('tags') as string)?.split(',').map((tag) => tag.trim()) || [];
  const technologies =
    (formData.get('technologies') as string)
      ?.split(',')
      .map((tech) => tech.trim()) || [];

  const isPublished = formData.get('isPublished') === 'true';

  if (!id || !title) {
    throw new Error('Some required fields are missing.');
  }

  if (slug) {
    const existingProject = await prisma.project.findFirst({
      where: {
        slug,
        NOT: { id },
      },
    });

    if (existingProject) {
      throw new Error('Another project is already using this URL slug.');
    }
  }

  await prisma.project.update({
    where: { id },
    data: {
      title,
      slug,
      description,
      repository,
      website,
      technologies,
      tags,
      published: isPublished,
    },
  });

  revalidateProjectPaths(id, slug);
}

function revalidateProjectPaths(projectId: string, slug: string | null) {
  revalidatePath('/dashboard/projects');
  revalidatePath('/dashboard/projects/new');
  revalidatePath(`/dashboard/projects/edit/${projectId}`);
  revalidatePath('/projects');
  revalidatePath(`/projects/${projectId}`);
  if (slug) {
    revalidatePath(`/dashboard/projects/edit/${slug}`);
    revalidatePath(`/projects/${slug}`);
  }
}
