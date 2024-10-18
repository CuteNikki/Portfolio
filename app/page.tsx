'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

import { ThemeSwitch } from '@/components/theme-switch';
import { AuroraBackground } from '@/components/ui/aurora-background';
import { BackgroundBeams } from '@/components/ui/beams-background';
import { ShootingStars } from '@/components/ui/shooting-stars';
import { SparklesCore } from '@/components/ui/sparkles-background';
import { StarsBackground } from '@/components/ui/stars-background';
import { Vortex } from '@/components/ui/vortex-background';
import { useTheme } from 'next-themes';

export default function Page() {
  return (
    <div>
      <Aurora />
      <Beams />
      <Stars />
      <Sparkles />
      <Vort />
      <Grid />
      <SmallGrid />
      <Dot />
    </div>
  );
}

export function Aurora() {
  return (
    <div className='relative overflow-hidden'>
      <AuroraBackground />
      <motion.div
        initial={{ opacity: 0.0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.3,
          duration: 0.8,
          ease: 'easeInOut',
        }}
        className='relative grid min-h-screen grid-rows-[20px_1fr_20px] items-center justify-items-center gap-16 p-8 pb-20 sm:p-20'
      >
        <main className='row-start-2 flex flex-col items-center gap-8 sm:items-start'>
          <Image
            className='dark:invert'
            src='https://nextjs.org/icons/next.svg'
            alt='Next.js logo'
            width={180}
            height={38}
            priority
          />
          <ol className='list-inside list-decimal text-center text-sm sm:text-left'>
            <li className='mb-2'>
              Get started by editing{' '}
              <code className='rounded bg-black/[.05] px-1 py-0.5 font-semibold dark:bg-white/[.06]'>
                app/page.tsx
              </code>
              .
            </li>
            <li>Save and see your changes instantly.</li>
          </ol>
          <div className='flex flex-col items-center gap-4 sm:flex-row'>
            <a
              className='flex h-10 items-center justify-center gap-2 rounded-full border border-solid border-transparent bg-foreground px-4 text-sm text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc] sm:h-12 sm:px-5 sm:text-base'
              href='https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app'
              target='_blank'
              rel='noopener noreferrer'
            >
              <Image
                className='dark:invert'
                src='https://nextjs.org/icons/vercel.svg'
                alt='Vercel logomark'
                width={20}
                height={20}
              />
              Deploy now
            </a>
            <a
              className='flex h-10 items-center justify-center rounded-full border border-solid border-black/[.08] bg-background px-4 text-sm transition-colors hover:border-transparent hover:bg-[#f2f2f2] dark:border-white/[.145] dark:hover:bg-[#1a1a1a] sm:h-12 sm:min-w-44 sm:px-5 sm:text-base'
              href='https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app'
              target='_blank'
              rel='noopener noreferrer'
            >
              Read our docs
            </a>
            <ThemeSwitch />
          </div>
        </main>
        <footer className='row-start-3 flex flex-wrap items-center justify-center gap-6'>
          <a
            className='flex items-center gap-2 hover:underline hover:underline-offset-4'
            href='https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app'
            target='_blank'
            rel='noopener noreferrer'
          >
            <Image
              aria-hidden
              src='https://nextjs.org/icons/file.svg'
              alt='File icon'
              width={16}
              height={16}
            />
            Learn
          </a>
          <a
            className='flex items-center gap-2 hover:underline hover:underline-offset-4'
            href='https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app'
            target='_blank'
            rel='noopener noreferrer'
          >
            <Image
              aria-hidden
              src='https://nextjs.org/icons/window.svg'
              alt='Window icon'
              width={16}
              height={16}
            />
            Examples
          </a>
          <a
            className='flex items-center gap-2 hover:underline hover:underline-offset-4'
            href='https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app'
            target='_blank'
            rel='noopener noreferrer'
          >
            <Image
              aria-hidden
              src='https://nextjs.org/icons/globe.svg'
              alt='Globe icon'
              width={16}
              height={16}
            />
            Go to nextjs.org →
          </a>
        </footer>
      </motion.div>
    </div>
  );
}

export function Beams() {
  return (
    <div className='relative overflow-hidden'>
      <BackgroundBeams />
      <div className='absolute inset-0 -z-10 h-full w-full bg-background [mask-image:radial-gradient(ellipse,transparent,black)]' />
      <motion.div
        initial={{ opacity: 0.0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.3,
          duration: 0.8,
          ease: 'easeInOut',
        }}
        className='relative grid min-h-screen grid-rows-[20px_1fr_20px] items-center justify-items-center gap-16 p-8 pb-20 sm:p-20'
      >
        <main className='row-start-2 flex flex-col items-center gap-8 sm:items-start'>
          <Image
            className='dark:invert'
            src='https://nextjs.org/icons/next.svg'
            alt='Next.js logo'
            width={180}
            height={38}
            priority
          />
          <ol className='list-inside list-decimal text-center text-sm sm:text-left'>
            <li className='mb-2'>
              Get started by editing{' '}
              <code className='rounded bg-black/[.05] px-1 py-0.5 font-semibold dark:bg-white/[.06]'>
                app/page.tsx
              </code>
              .
            </li>
            <li>Save and see your changes instantly.</li>
          </ol>
          <div className='flex flex-col items-center gap-4 sm:flex-row'>
            <a
              className='flex h-10 items-center justify-center gap-2 rounded-full border border-solid border-transparent bg-foreground px-4 text-sm text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc] sm:h-12 sm:px-5 sm:text-base'
              href='https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app'
              target='_blank'
              rel='noopener noreferrer'
            >
              <Image
                className='dark:invert'
                src='https://nextjs.org/icons/vercel.svg'
                alt='Vercel logomark'
                width={20}
                height={20}
              />
              Deploy now
            </a>
            <a
              className='flex h-10 items-center justify-center rounded-full border border-solid border-black/[.08] bg-background px-4 text-sm transition-colors hover:border-transparent hover:bg-[#f2f2f2] dark:border-white/[.145] dark:hover:bg-[#1a1a1a] sm:h-12 sm:min-w-44 sm:px-5 sm:text-base'
              href='https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app'
              target='_blank'
              rel='noopener noreferrer'
            >
              Read our docs
            </a>
            <ThemeSwitch />
          </div>
        </main>
        <footer className='row-start-3 flex flex-wrap items-center justify-center gap-6'>
          <a
            className='flex items-center gap-2 hover:underline hover:underline-offset-4'
            href='https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app'
            target='_blank'
            rel='noopener noreferrer'
          >
            <Image
              aria-hidden
              src='https://nextjs.org/icons/file.svg'
              alt='File icon'
              width={16}
              height={16}
            />
            Learn
          </a>
          <a
            className='flex items-center gap-2 hover:underline hover:underline-offset-4'
            href='https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app'
            target='_blank'
            rel='noopener noreferrer'
          >
            <Image
              aria-hidden
              src='https://nextjs.org/icons/window.svg'
              alt='Window icon'
              width={16}
              height={16}
            />
            Examples
          </a>
          <a
            className='flex items-center gap-2 hover:underline hover:underline-offset-4'
            href='https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app'
            target='_blank'
            rel='noopener noreferrer'
          >
            <Image
              aria-hidden
              src='https://nextjs.org/icons/globe.svg'
              alt='Globe icon'
              width={16}
              height={16}
            />
            Go to nextjs.org →
          </a>
        </footer>
      </motion.div>
    </div>
  );
}

export function Stars() {
  const { resolvedTheme } = useTheme();

  return (
    <div className='relative overflow-hidden'>
      <StarsBackground
        starDensity={0.001}
        starColor={resolvedTheme === 'light' ? '0, 0, 0' : '255, 255, 255'}
      />
      <ShootingStars
        minDelay={2000}
        maxDelay={4000}
        starColor={resolvedTheme === 'light' ? '#000000' : '#ffffff'}
        trailColor={resolvedTheme === 'light' ? '#000000' : '#ffffff'}
      />
      <div className='absolute inset-0 -z-10 h-full w-full bg-background [mask-image:radial-gradient(ellipse,transparent,black)]' />
      <motion.div
        initial={{ opacity: 0.0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.3,
          duration: 0.8,
          ease: 'easeInOut',
        }}
        className='relative grid min-h-screen grid-rows-[20px_1fr_20px] items-center justify-items-center gap-16 p-8 pb-20 sm:p-20'
      >
        <main className='row-start-2 flex flex-col items-center gap-8 sm:items-start'>
          <Image
            className='dark:invert'
            src='https://nextjs.org/icons/next.svg'
            alt='Next.js logo'
            width={180}
            height={38}
            priority
          />
          <ol className='list-inside list-decimal text-center text-sm sm:text-left'>
            <li className='mb-2'>
              Get started by editing{' '}
              <code className='rounded bg-black/[.05] px-1 py-0.5 font-semibold dark:bg-white/[.06]'>
                app/page.tsx
              </code>
              .
            </li>
            <li>Save and see your changes instantly.</li>
          </ol>
          <div className='flex flex-col items-center gap-4 sm:flex-row'>
            <a
              className='flex h-10 items-center justify-center gap-2 rounded-full border border-solid border-transparent bg-foreground px-4 text-sm text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc] sm:h-12 sm:px-5 sm:text-base'
              href='https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app'
              target='_blank'
              rel='noopener noreferrer'
            >
              <Image
                className='dark:invert'
                src='https://nextjs.org/icons/vercel.svg'
                alt='Vercel logomark'
                width={20}
                height={20}
              />
              Deploy now
            </a>
            <a
              className='flex h-10 items-center justify-center rounded-full border border-solid border-black/[.08] bg-background px-4 text-sm transition-colors hover:border-transparent hover:bg-[#f2f2f2] dark:border-white/[.145] dark:hover:bg-[#1a1a1a] sm:h-12 sm:min-w-44 sm:px-5 sm:text-base'
              href='https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app'
              target='_blank'
              rel='noopener noreferrer'
            >
              Read our docs
            </a>
            <ThemeSwitch />
          </div>
        </main>
        <footer className='row-start-3 flex flex-wrap items-center justify-center gap-6'>
          <a
            className='flex items-center gap-2 hover:underline hover:underline-offset-4'
            href='https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app'
            target='_blank'
            rel='noopener noreferrer'
          >
            <Image
              aria-hidden
              src='https://nextjs.org/icons/file.svg'
              alt='File icon'
              width={16}
              height={16}
            />
            Learn
          </a>
          <a
            className='flex items-center gap-2 hover:underline hover:underline-offset-4'
            href='https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app'
            target='_blank'
            rel='noopener noreferrer'
          >
            <Image
              aria-hidden
              src='https://nextjs.org/icons/window.svg'
              alt='Window icon'
              width={16}
              height={16}
            />
            Examples
          </a>
          <a
            className='flex items-center gap-2 hover:underline hover:underline-offset-4'
            href='https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app'
            target='_blank'
            rel='noopener noreferrer'
          >
            <Image
              aria-hidden
              src='https://nextjs.org/icons/globe.svg'
              alt='Globe icon'
              width={16}
              height={16}
            />
            Go to nextjs.org →
          </a>
        </footer>
      </motion.div>
    </div>
  );
}

export function Sparkles() {
  const { resolvedTheme } = useTheme();

  return (
    <div className='relative overflow-hidden'>
      <SparklesCore
        background='transparent'
        minSize={0.4}
        maxSize={1}
        particleDensity={100}
        className='absolute -z-20 h-full w-full'
        particleColor={resolvedTheme === 'light' ? '#000000' : '#ffffff'}
      />
      <div className='absolute inset-0 -z-10 h-full w-full bg-background [mask-image:radial-gradient(ellipse,transparent,black)]' />
      <motion.div
        initial={{ opacity: 0.0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.3,
          duration: 0.8,
          ease: 'easeInOut',
        }}
        className='relative grid min-h-screen grid-rows-[20px_1fr_20px] items-center justify-items-center gap-16 p-8 pb-20 sm:p-20'
      >
        <main className='row-start-2 flex flex-col items-center gap-8 sm:items-start'>
          <Image
            className='dark:invert'
            src='https://nextjs.org/icons/next.svg'
            alt='Next.js logo'
            width={180}
            height={38}
            priority
          />
          <ol className='list-inside list-decimal text-center text-sm sm:text-left'>
            <li className='mb-2'>
              Get started by editing{' '}
              <code className='rounded bg-black/[.05] px-1 py-0.5 font-semibold dark:bg-white/[.06]'>
                app/page.tsx
              </code>
              .
            </li>
            <li>Save and see your changes instantly.</li>
          </ol>
          <div className='flex flex-col items-center gap-4 sm:flex-row'>
            <a
              className='flex h-10 items-center justify-center gap-2 rounded-full border border-solid border-transparent bg-foreground px-4 text-sm text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc] sm:h-12 sm:px-5 sm:text-base'
              href='https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app'
              target='_blank'
              rel='noopener noreferrer'
            >
              <Image
                className='dark:invert'
                src='https://nextjs.org/icons/vercel.svg'
                alt='Vercel logomark'
                width={20}
                height={20}
              />
              Deploy now
            </a>
            <a
              className='flex h-10 items-center justify-center rounded-full border border-solid border-black/[.08] bg-background px-4 text-sm transition-colors hover:border-transparent hover:bg-[#f2f2f2] dark:border-white/[.145] dark:hover:bg-[#1a1a1a] sm:h-12 sm:min-w-44 sm:px-5 sm:text-base'
              href='https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app'
              target='_blank'
              rel='noopener noreferrer'
            >
              Read our docs
            </a>
            <ThemeSwitch />
          </div>
        </main>
        <footer className='row-start-3 flex flex-wrap items-center justify-center gap-6'>
          <a
            className='flex items-center gap-2 hover:underline hover:underline-offset-4'
            href='https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app'
            target='_blank'
            rel='noopener noreferrer'
          >
            <Image
              aria-hidden
              src='https://nextjs.org/icons/file.svg'
              alt='File icon'
              width={16}
              height={16}
            />
            Learn
          </a>
          <a
            className='flex items-center gap-2 hover:underline hover:underline-offset-4'
            href='https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app'
            target='_blank'
            rel='noopener noreferrer'
          >
            <Image
              aria-hidden
              src='https://nextjs.org/icons/window.svg'
              alt='Window icon'
              width={16}
              height={16}
            />
            Examples
          </a>
          <a
            className='flex items-center gap-2 hover:underline hover:underline-offset-4'
            href='https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app'
            target='_blank'
            rel='noopener noreferrer'
          >
            <Image
              aria-hidden
              src='https://nextjs.org/icons/globe.svg'
              alt='Globe icon'
              width={16}
              height={16}
            />
            Go to nextjs.org →
          </a>
        </footer>
      </motion.div>
    </div>
  );
}

export function Vort() {
  return (
    <div className='relative overflow-hidden'>
      <Vortex backgroundColor='transparent'>
        <div className='absolute inset-0 -z-10 h-full w-full bg-background [mask-image:radial-gradient(ellipse,transparent,black)]' />
        <motion.div
          initial={{ opacity: 0.0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.3,
            duration: 0.8,
            ease: 'easeInOut',
          }}
          className='relative grid min-h-screen grid-rows-[20px_1fr_20px] items-center justify-items-center gap-16 p-8 pb-20 sm:p-20'
        >
          <main className='row-start-2 flex flex-col items-center gap-8 sm:items-start'>
            <Image
              className='dark:invert'
              src='https://nextjs.org/icons/next.svg'
              alt='Next.js logo'
              width={180}
              height={38}
              priority
            />
            <ol className='list-inside list-decimal text-center text-sm sm:text-left'>
              <li className='mb-2'>
                Get started by editing{' '}
                <code className='rounded bg-black/[.05] px-1 py-0.5 font-semibold dark:bg-white/[.06]'>
                  app/page.tsx
                </code>
                .
              </li>
              <li>Save and see your changes instantly.</li>
            </ol>
            <div className='flex flex-col items-center gap-4 sm:flex-row'>
              <a
                className='flex h-10 items-center justify-center gap-2 rounded-full border border-solid border-transparent bg-foreground px-4 text-sm text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc] sm:h-12 sm:px-5 sm:text-base'
                href='https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app'
                target='_blank'
                rel='noopener noreferrer'
              >
                <Image
                  className='dark:invert'
                  src='https://nextjs.org/icons/vercel.svg'
                  alt='Vercel logomark'
                  width={20}
                  height={20}
                />
                Deploy now
              </a>
              <a
                className='flex h-10 items-center justify-center rounded-full border border-solid border-black/[.08] bg-background px-4 text-sm transition-colors hover:border-transparent hover:bg-[#f2f2f2] dark:border-white/[.145] dark:hover:bg-[#1a1a1a] sm:h-12 sm:min-w-44 sm:px-5 sm:text-base'
                href='https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app'
                target='_blank'
                rel='noopener noreferrer'
              >
                Read our docs
              </a>
              <ThemeSwitch />
            </div>
          </main>
          <footer className='row-start-3 flex flex-wrap items-center justify-center gap-6'>
            <a
              className='flex items-center gap-2 hover:underline hover:underline-offset-4'
              href='https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app'
              target='_blank'
              rel='noopener noreferrer'
            >
              <Image
                aria-hidden
                src='https://nextjs.org/icons/file.svg'
                alt='File icon'
                width={16}
                height={16}
              />
              Learn
            </a>
            <a
              className='flex items-center gap-2 hover:underline hover:underline-offset-4'
              href='https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app'
              target='_blank'
              rel='noopener noreferrer'
            >
              <Image
                aria-hidden
                src='https://nextjs.org/icons/window.svg'
                alt='Window icon'
                width={16}
                height={16}
              />
              Examples
            </a>
            <a
              className='flex items-center gap-2 hover:underline hover:underline-offset-4'
              href='https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app'
              target='_blank'
              rel='noopener noreferrer'
            >
              <Image
                aria-hidden
                src='https://nextjs.org/icons/globe.svg'
                alt='Globe icon'
                width={16}
                height={16}
              />
              Go to nextjs.org →
            </a>
          </footer>
        </motion.div>
      </Vortex>
    </div>
  );
}

export function Grid() {
  return (
    <div className='relative overflow-hidden'>
      <div className='bg-grid-black/[0.1] dark:bg-grid-white/[0.1] absolute inset-0 -z-20 h-full w-full' />
      <div className='absolute inset-0 -z-10 h-full w-full bg-background [mask-image:radial-gradient(ellipse,transparent,black)]' />
      <motion.div
        initial={{ opacity: 0.0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.3,
          duration: 0.8,
          ease: 'easeInOut',
        }}
        className='relative grid min-h-screen grid-rows-[20px_1fr_20px] items-center justify-items-center gap-16 p-8 pb-20 sm:p-20'
      >
        <main className='row-start-2 flex flex-col items-center gap-8 sm:items-start'>
          <Image
            className='dark:invert'
            src='https://nextjs.org/icons/next.svg'
            alt='Next.js logo'
            width={180}
            height={38}
            priority
          />
          <ol className='list-inside list-decimal text-center text-sm sm:text-left'>
            <li className='mb-2'>
              Get started by editing{' '}
              <code className='rounded bg-black/[.05] px-1 py-0.5 font-semibold dark:bg-white/[.06]'>
                app/page.tsx
              </code>
              .
            </li>
            <li>Save and see your changes instantly.</li>
          </ol>
          <div className='flex flex-col items-center gap-4 sm:flex-row'>
            <a
              className='flex h-10 items-center justify-center gap-2 rounded-full border border-solid border-transparent bg-foreground px-4 text-sm text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc] sm:h-12 sm:px-5 sm:text-base'
              href='https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app'
              target='_blank'
              rel='noopener noreferrer'
            >
              <Image
                className='dark:invert'
                src='https://nextjs.org/icons/vercel.svg'
                alt='Vercel logomark'
                width={20}
                height={20}
              />
              Deploy now
            </a>
            <a
              className='flex h-10 items-center justify-center rounded-full border border-solid border-black/[.08] bg-background px-4 text-sm transition-colors hover:border-transparent hover:bg-[#f2f2f2] dark:border-white/[.145] dark:hover:bg-[#1a1a1a] sm:h-12 sm:min-w-44 sm:px-5 sm:text-base'
              href='https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app'
              target='_blank'
              rel='noopener noreferrer'
            >
              Read our docs
            </a>
            <ThemeSwitch />
          </div>
        </main>
        <footer className='row-start-3 flex flex-wrap items-center justify-center gap-6'>
          <a
            className='flex items-center gap-2 hover:underline hover:underline-offset-4'
            href='https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app'
            target='_blank'
            rel='noopener noreferrer'
          >
            <Image
              aria-hidden
              src='https://nextjs.org/icons/file.svg'
              alt='File icon'
              width={16}
              height={16}
            />
            Learn
          </a>
          <a
            className='flex items-center gap-2 hover:underline hover:underline-offset-4'
            href='https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app'
            target='_blank'
            rel='noopener noreferrer'
          >
            <Image
              aria-hidden
              src='https://nextjs.org/icons/window.svg'
              alt='Window icon'
              width={16}
              height={16}
            />
            Examples
          </a>
          <a
            className='flex items-center gap-2 hover:underline hover:underline-offset-4'
            href='https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app'
            target='_blank'
            rel='noopener noreferrer'
          >
            <Image
              aria-hidden
              src='https://nextjs.org/icons/globe.svg'
              alt='Globe icon'
              width={16}
              height={16}
            />
            Go to nextjs.org →
          </a>
        </footer>
      </motion.div>
    </div>
  );
}

export function SmallGrid() {
  return (
    <div className='relative overflow-hidden'>
      <div className='bg-grid-small-black/[0.3] dark:bg-grid-small-white/[0.3] absolute inset-0 -z-20 h-full w-full' />
      <div className='absolute inset-0 -z-10 h-full w-full bg-background [mask-image:radial-gradient(ellipse,transparent,black)]' />
      <motion.div
        initial={{ opacity: 0.0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.3,
          duration: 0.8,
          ease: 'easeInOut',
        }}
        className='relative grid min-h-screen grid-rows-[20px_1fr_20px] items-center justify-items-center gap-16 p-8 pb-20 sm:p-20'
      >
        <main className='row-start-2 flex flex-col items-center gap-8 sm:items-start'>
          <Image
            className='dark:invert'
            src='https://nextjs.org/icons/next.svg'
            alt='Next.js logo'
            width={180}
            height={38}
            priority
          />
          <ol className='list-inside list-decimal text-center text-sm sm:text-left'>
            <li className='mb-2'>
              Get started by editing{' '}
              <code className='rounded bg-black/[.05] px-1 py-0.5 font-semibold dark:bg-white/[.06]'>
                app/page.tsx
              </code>
              .
            </li>
            <li>Save and see your changes instantly.</li>
          </ol>
          <div className='flex flex-col items-center gap-4 sm:flex-row'>
            <a
              className='flex h-10 items-center justify-center gap-2 rounded-full border border-solid border-transparent bg-foreground px-4 text-sm text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc] sm:h-12 sm:px-5 sm:text-base'
              href='https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app'
              target='_blank'
              rel='noopener noreferrer'
            >
              <Image
                className='dark:invert'
                src='https://nextjs.org/icons/vercel.svg'
                alt='Vercel logomark'
                width={20}
                height={20}
              />
              Deploy now
            </a>
            <a
              className='flex h-10 items-center justify-center rounded-full border border-solid border-black/[.08] bg-background px-4 text-sm transition-colors hover:border-transparent hover:bg-[#f2f2f2] dark:border-white/[.145] dark:hover:bg-[#1a1a1a] sm:h-12 sm:min-w-44 sm:px-5 sm:text-base'
              href='https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app'
              target='_blank'
              rel='noopener noreferrer'
            >
              Read our docs
            </a>
            <ThemeSwitch />
          </div>
        </main>
        <footer className='row-start-3 flex flex-wrap items-center justify-center gap-6'>
          <a
            className='flex items-center gap-2 hover:underline hover:underline-offset-4'
            href='https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app'
            target='_blank'
            rel='noopener noreferrer'
          >
            <Image
              aria-hidden
              src='https://nextjs.org/icons/file.svg'
              alt='File icon'
              width={16}
              height={16}
            />
            Learn
          </a>
          <a
            className='flex items-center gap-2 hover:underline hover:underline-offset-4'
            href='https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app'
            target='_blank'
            rel='noopener noreferrer'
          >
            <Image
              aria-hidden
              src='https://nextjs.org/icons/window.svg'
              alt='Window icon'
              width={16}
              height={16}
            />
            Examples
          </a>
          <a
            className='flex items-center gap-2 hover:underline hover:underline-offset-4'
            href='https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app'
            target='_blank'
            rel='noopener noreferrer'
          >
            <Image
              aria-hidden
              src='https://nextjs.org/icons/globe.svg'
              alt='Globe icon'
              width={16}
              height={16}
            />
            Go to nextjs.org →
          </a>
        </footer>
      </motion.div>
    </div>
  );
}

export function Dot() {
  return (
    <div className='relative overflow-hidden'>
      <div className='bg-dot-black/[0.3] dark:bg-dot-white/[0.3] absolute inset-0 -z-20 h-full w-full' />
      <div className='absolute inset-0 -z-10 h-full w-full bg-background [mask-image:radial-gradient(ellipse,transparent,black)]' />
      <motion.div
        initial={{ opacity: 0.0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.3,
          duration: 0.8,
          ease: 'easeInOut',
        }}
        className='relative grid min-h-screen grid-rows-[20px_1fr_20px] items-center justify-items-center gap-16 p-8 pb-20 sm:p-20'
      >
        <main className='row-start-2 flex flex-col items-center gap-8 sm:items-start'>
          <Image
            className='dark:invert'
            src='https://nextjs.org/icons/next.svg'
            alt='Next.js logo'
            width={180}
            height={38}
            priority
          />
          <ol className='list-inside list-decimal text-center text-sm sm:text-left'>
            <li className='mb-2'>
              Get started by editing{' '}
              <code className='rounded bg-black/[.05] px-1 py-0.5 font-semibold dark:bg-white/[.06]'>
                app/page.tsx
              </code>
              .
            </li>
            <li>Save and see your changes instantly.</li>
          </ol>
          <div className='flex flex-col items-center gap-4 sm:flex-row'>
            <a
              className='flex h-10 items-center justify-center gap-2 rounded-full border border-solid border-transparent bg-foreground px-4 text-sm text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc] sm:h-12 sm:px-5 sm:text-base'
              href='https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app'
              target='_blank'
              rel='noopener noreferrer'
            >
              <Image
                className='dark:invert'
                src='https://nextjs.org/icons/vercel.svg'
                alt='Vercel logomark'
                width={20}
                height={20}
              />
              Deploy now
            </a>
            <a
              className='flex h-10 items-center justify-center rounded-full border border-solid border-black/[.08] bg-background px-4 text-sm transition-colors hover:border-transparent hover:bg-[#f2f2f2] dark:border-white/[.145] dark:hover:bg-[#1a1a1a] sm:h-12 sm:min-w-44 sm:px-5 sm:text-base'
              href='https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app'
              target='_blank'
              rel='noopener noreferrer'
            >
              Read our docs
            </a>
            <ThemeSwitch />
          </div>
        </main>
        <footer className='row-start-3 flex flex-wrap items-center justify-center gap-6'>
          <a
            className='flex items-center gap-2 hover:underline hover:underline-offset-4'
            href='https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app'
            target='_blank'
            rel='noopener noreferrer'
          >
            <Image
              aria-hidden
              src='https://nextjs.org/icons/file.svg'
              alt='File icon'
              width={16}
              height={16}
            />
            Learn
          </a>
          <a
            className='flex items-center gap-2 hover:underline hover:underline-offset-4'
            href='https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app'
            target='_blank'
            rel='noopener noreferrer'
          >
            <Image
              aria-hidden
              src='https://nextjs.org/icons/window.svg'
              alt='Window icon'
              width={16}
              height={16}
            />
            Examples
          </a>
          <a
            className='flex items-center gap-2 hover:underline hover:underline-offset-4'
            href='https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app'
            target='_blank'
            rel='noopener noreferrer'
          >
            <Image
              aria-hidden
              src='https://nextjs.org/icons/globe.svg'
              alt='Globe icon'
              width={16}
              height={16}
            />
            Go to nextjs.org →
          </a>
        </footer>
      </motion.div>
    </div>
  );
}
