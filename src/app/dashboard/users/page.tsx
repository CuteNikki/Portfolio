import { Users2Icon } from 'lucide-react';

import { SITE_METADATA } from '@/constants/metadata';
import { requireAdmin } from '@/lib/auth';
import prisma from '@/lib/prisma';

import { DashboardHeader } from '@/components/dashboard/shared/header';
import { DataTable } from '@/components/dashboard/shared/table';
import { columns } from '@/components/dashboard/users/columns';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

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
    <Card>
      <CardHeader>
        <DashboardHeader
          icon={Users2Icon}
          title={'Users'}
          description={'Manage users and their permissions.'}
        />
      </CardHeader>
      <CardContent>
        <DataTable
          columns={columns}
          data={users}
          hasError={hasError}
          filterPlaceholder='Filter Users...'
        />
      </CardContent>
    </Card>
  );
}
