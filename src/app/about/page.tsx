'use client';

import { motion } from 'framer-motion';

export default function AboutPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className='flex flex-1 items-center justify-center'
    >
      <motion.h1
        className='mb-6 text-4xl font-bold tracking-tight md:text-6xl'
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.7 }}
      >
        About
      </motion.h1>
    </motion.div>
  );
}
