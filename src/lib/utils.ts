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

/**
 * Calculates the age in years based on the given birthdate and an optional reference date.
 *
 * @param birthdate - The date of birth.
 * @param reference - The reference date to calculate the age from. Defaults to the current date if not provided.
 * @returns The calculated age in years.
 */
export function getAge(birthdate: Date, reference = new Date()): number {
  let age = reference.getFullYear() - birthdate.getFullYear();
  const monthDiff = reference.getMonth() - birthdate.getMonth();
  if (
    monthDiff < 0 ||
    (monthDiff === 0 && reference.getDate() < birthdate.getDate())
  ) {
    age--;
  }
  return age;
}
