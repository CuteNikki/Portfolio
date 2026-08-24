'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

export function ExperienceTabs({ career, education }: { career: React.ReactNode; education: React.ReactNode }) {
  const [active, setActive] = useState('career');

  return (
    <Tabs value={active} onValueChange={setActive} className='w-full'>
      <TabsList className='w-full max-w-xs'>
        {(['career', 'education'] as const).map((tab) => (
          <TabsTrigger key={tab} value={tab} className='uppercase'>
            {tab}
          </TabsTrigger>
        ))}
      </TabsList>
      <div className='mt-6 min-h-56'>
        <AnimatePresence initial={false} mode='sync'>
          <motion.div key={active} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.18, ease: 'easeOut' }}>
            {active === 'career' ? career : education}
          </motion.div>
        </AnimatePresence>
      </div>
    </Tabs>
  );
}
