import { Role } from '@/generated/prisma/enums';

import { PUBLIC_USER_SELECT } from '@/lib/data';
import prisma from '@/lib/prisma';

import type { AuthorOption } from '@/components/dashboard/shared/authors-field';

const MAX_AUTHORS = 10;

/**
 * The people who can be picked as authors: every writer and admin.
 */
export async function getAuthorOptions(): Promise<AuthorOption[]> {
  const users = await prisma.user.findMany({
    where: { role: { in: [Role.WRITER, Role.ADMIN] } },
    select: PUBLIC_USER_SELECT,
    orderBy: { username: 'asc' },
  });

  return users.map((user) => ({
    id: user.id,
    name: user.displayName ?? user.username,
    username: user.username,
    avatarUrl: user.avatarUrl,
  }));
}

/**
 * Reads the authors picked in a dashboard form. The ids come from the browser, so only writers and admins that
 * exist count, each once, in the order picked.
 *
 * @param formData - The form, with the ids as JSON in its `authors` field.
 * @returns The authors' ids, or null when the form had none that count.
 */
export async function readAuthors(
  formData: FormData,
): Promise<string[] | null> {
  let ids: unknown;
  try {
    ids = JSON.parse(String(formData.get('authors') ?? '[]'));
  } catch {
    return null;
  }
  if (!Array.isArray(ids)) return null;

  const unique = [
    ...new Set(ids.filter((id): id is string => typeof id === 'string')),
  ].slice(0, MAX_AUTHORS);
  const allowed = await prisma.user.findMany({
    where: { id: { in: unique }, role: { in: [Role.WRITER, Role.ADMIN] } },
    select: { id: true },
  });
  const allowedIds = new Set(allowed.map(({ id }) => id));
  const authors = unique.filter((id) => allowedIds.has(id));

  return authors.length > 0 ? authors : null;
}

/**
 * The rows for a post's or project's author list, in the picked order.
 */
export function authorRows(ids: string[]) {
  return ids.map((userId, position) => ({ userId, position }));
}
