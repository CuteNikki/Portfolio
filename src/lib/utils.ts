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
  }).format(date);
}
