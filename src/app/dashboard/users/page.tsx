import { UsersTable } from '@/components/dashboard/user-table';

export default function UsersPage() {
  return (
    <div className='container mx-auto py-10'>
      <h1 className='mb-6 text-2xl font-bold'>Users</h1>
      <UsersTable />
    </div>
  );
}
