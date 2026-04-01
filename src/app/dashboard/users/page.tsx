import { Users2Icon } from 'lucide-react';

import { SITE_METADATA } from '@/constants/metadata';
import prisma from '@/lib/prisma';

import { DashboardHeader } from '@/components/dashboard/shared/header';
import { DataTable } from '@/components/dashboard/shared/table';
import { columns } from '@/components/dashboard/users/columns';

export const { dashboardUsers: metadata } = SITE_METADATA;

export default async function UsersPage() {
  const { users, hasError } = await prisma.user
    .findMany()
    .then((users) => ({ users, hasError: false }))
    .catch((error) => {
      console.error('Error fetching users:', error);
      return { users: [], hasError: true };
    });

  return (
    <div className='flex w-full flex-col gap-4 border p-4 sm:p-8'>
      <DashboardHeader
        icon={Users2Icon}
        title={'Users'}
        description={'Manage users and their permissions.'}
      />
      <DataTable
        columns={columns}
        data={users}
        hasError={hasError}
        filterPlaceholder='Filter Users...'
      />
    </div>
  );
}
