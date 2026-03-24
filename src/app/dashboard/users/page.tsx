import { Users2Icon } from 'lucide-react';

import { UsersTable } from '@/components/dashboard/user-table';

export default async function UsersPage() {
  return (
    <div className='flex w-full max-w-5xl flex-col gap-4 border p-4 sm:p-8'>
      <h1 className='text-primary-text flex items-center gap-2 text-xl font-semibold'>
        <Users2Icon className='shrink-0' /> Users
      </h1>
      <UsersTable />
    </div>
  );
}
