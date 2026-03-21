import Link from 'next/link';

import { SITE_METADATA } from '@/constants/metadata';
import { PERSONAL_DETAILS } from '@/constants/personal';

import { formatDate } from '@/lib/utils';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export const metadata = SITE_METADATA.home;

export default function Home() {
  return (
    <div className='flex flex-col gap-6'>
      <h1 className='text-4xl font-bold'>
        Hello, I&apos;m{' '}
        <span className='text-primary-text'>{PERSONAL_DETAILS.firstName}</span>!
        👋
      </h1>
      <p className='text-lg'>
        {PERSONAL_DETAILS.age}-year-old {PERSONAL_DETAILS.title} based in{' '}
        {PERSONAL_DETAILS.address.country} {PERSONAL_DETAILS.address.flag}
      </p>
      <p className='max-w-prose'>{PERSONAL_DETAILS.description}</p>
      <ul className='flex flex-wrap gap-4'>
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
      <Tabs defaultValue='career' className='w-full max-w-2xl'>
        <TabsList className='w-full'>
          <TabsTrigger value='career'>Career</TabsTrigger>
          <TabsTrigger value='education'>Education</TabsTrigger>
        </TabsList>
        <TabsContent value='career' className='border'>
          <div className='relative m-8 flex flex-col border-l-2 pl-6'>
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
                    <p className='text-foreground/80 mt-2 leading-relaxed'>
                      {description}
                    </p>
                  </div>
                </div>
              ),
            )}
          </div>
        </TabsContent>
        <TabsContent value='education' className='border'>
          <div className='relative m-8 flex flex-col border-l-2 pl-6'>
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
                    <p className='text-foreground/80 mt-2 leading-relaxed'>
                      {description}
                    </p>
                  </div>
                </div>
              ),
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
