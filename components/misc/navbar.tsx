import Link from 'next/link';

import { navbarLinks } from '@/constants/routes';

import { ThemeSwitch } from '@/components/theme/theme-switch';

export function Navbar() {
  return (
    <header className='absolute z-50 flex w-full items-center justify-center p-4'>
      <nav className='h-10 w-full max-w-screen-lg rounded-md border border-foreground/10 bg-background/30 backdrop-blur-xl'>
        <div className='flex h-10 flex-row items-center justify-between'>
          <Link href='/' className='group rounded-md px-4 py-2'>
            <span className='anim-underline'>Nikki</span>
          </Link>
          <div className='flex flex-row'>
            {navbarLinks.map((route, index) => (
              <Link href={route.href} key={`navbar-link-${index}-${route.name}-${route.href}`} className='group rounded-md px-4 py-2'>
                <span className='anim-underline'>{route.name}</span>
              </Link>
            ))}
            <ThemeSwitch />
          </div>
        </div>
      </nav>
    </header>
  );
}
