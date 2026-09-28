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
 * Turns markdown into a plain-text excerpt for meta descriptions, cut at a word boundary.
 *
 * @param markdown - The markdown source.
 * @param maxLength - The maximum length of the excerpt, including the ellipsis.
 * @returns The plain-text excerpt.
 */
export function toExcerpt(markdown: string, maxLength = 160): string {
  const text = markdown
    .replace(/```[\s\S]*?```/g, ' ') // code blocks
    .replace(/<[^>]+>/g, ' ') // html tags
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ') // images
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1') // links
    .replace(/^\s{0,3}(#{1,6}|>|[-*+]|\d+\.)\s+/gm, '') // headings, quotes, lists
    .replace(/[*_~`|]/g, '') // emphasis, inline code, tables
    .replace(/\s+/g, ' ')
    .trim();

  if (text.length <= maxLength) return text;

  const cut = text.slice(0, maxLength - 1);
  const lastSpace = cut.lastIndexOf(' ');
  return `${(lastSpace > 0 ? cut.slice(0, lastSpace) : cut).replace(/[\s.,;:!?-]+$/, '')}…`;
}
