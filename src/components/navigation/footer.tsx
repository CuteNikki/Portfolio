import Link from 'next/link';

import { ThemeButton } from '@/components/ui/theme-button';

import { links } from '@/constants/links';

import { chunkArray } from '@/lib/utils';

export function Footer() {
  return (
    <footer className='container m-4 mx-auto flex flex-wrap items-center justify-between gap-4 self-end rounded-xl p-4 px-8'>
      <div className='flex items-center gap-4'>
        <ThemeButton />
        <span>Nikki Sophie</span>
      </div>
      <div className='flex flex-row gap-8'>
        {chunkArray(Object.values(links), 2).map((chunk, index) => (
          <div key={`${index}-footer-links`} className='flex flex-col gap-2'>
            {chunk.map((link, index) => (
              <Link key={`${index}-footer-link-${link.name}`} href={link.href} className='hover:underline hover:underline-offset-4'>
                {link.name}
              </Link>
            ))}
          </div>
        ))}
      </div>
    </footer>
  );
}
