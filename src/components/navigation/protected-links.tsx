import Link from 'next/link';

import { Role } from '@/generated/prisma/enums';

import { getCurrentSession } from '@/lib/auth';

import { NAVBAR_LINKS } from '@/constants/links';

export async function ProtectedNavLinks({ isMobile }: { isMobile?: boolean }) {
  const session = await getCurrentSession();
  const isAuthorized =
    session?.user.role === Role.ADMIN || session?.user.role === Role.WRITER;

  if (!isAuthorized) return null;

  const protectedLinks = NAVBAR_LINKS.filter((link) => link.requiresAuth);

  return (
    <>
      {protectedLinks.map(({ url, label, icon: Icon }) => (
        <li key={url}>
          <Link
            href={url}
            className={
              isMobile
                ? 'hover:text-primary-text active:text-primary-text focus:text-primary-text flex items-center gap-2 text-lg font-medium lowercase transition-colors'
                : 'hover:text-primary-text text-muted-foreground lowercase transition-colors'
            }
          >
            {isMobile && Icon && <Icon className='size-5 shrink-0' />}
            {label}
          </Link>
        </li>
      ))}
    </>
  );
}
