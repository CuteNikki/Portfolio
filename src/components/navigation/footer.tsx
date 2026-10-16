import { cacheLife } from 'next/cache';
import Link from 'next/link';

import { FOOTER_LINKS } from '@/constants/links';

export function Footer() {
  return (
    <footer className='w-full border-t'>
      <div className='text-muted-foreground container mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-8 gap-y-4 px-4 py-7 text-[13px] sm:px-6 lg:px-8'>
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
