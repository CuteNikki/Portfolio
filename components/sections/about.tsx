'use client';

import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';

import { Sparkles } from '@/components/backgrounds/sparkles-background';
import { Vignette } from '@/components/misc/vignette';

export function About() {
  const { resolvedTheme } = useTheme();

  return (
    <div className='relative overflow-hidden'>
      <Sparkles
        background='transparent'
        minSize={0.4}
        maxSize={1}
        particleDensity={100}
        particleColor={resolvedTheme === 'light' ? '#000000' : '#ffffff'}
      />
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
        <div className='flex min-h-screen flex-col items-center justify-center gap-10 px-4 py-[72px] md:flex-row'>
          <h1>Test</h1>
        </div>
      </motion.div>
    </div>
  );
}
