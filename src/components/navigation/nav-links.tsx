'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { NAVBAR_LINKS } from '@/constants/links';

import { cn } from '@/lib/utils';

// A link counts as current on its own page and on the pages below it, so /projects/ludo still marks "projects"
function isCurrent(pathname: string, url: string) {
  const path = url.split('#')[0] || '/';
  return path === '/' ? pathname === '/' : pathname.startsWith(path);
}

// Imports the links itself rather than taking them as a prop: their icons are components, which a Server Component
// can't pass to a Client Component
export function NavLinks({ isMobile }: { isMobile?: boolean }) {
  const pathname = usePathname();

  return (
    <ul
      className={
        isMobile
          ? 'flex flex-col gap-1 py-4'
          : 'flex items-center gap-8 text-sm'
      }
    >
      {NAVBAR_LINKS.map(({ url, label, icon: Icon }) => {
        const current = isCurrent(pathname, url);

        return (
          <li key={url}>
            <Link
              href={url}
              aria-current={current ? 'page' : undefined}
              className={cn(
                'lowercase transition-colors',
                isMobile
                  ? 'hover:bg-muted flex h-12 items-center gap-3 rounded-lg px-3 text-base'
                  : 'nav-underline hover:text-foreground',
                current
                  ? 'text-foreground'
                  : isMobile
                    ? 'text-body'
                    : 'text-muted-foreground',
                isMobile && current && 'bg-primary-soft',
              )}
            >
              {isMobile && Icon && (
                <Icon className='text-muted-foreground size-5 shrink-0' />
              )}
              {label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
