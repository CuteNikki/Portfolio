'use client';

import { motion } from 'framer-motion';
import Fuse from 'fuse.js';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';

import { getAcronym } from '@/lib/utils';

import { list } from '@/constants/projects';

import { Vortex } from '@/components/backgrounds/vortex-background';
import { Vignette } from '@/components/misc/vignette';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import MultiSelect from '@/components/ui/multi-select';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Project as ProjectType } from '@/lib/types';

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

  const searchTechs =
    searchParams
      .get('techs')
      ?.split(',')
      .filter((v) => v !== '') ?? [];

  const setSearchTechs = useCallback(
    (value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set('techs', value);
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
    keys: ['name', 'description', 'tags', 'links.label', 'technologies.name'],
    threshold: 0.4,
    useExtendedSearch: true,
  });

  const searchResults = searchTerm?.length ? fuse.search(searchTerm).map((result) => result.item) : list;

  const filteredProjects = searchResults.filter(
    (project) =>
      (searchTags.length ? searchTags.every((tag) => project.tags.includes(tag)) : true) &&
      (searchTechs.length ? searchTechs.every((tech) => project.technologies.some((t) => t.name === tech)) : true),
  );

  const uniqueTags = [...new Set(list.flatMap((project) => project.tags))];
  const uniqueTechs = [...new Set(list.flatMap((project) => project.technologies.map((tech) => tech.name)))];

  return (
    <Vortex backgroundColor='transparent'>
      <Vignette />
      <div className='flex min-h-[100dvh] flex-col items-center px-4 pb-4 pt-[72px]'>
        <div className='w-full'>
          <div className='flex flex-col items-center'>
            <div className='flex flex-row gap-4 pb-4'>
              <Input type='text' placeholder='Search' onChange={(e) => router.push(pathname + '?' + setSearchTerm(e.target.value))} />
              <MultiSelect
                values={uniqueTags.map((tag) => ({
                  key: tag,
                  value: tag,
                }))}
                defaultValues={searchTags}
                onSelectionChange={(selectedItems) => router.push(pathname + '?' + setSearchTags(selectedItems.join(',')))}
              >
                {searchTags && searchTags.length > 0 ? (
                  <>
                    <span className='sm:hidden'>
                      {searchTags.length} Tag{searchTags.length > 1 ? 's' : ''}
                    </span>
                    <span className='hidden max-w-40 truncate sm:block md:max-w-56 lg:max-w-72'>
                      {searchTags.length} Tag{searchTags.length > 1 ? 's' : ''}:{' '}
                      {searchTags.map((t) => (t!.length > 25 ? t!.slice(0, 25) + '...' : t)).join(', ')}
                    </span>
                  </>
                ) : (
                  <>
                    <span className='sm:hidden'>Tag</span>
                    <span className='hidden sm:block'>Tag</span>
                  </>
                )}
              </MultiSelect>
              <MultiSelect
                values={uniqueTechs.map((tag) => ({
                  key: tag,
                  value: tag,
                }))}
                defaultValues={searchTechs}
                onSelectionChange={(selectedItems) => router.push(pathname + '?' + setSearchTechs(selectedItems.join(',')))}
              >
                {searchTechs && searchTechs.length > 0 ? (
                  <>
                    <span className='sm:hidden'>
                      {searchTechs.length} Tech
                      {searchTechs.length > 1 ? 's' : ''}
                    </span>
                    <span className='hidden max-w-40 truncate sm:block md:max-w-56 lg:max-w-72'>
                      {searchTechs.length} Tech
                      {searchTechs.length > 1 ? 's' : ''}: {searchTechs.map((t) => (t!.length > 25 ? t!.slice(0, 25) + '...' : t)).join(', ')}
                    </span>
                  </>
                ) : (
                  <>
                    <span className='sm:hidden'>Tech</span>
                    <span className='hidden sm:block'>Tech</span>
                  </>
                )}
              </MultiSelect>
            </div>
          </div>
        </div>
        <div className='flex w-full flex-1 items-center justify-center'>
          <div className='flex max-w-screen-2xl flex-wrap items-center justify-center gap-5'>
            {filteredProjects.map((project, index) => (
              <Project index={index} key={`project-${index}-${project.name}`} {...project} />
            ))}
          </div>
        </div>
      </div>
    </Vortex>
  );
}

export function Project({ name, description, technologies, links, tags, image, icon, index }: ProjectType & { index: number }) {
  return (
    <motion.div
      layout
      transition={{
        duration: 0.2,
        delay: index * 0.2 + 0.2,
        ease: 'easeInOut',
      }}
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 40 }}
    >
      <div className='flex flex-col gap-4 rounded-md border border-foreground/10 bg-background p-4 xl:max-w-full'>
        <div className='flex flex-row items-center gap-4'>
          <Avatar className='rounded-lg'>
            <AvatarImage aria-hidden draggable={false} src={icon} className='select-none' />
            <AvatarFallback>{getAcronym(name)}</AvatarFallback>
          </Avatar>
          <div className='flex flex-col'>
            <span className='text-lg font-bold'>{name}</span>
            <span className='text-sm text-muted-foreground'>{description}</span>
          </div>
        </div>
        <div className='flex max-w-[400px] flex-col gap-2 sm:flex-row sm:items-center'>
          <div className='flex h-fit flex-wrap gap-1 text-sm text-muted-foreground'>
            {technologies.map((tech, index) => (
              <Tooltip key={`technologies-${index}-${tech.name}`}>
                <TooltipTrigger asChild>
                  <span className='size-4 fill-foreground'>{tech.icon}</span>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{tech.name}</p>
                </TooltipContent>
              </Tooltip>
            ))}
          </div>
          <p className='hidden sm:block'>•</p>
          <div className='text-sm text-muted-foreground'>{tags.join(', ')}</div>
        </div>
        <Image
          unoptimized
          aria-hidden
          draggable={false}
          src={image}
          alt='placeholder'
          className='aspect-[4/3] select-none rounded-md object-cover'
          width={400}
          height={300}
        />
        {links.length > 0 && (
          <div className='flex flex-wrap gap-2'>
            {links.map((link, i) => (
              <Button asChild size='sm' variant={i === 0 ? 'default' : 'secondary'} key={`project-${i}-${name}-${link.href}-link`}>
                <Link href={link.href}>
                  <span className='fill-foreground'>{link.icon}</span> {link.label}
                </Link>
              </Button>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
