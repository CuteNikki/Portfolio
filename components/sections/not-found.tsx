'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

import { Beams } from '@/components/backgrounds/beams-background';
import { Vignette } from '@/components/misc/vignette';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <>
      <Beams />
      <Vignette />
      <div className='flex min-h-[100dvh] flex-col items-center justify-center gap-10 px-4 py-[72px] md:flex-row'>
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{
            duration: 0.2,
            delay: 0.2,
            ease: 'easeInOut',
          }}
        >
          <div className='flex flex-col items-center justify-center gap-4 text-balance text-center md:items-start md:text-start'>
            <h1 className='text-5xl font-bold'>Oops!</h1>
            <p className='whitespace-pre-line text-xl font-semibold text-foreground/80'>{`Page not found.`}</p>
            <div className='flex flex-wrap items-center justify-center gap-2'>
              <Button asChild>
                <Link href='/'>Go back home</Link>
              </Button>
            </div>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0.0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{
            delay: 0.4,
            duration: 0.2,
            ease: 'easeInOut',
          }}
        >
          <div>
            <span className='text-7xl md:text-9xl'>404</span>
          </div>
        </motion.div>
      </div>
    </>
  );
}
