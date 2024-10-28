'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

import { Beams } from '@/components/backgrounds/beams-background';
import { Vignette } from '@/components/misc/vignette';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className='relative overflow-hidden'>
      <Beams />
      <Vignette />
      <motion.div
        initial={{ opacity: 0.0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.3,
          duration: 0.8,
          ease: 'easeInOut',
        }}
      >
        <div className='flex min-h-[100dvh] flex-col items-center justify-center gap-4 px-4 py-[72px] text-center'>
          <h1 className='text-8xl font-extrabold leading-[5rem]'>404</h1>
          <p className='text-muted-foreground'>Page could not be found</p>
          <Button variant='outline' asChild>
            <Link href='/'>Go back home</Link>
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
