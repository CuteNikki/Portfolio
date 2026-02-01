import Image from 'next/image';
import Link from 'next/link';

import { ThemeSwitcher } from '@/components/theme/switcher';
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <div className='flex min-h-screen items-center justify-center'>
      <main className='flex min-h-screen w-full max-w-3xl flex-col items-center justify-between px-16 py-32 sm:items-start'>
        <Image
          className='dark:invert'
          src='/next.svg'
          alt='Next.js logo'
          unoptimized
          width={100}
          height={20}
          priority
        />
        <div className='flex flex-col items-center gap-6 text-center sm:items-start sm:text-left'>
          <h1 className='max-w-xs text-3xl leading-10 font-semibold tracking-tight'>
            To get started, edit the page.tsx file.
          </h1>
          <p className='text-muted-foreground max-w-md text-lg leading-8'>
            Looking for a starting point or more instructions? Head over to{' '}
            <Link
              href='https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app'
              className='text-foreground underline'
            >
              Templates
            </Link>{' '}
            or the{' '}
            <Link
              href='https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app'
              className='text-foreground underline'
            >
              Learning
            </Link>{' '}
            center.
          </p>
        </div>
        <div className='flex flex-col gap-4 sm:flex-row'>
          <Button asChild>
            <Link
              href='https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app'
              target='_blank'
              rel='noopener noreferrer'
            >
              <Image
                src='/vercel.svg'
                alt='Vercel logomark'
                unoptimized
                width={16}
                height={16}
              />
              Deploy Now
            </Link>
          </Button>
          <Button variant='secondary' asChild>
            <Link
              href='https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app'
              target='_blank'
              rel='noopener noreferrer'
            >
              Documentation
            </Link>
          </Button>
          <ThemeSwitcher />
        </div>
      </main>
    </div>
  );
}
