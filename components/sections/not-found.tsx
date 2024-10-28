'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

import { Beams } from '@/components/backgrounds/beams-background';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <>
      <Beams />
      <div className='absolute inset-0 -z-10 h-full w-full bg-background [mask-image:radial-gradient(ellipse,transparent,black)]' />
      <motion.div
        initial={{ opacity: 0.0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.3,
          duration: 0.8,
          ease: 'easeInOut',
        }}
      >
        <div className='flex min-h-screen flex-col items-center justify-center px-2 py-[72px] text-center'>
          <h1 className='text-8xl font-extrabold'>404</h1>
          <p className='mb-8 text-center'>Page could not be found</p>
          <Button variant='outline' asChild>
            <Link href='/'>Go back home</Link>
          </Button>
        </div>
      </motion.div>
    </>
  );
}
