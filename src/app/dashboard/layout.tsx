import { redirect } from 'next/navigation';

import { getCurrentSession } from '@/lib/auth';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getCurrentSession();

  if (!session || session.user.role !== 'ADMIN') {
    redirect('/unauthorized');
  }

  return children;
}
