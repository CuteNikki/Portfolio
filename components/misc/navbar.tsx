import Link from 'next/link';

import { Button } from '@/components/ui/button';

export function Navbar() {
  return (
    <div className='absolute z-50 flex w-full items-center justify-center p-4'>
      <div className='h-10 w-full max-w-screen-lg rounded-xl bg-background/20 outline outline-2 outline-foreground/5 drop-shadow-xl backdrop-blur-xl'>
        <div className='flex h-10 flex-row items-center justify-between sm:px-4'>
          <Button variant='link' asChild>
            <Link href='/'>Nikki</Link>
          </Button>
          <div className='flex flex-row'>
            <Button variant='link' asChild>
              <Link href='/'>Home</Link>
            </Button>
            <Button variant='link' asChild>
              <Link href='/about'>About</Link>
            </Button>
            <Button variant='link' asChild>
              <Link href='/projects'>Projects</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
