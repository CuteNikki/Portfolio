import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

import { Aurora } from '@/components/backgrounds/aurora-background';
import { Button } from '@/components/ui/button';

export function HeroSection() {
  return (
    <div className='relative overflow-hidden'>
      <Aurora />
      <motion.div
        initial={{ opacity: 0.0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.3,
          duration: 0.8,
          ease: 'easeInOut',
        }}
      >
        <div className='flex min-h-[100dvh] flex-col items-center justify-center gap-10 px-4 py-[72px] md:flex-row'>
          <div className='flex flex-col items-center justify-center gap-4 text-balance text-center md:items-start md:text-start'>
            <h1 className='text-4xl font-bold sm:text-5xl'>
              Hey, I&apos;m Nikki.
            </h1>
            <p className='text-sm font-semibold text-muted-foreground sm:text-lg'>
              A developer and designer from Germany.
            </p>
            <div className='flex flex-wrap items-center justify-center gap-2'>
              <Button variant='outline' asChild>
                <Link href='/about'>Read more</Link>
              </Button>
              <Button variant='outline' asChild>
                <Link href='/projects'>My projects</Link>
              </Button>
            </div>
          </div>
          <div>
            <Image
              unoptimized
              aria-hidden
              src='https://placehold.co/288x288/png?text=Avatar\nPlaceholder'
              alt='avatar'
              className='h-72 w-72 rounded-3xl outline outline-2 outline-foreground/10 drop-shadow-xl'
              height={288}
              width={288}
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
}
