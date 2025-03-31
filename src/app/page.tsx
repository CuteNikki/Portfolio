'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

import { ArrowRightIcon } from 'lucide-react';

import { AuroraBackground } from '@/components/theme/aurora';
import { ThemeButton } from '@/components/theme/button';
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <div className='flex flex-1 items-center justify-center'>
      <AuroraBackground />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className='mx-auto max-w-2xl text-center'>
        <motion.h1
          className='mb-6 text-4xl font-bold tracking-tight md:text-6xl'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.7 }}
        >
          Hey, I&apos;m Nikki
        </motion.h1>

        <motion.p
          className='text-muted-foreground mb-12 text-xl md:text-2xl'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.7 }}
        >
          Welcome to my portfolio.
        </motion.p>

        <motion.div
          className='flex flex-col items-center justify-center gap-4 sm:flex-row'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.7 }}
        >
          <Button asChild size='lg' className='group text-base'>
            <Link href='/about'>
              About Me
              <ArrowRightIcon className='ml-2 h-4 w-4 transition-transform group-hover:translate-x-1' />
            </Link>
          </Button>
          <Button asChild size='lg' variant='secondary' className='text-base'>
            <Link href='/about'>View Projects</Link>
          </Button>
          <ThemeButton />
        </motion.div>
      </motion.div>
    </div>
  );
}
