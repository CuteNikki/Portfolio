import { cacheLife } from 'next/cache';
import Link from 'next/link';

import { FOOTER_LINKS } from '@/constants/links';

import { cn } from '@/lib/utils';

// `wide` spans the whole window instead of the page column, like the dashboard's navbar
export function Footer({ wide }: { wide?: boolean }) {
  return (
    <footer className='w-full border-t'>
      <div
        className={cn(
          'text-muted-foreground mx-auto flex flex-wrap items-center justify-between gap-x-8 gap-y-4 px-4 py-7 text-[13px] sm:px-6',
          wide ? 'lg:px-6' : 'container max-w-6xl lg:px-8',
        )}
      >
        <p>
          &copy; <CurrentYear /> niso.moe
        </p>
        <nav aria-label='Legal'>
          <ul className='flex flex-wrap gap-x-5 gap-y-2'>
            {FOOTER_LINKS.map(({ url, label, lang }) => (
              <li key={url}>
                <Link
                  href={url}
                  lang={lang}
                  className='hover:text-foreground lowercase transition-colors'
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </footer>
  );
}

// Cached so the footer can be prerendered; refreshed daily to roll over the year
async function CurrentYear() {
  'use cache';
  cacheLife('days');

  return new Date().getFullYear();
}
