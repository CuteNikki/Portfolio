'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export function ExperienceTabs({ career, education }: { career: React.ReactNode; education: React.ReactNode }) {
  const [active, setActive] = useState('career');

  return (
    <Tabs value={active} onValueChange={setActive} className='w-full'>
      <TabsList className='h-auto w-fit gap-1 rounded-lg bg-muted p-[3px]'>
        {(['career', 'education'] as const).map((tab) => (
          <TabsTrigger key={tab} value={tab} className='relative isolate z-0 h-8 flex-none rounded-md border border-transparent px-3 text-sm font-medium capitalize data-[state=active]:bg-transparent data-[state=active]:shadow-none'>
            {active === tab && <motion.span layoutId='experience-tab-highlight' transition={{ type: 'spring', stiffness: 400, damping: 30 }} className='pointer-events-none absolute inset-0 z-0 rounded-md bg-background shadow-sm' />}
            <span className='relative z-10'>{tab}</span>
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
