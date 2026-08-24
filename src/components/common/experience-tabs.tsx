'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export function ExperienceTabs({ career, education }: { career: React.ReactNode; education: React.ReactNode }) {
  const [active, setActive] = useState('career');

  return (
    <Tabs value={active} onValueChange={setActive} className='w-full'>
      <TabsList className='h-11 w-fit gap-1 overflow-hidden rounded-lg border border-border bg-muted/40 p-1'>
        {(['career', 'education'] as const).map((tab) => (
          <TabsTrigger key={tab} value={tab} className='relative h-9 flex-none rounded-md px-4 text-sm font-semibold capitalize data-[state=active]:bg-transparent data-[state=active]:shadow-none'>
            {active === tab && <motion.span layoutId='experience-tab-highlight' transition={{ type: 'tween', duration: 0.18, ease: 'easeOut' }} className='absolute inset-0.5 rounded-[0.3rem] bg-background shadow-sm' />}
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
