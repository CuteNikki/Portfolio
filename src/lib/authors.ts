import { PUBLIC_USER_SELECT } from '@/lib/data';
import prisma from '@/lib/prisma';

import { canWrite } from '@/constants/roles';

import type { AuthorOption } from '@/components/dashboard/shared/authors-field';

const MAX_AUTHORS = 10;
const MAX_NAME_LENGTH = 80;
const MAX_URL_LENGTH = 300;

// One author as the dashboard form sends it: someone who signed in, or someone without an account
export type AuthorEntry =
  { userId: string } | { name: string; url: string | null };

/**
 * The people who can be picked as authors: everyone who has signed in, writers and admins first.
 */
export async function getAuthorOptions(): Promise<AuthorOption[]> {
  const users = await prisma.user.findMany({
    select: PUBLIC_USER_SELECT,
    orderBy: { username: 'asc' },
  });

  return users
    .map((user) => ({
      id: user.id,
      name: user.displayName ?? user.username,
      username: user.username,
      avatarUrl: user.avatarUrl,
      isWriter: canWrite(user.role),
    }))
    .sort((a, b) => Number(b.isWriter) - Number(a.isWriter));
}

// A link for someone without an account, only http(s), or null when there's none or it isn't one
function readUrl(value: unknown): string | null {
  if (typeof value !== 'string' || !value.trim()) return null;
  try {
    const url = new URL(value.trim());
    return (url.protocol === 'https:' || url.protocol === 'http:') &&
      url.href.length <= MAX_URL_LENGTH
      ? url.href
      : null;
  } catch {
    return null;
  }
}

/**
 * Reads the authors picked in a dashboard form. They come from the browser, so only users that exist count, each
 * once, and people without an account need a name; everything stays in the order picked.
 *
 * @param formData - The form, with the authors as JSON in its `authors` field.
 * @returns The authors, or null when the form had none that count.
 */
export async function readAuthors(
  formData: FormData,
): Promise<AuthorEntry[] | null> {
  let raw: unknown;
  try {
    raw = JSON.parse(String(formData.get('authors') ?? '[]'));
  } catch {
    return null;
  }
  if (!Array.isArray(raw)) return null;

  const entries: AuthorEntry[] = [];
  for (const item of raw as unknown[]) {
    if (!item || typeof item !== 'object') continue;
    const { userId, name, url } = item as Record<string, unknown>;
    if (typeof userId === 'string') {
      entries.push({ userId });
    } else if (typeof name === 'string' && name.trim()) {
      entries.push({
        name: name.trim().slice(0, MAX_NAME_LENGTH),
        url: readUrl(url),
      });
    }
  }

  const userIds = entries.flatMap((entry) =>
    'userId' in entry ? [entry.userId] : [],
  );
  const existing = new Set(
    (
      await prisma.user.findMany({
        where: { id: { in: userIds } },
        select: { id: true },
      })
    ).map(({ id }) => id),
  );

  const seen = new Set<string>();
  const authors = entries
    .filter((entry) => {
      if (!('userId' in entry)) return true;
      if (!existing.has(entry.userId) || seen.has(entry.userId)) return false;
      seen.add(entry.userId);
      return true;
    })
    .slice(0, MAX_AUTHORS);

  return authors.length > 0 ? authors : null;
}

/**
 * The rows for a post's or project's author list, in the picked order.
 */
export function authorRows(authors: AuthorEntry[]) {
  return authors.map((author, position) =>
    'userId' in author
      ? { userId: author.userId, position }
      : { name: author.name, url: author.url, position },
  );
}

/**
 * A saved author list as the dashboard form starts with it.
 */
export function authorEntries(
  authors: { userId: string | null; name: string | null; url: string | null }[],
): AuthorEntry[] {
  return authors.flatMap(({ userId, name, url }): AuthorEntry[] =>
    userId ? [{ userId }] : name ? [{ name, url }] : [],
  );
}
