'use server';

import { revalidatePath, updateTag } from 'next/cache';

import { Role } from '@/generated/prisma/enums';

import { getCurrentSession } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { resolveSlug } from '@/lib/slug';

function canWrite(
  session: Awaited<ReturnType<typeof getCurrentSession>>,
): session is NonNullable<typeof session> {
  return (
    !!session &&
    (session.user.role === Role.ADMIN || session.user.role === Role.WRITER)
  );
}

function isProjectSlugTaken(exceptId?: string) {
  return async (slug: string) =>
    (await prisma.project.count({
      where: exceptId ? { slug, NOT: { id: exceptId } } : { slug },
    })) > 0;
}

export async function createProject(formData: FormData) {
  const session = await getCurrentSession();

  if (!canWrite(session)) {
    throw new Error(
      'Unauthorized: You do not have permission to publish projects.',
    );
  }

  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  const repository = formData.get('repository') as string;
  const website = formData.get('website') as string;
  const tags =
    (formData.get('tags') as string)
      ?.split(',')
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0) || [];
  const technologies =
    (formData.get('technologies') as string)
      ?.split(',')
      .map((tech) => tech.trim())
      .filter((tech) => tech.length > 0) || [];

  const createdAt = parseProjectDate(formData.get('date'));

  const isPublished = formData.get('isPublished') === 'true';
  if (!title || !description) {
    throw new Error('Title and description are required.');
  }

  const slug = await resolveSlug(
    formData.get('slug'),
    title,
    isProjectSlugTaken(),
  );

  const createdProject = await prisma.project.create({
    data: {
      title,
      slug,
      description,
      repository,
      website,
      technologies,
      tags,
      createdAt,
      writerId: session.user.id,
      publishedAt: isPublished ? new Date() : null,
    },
  });

  revalidateProjectPaths(createdProject.id, createdProject.slug);
  return createdProject;
}

export async function deleteProject(formData: FormData) {
  const session = await getCurrentSession();

  if (!canWrite(session)) {
    throw new Error('Unauthorized');
  }

  const projectId = formData.get('projectId') as string;

  const project = await prisma.project.findFirst({
    where: { id: projectId },
    select: { id: true },
  });

  if (!project) {
    throw new Error('Project not found.');
  }

  const deletedProject = await prisma.project.delete({
    where: { id: project.id },
  });

  revalidateProjectPaths(deletedProject.id, deletedProject.slug);
}

export async function updateProject(formData: FormData) {
  const session = await getCurrentSession();

  if (!canWrite(session)) {
    throw new Error('Unauthorized');
  }

  const id = formData.get('projectId') as string;
  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  const repository = formData.get('repository') as string;
  const website = formData.get('website') as string;
  const tags =
    (formData.get('tags') as string)
      ?.split(',')
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0) || [];
  const technologies =
    (formData.get('technologies') as string)
      ?.split(',')
      .map((tech) => tech.trim())
      .filter((tech) => tech.length > 0) || [];

  const createdAt = parseProjectDate(formData.get('date'));

  const isPublished = formData.get('isPublished') === 'true';

  if (!id || !title || !description) {
    throw new Error('Some required fields are missing.');
  }

  const currentProject = await prisma.project.findFirst({
    where: { id },
    select: { publishedAt: true },
  });

  if (!currentProject) {
    throw new Error('Project not found.');
  }

  const slug = await resolveSlug(
    formData.get('slug'),
    title,
    isProjectSlugTaken(id),
  );

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
      createdAt,
      // Keep the original publish date when updating an already published project
      publishedAt: isPublished
        ? (currentProject.publishedAt ?? new Date())
        : null,
    },
  });

  revalidateProjectPaths(id, slug);
}

// Parses a "YYYY-MM-DD" date input. Stored at noon UTC so the displayed day
// doesn't shift in other time zones. Returns undefined if no date was given.
function parseProjectDate(value: FormDataEntryValue | null) {
  if (!value) return undefined;

  const date = new Date(`${value}T12:00:00Z`);
  if (Number.isNaN(date.getTime())) {
    throw new Error('Please enter a valid project date.');
  }

  return date;
}

function revalidateProjectPaths(projectId: string, slug: string | null) {
  updateTag('projects');
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
