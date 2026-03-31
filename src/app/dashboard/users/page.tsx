import { Users2Icon } from 'lucide-react';

import { SITE_METADATA } from '@/constants/metadata';
import prisma from '@/lib/prisma';

import { DashboardHeader } from '@/components/dashboard/shared/header';
import { TableWrapper } from '@/components/dashboard/shared/table-wrapper';
import { columns } from '@/components/dashboard/users/columns';

export const { dashboardUsers: metadata } = SITE_METADATA;

export default async function UsersPage() {
  const users = await prisma.user.findMany();

  return (
    <div className='flex w-full flex-col gap-4 border p-4 sm:p-8'>
      <DashboardHeader
        icon={Users2Icon}
        title={'Users'}
        description={'Manage users and their permissions.'}
      />
      <TableWrapper
        columns={columns}
        data={users}
        filterPlaceholder='Filter Users...'
      />
    </div>
  );
}
