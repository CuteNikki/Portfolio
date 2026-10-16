'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export function ExperienceTabs({
  career,
  education,
}: {
  career: React.ReactNode;
  education: React.ReactNode;
}) {
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
        <AnimatePresence initial={false} mode='wait'>
          {/* The tab panel the active trigger points to. forceMount keeps the old panel visible while it fades out. */}
          <TabsContent
            key={active}
            value={active}
            forceMount
            asChild
            // The panel styles would shrink the text to text-sm. The panel is focusable, so it gets a focus ring.
            className='focus-visible:ring-ring/50 text-base focus-visible:ring-[3px]'
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
            >
              {active === 'career' ? career : education}
            </motion.div>
          </TabsContent>
        </AnimatePresence>
      </div>
    </Tabs>
  );
}
