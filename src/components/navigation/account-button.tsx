import { CircleUserRoundIcon, MenuIcon } from 'lucide-react';

import { Role } from '@/generated/prisma/enums';

import { getCurrentSession } from '@/lib/auth';

import { AccountMenu } from '@/components/navigation/account-menu';

// Reads the session, so it has to sit behind a Suspense boundary. Only the fields the menus show reach the browser:
// the full user also holds the Discord access and refresh tokens.
export async function AccountButton() {
  const session = await getCurrentSession();
  const user = session
    ? {
        name: session.user.displayName ?? session.user.username,
        username: session.user.username,
        avatarUrl: session.user.avatarUrl,
        role: session.user.role,
        canWrite:
          session.user.role === Role.ADMIN || session.user.role === Role.WRITER,
      }
    : null;

  return (
    <>
      <AccountMenu user={user} className='hidden sm:inline-flex' />
      <AccountMenu user={user} withPages className='sm:hidden' />
    </>
  );
}

// Same size and look as the buttons above, so nothing moves when they stream in
export function AccountButtonPlaceholder() {
  return (
    <>
      <span
        aria-hidden
        className='border-border bg-card text-muted-foreground hidden size-10 place-items-center rounded-lg border sm:grid'
      >
        <CircleUserRoundIcon className='size-4.5' />
      </span>
      <span
        aria-hidden
        className='border-border bg-card text-muted-foreground grid size-10 place-items-center rounded-lg border sm:hidden'
      >
        <MenuIcon className='size-5' />
      </span>
    </>
  );
}
