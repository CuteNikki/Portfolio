import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combines class names using clsx and merges them with twMerge for Tailwind CSS compatibility.
 *
 * @param inputs - An array of class names or class name objects.
 * @returns The combined and merged class names as a single string.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string, showDays = false): string {
  if (typeof date === 'string') {
    return date;
  }

  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: showDays ? '2-digit' : undefined,
    timeZone: 'UTC',
  }).format(date);
}

export function getUserAvatarUrl(
  userId: string,
  discriminator: string,
  avatarHash: string | null,
  size: number = 64,
): string {
  // If they have a custom avatar, return it immediately
  if (avatarHash) {
    const isAnimated = avatarHash.startsWith('a_');
    const format = isAnimated ? 'gif' : 'webp';
    return `https://cdn.discordapp.com/avatars/${userId}/${avatarHash}.${format}?size=${size}`;
  }

  // Handle Default Avatars
  if (discriminator === '0' || discriminator === '#0000') {
    // New system: Use User ID
    const index = Number((BigInt(userId) >> BigInt(22)) % BigInt(6));
    return `https://cdn.discordapp.com/embed/avatars/${index}.png`;
  } else {
    // Legacy system: Use Discriminator
    const index = parseInt(discriminator) % 5;
    return `https://cdn.discordapp.com/embed/avatars/${index}.png`;
  }
}

/**
 * Shortens text to fit a length, on one line and cut at a word boundary, e.g. a comment in a list. Markdown is
 * shortened as it reads with toExcerpt in markdown.ts instead.
 *
 * @param text - The text to shorten.
 * @param maxLength - The maximum length, including the ellipsis.
 * @returns The text, shortened if it was longer.
 */
export function shorten(text: string, maxLength: number): string {
  const line = text.replace(/\s+/g, ' ').trim();
  if (line.length <= maxLength) return line;

  const cut = line.slice(0, maxLength - 1);
  const lastSpace = cut.lastIndexOf(' ');
  return `${(lastSpace > 0 ? cut.slice(0, lastSpace) : cut).replace(/[\s.,;:!?-]+$/, '')}…`;
}

/**
 * Turns text into a URL slug of lowercase ASCII letters, digits and dashes, e.g. "Über Linux!" becomes "ueber-linux".
 *
 * @param text - The text to turn into a slug, e.g. a title.
 * @param maxLength - The maximum length of the slug.
 * @returns The slug, or an empty string if the text has no letters or digits.
 */
export function slugify(text: string, maxLength = 80): string {
  return text
    .toLowerCase()
    .replace(/ä/g, 'ae')
    .replace(/ö/g, 'oe')
    .replace(/ü/g, 'ue')
    .replace(/ß/g, 'ss')
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '') // accents
    .replace(/[^a-z0-9]+/g, '-')
    .slice(0, maxLength)
    .replace(/^-+|-+$/g, '');
}

/**
 * Points a Discord avatar URL at this site's /discord-cdn rewrite (see next.config.ts), so the browser loads it from
 * here instead of from Discord. Other URLs are returned unchanged.
 *
 * @param url - The avatar URL as stored for the user.
 * @returns The URL to put in the page.
 */
export function proxiedAvatarUrl(url: string): string {
  return url.replace(/^https:\/\/cdn\.discordapp\.com\//, '/discord-cdn/');
}

/**
 * Formats a date the short way the cards show it, e.g. "16 Sep 2026".
 *
 * @param date - The date to format.
 * @returns The formatted date, in UTC so the server and browser agree.
 */
export function formatShortDate(date: Date | string): string {
  // Built from parts: British English writes "Sept", American English puts the month first
  const parts = new Intl.DateTimeFormat('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  }).formatToParts(new Date(date));
  const part = (type: string) => parts.find((p) => p.type === type)?.value;

  return `${part('day')} ${part('month')} ${part('year')}`;
}

/**
 * Picks one of the five chart colours for a title, so every project keeps the same colour wherever it's shown.
 *
 * @param text - The text to pick a colour for, e.g. a project's title.
 * @returns A CSS colour variable, e.g. "var(--chart-3)".
 */
export function toneFor(text: string): string {
  let hash = 0;
  for (const char of text) hash = (hash * 31 + char.charCodeAt(0)) | 0;
  return `var(--chart-${(Math.abs(hash) % 5) + 1})`;
}

/**
 * A project's colour: the one picked for it in the dashboard, or else the chart colour closest to its cover's main
 * colour, or else one from its title (see toneFor).
 *
 * @param project - The project's title, picked colour ("1" to "5" for a chart colour, or "#rrggbb") and cover colour.
 * @returns A CSS colour, e.g. "var(--chart-3)" or "#e88c3a".
 */
export function projectTone(project: {
  title: string;
  tone?: string | null;
  coverTone?: number | null;
}): string {
  const { tone, coverTone } = project;
  if (tone && /^[1-5]$/.test(tone)) return `var(--chart-${tone})`;
  if (tone && /^#[0-9a-f]{6}$/i.test(tone)) return tone;
  if (coverTone && coverTone >= 1 && coverTone <= 5)
    return `var(--chart-${coverTone})`;
  return toneFor(project.title);
}
