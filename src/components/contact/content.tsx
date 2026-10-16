import Link from 'next/link';

import { MailIcon } from 'lucide-react';

import { PERSONAL_DETAILS } from '@/constants/personal';

import { ScrollReveal } from '@/components/common/scroll-reveal';
import { ContactForm } from '@/components/contact/contact-form';
import { DiscordMenu } from '@/components/navigation/discord-menu';

// The contact page: how to reach me, rendered on the server with the social links and their icons, and the form,
// which is the only part that runs in the browser
export function ContactContent() {
  return (
    <ScrollReveal className='scroll-reveal w-full max-w-6xl'>
      <section className='w-full'>
        <div className='grid lg:grid-cols-[0.8fr_1.2fr]'>
          <div
            data-reveal-item
            style={{ '--reveal-index': 0 } as React.CSSProperties}
            className='flex flex-col gap-4 border-b p-4 sm:p-8 lg:border-r lg:border-b-0 lg:p-10'
          >
            <p className='text-primary-text flex items-center gap-2 text-sm font-semibold tracking-widest uppercase'>
              <MailIcon className='size-4' /> Contact
            </p>
            <h1 className='text-4xl tracking-tight sm:text-5xl'>
              Let&apos;s talk.
            </h1>
            <p className='text-muted-foreground max-w-sm leading-relaxed text-balance'>
              Have a question, an idea, or a project in mind? Send a note and
              I&apos;ll get back to you soon.
            </p>
            <div
              data-reveal-item
              style={{ '--reveal-index': 1 } as React.CSSProperties}
              className='mt-auto flex flex-col gap-4 border-t-0 pt-6 text-sm lg:border-t'
            >
              <div className='flex flex-col gap-2'>
                <span className='text-muted-foreground'>
                  Prefer other methods?
                </span>
                <a
                  className='hover:text-primary-text font-medium transition-colors'
                  href={PERSONAL_DETAILS.emailLink}
                >
                  {PERSONAL_DETAILS.email}
                </a>
              </div>
              <div className='flex flex-wrap items-center gap-x-4 gap-y-2'>
                {PERSONAL_DETAILS.socials
                  .filter(
                    ({ platform }) =>
                      platform !== 'Mail' && platform !== 'Discord',
                  )
                  .map(({ platform, icon: Icon, url }) => (
                    <Link
                      key={platform}
                      href={url}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='text-muted-foreground hover:text-primary-text flex items-center gap-2 transition-colors'
                    >
                      <Icon className='size-4 shrink-0' />
                      {platform}
                    </Link>
                  ))}
                <DiscordMenu />
              </div>
            </div>
          </div>
          <ContactForm />
        </div>
      </section>
    </ScrollReveal>
  );
}
