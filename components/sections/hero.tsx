import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

import { about, hero } from '@/assets/about';

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
            <h1 className='text-4xl font-bold md:text-5xl'>{hero.title}</h1>
            <p className='text-lg font-semibold text-foreground/80 md:block md:text-xl'>
              {hero.subtitle}
            </p>
            <div className='flex flex-wrap items-center justify-center gap-2'>
              {hero.buttons.map((button, index) => (
                <Button
                  key={`hero-button-${index}`}
                  variant={index === 0 ? 'default' : 'secondary'}
                  asChild
                >
                  <Link href={button.href}>{button.text}</Link>
                </Button>
              ))}
            </div>
          </div>
          <div>
            <Image
              unoptimized
              aria-hidden
              draggable={false}
              src={about.image}
              alt='avatar'
              className='h-72 w-72 select-none rounded-md'
              height={288}
              width={288}
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
}
