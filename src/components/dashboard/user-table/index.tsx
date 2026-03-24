import prisma from '@/lib/prisma';

import { User } from '../../../../generated/prisma/client';

import { columns } from './columns';
import { DataTable } from './data-table';

async function getData(): Promise<User[]> {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      discordId: true,
      displayName: true,
      username: true,
      avatarUrl: true,
      role: true,
    },
  });
  return users;
}

export async function UsersTable() {
  const data = await getData();

  return <DataTable columns={columns} data={data} />;
}
