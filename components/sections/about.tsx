'use client';

import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import Link from 'next/link';

import { ClipboardCopyIcon, ClipboardTypeIcon, LinkIcon } from 'lucide-react';

import {
  about,
  backend,
  databases,
  discord,
  frontend,
  languages,
  skills,
  socials,
  tools,
} from '@/assets/about';

import { Sparkles } from '@/components/backgrounds/sparkles-background';
import { Vignette } from '@/components/misc/vignette';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Image from 'next/image';

export function About() {
  const { resolvedTheme } = useTheme();

  return (
    <div className='relative overflow-hidden'>
      <Sparkles
        background='transparent'
        minSize={0.3}
        maxSize={2}
        particleDensity={100}
        particleColor={resolvedTheme === 'light' ? '#000000' : '#ffffff'}
      />
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
          <div className='grid justify-center gap-2'>
            <div className='flex max-w-screen-lg flex-col gap-2 xl:flex-row'>
              <Info />
              <div className='flex flex-col gap-2'>
                <Skills />
                <Socials />
              </div>
            </div>
            <div className='grid max-w-[36rem] gap-2 sm:grid-cols-2 xl:max-w-screen-lg xl:grid-cols-3'>
              <Languages />
              <BackEnd />
              <FrontEnd />
              <Databases />
              <OtherTools />
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function Info() {
  return (
    <div className='flex max-w-[36rem] flex-col gap-4 rounded-md border border-foreground/10 bg-background p-4 xl:max-w-full'>
      <div className='flex flex-row items-center gap-2'>
        <Image
          unoptimized
          aria-hidden
          draggable={false}
          src='https://placehold.co/40x40/png?text=Avatar'
          alt='avatar'
          className='h-10 w-10 select-none rounded-full'
          height={40}
          width={40}
        />
        <div className='flex flex-col'>
          <span className='text-lg font-bold'>{about.name}</span>
          <ul className='flex flex-row gap-1 text-sm text-muted-foreground'>
            <li>{about.title}</li>
            <li>•</li>
            <li>{about.location}</li>
          </ul>
        </div>
      </div>
      <p className='whitespace-pre-line text-pretty'>{about.description}</p>
    </div>
  );
}

function Socials() {
  return (
    <div className='flex h-fit max-w-[36rem] flex-col gap-2 rounded-md border border-foreground/10 bg-background px-4 py-4'>
      <h1 className='font-bold'>Socials</h1>
      <div className='flex flex-wrap gap-2'>
        {socials.map((social) => (
          <Button key={social.name} variant='default' asChild>
            <Link href={social.url}>
              <span className='size-4 fill-primary-foreground'>
                {social.icon}
              </span>
              {social.name}
            </Link>
          </Button>
        ))}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='default'>
              <span className='size-4 fill-primary-foreground'>
                {discord.icon}
              </span>
              Discord
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem
              onClick={() => {
                navigator.clipboard.writeText(discord.username);
              }}
            >
              <ClipboardTypeIcon />
              Copy name
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                navigator.clipboard.writeText(discord.id);
              }}
            >
              <ClipboardCopyIcon />
              Copy ID
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <a href={`https://discord.com/users/${discord.id}`}>
                <LinkIcon />
                Profile Link
              </a>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

function Skills() {
  return (
    <div className='flex h-fit max-w-[36rem] flex-col gap-2 rounded-md border border-foreground/10 bg-background px-4 py-4'>
      <h1 className='font-bold'>Skills</h1>
      <ul className='flex flex-wrap gap-2'>
        {skills.map((skill) => (
          <span
            key={skill.text}
            className='flex w-fit flex-row items-center gap-2 rounded-md border border-foreground/10 bg-background px-4 py-2 text-start text-sm shadow-sm'
          >
            <skill.icon className='size-4' />
            {skill.text}
          </span>
        ))}
      </ul>
    </div>
  );
}

function Languages() {
  return (
    <div className='flex flex-col gap-2 rounded-md border border-foreground/10 bg-background px-4 py-4'>
      <span className='font-bold'>Languages</span>
      <ul className='flex flex-wrap gap-2'>
        {languages.map((language) => (
          <li
            key={language.name}
            className='flex flex-row items-center gap-2 rounded-md border border-foreground/10 bg-background px-4 py-2 shadow-sm'
          >
            <span className='size-4 fill-foreground'>{language.icon}</span>
            <span className='text-sm'>{language.name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function BackEnd() {
  return (
    <div className='flex flex-col gap-2 rounded-md border border-foreground/10 bg-background px-4 py-4'>
      <span className='font-bold'>Back-End</span>
      <ul className='flex flex-wrap gap-2'>
        {backend.map((backend) => (
          <li
            key={backend.name}
            className='flex flex-row items-center gap-2 rounded-md border border-foreground/10 bg-background px-4 py-2 shadow-sm'
          >
            <span className='size-4 fill-foreground'>{backend.icon}</span>
            <span className='text-sm'>{backend.name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function FrontEnd() {
  return (
    <div className='flex flex-col gap-2 rounded-md border border-foreground/10 bg-background px-4 py-4'>
      <span className='font-bold'>Front-End</span>
      <ul className='flex flex-wrap gap-2'>
        {frontend.map((frontend) => (
          <li
            key={frontend.name}
            className='flex flex-row items-center gap-2 rounded-md border border-foreground/10 bg-background px-4 py-2 shadow-sm'
          >
            <span className='size-4 fill-foreground'>{frontend.icon}</span>
            <span className='text-sm'>{frontend.name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Databases() {
  return (
    <div className='flex flex-col gap-2 rounded-md border border-foreground/10 bg-background px-4 py-4'>
      <span className='font-bold'>Databases</span>
      <ul className='flex flex-wrap gap-2'>
        {databases.map((database) => (
          <li
            key={database.name}
            className='flex flex-row items-center gap-2 rounded-md border border-foreground/10 bg-background px-4 py-2 shadow-sm'
          >
            <span className='size-4 fill-foreground'>{database.icon}</span>
            <span className='text-sm'>{database.name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function OtherTools() {
  return (
    <div className='flex flex-col gap-2 rounded-md border border-foreground/10 bg-background px-4 py-4'>
      <span className='font-bold'>Other Tools</span>
      <ul className='flex flex-wrap gap-2'>
        {tools.map((tool) => (
          <li
            key={tool.name}
            className='flex flex-row items-center gap-2 rounded-md border border-foreground/10 bg-background px-4 py-2 shadow-sm'
          >
            <span className='size-4 fill-foreground'>{tool.icon}</span>
            <span className='text-sm'>{tool.name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
