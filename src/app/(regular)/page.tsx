import { cacheLife } from 'next/cache';
import Link from 'next/link';

import { ArrowRightIcon, BriefcaseIcon, GraduationCapIcon } from 'lucide-react';

import { toPostRow, toProjectCard } from '@/lib/cards';
import { getPublishedPosts, getPublishedProjects } from '@/lib/data';
import { cn, formatDate } from '@/lib/utils';

import { LINKS } from '@/constants/links';
import { SITE_METADATA } from '@/constants/metadata';
import { PERSONAL_DETAILS, WHAT_I_DO } from '@/constants/personal';

import { ScrollReveal } from '@/components/common/scroll-reveal';
import { DiscordMenu } from '@/components/navigation/discord-menu';
import { PostRow } from '@/components/posts/post-row';
import { FeaturedProjects } from '@/components/projects/featured-projects';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export const { home: metadata } = SITE_METADATA;

// Cached so the page can be prerendered; refreshed daily to catch birthdays
async function Age() {
  'use cache';
  cacheLife('days');

  return PERSONAL_DETAILS.age;
}

// The small violet label above each heading, as in the hero
const EYEBROW =
  'text-primary-text text-[13px] font-semibold tracking-[0.14em] uppercase';

function SectionHeading({
  id,
  eyebrow,
  className,
  children,
}: {
  id: string;
  eyebrow: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <p className={EYEBROW}>{eyebrow}</p>
      <h2
        id={id}
        className='text-[32px] leading-tight font-bold tracking-[-0.05em]'
      >
        {children}
      </h2>
    </div>
  );
}

const reveal = (index: number) =>
  ({ '--reveal-index': index }) as React.CSSProperties;

export default function Home() {
  return (
    <div className='flex w-full flex-col gap-24 sm:gap-30'>
      <section className='relative isolate flex flex-col gap-6'>
        {/* Reaches out of the page's column to the window's edges, and up behind the navbar. `isolate` above keeps it in
            front of the page background. */}
        <div
          aria-hidden
          className='grid-backdrop pointer-events-none absolute -top-16 left-1/2 -z-10 h-160 w-screen -translate-x-1/2 sm:-top-24'
        />
        <p className={cn(EYEBROW, 'animate-hero-in pt-6 sm:pt-10')}>
          Portfolio / 2026
        </p>
        <h1 className='animate-hero-in max-w-5xl text-[44px] leading-[1.04] font-bold tracking-[-0.06em] text-balance delay-1 sm:text-6xl lg:text-[76px]'>
          Full-stack developer building fast, accessible web apps{' '}
          <span className='text-primary-text'>from the ground up.</span>
        </h1>
        <p className='animate-hero-in text-body max-w-2xl text-base leading-[1.75] text-pretty delay-2'>
          I&apos;m {PERSONAL_DETAILS.firstName}, a <Age />
          -year-old {PERSONAL_DETAILS.title.toLowerCase()} based in{' '}
          {PERSONAL_DETAILS.address.country}. I do full-stack development and
          design, focusing on the intersection of code and user experience.
        </p>
        <div className='animate-hero-in flex flex-wrap items-center gap-3 pt-4 delay-3'>
          <Button asChild size='lg'>
            <Link href={LINKS.projects.url}>
              View projects
              <ArrowRightIcon className='group-hover/button:translate-x-0.75' />
            </Link>
          </Button>
          <Button asChild variant='outline' size='lg'>
            <Link href={LINKS.contact.url}>Get in touch</Link>
          </Button>
        </div>
      </section>

      <ScrollReveal className='scroll-reveal bg-card -mt-6 grid gap-8 rounded-xl border p-7 sm:-mt-12 sm:p-8 lg:grid-cols-2 lg:gap-0'>
        <div
          data-reveal-item
          style={{ '--reveal-index': 1 } as React.CSSProperties}
          className='flex flex-col gap-3 lg:pr-8'
        >
          <span className={EYEBROW}>Availability</span>
          <p className='text-body max-w-md text-sm leading-relaxed'>
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
          style={{ '--reveal-index': 2 } as React.CSSProperties}
          className='lg:border-border flex flex-col gap-3 lg:border-l lg:pl-8'
        >
          <span className={EYEBROW}>Experience</span>
          <p className='text-body max-w-md text-sm leading-relaxed text-pretty'>
            Nearly a decade of experience building on the web, shaped by the
            work and education that continue to guide how I build.
          </p>
        </div>
      </ScrollReveal>

      <ScrollReveal className='scroll-reveal'>
        <section aria-labelledby='what-i-do'>
          <h2 id='what-i-do' className='sr-only'>
            What I do
          </h2>
          <ul className='grid gap-4 md:grid-cols-3'>
            {WHAT_I_DO.map(({ area, title, description, tools }, index) => (
              <li
                key={area}
                data-reveal-item
                style={reveal(index)}
                className='group bg-card hover:border-line-strong flex flex-col gap-3 rounded-xl border p-7 transition-[border-color,translate] duration-500 ease-(--ease-out-soft) hover:-translate-y-0.5'
              >
                <span className='text-muted-foreground group-hover:text-primary-text text-xs transition-colors duration-300'>
                  {String(index + 1).padStart(2, '0')} / {area}
                </span>
                <h3 className='text-lg font-bold tracking-[-0.035em]'>
                  {title}
                </h3>
                <p className='text-body text-sm leading-[1.7]'>{description}</p>
                <p className='text-muted-foreground mt-auto pt-2 text-xs leading-[1.8]'>
                  {tools.join(' · ')}
                </p>
              </li>
            ))}
          </ul>
        </section>
      </ScrollReveal>

      <ScrollReveal className='scroll-reveal'>
        <section aria-labelledby='projects-heading'>
          <SelectedProjects />
          <div className='mt-6 flex justify-center'>
            <Button asChild variant='outline'>
              <Link href={LINKS.projects.url}>
                All projects
                <ArrowRightIcon className='group-hover/button:translate-x-0.75' />
              </Link>
            </Button>
          </div>
        </section>
      </ScrollReveal>

      <ScrollReveal className='scroll-reveal'>
        <section aria-labelledby='posts-heading'>
          <div className='mb-6 flex flex-wrap items-end justify-between gap-4'>
            <SectionHeading id='posts-heading' eyebrow='Writing'>
              Latest posts
            </SectionHeading>
            <Link
              href={LINKS.posts.url}
              className='nav-underline text-muted-foreground hover:text-foreground text-sm transition-colors'
            >
              all posts →
            </Link>
          </div>
          <LatestPosts />
        </section>
      </ScrollReveal>

      <ScrollReveal className='scroll-reveal'>
        <section aria-labelledby='experience-heading'>
          <SectionHeading
            id='experience-heading'
            eyebrow='Background'
            className='mb-7'
          >
            Experience
          </SectionHeading>
          <div className='grid items-start gap-4 lg:grid-cols-2'>
            <ExperienceCard
              title='Career'
              icon={<BriefcaseIcon />}
              index={0}
              entries={PERSONAL_DETAILS.career.map(
                ({
                  from,
                  to,
                  title,
                  company,
                  location,
                  description,
                  showDays,
                }) => ({
                  name: company,
                  role: `${title} · ${location}`,
                  description,
                  from: formatDate(from, showDays),
                  to: typeof to === 'string' ? to : formatDate(to, showDays),
                }),
              )}
            />
            <ExperienceCard
              title='Education'
              icon={<GraduationCapIcon />}
              index={1}
              entries={PERSONAL_DETAILS.education.map(
                ({ from, to, title, school, location, description }) => ({
                  name: school,
                  role: `${title} · ${location}`,
                  description,
                  from: formatDate(from),
                  to: typeof to === 'string' ? to : formatDate(to),
                }),
              )}
            />
          </div>
        </section>
      </ScrollReveal>

      <ScrollReveal className='scroll-reveal'>
        <section
          aria-labelledby='toolkit-heading'
          className='flex flex-col gap-7'
        >
          <SectionHeading id='toolkit-heading' eyebrow='Toolkit'>
            Things I work with.
          </SectionHeading>
          <div className='bg-card grid gap-x-6 gap-y-8 rounded-xl border p-7 sm:grid-cols-2 sm:p-8 lg:grid-cols-4'>
            {Object.entries(PERSONAL_DETAILS.skillsTechnologies).map(
              ([category, skills], index) => (
                <div
                  key={category}
                  data-reveal-item
                  style={{ '--reveal-index': index } as React.CSSProperties}
                  className='flex flex-col gap-2'
                >
                  <h3 className='text-sm font-bold capitalize'>{category}</h3>
                  <div className='flex flex-wrap gap-1.5'>
                    {skills.map(({ name, icon, description }) => (
                      // A tooltip in CSS alone, for devices that can hover; phones can't show one anyway
                      <span key={name} className='group/skill relative'>
                        <Badge
                          variant='outline'
                          className='bg-background text-body group-hover/skill:border-line-strong group-hover/skill:text-foreground h-7 cursor-help gap-1.5 rounded-lg px-2.5 text-xs font-normal transition-colors'
                        >
                          {icon}
                          {name}
                        </Badge>
                        <span
                          aria-hidden
                          className='bg-foreground text-background pointer-events-none absolute bottom-full left-1/2 z-20 mb-2.5 hidden w-max max-w-xs -translate-x-1/2 rounded-lg px-3 py-1.5 text-xs leading-snug [@media(hover:hover)]:group-hover/skill:block'
                        >
                          {description}
                          <span className='bg-foreground absolute top-full left-1/2 size-2.5 -translate-x-1/2 -translate-y-1/2 rotate-45 rounded-[2px]' />
                        </span>
                      </span>
                    ))}
                  </div>
                </div>
              ),
            )}
          </div>
        </section>
      </ScrollReveal>

      <ScrollReveal className='scroll-reveal'>
        <section
          aria-labelledby='contact-heading'
          className='bg-card relative isolate flex flex-col gap-8 overflow-hidden rounded-xl border p-8 sm:p-12 lg:flex-row lg:items-end lg:justify-between'
        >
          <div
            aria-hidden
            className='grid-backdrop absolute inset-0 -z-10 opacity-70'
          />
          <div className='max-w-xl'>
            <h2
              id='contact-heading'
              className='text-[32px] leading-tight font-bold tracking-[-0.05em]'
            >
              Have a project in mind?
            </h2>
            <p className='text-body mt-3 text-sm'>
              Whether you have a question, want to collaborate or just want to
              say hi, I&apos;d love to hear from you.
            </p>
          </div>
          <div className='flex flex-wrap gap-2.5'>
            <Button asChild size='lg'>
              <Link href={LINKS.contact.url}>
                Contact me
                <ArrowRightIcon className='group-hover/button:translate-x-0.75' />
              </Link>
            </Button>
            {PERSONAL_DETAILS.socials
              .filter(
                ({ platform }) =>
                  platform === 'GitHub' || platform === 'LinkedIn',
              )
              .map(({ platform, url }) => (
                <Button key={platform} asChild variant='outline' size='lg'>
                  <a href={url} target='_blank' rel='noopener noreferrer'>
                    {platform}
                  </a>
                </Button>
              ))}
          </div>
        </section>
      </ScrollReveal>
    </div>
  );
}

async function SelectedProjects() {
  const projects = await getPublishedProjects();

  const heading = (
    <SectionHeading id='projects-heading' eyebrow='Work'>
      Selected projects
    </SectionHeading>
  );

  if (projects.length === 0) {
    return (
      <>
        {heading}
        <p className='text-muted-foreground mt-4'>
          No projects yet. Check back later!
        </p>
      </>
    );
  }

  return (
    <FeaturedProjects
      projects={projects.map(toProjectCard)}
      heading={heading}
    />
  );
}

async function LatestPosts() {
  const posts = (await getPublishedPosts()).slice(0, 3);

  if (posts.length === 0) {
    return (
      <p className='text-muted-foreground'>No posts yet. Check back later!</p>
    );
  }

  return (
    <div className='flex flex-col gap-2'>
      {posts.map((post) => (
        <PostRow key={post.id} post={toPostRow(post)} />
      ))}
    </div>
  );
}

function ExperienceCard({
  title,
  icon,
  index,
  entries,
}: {
  title: string;
  icon: React.ReactNode;
  index: number;
  entries: {
    name: string;
    role: string;
    description: string;
    from: string;
    to: string;
  }[];
}) {
  return (
    <div
      data-reveal-item
      style={reveal(index)}
      className='bg-card rounded-xl border p-2'
    >
      <h3 className='[&_svg]:text-primary-text flex items-center gap-2.5 px-4.5 pt-4 pb-3 text-[17px] font-bold tracking-[-0.03em] [&_svg]:size-4.5'>
        {icon}
        {title}
      </h3>
      <ul>
        {entries.map(({ name, role, description, from, to }) => (
          <li
            key={`${name}-${role}`}
            className='hover:bg-muted/60 flex flex-col gap-1 rounded-lg px-4.5 py-4 transition-colors'
          >
            <div className='flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1'>
              <span className='text-base font-bold tracking-[-0.02em]'>
                {name}
              </span>
              <span className='text-muted-foreground text-xs'>
                {from} — {to}
              </span>
            </div>
            <span className='text-muted-foreground text-[13px]'>{role}</span>
            <p className='text-body mt-1 text-[13px] leading-[1.65]'>
              {description}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
