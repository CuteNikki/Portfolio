import Link from 'next/link';

import { Button } from '@/components/ui/button';

import { links, navbarLinks } from '@/constants/links';

export function Navbar() {
  return (
    <header className='self-start'>
      <nav className='container m-4 mx-auto flex flex-wrap items-center justify-between rounded-xl p-4 px-8'>
        <Button variant='link' asChild>
          <Link href={links.home.href}>niso</Link>
        </Button>
        <div className='flex flex-wrap'>
          {navbarLinks.map((link, index) => (
            <Button key={`${index}-navbar-link-${link.name}`} variant='link' asChild>
              <Link href={link.href}>{link.name}</Link>
            </Button>
          ))}
        </div>
      </nav>
    </header>
  );
}
