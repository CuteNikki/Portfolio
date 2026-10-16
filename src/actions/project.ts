'use server';

import { revalidatePath, updateTag } from 'next/cache';
import { after } from 'next/server';

import { Role } from '@/generated/prisma/enums';

import type { ActionResult } from '@/lib/action-result';
import { getCurrentSession } from '@/lib/auth';
import { authorRows, readAuthors } from '@/lib/authors';
import { readCover, readGallery, removedImages } from '@/lib/form-images';
import { deleteImages } from '@/lib/uploads';
import prisma from '@/lib/prisma';
import { resolveSlug } from '@/lib/slug';

// Messages go back as values, since a production build hides a thrown error's message (see action-result.ts)
const fail = (error: string) => ({ error });
type CreateResult = ActionResult & { id?: string; slug?: string | null };

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

export async function createProject(formData: FormData): Promise<CreateResult> {
  const session = await getCurrentSession();

  if (!canWrite(session)) {
    return fail('Only writers and admins can do that.');
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
  if (createdAt === null) return fail('Please enter a valid project date.');

  const isPublished = formData.get('isPublished') === 'true';
  if (!title || !description) {
    return fail('Title and description are required.');
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
      coverUrl: readCover(formData) ?? null,
      images: { create: readGallery(formData) ?? [] },
      // The picked authors, or else whoever creates it
      authors: {
        create: authorRows((await readAuthors(formData)) ?? [session.user.id]),
      },
      publishedAt: isPublished ? new Date() : null,
    },
  });

  revalidateProjectPaths(createdProject.id, createdProject.slug);
  return { id: createdProject.id, slug: createdProject.slug };
}

export async function deleteProject(formData: FormData): Promise<ActionResult> {
  const session = await getCurrentSession();

  if (!canWrite(session)) {
    return fail('Only writers and admins can do that.');
  }

  const projectId = formData.get('projectId') as string;

  const project = await prisma.project.findFirst({
    where: { id: projectId },
    select: { id: true },
  });

  if (!project) {
    return fail('Project not found.');
  }

  const deletedProject = await prisma.project.delete({
    where: { id: project.id },
    include: { images: { select: { url: true } } },
  });

  // Its pictures go too, once the response is sent
  after(() =>
    deleteImages(
      [
        deletedProject.coverUrl,
        ...deletedProject.images.map(({ url }) => url),
      ].filter((url): url is string => !!url),
    ),
  );

  revalidateProjectPaths(deletedProject.id, deletedProject.slug);
  return {};
}

export async function updateProject(formData: FormData): Promise<ActionResult> {
  const session = await getCurrentSession();

  if (!canWrite(session)) {
    return fail('Only writers and admins can do that.');
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
  if (createdAt === null) return fail('Please enter a valid project date.');

  const isPublished = formData.get('isPublished') === 'true';

  if (!id || !title || !description) {
    return fail('Some required fields are missing.');
  }

  const currentProject = await prisma.project.findFirst({
    where: { id },
    select: {
      publishedAt: true,
      coverUrl: true,
      images: { select: { url: true } },
    },
  });

  if (!currentProject) {
    return fail('Project not found.');
  }

  const slug = await resolveSlug(
    formData.get('slug'),
    title,
    isProjectSlugTaken(id),
  );

  // A form without authors or pictures keeps the current ones
  const authors = await readAuthors(formData);
  const coverUrl = readCover(formData);
  const gallery = readGallery(formData);

  await prisma.project.update({
    where: { id },
    data: {
      ...(authors && {
        authors: { deleteMany: {}, create: authorRows(authors) },
      }),
      ...(coverUrl !== undefined && { coverUrl }),
      ...(gallery && { images: { deleteMany: {}, create: gallery } }),
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

  // Pictures that were replaced or removed go once the response is sent
  const before = [
    currentProject.coverUrl,
    ...currentProject.images.map(({ url }) => url),
  ];
  const now = [
    coverUrl === undefined ? currentProject.coverUrl : coverUrl,
    ...(gallery
      ? gallery.map(({ url }) => url)
      : currentProject.images.map(({ url }) => url)),
  ];
  const removed = removedImages(before, now);
  if (removed.length > 0) after(() => deleteImages(removed));

  revalidateProjectPaths(id, slug);
  return {};
}

// Parses a "YYYY-MM-DD" date input. Stored at noon UTC so the displayed day
// doesn't shift in other time zones. Undefined if no date was given, null if it isn't a date.
function parseProjectDate(value: FormDataEntryValue | null) {
  if (!value) return undefined;

  const date = new Date(`${value}T12:00:00Z`);
  return Number.isNaN(date.getTime()) ? null : date;
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
