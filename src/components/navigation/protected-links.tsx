'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

import { checkNavPermissions } from '@/actions/user';

import { NAVBAR_LINKS } from '@/constants/links';

export function ProtectedNavLinks({ isMobile }: { isMobile?: boolean }) {
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    checkNavPermissions().then((hasPermission) => {
      setIsAuthorized(hasPermission);
    });
  }, []);

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
