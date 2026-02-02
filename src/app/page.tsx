import Link from 'next/link';

import { GithubIcon, LinkedinIcon, MailIcon } from 'lucide-react';

import { getAge } from '@/lib/utils';

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
  };

  return (
    <div className='flex flex-1 items-center justify-center'>
      <main className='container mx-auto flex flex-col items-start gap-8 p-4 py-32'>
        <h1 className='text-4xl font-bold'>
          Hello, I&apos;m <span className='text-primary-text'>Nikki</span>! 👋
        </h1>
        <p className='text-lg'>
          {ABOUT.age}-year-old {ABOUT.title} based in {ABOUT.country}{' '}
          {ABOUT.flag}
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
      </main>
    </div>
  );
}
