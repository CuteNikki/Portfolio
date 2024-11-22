'use client';

import { AnimatePresence, motion } from 'framer-motion';
import Fuse from 'fuse.js';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

import { list } from '@/assets/projects';

import { Vortex } from '@/components/backgrounds/vortex-background';
import { Vignette } from '@/components/misc/vignette';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import MultiSelect from '@/components/ui/multi-select';

export function Projects() {
  const [tags, setTags] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');

  const fuse = new Fuse(list, {
    keys: ['name', 'description', 'tags', 'links.label'],
    threshold: 0.4,
    useExtendedSearch: true,
  });

  const filteredProjects = searchTerm.length
    ? fuse.search(searchTerm).map((result) => result.item)
    : list;

  const uniqueTags = [...new Set(list.flatMap((project) => project.tags))];

  return (
    <div className='relative overflow-hidden'>
      <Vortex backgroundColor='transparent'>
        <Vignette />
        <div className='flex min-h-[100dvh] flex-col items-center px-4 pb-4 pt-[72px]'>
          <div className='flex flex-row gap-4 pb-4'>
            <Input
              type='text'
              placeholder='Search...'
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <MultiSelect
              values={uniqueTags.map((tag) => ({
                key: tag,
                value: tag,
              }))}
              onSelectionChange={(selectedItems) => {
                setTags(selectedItems);
              }}
            >
              {tags.length > 0 ? (
                <>
                  <span className='sm:hidden'>
                    {tags.length} Filter{tags.length > 1 ? 's' : ''}
                  </span>
                  <span className='hidden max-w-72 truncate sm:block'>
                    {tags.length} Filter{tags.length > 1 ? 's' : ''}:{' '}
                    {tags
                      .map((t) => (t.length > 25 ? t.slice(0, 25) + '...' : t))
                      .join(', ')}
                  </span>
                </>
              ) : (
                <>
                  <span className='sm:hidden'>Filter</span>
                  <span className='hidden sm:block'>Filter</span>
                </>
              )}
            </MultiSelect>
          </div>
          <div className='flex flex-wrap items-center justify-center gap-5'>
            <AnimatePresence mode='wait'>
              {filteredProjects.map((project, index) => (
                <Project
                  index={index}
                  key={`project-${index}-${project.name}`}
                  {...project}
                />
              ))}
            </AnimatePresence>
          </div>
        </div>
      </Vortex>
    </div>
  );
}

export function Project({
  name,
  description,
  links,
  tags,
  image,
  icon,
  index,
}: {
  name: string;
  description: string;
  tags: string[];
  links: { href: string; label: string }[];
  image: string;
  icon: string;
  index: number;
}) {
  return (
    <motion.div
      layout
      transition={{ duration: 0.2, delay: index * 0.1, ease: 'easeInOut' }}
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 40 }}
    >
      <div className='flex flex-col gap-4 rounded-md border border-foreground/10 bg-background p-4 xl:max-w-full'>
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
            <span className='text-sm text-muted-foreground'>{description}</span>
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
          <div className='flex flex-wrap gap-2'>
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
        <ul className='flex max-w-[400px] flex-wrap gap-1 text-sm text-muted-foreground'>
          {tags.map((tag, index) => (
            <li key={index} className='flex flex-row gap-1'>
              <span className='max-w-[200px] truncate'>{tag}</span>
              {index !== tags.length - 1 && <p>•</p>}
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
}
