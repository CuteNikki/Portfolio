import Link from 'next/link';

import { ThemeSwitcher } from '@/components/theme/switcher';

import { FOOTER_LINKS } from '@/constants/links';

export function Footer() {
  return (
    <footer className='bg-background/95 w-full border-t'>
      <div className='container mx-auto flex items-center justify-between gap-4 p-4 tracking-tight'>
        <p className='text-muted-foreground text-sm'>
          &copy; {new Date().getFullYear()} niso.moe
        </p>
        <div className='text-muted-foreground text-sm'>
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
