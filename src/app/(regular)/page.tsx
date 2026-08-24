import Link from 'next/link';

import { ArrowUpRightIcon, MapPinIcon } from 'lucide-react';

import { DiscordMenu } from '@/components/navigation/discord-menu';
import { ScrollReveal } from '@/components/common/scroll-reveal';

import { SITE_METADATA } from '@/constants/metadata';
import { PERSONAL_DETAILS } from '@/constants/personal';
import { formatDate } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

export const { home: metadata } = SITE_METADATA;

export default function Home() {
  return (
    <div className='flex w-full flex-col gap-12'>
      <section className='animate-rise-in flex flex-col gap-6'>
        <p className='text-muted-foreground text-sm font-semibold uppercase tracking-[0.2em]'>Portfolio / 2026</p>
        <h1 className='max-w-5xl text-balance text-5xl font-bold tracking-[-0.06em] sm:text-7xl lg:text-8xl'>
          Building useful things for the <span className='text-primary-text'>web.</span>
        </h1>
        <p className='text-muted-foreground max-w-2xl text-pretty text-lg leading-relaxed'>
          I&apos;m {PERSONAL_DETAILS.firstName}, a {PERSONAL_DETAILS.title.toLowerCase()} based in {PERSONAL_DETAILS.address.country}. {PERSONAL_DETAILS.description}
        </p>
        <div className='flex flex-wrap items-center gap-3'>
          <Link href='/projects' className='bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center gap-2 rounded-md px-5 py-3 text-sm font-semibold transition-colors'>
            View selected work <ArrowUpRightIcon className='size-4' />
          </Link>
          <Link href='/contact' className='border-border hover:border-primary-text hover:text-primary-text inline-flex items-center gap-2 rounded-md border px-5 py-3 text-sm font-semibold transition-colors'>Get in touch</Link>
        </div>
      </section>

      <ScrollReveal className='scroll-reveal grid gap-8 border-y border-border py-8 lg:grid-cols-2 lg:gap-16'>
        <div className='flex flex-col gap-5'>
          <div className='flex items-center gap-2 text-sm'><MapPinIcon className='text-primary-text size-4' /> {PERSONAL_DETAILS.address.city}, {PERSONAL_DETAILS.address.country}</div>
          <p className='text-muted-foreground max-w-sm text-sm leading-relaxed'>Currently open to thoughtful collaborations, product work, and interesting problems.</p>
          <ul className='flex flex-wrap gap-x-5 gap-y-3'>
            {PERSONAL_DETAILS.socials.filter(({ platform }) => platform !== 'Discord').map(({ platform, icon: Icon, url }) => <li key={platform}><Link href={url} target='_blank' rel='noopener noreferrer' className='text-muted-foreground hover:text-primary-text flex items-center gap-2 text-sm transition-colors'><Icon className='size-4' />{platform}</Link></li>)}
            <li><DiscordMenu /></li>
          </ul>
        </div>
        <div className='flex flex-col gap-3 lg:border-l lg:border-border lg:pl-8'><p className='text-muted-foreground text-sm font-semibold uppercase tracking-[0.2em]'>Experience</p><h2 className='text-3xl font-bold tracking-tight'>A practice built on curiosity.</h2><p className='text-muted-foreground leading-relaxed'>A quick look at the places and ideas that have shaped how I work.</p></div>
      </ScrollReveal>

      <ScrollReveal className='scroll-reveal'>
        <Tabs defaultValue='career' className='w-full'>
          <TabsList className='bg-muted/60 w-full justify-start rounded-none border-b'><TabsTrigger value='career'>Career</TabsTrigger><TabsTrigger value='education'>Education</TabsTrigger></TabsList>
          <TabsContent value='career' className='mt-6 flex flex-col gap-6'>{PERSONAL_DETAILS.career.filter(({ company }) => company !== 'TheVace').map(({ from, to, title, company, location, description, showDays }) => <div key={`${title}-${company}`} data-reveal-item className='border-border grid gap-2 border-b pb-6 last:border-0 sm:grid-cols-[1fr_auto]'><div><h3 className='text-xl font-semibold'>{company}</h3><p className='text-muted-foreground text-sm'>{title} · {location}</p><p className='text-muted-foreground mt-3 max-w-xl text-sm leading-relaxed'>{description}</p></div><time className='text-muted-foreground text-sm'>{formatDate(from, showDays)} — {typeof to === 'string' && to.toLowerCase() === 'present' ? <span>{formatDate(to)}</span> : formatDate(to, showDays)}</time></div>)}</TabsContent>
          <TabsContent value='education' className='mt-6 flex flex-col gap-6'>{PERSONAL_DETAILS.education.map(({ from, to, title, school, location, description }) => <div key={`${title}-${school}`} data-reveal-item className='border-border grid gap-2 border-b pb-6 last:border-0 sm:grid-cols-[1fr_auto]'><div><h3 className='text-xl font-semibold'>{school}</h3><p className='text-muted-foreground text-sm'>{title} · {location}</p><p className='text-muted-foreground mt-3 max-w-xl text-sm leading-relaxed'>{description}</p></div><time className='text-muted-foreground text-sm'>{formatDate(from)} — {formatDate(to)}</time></div>)}</TabsContent>
        </Tabs>
      </ScrollReveal>

      <ScrollReveal className='scroll-reveal border-border flex flex-col gap-6 border-t pt-8'><div className='flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between'><div><p className='text-primary-text text-sm font-semibold uppercase tracking-[0.2em]'>Toolkit</p><h2 className='text-3xl font-bold tracking-tight'>Things I work with.</h2></div></div><div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-4'>{Object.entries(PERSONAL_DETAILS.skillsTechnologies).map(([category, skills]) => <div key={category} className='flex flex-col gap-3'><h3 className='text-muted-foreground text-sm font-semibold capitalize'>{category}</h3><div className='flex flex-wrap gap-2'>{skills.map(({ name, icon, description }) => <Tooltip key={name}><TooltipTrigger asChild><Badge variant='secondary' className='cursor-help'>{icon}{name}</Badge></TooltipTrigger><TooltipContent>{description}</TooltipContent></Tooltip>)}</div></div>)}</div></ScrollReveal>
    </div>
  );
}
