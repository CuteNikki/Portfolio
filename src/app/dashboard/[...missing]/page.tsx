import { notFound } from 'next/navigation';

import { requireWriter } from '@/lib/auth';

// Unknown addresses under /dashboard would otherwise get the site's own 404 page, without the dashboard around it.
// Catching them here shows the dashboard's not-found page inside its layout instead.
export const instant = false;

export default async function MissingDashboardPage() {
  await requireWriter();
  notFound();
}
