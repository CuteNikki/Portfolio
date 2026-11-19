import { CircleUserRoundIcon, MenuIcon } from 'lucide-react';

import { canWrite } from '@/constants/roles';

import { getDisplaySession } from '@/lib/auth';

import { AccountMenu } from '@/components/navigation/account-menu';

// Reads the session, so it has to sit behind a Suspense boundary. Only the fields the menus show reach the browser.
export async function AccountButton() {
  const session = await getDisplaySession();
  const user = session
    ? {
        name: session.user.displayName ?? session.user.username,
        username: session.user.username,
        avatarUrl: session.user.avatarUrl,
        role: session.user.role,
        canWrite: canWrite(session.user.role),
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
        className='hidden size-10 place-items-center rounded-lg border border-border bg-card text-muted-foreground sm:grid'
      >
        <CircleUserRoundIcon className='size-4.5' />
      </span>
      <span
        aria-hidden
        className='grid size-10 place-items-center rounded-lg border border-border bg-card text-muted-foreground sm:hidden'
      >
        <MenuIcon className='size-5' />
      </span>
    </>
  );
}
