import Link from 'next/link';

import { routes } from '@/assets/routes';

import { ThemeSwitch } from '@/components/theme/theme-switch';
import { Button } from '@/components/ui/button';

export function Navbar() {
  return (
    <header className='absolute z-50 flex w-full items-center justify-center p-4'>
      <nav className='h-10 w-full max-w-screen-lg rounded-md border border-foreground/10 bg-background/30 backdrop-blur-xl'>
        <div className='flex h-10 flex-row items-center justify-between'>
          <Button variant='link' asChild>
            <Link href='/'>Nikki</Link>
          </Button>
          <div className='flex flex-row'>
            {routes.map((route) => (
              <Button key={route.href} variant='link' asChild>
                <Link href={route.href}>{route.name}</Link>
              </Button>
            ))}
            <ThemeSwitch />
          </div>
        </div>
      </nav>
    </header>
  );
}
