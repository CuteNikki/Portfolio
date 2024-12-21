import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getAcronym(text: string) {
  return text
    .replace(/'s /g, ' ')
    .replace(/\w+/g, (e) => e[0])
    .replace(/\s/g, '');
}
