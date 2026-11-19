'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { NAVBAR_LINKS } from '@/constants/links';

import { cn } from '@/lib/utils';

// A link counts as current on its own page and on the pages below it, so /projects/ludo still marks "projects"
export function isCurrent(pathname: string, url: string) {
  const path = url.split('#')[0] || '/';
  return path === '/' ? pathname === '/' : pathname.startsWith(path);
}

// The navbar's page links on larger screens; on phones they are in the mobile menu. Imports the links itself rather
// than taking them as a prop: their icons are components, which a Server Component can't pass to a Client Component.
export function NavLinks() {
  return <NavLinkList pathname={usePathname()} />;
}

// Until the path is known, as on a post or project the build didn't know about: the same links, none current yet.
// Only the current link's color differs, so nothing moves when NavLinks takes over.
export function NavLinksPlaceholder() {
  return <NavLinkList pathname={null} />;
}

function NavLinkList({ pathname }: { pathname: string | null }) {
  return (
    <ul className='flex items-center gap-8 text-sm'>
      {NAVBAR_LINKS.map(({ url, label }) => {
        const current = pathname !== null && isCurrent(pathname, url);

        return (
          <li key={url}>
            <Link
              href={url}
              aria-current={current ? 'page' : undefined}
              className={cn(
                'nav-underline lowercase transition-colors hover:text-foreground',
                current ? 'text-foreground' : 'text-muted-foreground'
              )}
            >
              {label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
