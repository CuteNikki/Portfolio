'use client';

import { AnimatePresence, motion } from 'framer-motion';
import Fuse from 'fuse.js';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';

import { list } from '@/assets/projects';

import { Vortex } from '@/components/backgrounds/vortex-background';
import { Vignette } from '@/components/misc/vignette';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import MultiSelect from '@/components/ui/multi-select';

export function Projects() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const searchTags =
    searchParams
      .get('tags')
      ?.split(',')
      .filter((v) => v !== '') ?? [];

  const setSearchTags = useCallback(
    (value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set('tags', value);
      return params.toString();
    },
    [searchParams],
  );

  const searchTerm = searchParams.get('search') ?? '';

  const setSearchTerm = useCallback(
    (value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set('search', value);
      return params.toString();
    },
    [searchParams],
  );

  const fuse = new Fuse(list, {
    keys: ['name', 'description', 'tags', 'links.label'],
    threshold: 0.4,
    useExtendedSearch: true,
  });

  const searchResults = searchTerm?.length
    ? fuse.search(searchTerm).map((result) => result.item)
    : list;

  const filteredProjects = searchResults.filter((project) =>
    searchTags.length
      ? searchTags.every((tag) => project.tags.includes(tag))
      : true,
  );

  const uniqueTags = [...new Set(list.flatMap((project) => project.tags))];

  return (
    <Vortex backgroundColor='transparent'>
      <Vignette />
      <div className='flex min-h-[100dvh] flex-col items-center px-4 pb-4 pt-[72px]'>
        <div className='flex flex-row gap-4 pb-4'>
          <Input
            type='text'
            placeholder='Search...'
            onChange={(e) =>
              router.push(pathname + '?' + setSearchTerm(e.target.value))
            }
          />
          <MultiSelect
            values={uniqueTags.map((tag) => ({
              key: tag,
              value: tag,
            }))}
            defaultValues={searchTags}
            onSelectionChange={(selectedItems) =>
              router.push(
                pathname + '?' + setSearchTags(selectedItems.join(',')),
              )
            }
          >
            {searchTags && searchTags.length > 0 ? (
              <>
                <span className='sm:hidden'>
                  {searchTags.length} Filter{searchTags.length > 1 ? 's' : ''}
                </span>
                <span className='hidden max-w-72 truncate sm:block'>
                  {searchTags.length} Filter{searchTags.length > 1 ? 's' : ''}:{' '}
                  {searchTags
                    .map((t) => (t!.length > 25 ? t!.slice(0, 25) + '...' : t))
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
              <Button
                asChild
                size='sm'
                variant={i === 0 ? 'default' : 'secondary'}
                key={`project-${i}-${name}-${link.href}-link`}
              >
                <Link href={link.href}>{link.label}</Link>
              </Button>
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
