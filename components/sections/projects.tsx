'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

import { list } from '@/assets/projects';
import { Vortex } from '@/components/backgrounds/vortex-background';
import { Vignette } from '@/components/misc/vignette';
import { Button } from '@/components/ui/button';

export function Projects() {
  return (
    <div className='relative overflow-hidden'>
      <Vortex backgroundColor='transparent'>
        <Vignette />
        <motion.div
          initial={{ opacity: 0.0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.3,
            duration: 0.8,
            ease: 'easeInOut',
          }}
        >
          <div className='flex min-h-[100dvh] flex-col items-center justify-center px-4 pb-4 pt-[72px]'>
            <div className='flex flex-wrap items-center justify-center gap-5'>
              {list.map((project, index) => (
                <Project
                  key={`project-${index}-${project.name}`}
                  {...project}
                />
              ))}
            </div>
          </div>
        </motion.div>
      </Vortex>
    </div>
  );
}

export function Project({
  name,
  links,
  tags,
  image,
  icon,
}: {
  name: string;
  tags: string[];
  links: { href: string; label: string }[];
  image: string;
  icon: string;
}) {
  return (
    <div className='flex max-w-[36rem] flex-col gap-4 rounded-md border border-foreground/10 bg-background p-4 xl:max-w-full'>
      <div className='flex flex-row items-center gap-2'>
        <Image
          unoptimized
          aria-hidden
          draggable={false}
          src={icon}
          alt='avatar'
          className='h-10 w-10 select-none rounded-full'
          height={40}
          width={40}
        />
        <div className='flex flex-col'>
          <span className='text-lg font-bold'>{name}</span>
          <ul className='flex flex-row gap-1 text-sm text-muted-foreground'>
            {tags.map((tag, index) => (
              <li key={index} className='flex flex-row gap-1'>
                <span>{tag}</span>
                {index !== tags.length - 1 && <p>•</p>}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <Image
        unoptimized
        aria-hidden
        draggable={false}
        src={image}
        alt='placeholder'
        className='w-full select-none rounded-md'
        width={400}
        height={300}
      />
      {links.length > 0 && (
        <div className='flex flex-row gap-2'>
          {links.map((link, i) => (
            <Link
              href={link.href}
              key={`project-${i}-${name}-${link.href}-link`}
            >
              <Button variant={i === 0 ? 'default' : 'secondary'}>
                {link.label}
              </Button>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
