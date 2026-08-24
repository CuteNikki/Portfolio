import Link from 'next/link';

import { ArrowRightIcon } from 'lucide-react';

import { ScrollReveal } from '@/components/common/scroll-reveal';
import { DiscordMenu } from '@/components/navigation/discord-menu';

import { ExperienceTabs } from '@/components/common/experience-tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { SITE_METADATA } from '@/constants/metadata';
import { PERSONAL_DETAILS } from '@/constants/personal';
import { formatDate } from '@/lib/utils';

export const { home: metadata } = SITE_METADATA;

export default function Home() {
  return (
    <div className='flex w-full flex-col gap-12'>
      <section className='animate-rise-in flex flex-col gap-6'>
        <p className='text-primary-text text-sm font-semibold tracking-[0.2em] uppercase'>
          Portfolio / 2026
        </p>
        <h1 className='max-w-5xl text-5xl font-bold tracking-[-0.06em] text-balance sm:text-7xl lg:text-8xl'>
          Building useful things for the web.
        </h1>
        <p className='text-muted-foreground max-w-xl text-lg leading-relaxed text-pretty'>
          I&apos;m {PERSONAL_DETAILS.firstName}, a {PERSONAL_DETAILS.age}
          -year-old {PERSONAL_DETAILS.title.toLowerCase()} based in{' '}
          {PERSONAL_DETAILS.address.country}. {PERSONAL_DETAILS.description}
        </p>
        <div className='flex flex-wrap items-center gap-3'>
          <Button asChild variant='default' size='lg'>
            <Link href='/projects'>
              View selected work <ArrowRightIcon className='shrink-0' />
            </Link>
          </Button>
          <Button asChild variant='outline' size='lg'>
            <Link href='/contact'>Get in touch</Link>
          </Button>
        </div>
      </section>

      <ScrollReveal className='scroll-reveal border-border grid gap-8 border-y py-8 lg:grid-cols-2 lg:gap-16'>
        <div
          data-reveal-item
          style={{ '--reveal-index': 0 } as React.CSSProperties}
          className='flex flex-col gap-3'
        >
          <span className='text-primary-text flex items-center gap-2 text-sm font-semibold tracking-[0.2em] uppercase'>
            Availability
          </span>
          <p className='text-muted-foreground max-w-sm leading-relaxed'>
            Currently open to thoughtful collaborations, product work, and
            interesting problems.
          </p>
          <ul className='flex flex-wrap gap-x-5 gap-y-3'>
            {PERSONAL_DETAILS.socials
              .filter(({ platform }) => platform !== 'Discord')
              .map(({ platform, icon: Icon, url }) => (
                <li key={platform}>
                  <Link
                    href={url}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='text-muted-foreground hover:text-primary-text flex items-center gap-2 text-sm transition-colors'
                  >
                    <Icon className='size-4' />
                    {platform}
                  </Link>
                </li>
              ))}
            <li>
              <DiscordMenu />
            </li>
          </ul>
        </div>
        <div
          data-reveal-item
          style={{ '--reveal-index': 1 } as React.CSSProperties}
          className='lg:border-border flex max-w-md flex-col gap-3 lg:border-l lg:pl-8'
        >
          <span className='text-primary-text text-sm font-semibold tracking-[0.2em] uppercase'>
            Experience
          </span>
          <p className='text-muted-foreground max-w-xs leading-relaxed text-pretty'>
            Nearly a decade of experience building on the web, shaped by the
            work and education that continue to guide how I build.
          </p>
        </div>
      </ScrollReveal>

      <ScrollReveal className='scroll-reveal'>
        <ExperienceTabs
          career={
            <div className='flex flex-col gap-6'>
              {PERSONAL_DETAILS.career.map(
                (
                  { from, to, title, company, location, description, showDays },
                  index,
                ) => (
                  <div
                    key={`${title}-${company}`}
                    data-reveal-item
                    style={{ '--reveal-index': index } as React.CSSProperties}
                    className='grid gap-2 pb-6 sm:grid-cols-[1fr_auto]'
                  >
                    <div>
                      <h3 className='text-xl font-semibold'>{company}</h3>
                      <p className='text-muted-foreground text-sm'>
                        {title} · {location}
                      </p>
                      <p className='text-muted-foreground mt-3 max-w-xl text-sm leading-relaxed'>
                        {description}
                      </p>
                    </div>
                    <time className='text-muted-foreground text-sm'>
                      {formatDate(from, showDays)} —{' '}
                      {typeof to === 'string' &&
                      to.toLowerCase() === 'present' ? (
                        <span>{formatDate(to)}</span>
                      ) : (
                        formatDate(to, showDays)
                      )}
                    </time>
                  </div>
                ),
              )}
            </div>
          }
          education={
            <div className='flex flex-col gap-6'>
              {PERSONAL_DETAILS.education.map(
                ({ from, to, title, school, location, description }, index) => (
                  <div
                    key={`${title}-${school}`}
                    data-reveal-item
                    style={{ '--reveal-index': index } as React.CSSProperties}
                    className='grid gap-2 pb-6 sm:grid-cols-[1fr_auto]'
                  >
                    <div>
                      <h3 className='text-xl font-semibold'>{school}</h3>
                      <p className='text-muted-foreground text-sm'>
                        {title} · {location}
                      </p>
                      <p className='text-muted-foreground mt-3 max-w-xl text-sm leading-relaxed'>
                        {description}
                      </p>
                    </div>
                    <time className='text-muted-foreground text-sm'>
                      {formatDate(from)} — {formatDate(to)}
                    </time>
                  </div>
                ),
              )}
            </div>
          }
        />
      </ScrollReveal>

      <ScrollReveal className='scroll-reveal'>
        <section className='border-border flex flex-col gap-6 border-t pt-8'>
          <div className='flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between'>
            <div>
              <p className='text-primary-text text-sm font-semibold tracking-[0.2em] uppercase'>
                Toolkit
              </p>
              <h2 className='text-3xl font-bold tracking-tight'>
                Things I work with.
              </h2>
            </div>
          </div>
          <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-4'>
            {Object.entries(PERSONAL_DETAILS.skillsTechnologies).map(
              ([category, skills], index) => (
                <div
                  key={category}
                  data-reveal-item
                  style={{ '--reveal-index': index } as React.CSSProperties}
                  className='flex flex-col gap-3'
                >
                  <h3 className='text-muted-foreground text-sm font-semibold capitalize'>
                    {category}
                  </h3>
                  <div className='flex flex-wrap gap-2'>
                    {skills.map(({ name, icon, description }) => (
                      <Tooltip key={name}>
                        <TooltipTrigger asChild>
                          <Badge variant='secondary' className='cursor-help'>
                            {icon}
                            {name}
                          </Badge>
                        </TooltipTrigger>
                        <TooltipContent>{description}</TooltipContent>
                      </Tooltip>
                    ))}
                  </div>
                </div>
              ),
            )}
          </div>
        </section>
      </ScrollReveal>
    </div>
  );
}
