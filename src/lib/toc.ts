import GithubSlugger from 'github-slugger';

import { toExcerpt } from '@/lib/utils';

export interface TocEntry {
  id: string;
  text: string;
  level: 2 | 3;
}

/**
 * The second and third level headings of a markdown text, with the same ids rehype-slug gives them on the page, for
 * an "On this page" list. Headings inside code blocks don't count.
 */
export function headingsOf(markdown: string): TocEntry[] {
  const slugger = new GithubSlugger();
  const entries: TocEntry[] = [];
  let inCode = false;

  for (const line of markdown.split('\n')) {
    if (/^\s*(```|~~~)/.test(line)) inCode = !inCode;
    if (inCode) continue;

    const match = line.match(/^(#{1,6})\s+(.+?)\s*#*\s*$/);
    if (!match) continue;

    // Every heading takes a slug, so later ones get the same "-1" suffixes as on the page
    const text = toExcerpt(match[2], 120);
    const id = slugger.slug(text);
    const level = match[1].length;
    if (level === 2 || level === 3) entries.push({ id, text, level });
  }

  return entries;
}
