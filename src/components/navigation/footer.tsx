import { cacheLife } from 'next/cache';
import Link from 'next/link';

import { ThemeSwitcher } from '@/components/theme/switcher';

import { FOOTER_LINKS } from '@/constants/links';

export function Footer() {
  return (
    <footer className='bg-background/95 w-full border-t'>
      <div className='container mx-auto flex items-center justify-between gap-3 overflow-x-auto px-4 py-6 tracking-tight sm:px-6 lg:px-8'>
        <p className='text-muted-foreground shrink-0 text-sm whitespace-nowrap'>
          &copy; <CurrentYear /> niso.moe
        </p>
        <div className='text-muted-foreground shrink-0 text-sm font-medium whitespace-nowrap'>
          <ul className='flex flex-wrap gap-4'>
            {FOOTER_LINKS.map(({ url, label }) => (
              <li key={url}>
                <Link
                  href={url}
                  className='hover:text-primary-text lowercase transition-colors'
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <ThemeSwitcher className='hidden sm:flex' />
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
