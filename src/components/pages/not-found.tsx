'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

import { ArrowRightIcon } from 'lucide-react';

import { AuroraBackground } from '@/components/backgrounds/aurora';
import { Button } from '@/components/ui/button';

export function NotFoundContent() {
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
          Error 404
        </motion.h1>

        <motion.p
          className='text-muted-foreground mb-12 text-xl md:text-2xl'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.7 }}
        >
          Page was not found.
        </motion.p>

        <motion.div
          className='flex flex-col items-center justify-center gap-4 sm:flex-row'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.7 }}
        >
          <Button asChild className='group'>
            <Link href='/'>
              Go Home
              <ArrowRightIcon className='h-4 w-4 transition-transform group-hover:translate-x-1' />
            </Link>
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
}
