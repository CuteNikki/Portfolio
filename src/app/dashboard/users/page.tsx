import { SITE_METADATA } from '@/constants/metadata';
import { requireAdmin } from '@/lib/auth';
import prisma from '@/lib/prisma';

import { DashboardPageHeader } from '@/components/dashboard/shared/page-header';
import { DataTable } from '@/components/dashboard/shared/table';
import { columns } from '@/components/dashboard/users/columns';

export const { dashboardUsers: metadata } = SITE_METADATA;

// Every dashboard page checks the session before it renders anything, so moving between them waits for the server.
// The layout's `instant = false` only covers arriving from outside the dashboard.
export const instant = false;

export default async function UsersPage() {
  await requireAdmin();

  const { users, hasError } = await prisma.user
    .findMany({
      omit: { accessToken: true, refreshToken: true, tokenExpiresAt: true },
      orderBy: { createdAt: 'asc' },
    })
    .then((users) => ({ users, hasError: false }))
    .catch((error) => {
      console.error('Error fetching users:', error);
      return { users: [], hasError: true };
    });

  return (
    <div className='flex flex-col gap-6'>
      <DashboardPageHeader
        title='Users'
        description='Everyone who has signed in. Admins can change roles here.'
      />
      <DataTable
        columns={columns}
        data={users}
        hasError={hasError}
        defaultSorting={[{ id: 'role', desc: false }]}
        filterPlaceholder='Search users'
      />
    </div>
  );
}
