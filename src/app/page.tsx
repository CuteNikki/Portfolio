import Link from 'next/link';

import { GithubIcon, LinkedinIcon, MailIcon } from 'lucide-react';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { formatDate, getAge } from '@/lib/utils';

export default function Home() {
  const ABOUT = {
    name: 'Nikki',
    age: getAge(new Date('2004-09-26')),
    title: 'Software Developer',
    country: 'Germany',
    flag: '🇩🇪',
    description:
      'Full-stack developer and designer focused on the intersection of code and user experience. I build fast, accessible, and well-structured web applications from the ground up.',
    socials: [
      {
        platform: 'GitHub',
        icon: GithubIcon,
        url: 'https://github.com/CuteNikki',
      },
      {
        platform: 'LinkedIn',
        icon: LinkedinIcon,
        url: 'https://linkedin.com/in/nikki-sophie-berthold/',
      },
      {
        platform: 'Mail',
        icon: MailIcon,
        url: 'mailto:nikki@niso.moe',
      },
    ],
    education: [
      {
        from: new Date('2024-09'),
        to: new Date('2027-08'),
        title: 'Student',
        school: 'Carl-Severing-Berufskolleg',
        location: 'Bielefeld, Germany',
        description:
          'Pursuing vocational education in software development, focusing on practical skills and theoretical knowledge.',
      },
      {
        from: new Date('2015-09'),
        to: new Date('2021-08'),
        title: 'Student',
        school: 'Bertolt-Brecht-Gesamtschule',
        location: 'Löhne, Germany',
        description:
          'Completed secondary school education with a focus on science and technology subjects.',
      },
      {
        from: new Date('2011-09'),
        to: new Date('2015-08'),
        title: 'Student',
        school: 'Ev. Grundschule Obernbeck',
        location: 'Löhne, Germany',
        description:
          'Completed primary/elementary school education, laying the foundation for further academic pursuits.',
      },
      {
        from: new Date('2008-09'),
        to: new Date('2011-08'),
        title: 'Kindergartner',
        school: 'Ev. Kindergarten Die Arche',
        location: 'Löhne, Germany',
        description:
          'Attended kindergarten, developing social skills and preparing for formal education.',
      },
    ],
    career: [
      {
        from: new Date('2024-08'),
        to: 'Present',
        title: 'Application Developer',
        company: 'Prodress Software GmbH',
        location: 'Bielefeld, Germany',
        description:
          'Developing and maintaining software applications, collaborating with cross-functional teams to deliver high-quality products.',
      },
      {
        from: new Date('2022-09-17'),
        to: new Date('2022-09-21'),
        showDays: true,
        title: 'Application Developer',
        company: 'Mittwald CM Service',
        location: 'Espelkamp, Germany',
        description:
          'Completed an internship, gaining hands-on experience in application development and understanding industry practices.',
      },
      {
        from: new Date('2015-09'),
        to: 'Present',
        title: 'Freelancer',
        company: 'Self-Employed',
        location: 'Remote',
        description:
          'Working on various freelance projects, building websites and more for clients across different industries.',
      },
    ],
  };

  return (
    <div className='flex flex-col gap-8'>
      <h1 className='text-4xl font-bold'>
        Hello, I&apos;m <span className='text-primary-text'>Nikki</span>! 👋
      </h1>
      <p className='text-lg'>
        {ABOUT.age}-year-old {ABOUT.title} based in {ABOUT.country} {ABOUT.flag}
      </p>
      <p className='max-w-prose'>{ABOUT.description}</p>
      <ul className='flex flex-wrap gap-4'>
        {ABOUT.socials.map(({ platform, icon: Icon, url }) => (
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
            {ABOUT.career.map(
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
            {ABOUT.education.map(
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
