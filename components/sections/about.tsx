'use client';

import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import Link from 'next/link';

import {
  BookMarkedIcon,
  ClipboardCopyIcon,
  LinkIcon,
  UserIcon,
  UsersIcon,
  WeightIcon,
} from 'lucide-react';

import {
  backend,
  databases,
  design,
  discord,
  frontend,
  languages,
  socials,
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

export function About() {
  const { resolvedTheme } = useTheme();

  return (
    <div className='relative overflow-hidden'>
      <Sparkles
        background='transparent'
        minSize={0.4}
        maxSize={1}
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
          <div className='flex flex-col justify-center gap-6'>
            <Socials />
            <Description />
            <Skills />
            <ToolsAndTechnologies />
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function Description() {
  return (
    <div>
      <h1 className='font-bold'>Description</h1>
      <p className='text-pretty'>
        Hi, I&apos;m Nikki, a designer and full-stack developer who loves
        solving problems
        <br />
        and building accessible, user-friendly experiences.
        <br />
        I enjoy the flexibility of working across the stack, bringing ideas to
        life at every level.
        <br />
        I&apos;m also always exploring new tools to keep my skills sharp and
        up-to-date.
        <br />
        Feel free to{' '}
        <Link href='/projects' className='underline underline-offset-4'>
          explore my work
        </Link>{' '}
        or{' '}
        <Link
          href='mailto:contact@yanera.xyz'
          className='underline underline-offset-4'
        >
          connect with me
        </Link>
        .
        <br />
        I&apos;d love to hear from you!
      </p>
    </div>
  );
}

function Socials() {
  return (
    <div className='flex flex-col justify-center'>
      <h1 className='font-bold'>Socials</h1>
      <div className='flex flex-wrap gap-2'>
        {socials.map((social) => (
          <Button key={social.name} variant='outline' asChild>
            <Link href={social.url} className='fill-foreground'>
              {social.icon}
              {social.name}
            </Link>
          </Button>
        ))}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='outline' className='fill-foreground'>
              {discord.icon}
              Discord
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem
              onClick={() => {
                navigator.clipboard.writeText(discord.username);
              }}
            >
              <ClipboardCopyIcon />
              Copy Username
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <a href={`https://discord.com/users/${discord.id}`}>
                <LinkIcon />
                Open Profile
              </a>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

function ToolsAndTechnologies() {
  return (
    <div>
      <h1 className='mb-2 font-bold'>Tools & Technologies</h1>
      <div className='flex flex-col gap-4'>
        <div className='flex flex-col gap-2'>
          <span className='ml-2'>Languages:</span>
          <ul className='flex flex-wrap gap-2'>
            {languages.map((language) => (
              <li
                key={language.name}
                className='flex flex-row items-center justify-between gap-2 rounded-md border border-input bg-background px-4 py-2 shadow-sm'
              >
                <span className='size-4'>{language.icon}</span>
                <span className='text-sm'>{language.name}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className='flex flex-col gap-2'>
          <span className='ml-2'>Back-End:</span>
          <ul className='flex flex-wrap gap-2'>
            {backend.map((backend) => (
              <li
                key={backend.name}
                className='flex flex-row items-center justify-between gap-2 rounded-md border border-input bg-background px-4 py-2 shadow-sm'
              >
                <span className='size-4'>{backend.icon}</span>
                <span className='text-sm'>{backend.name}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className='flex flex-col gap-2'>
          <span className='ml-2'>Front-End:</span>
          <ul className='flex flex-wrap gap-2'>
            {frontend.map((frontend) => (
              <li
                key={frontend.name}
                className='flex flex-row items-center justify-between gap-2 rounded-md border border-input bg-background px-4 py-2 shadow-sm'
              >
                <span className='size-4'>{frontend.icon}</span>
                <span className='text-sm'>{frontend.name}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className='flex flex-col gap-2'>
          <span className='ml-2'>Databases:</span>
          <ul className='flex flex-wrap gap-2'>
            {databases.map((database) => (
              <li
                key={database.name}
                className='flex flex-row items-center justify-between gap-2 rounded-md border border-input bg-background px-4 py-2 shadow-sm'
              >
                <span className='size-4'>{database.icon}</span>
                <span className='text-sm'>{database.name}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className='flex flex-col gap-2'>
          <span className='ml-2'>Design Tools:</span>
          <ul className='flex flex-wrap gap-2'>
            {design.map((tool) => (
              <li
                key={tool.name}
                className='flex flex-row items-center justify-between gap-2 rounded-md border border-input bg-background px-4 py-2 shadow-sm'
              >
                <span className='size-4'>{tool.icon}</span>
                <span className='text-sm'>{tool.name}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

function Skills() {
  return (
    <div className='flex flex-col justify-center'>
      <h1 className='font-bold'>Skills</h1>
      <ul className='flex flex-col gap-2'>
        <li className='flex w-fit flex-row items-center justify-between gap-2 rounded-md border border-input bg-background px-4 py-2 shadow-sm'>
          <UserIcon className='size-4' />
          <span className='text-sm'>Focus on user experience design.</span>
        </li>
        <li className='flex w-fit flex-row items-center justify-between gap-2 rounded-md border border-input bg-background px-4 py-2 shadow-sm'>
          <WeightIcon className='size-4' />
          <span className='text-sm'>Strong problem-solving abilities.</span>
        </li>
        <li className='flex w-fit flex-row items-center justify-between gap-2 rounded-md border border-input bg-background px-4 py-2 shadow-sm'>
          <BookMarkedIcon className='size-4' />
          <span className='text-sm'>Commitment to continuous learning.</span>
        </li>
        <li className='flex w-fit flex-row items-center justify-between gap-2 rounded-md border border-input bg-background px-4 py-2 shadow-sm'>
          <UsersIcon className='size-4' />
          <span className='text-sm'>Collaborative and supportive.</span>
        </li>
      </ul>
    </div>
  );
}
