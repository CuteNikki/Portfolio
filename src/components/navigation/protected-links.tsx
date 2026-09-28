import Link from 'next/link';

import { NAVBAR_LINKS } from '@/constants/links';

import { WriterOnly } from '@/components/common/writer-only';

export function ProtectedNavLinks({ isMobile }: { isMobile?: boolean }) {
  const protectedLinks = NAVBAR_LINKS.filter((link) => link.requiresAuth);

  return (
    <WriterOnly>
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
    </WriterOnly>
  );
}
