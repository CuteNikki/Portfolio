'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export function ExperienceTabs({ career, education }: { career: React.ReactNode; education: React.ReactNode }) {
  const [active, setActive] = useState('career');

  return (
    <Tabs value={active} onValueChange={setActive} className='w-full'>
      <TabsList className='h-auto w-fit gap-1 rounded-lg bg-muted'>
        {(['career', 'education'] as const).map((tab) => (
          <TabsTrigger key={tab} value={tab} className='uppercase'>
            {active === tab && <motion.span layoutId='experience-tab-highlight' transition={{ type: 'spring', stiffness: 400, damping: 30 }} />}
            <span>{tab}</span>
          </TabsTrigger>
        ))}
      </TabsList>
      <AnimatePresence mode='wait' initial={false}>
        <motion.div key={active} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.14, ease: 'easeOut' }} className='mt-6'>
          {active === 'career' ? career : education}
        </motion.div>
      </AnimatePresence>
    </Tabs>
  );
}
