'use client';

import { motion } from 'framer-motion';

import { Grid } from '@/components/backgrounds/grid-background';
import { Vignette } from '@/components/misc/vignette';
import { Socials } from '@/components/sections/about';

export default function Contact() {
  return (
    <div className='flex min-h-[100dvh] flex-col items-center justify-center px-4 pb-4 pt-[72px]'>
      <Grid type='dot' />
      <Vignette />
      <motion.div transition={{ duration: 0.2, delay: 0.2, ease: 'easeInOut' }} initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}>
        <div className='flex max-w-96 flex-col gap-4'>
          <Socials />
        </div>
      </motion.div>
    </div>
  );
}
