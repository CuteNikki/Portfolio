'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { Trash2Icon } from 'lucide-react';

import type { Role } from '@/generated/prisma/enums';

import { LINKS } from '@/constants/links';

import { RoleSelect } from '@/components/dashboard/users/columns';
import { DeleteUserDialog } from '@/components/dashboard/users/delete-user';
import { Button } from '@/components/ui/button';

// What admins can do on someone's page: change their role or delete them
export function UserAdminActions({
  user,
}: {
  user: { id: string; username: string; role: Role };
}) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);

  return (
    <>
      <RoleSelect user={user} size='default' />
      <Button variant='destructive' onClick={() => setConfirming(true)}>
        <Trash2Icon />
        Delete
      </Button>
      <DeleteUserDialog
        user={user}
        open={confirming}
        onOpenChange={setConfirming}
        onDeleted={() => router.push(LINKS.dashboardUsers.url)}
      />
    </>
  );
}
