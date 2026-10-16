import { notFound } from 'next/navigation';

import { SITE_METADATA } from '@/constants/metadata';

// Unknown addresses would otherwise get the site's global 404 page, which has to do without the account menu.
// Catching them here shows this group's not-found page inside the usual layout instead.
export const { notFound: metadata } = SITE_METADATA;

// The page never renders, so there is nothing for instant navigation to check
export const instant = false;

export default function MissingPage() {
  notFound();
}
