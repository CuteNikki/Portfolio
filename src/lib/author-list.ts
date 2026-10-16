import type { PublicUser } from '@/lib/data';

// An author as pages show them: someone who signed in (with their public fields), or someone without an account
export interface Author {
  key: string;
  name: string;
  // Only for people without an account; a user's name opens their card instead
  url: string | null;
  avatarUrl: string | null;
  user: PublicUser | null;
}

/**
 * The authors of a post or project, in the order they're shown.
 */
export function authorsOf(item: {
  authors: {
    id: string;
    name: string | null;
    url: string | null;
    user: PublicUser | null;
  }[];
}): Author[] {
  return item.authors.map(({ id, name, url, user }) => ({
    key: id,
    name: user ? (user.displayName ?? user.username) : (name ?? 'Unknown'),
    url: user ? null : url,
    avatarUrl: user?.avatarUrl ?? null,
    user,
  }));
}
