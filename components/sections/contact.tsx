'use client';

import { motion } from 'framer-motion';

import { Socials } from '@/components/sections/about';

export default function Contact() {
  return (
    <div className='flex min-h-[100dvh] flex-col items-center justify-center px-4 pb-4 pt-[72px]'>
      <motion.div
        transition={{ duration: 0.2, delay: 0.1, ease: 'easeInOut' }}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className='flex flex-col gap-4 max-w-96'>
          <Socials />
        </div>
      </motion.div>
    </div>
  );
}
