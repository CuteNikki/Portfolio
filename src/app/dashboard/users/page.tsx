import { UsersTable } from '@/components/dashboard/user-table';

export default async function UsersPage() {
  return (
    <div className='container mx-auto'>
      <h1 className='text-2xl font-bold'>Users</h1>
      <UsersTable />
    </div>
  );
}
