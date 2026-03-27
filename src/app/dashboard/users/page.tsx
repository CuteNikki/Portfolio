import { Users2Icon } from 'lucide-react';

import { SITE_METADATA } from '@/constants/metadata';

import { UsersTable } from '@/components/dashboard/user-table';

export const { dashboardUsers: metadata } = SITE_METADATA;

export default async function UsersPage() {
  return (
    <div className='flex w-full flex-col gap-4 border p-4 sm:p-8'>
      <h1 className='text-primary-text flex items-center gap-2 text-xl font-semibold'>
        <Users2Icon className='shrink-0' /> Users
      </h1>
      <UsersTable />
    </div>
  );
}
