import { slugify } from '@/lib/utils';

// Picks the slug for a post or project. A slug that was entered is cleaned up and must be free. Without one, the slug
// comes from the title, with -2, -3, … added while it's taken. The slug is null when neither has any letters or
// digits, so the entry is reached by its id. A taken slug comes back as an error to show, not a thrown one, since a
// production build hides a thrown error's message (see action-result.ts).
export async function resolveSlug(
  entered: FormDataEntryValue | null,
  title: string,
  isTaken: (slug: string) => Promise<boolean>,
): Promise<{ slug: string | null } | { error: string }> {
  if (typeof entered === 'string' && entered.trim()) {
    const slug = slugify(entered);
    if (!slug) return { slug: null };
    if (await isTaken(slug)) {
      return {
        error: `The URL slug "${slug}" is already in use. Please choose a different one.`,
      };
    }
    return { slug };
  }

  const base = slugify(title);
  if (!base) return { slug: null };

  for (let n = 1; ; n++) {
    const slug = n === 1 ? base : `${base}-${n}`;
    if (!(await isTaken(slug))) return { slug };
  }
}
