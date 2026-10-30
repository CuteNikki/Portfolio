'use server';

import { revalidatePath, updateTag } from 'next/cache';
import { after } from 'next/server';

import {
  type ActionResult,
  type CreateResult,
  fail,
} from '@/lib/action-result';
import { getWriterSession } from '@/lib/auth';
import { authorRows, readAuthors } from '@/lib/authors';
import { readDate, readList, readText } from '@/lib/form-fields';
import { readCover, readGallery, removedImages } from '@/lib/form-images';
import { coverTone } from '@/lib/tone';
import { deleteImages } from '@/lib/uploads';
import prisma from '@/lib/prisma';
import { resolveSlug } from '@/lib/slug';

function isProjectSlugTaken(exceptId?: string) {
  return async (slug: string) =>
    (await prisma.project.count({
      where: exceptId ? { slug, NOT: { id: exceptId } } : { slug },
    })) > 0;
}

export async function createProject(formData: FormData): Promise<CreateResult> {
  const session = await getWriterSession();
  if (!session) return fail('Only writers and admins can do that.');

  const title = readText(formData, 'title').trim();
  const description = readText(formData, 'description');
  const repository = readLink(formData.get('repository'));
  const website = readLink(formData.get('website'));
  if (repository === false || website === false) {
    return fail('Links must be web addresses, like https://example.com.');
  }
  const tags = readList(formData, 'tags');
  const technologies = readList(formData, 'technologies');

  const createdAt = readDate(formData.get('date'));
  if (createdAt === null) return fail('Please enter a valid project date.');

  const isPublished = formData.get('isPublished') === 'true';
  if (!title || !description.trim()) {
    return fail('Title and description are required.');
  }

  const resolved = await resolveSlug(
    formData.get('slug'),
    title,
    isProjectSlugTaken(),
  );
  if ('error' in resolved) return fail(resolved.error);
  const { slug } = resolved;

  const coverUrl = readCover(formData) ?? null;

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
      coverUrl,
      coverDarkUrl: readCover(formData, 'coverDarkUrl') ?? null,
      tone: readTone(formData) ?? null,
      coverTone: await coverTone(coverUrl),
      images: { create: readGallery(formData) ?? [] },
      // The picked authors, or else whoever creates it
      authors: {
        create: authorRows(
          (await readAuthors(formData)) ?? [{ userId: session.user.id }],
        ),
      },
      publishedAt: isPublished ? new Date() : null,
    },
  });

  revalidateProjectPaths(createdProject.id, createdProject.slug);
  return { id: createdProject.id, slug: createdProject.slug };
}

export async function deleteProject(formData: FormData): Promise<ActionResult> {
  if (!(await getWriterSession())) {
    return fail('Only writers and admins can do that.');
  }

  const projectId = readText(formData, 'projectId');

  const project = await prisma.project.findFirst({
    where: { id: projectId },
    select: { id: true },
  });

  if (!project) {
    return fail('Project not found.');
  }

  const deletedProject = await prisma.project.delete({
    where: { id: project.id },
    include: { images: { select: { url: true, darkUrl: true } } },
  });

  // Its pictures go too, once the response is sent
  after(() =>
    deleteImages(
      [
        deletedProject.coverUrl,
        deletedProject.coverDarkUrl,
        ...deletedProject.images.flatMap(({ url, darkUrl }) => [url, darkUrl]),
      ].filter((url): url is string => !!url),
    ),
  );

  revalidateProjectPaths(deletedProject.id, deletedProject.slug);
  return {};
}

export async function updateProject(formData: FormData): Promise<ActionResult> {
  if (!(await getWriterSession())) {
    return fail('Only writers and admins can do that.');
  }

  const id = readText(formData, 'projectId');
  const title = readText(formData, 'title').trim();
  const description = readText(formData, 'description');
  const repository = readLink(formData.get('repository'));
  const website = readLink(formData.get('website'));
  if (repository === false || website === false) {
    return fail('Links must be web addresses, like https://example.com.');
  }
  const tags = readList(formData, 'tags');
  const technologies = readList(formData, 'technologies');

  const createdAt = readDate(formData.get('date'));
  if (createdAt === null) return fail('Please enter a valid project date.');

  const isPublished = formData.get('isPublished') === 'true';

  if (!id || !title || !description.trim()) {
    return fail('Some required fields are missing.');
  }

  const currentProject = await prisma.project.findFirst({
    where: { id },
    select: {
      publishedAt: true,
      coverUrl: true,
      coverDarkUrl: true,
      images: { select: { url: true, darkUrl: true } },
    },
  });

  if (!currentProject) {
    return fail('Project not found.');
  }

  const resolved = await resolveSlug(
    formData.get('slug'),
    title,
    isProjectSlugTaken(id),
  );
  if ('error' in resolved) return fail(resolved.error);
  const { slug } = resolved;

  // A form without authors or pictures keeps the current ones
  const authors = await readAuthors(formData);
  const coverUrl = readCover(formData);
  const coverDarkUrl = readCover(formData, 'coverDarkUrl');
  const gallery = readGallery(formData);
  const tone = readTone(formData);
  // A new cover brings its own colour for Auto
  const coverChanged =
    coverUrl !== undefined && coverUrl !== currentProject.coverUrl;

  await prisma.project.update({
    where: { id },
    data: {
      ...(authors && {
        authors: { deleteMany: {}, create: authorRows(authors) },
      }),
      ...(coverUrl !== undefined && { coverUrl }),
      ...(coverDarkUrl !== undefined && { coverDarkUrl }),
      ...(coverChanged && { coverTone: await coverTone(coverUrl) }),
      ...(tone !== undefined && { tone }),
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
    currentProject.coverDarkUrl,
    ...currentProject.images.flatMap(({ url, darkUrl }) => [url, darkUrl]),
  ];
  const now = [
    coverUrl === undefined ? currentProject.coverUrl : coverUrl,
    coverDarkUrl === undefined ? currentProject.coverDarkUrl : coverDarkUrl,
    ...(gallery ?? currentProject.images).flatMap(({ url, darkUrl }) => [
      url,
      darkUrl,
    ]),
  ];
  const removed = removedImages(before, now);
  if (removed.length > 0) after(() => deleteImages(removed));

  revalidateProjectPaths(id, slug);
  return {};
}

// The colour picked in a project's form: a chart colour ("1" to "5") or any colour ("#rrggbb"), null for Auto (matched
// to the cover), or undefined if the form had no colour field (then the saved one stays)
function readTone(formData: FormData): string | null | undefined {
  if (!formData.has('tone')) return undefined;
  const tone = readText(formData, 'tone').trim().toLowerCase();
  return /^([1-5]|#[0-9a-f]{6})$/.test(tone) ? tone : null;
}

// A project's repository or website: empty, or a web address. People often leave out the https://, which is added
// then. False for anything else, such as a javascript: link, which the project page would otherwise turn into a link.
function readLink(value: FormDataEntryValue | null): string | false {
  const text = String(value ?? '').trim();
  if (!text) return '';
  try {
    const url = new URL(
      /^[a-z][a-z\d+.-]*:/i.test(text) ? text : `https://${text}`,
    );
    return url.protocol === 'https:' || url.protocol === 'http:'
      ? url.href
      : false;
  } catch {
    return false;
  }
}

// Parses a "YYYY-MM-DD" date input. Stored at noon UTC so the displayed day
// doesn't shift in other time zones. Undefined if no date was given, null if it isn't a date.

/**
 * Publishes a project or takes it back to a draft without opening it, e.g. from a row's menu.
 */
export async function setProjectPublished(
  projectId: string,
  published: boolean,
): Promise<ActionResult> {
  if (!(await getWriterSession())) {
    return fail('Only writers and admins can do that.');
  }

  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: { slug: true, publishedAt: true },
  });
  if (!project) return fail("That project doesn't exist any more.");

  // Already as asked, e.g. after a second click in another tab
  if (!!project.publishedAt === published) return {};

  await prisma.project.update({
    where: { id: projectId },
    data: { publishedAt: published ? new Date() : null },
  });

  revalidateProjectPaths(projectId, project.slug);
  return {};
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
