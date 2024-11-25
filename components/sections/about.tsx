'use client';

import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import Image from 'next/image';
import Link from 'next/link';

import {
  about,
  backend,
  career,
  databases,
  discordButton,
  editors,
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
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  MapPin,
} from 'lucide-react';

export function About() {
  const { resolvedTheme } = useTheme();

  return (
    <>
      <Sparkles
        background='transparent'
        minSize={0.3}
        maxSize={2}
        particleDensity={100}
        particleColor={resolvedTheme === 'light' ? '#000000' : '#ffffff'}
      />
      <Vignette />
      <div className='flex min-h-[100dvh] flex-col items-center justify-center px-4 pb-4 pt-[72px]'>
        <div className='grid max-w-screen-lg items-center justify-center gap-4'>
          <div className='flex flex-col gap-4 md:flex-row'>
            <Info />
            <div className='flex flex-col justify-evenly gap-4 sm:flex-row md:flex-col'>
              <Skills />
              <Socials />
            </div>
          </div>
          <div className='grid gap-4 sm:grid-cols-2 md:grid-cols-3'>
            <Languages />
            <BackEnd />
            <FrontEnd />
            <Databases />
            <Editors />
            <OtherTools />
          </div>
          <Career />
        </div>
      </div>
    </>
  );
}

function Info() {
  return (
    <motion.div
      layout
      transition={{ duration: 0.2, delay: 0.2, ease: 'easeInOut' }}
      initial={{ opacity: 0, x: -40 }}
      animate={{ opacity: 1, x: 0 }}
    >
      <div className='flex h-full w-full flex-col gap-4 rounded-md border border-foreground/10 bg-background p-4'>
        <div className='flex flex-row items-center gap-2'>
          <Image
            unoptimized
            aria-hidden
            draggable={false}
            src={about.avatar}
            alt='avatar'
            className='h-10 w-10 select-none rounded-full'
            height={40}
            width={40}
          />
          <div className='flex flex-col'>
            <span className='text-lg font-bold'>{about.name}</span>
            <div className='flex flex-col gap-1 text-sm text-muted-foreground sm:flex-row'>
              <span>{about.title}</span>
              <span className='hidden sm:block'>•</span>
              <div className='flex flex-row items-center gap-1'>
                <span>{about.location}</span>
                <span>•</span>
                <span>{about.age}</span>
              </div>
            </div>
          </div>
        </div>
        <p className='flex flex-col gap-4 whitespace-pre-line text-pretty'>
          {about.description}
          <span className='whitespace-pre-line text-balance'>
            {about.addition.split('explore my work')[0]}
            <Link href='/projects' className='underline underline-offset-4'>
              explore my work
            </Link>
            {about.addition.split('explore my work')[1].split('reach out')[0]}
            <Link href='/contact' className='underline underline-offset-4'>
              reach out
            </Link>
            {about.addition.split('reach out')[1]}
          </span>
        </p>
      </div>
    </motion.div>
  );
}

function Skills() {
  return (
    <motion.div
      layout
      transition={{ duration: 0.2, delay: 0.4, ease: 'easeInOut' }}
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
    >
      <div className='flex h-fit max-w-[36rem] flex-col gap-2 rounded-md border border-foreground/10 bg-background p-4'>
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
    </motion.div>
  );
}

export function Socials() {
  return (
    <motion.div
      layout
      transition={{ duration: 0.2, delay: 0.6, ease: 'easeInOut' }}
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div
        id='socials'
        className='flex h-full max-w-[36rem] flex-col gap-2 rounded-md border border-foreground/10 bg-background p-4'
      >
        <h1 className='font-bold'>Socials</h1>
        <div className='flex flex-wrap gap-2'>
          {socials.map((social, index) => (
            <Button
              key={`social-${index}-${social.name}`}
              variant='secondary'
              asChild
            >
              <Link href={social.url}>
                <span className='size-4 fill-foreground'>{social.icon}</span>
                {social.name}
              </Link>
            </Button>
          ))}
          {discordButton}
        </div>
      </div>
    </motion.div>
  );
}

function Languages() {
  return (
    <motion.div
      layout
      transition={{ duration: 0.2, delay: 0.8, ease: 'easeInOut' }}
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className='flex h-full w-full flex-col gap-2 rounded-md border border-foreground/10 bg-background p-4'>
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
    </motion.div>
  );
}

function BackEnd() {
  return (
    <motion.div
      layout
      transition={{ duration: 0.2, delay: 1, ease: 'easeInOut' }}
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className='flex h-full w-full flex-col gap-2 rounded-md border border-foreground/10 bg-background p-4'>
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
    </motion.div>
  );
}

function FrontEnd() {
  return (
    <motion.div
      layout
      transition={{ duration: 0.2, delay: 1.2, ease: 'easeInOut' }}
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className='flex h-full w-full flex-col gap-2 rounded-md border border-foreground/10 bg-background p-4'>
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
    </motion.div>
  );
}

function Databases() {
  return (
    <motion.div
      layout
      transition={{ duration: 0.2, delay: 1.4, ease: 'easeInOut' }}
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className='flex h-full w-full flex-col gap-2 rounded-md border border-foreground/10 bg-background p-4'>
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
    </motion.div>
  );
}

function Editors() {
  return (
    <motion.div
      layout
      transition={{ duration: 0.2, delay: 1.6, ease: 'easeInOut' }}
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className='flex h-full w-full flex-col gap-2 rounded-md border border-foreground/10 bg-background p-4'>
        <span className='font-bold'>Editors</span>
        <ul className='flex flex-wrap gap-2'>
          {editors.map((editor) => (
            <li
              key={editor.name}
              className='flex flex-row items-center gap-2 rounded-md border border-foreground/10 bg-background px-4 py-2 shadow-sm'
            >
              <span className='size-4 fill-foreground'>{editor.icon}</span>
              <span className='text-sm'>{editor.name}</span>
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
}

function OtherTools() {
  return (
    <motion.div
      layout
      transition={{ duration: 0.2, delay: 1.8, ease: 'easeInOut' }}
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className='flex h-full w-full flex-col gap-2 rounded-md border border-foreground/10 bg-background p-4'>
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
    </motion.div>
  );
}

function Career() {
  return (
    <motion.div
      layout
      transition={{ duration: 0.2, delay: 2, ease: 'easeInOut' }}
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className='flex flex-col gap-2 rounded-md border border-foreground/10 bg-background p-4'>
        <span className='font-bold'>Career</span>
        <div className='grid gap-4 md:grid-cols-2'>
          {career.map((job, index) => (
            <div
              key={`job-${index}`}
              className='flex w-fit flex-col gap-2 rounded-md border border-foreground/10 bg-background p-4'
            >
              <span className='flex flex-row items-center gap-1 text-foreground/80'>
                <BriefcaseBusiness className='size-4 min-h-4 min-w-4 text-foreground' />
                {job.title}
              </span>
              <span className='flex flex-row items-center gap-1 text-lg text-foreground'>
                <Building2 className='size-4 min-h-4 min-w-4' />
                {job.company}
              </span>
              <span className='flex flex-row items-center gap-1 text-foreground/80'>
                <MapPin className='size-4 min-h-4 min-w-4 text-foreground' />
                {job.location}
              </span>
              <span className='flex flex-row items-center gap-1 text-foreground/80'>
                <CalendarDays className='size-4 min-h-4 min-w-4 text-foreground' />
                From {job.from} to {job.to}
              </span>
              <span className='flex flex-row items-center gap-1 text-pretty text-foreground/80'>
                {job.description}
              </span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
