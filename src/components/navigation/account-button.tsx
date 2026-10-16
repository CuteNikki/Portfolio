import { CircleUserRoundIcon } from 'lucide-react';

import { Role } from '@/generated/prisma/enums';

import { getCurrentSession } from '@/lib/auth';

import { AccountMenu } from '@/components/navigation/account-menu';

// Reads the session, so it has to sit behind a Suspense boundary. Only the fields the menu shows reach the browser:
// the full user also holds the Discord access and refresh tokens.
export async function AccountButton() {
  const session = await getCurrentSession();

  if (!session) return <AccountMenu user={null} />;

  const { user } = session;

  return (
    <AccountMenu
      user={{
        name: user.displayName ?? user.username,
        username: user.username,
        avatarUrl: user.avatarUrl,
        role: user.role,
        canWrite: user.role === Role.ADMIN || user.role === Role.WRITER,
      }}
    />
  );
}

// Same size and look as the signed-out button, so nothing moves when the menu streams in
export function AccountButtonPlaceholder() {
  return (
    <span
      aria-hidden
      className='border-border bg-card text-muted-foreground grid size-11 place-items-center rounded-lg border'
    >
      <CircleUserRoundIcon className='size-4.5' />
    </span>
  );
}
