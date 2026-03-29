import Link from 'next/link';

import { SITE_METADATA } from '@/constants/metadata';
import { PERSONAL_DETAILS } from '@/constants/personal';

import { formatDate } from '@/lib/utils';

import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

export const { home: metadata } = SITE_METADATA;

export default function Home() {
  return (
    <div className='flex w-full max-w-5xl flex-col gap-4 border p-4 sm:p-8'>
      <h1 className='text-xl font-semibold'>
        Hello, I&apos;m{' '}
        <span className='text-primary-text'>{PERSONAL_DETAILS.firstName}</span>!
        👋
      </h1>
      <p className='text-lg text-balance'>
        {PERSONAL_DETAILS.age}-year-old {PERSONAL_DETAILS.title} based in{' '}
        {PERSONAL_DETAILS.address.country} {PERSONAL_DETAILS.address.flag}
      </p>
      <p className='text-pretty xl:text-balance'>
        {PERSONAL_DETAILS.description}
      </p>
      <ul className='grid grid-cols-2 justify-items-center gap-4 py-2 sm:grid-cols-4 sm:justify-items-start'>
        {PERSONAL_DETAILS.socials.map(({ platform, icon: Icon, url }) => (
          <li key={platform}>
            <Link
              href={url}
              target='_blank'
              rel='noopener noreferrer'
              className='hover:text-primary-text flex items-center gap-1 transition-colors'
            >
              <Icon className='text-primary-text size-5' />
              {platform}
            </Link>
          </li>
        ))}
      </ul>
      <Tabs defaultValue='career' className='w-full'>
        <TabsList className='w-full border border-b-0'>
          <TabsTrigger value='career'>Career</TabsTrigger>
          <TabsTrigger value='education'>Education</TabsTrigger>
        </TabsList>
        <TabsContent value='career' className='border'>
          <div className='relative m-4 flex flex-col border-l-2 pl-6 sm:mx-8'>
            {PERSONAL_DETAILS.career.map(
              ({
                from,
                to,
                title,
                company,
                location,
                description,
                showDays,
              }) => (
                <div
                  key={`${title}-${company}`}
                  className='relative mb-10 last:mb-0'
                >
                  {/* The Dot */}
                  <span
                    className='bg-primary absolute top-2 -left-6.25 size-3 -translate-x-1/2 rounded-full'
                    aria-hidden='true'
                  />

                  {/* Content */}
                  <div className='flex flex-col gap-1'>
                    <div className='flex flex-col md:flex-row md:items-baseline md:justify-between'>
                      <h2 className='text-xl font-bold'>{company}</h2>
                      <time className='text-muted-foreground text-sm'>
                        {formatDate(from, showDays)} —{' '}
                        {typeof to === 'string' &&
                        to.toLowerCase() === 'present' ? (
                          <span className='font-extrabold'>
                            {formatDate(to)}
                          </span>
                        ) : (
                          formatDate(to, showDays)
                        )}
                      </time>
                    </div>
                    <div className='flex flex-col md:flex-row md:items-baseline md:justify-between'>
                      <h3 className='text-base'>{title}</h3>
                      <p className='text-muted-foreground text-sm'>
                        {location}
                      </p>
                    </div>
                    <p className='text-foreground/80 mt-2 leading-relaxed text-pretty'>
                      {description}
                    </p>
                  </div>
                </div>
              ),
            )}
          </div>
        </TabsContent>
        <TabsContent value='education' className='border'>
          <div className='relative m-4 flex flex-col border-l-2 pl-6 sm:mx-8'>
            {PERSONAL_DETAILS.education.map(
              ({ from, to, title, school, location, description }) => (
                <div
                  key={`${title}-${school}`}
                  className='relative mb-10 last:mb-0'
                >
                  {/* The Dot */}
                  <span
                    className='bg-primary absolute top-2 -left-6.25 size-3 -translate-x-1/2 rounded-full'
                    aria-hidden='true'
                  />

                  {/* Content */}
                  <div className='flex flex-col gap-1'>
                    <div className='flex flex-col md:flex-row md:items-baseline md:justify-between'>
                      <h2 className='text-xl font-bold'>{school}</h2>
                      <time className='text-muted-foreground text-sm'>
                        {formatDate(from)} — {formatDate(to)}
                      </time>
                    </div>
                    <div className='flex flex-col md:flex-row md:items-baseline md:justify-between'>
                      <h3 className='text-base'>{title}</h3>
                      <p className='text-muted-foreground text-sm'>
                        {location}
                      </p>
                    </div>
                    <p className='text-foreground/80 mt-2 leading-relaxed text-pretty'>
                      {description}
                    </p>
                  </div>
                </div>
              ),
            )}
          </div>
        </TabsContent>
      </Tabs>
      <div className='xs:grid-cols-2 grid grid-cols-1 gap-4 pt-2 md:grid-cols-3 xl:grid-cols-6'>
        {Object.keys(PERSONAL_DETAILS.skillsTechnologies).map((category) => (
          <div key={category} className='flex flex-col gap-2'>
            <span className='capitalize'>{category}</span>
            <ul>
              {PERSONAL_DETAILS.skillsTechnologies[category].map(
                ({ name, icon, description }) => (
                  <li key={name}>
                    <Tooltip>
                      <TooltipTrigger>
                        <Badge variant='secondary'>
                          {icon}
                          {name}
                        </Badge>
                      </TooltipTrigger>
                      <TooltipContent>{description}</TooltipContent>
                    </Tooltip>
                  </li>
                ),
              )}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
