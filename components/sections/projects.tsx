'use client';

import { motion } from 'framer-motion';

import { Vortex } from '@/components/backgrounds/vortex-background';
import { Vignette } from '@/components/misc/vignette';

export function Projects() {
  return (
    <div className='relative overflow-hidden'>
      <Vortex backgroundColor='transparent'>
        <Vignette />
        <motion.div
          initial={{ opacity: 0.0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.3,
            duration: 0.8,
            ease: 'easeInOut',
          }}
        >
          <div className='flex min-h-[100dvh] flex-col items-center justify-center px-4 pb-4 pt-[72px]'>
            <div>Work in Progress</div>
          </div>
        </motion.div>
      </Vortex>
    </div>
  );
}
