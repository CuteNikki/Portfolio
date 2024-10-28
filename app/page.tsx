'use client';

import { HeroSection } from '@/components/sections/hero';

/*
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import Image from 'next/image';

import { ThemeSwitch } from '@/components/theme/theme-switch';

import { Aurora } from '@/components/backgrounds/aurora-background';
import { Beams } from '@/components/backgrounds/beams-background';
import { Grid } from '@/components/backgrounds/grid-background';
import { ShootingStars } from '@/components/backgrounds/shooting-stars';
import { Sparkles } from '@/components/backgrounds/sparkles-background';
import { StarsBackground } from '@/components/backgrounds/stars-background';
import { Vortex } from '@/components/backgrounds/vortex-background';
*/

export default function Page() {
  return (
    <main className='relative overflow-hidden'>
      <HeroSection />
      {/* <AuroraSection />
      <BeamSection />
      <StarSection />
      <SparkleSection />
      <VortexSection />
      <GridSection />
      <SmallGridSection />
      <DotSection /> */}
    </main>
  );
}

/*
function Content() {
  return (
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
  );
}

function Vignette() {
  return (
    <div className='absolute inset-0 -z-10 h-full w-full bg-background [mask-image:radial-gradient(ellipse,transparent,black)]' />
  );
}

function AuroraSection() {
  return (
    <div className='relative overflow-hidden'>
      <Aurora />
      <Content />
    </div>
  );
}

function BeamSection() {
  return (
    <div className='relative overflow-hidden'>
      <Beams />
      <Vignette />
      <Content />
    </div>
  );
}

function StarSection() {
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
      <Vignette />
      <Content />
    </div>
  );
}

function SparkleSection() {
  const { resolvedTheme } = useTheme();

  return (
    <div className='relative overflow-hidden'>
      <Sparkles
        background='transparent'
        minSize={0.4}
        maxSize={1}
        particleDensity={100}
        className='absolute -z-20 h-full w-full'
        particleColor={resolvedTheme === 'light' ? '#000000' : '#ffffff'}
      />
      <Vignette />
      <Content />
    </div>
  );
}

function VortexSection() {
  return (
    <div className='relative overflow-hidden'>
      <Vortex backgroundColor='transparent'>
        <Vignette />
        <Content />
      </Vortex>
    </div>
  );
}

function GridSection() {
  return (
    <div className='relative overflow-hidden'>
      <Grid type='default' />
      <Vignette />
      <Content />
    </div>
  );
}

function SmallGridSection() {
  return (
    <div className='relative overflow-hidden'>
      <Grid type='small' />
      <Vignette />
      <Content />
    </div>
  );
}

function DotSection() {
  return (
    <div className='relative overflow-hidden'>
      <Grid type='dot' />
      <Vignette />
      <Content />
    </div>
  );
}
*/
