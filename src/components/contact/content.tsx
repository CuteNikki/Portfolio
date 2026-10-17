import Link from 'next/link';

import { ArrowUpRightIcon } from 'lucide-react';

import { PERSONAL_DETAILS } from '@/constants/personal';

import { PageHeader } from '@/components/common/page-header';
import { ContactForm } from '@/components/contact/contact-form';
import { DiscordMenu } from '@/components/navigation/discord-menu';

// The contact page: the form, and the other ways to reach me beside it. Rendered on the server with the social links
// and their icons; only the form runs in the browser.
export function ContactContent() {
  const socials = PERSONAL_DETAILS.socials.filter(
    ({ platform }) => platform !== 'Mail' && platform !== 'Discord',
  );

  return (
    <div className='flex w-full flex-col gap-10'>
      <PageHeader
        eyebrow='Contact'
        title="Let's talk."
        description="Have a question, an idea or a project in mind? Send a note and I'll get back to you soon."
      />

      <div className='grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start'>
        <section
          aria-labelledby='contact-form-heading'
          data-reveal=''
          className='bg-card rounded-xl border p-5 sm:p-8'
        >
          <h2 id='contact-form-heading' className='mb-6 text-[15px] font-bold'>
            Send a message
          </h2>
          <ContactForm />
        </section>

        <aside
          aria-labelledby='contact-other-heading'
          data-reveal=''
          style={{ '--reveal-index': 1 } as React.CSSProperties}
          className='bg-card flex flex-col gap-5 rounded-xl border p-5 sm:p-6'
        >
          <div>
            <h2 id='contact-other-heading' className='text-[15px] font-bold'>
              Other ways
            </h2>
            <p className='text-muted-foreground mt-1 text-xs'>
              Rather write directly? Reach me here.
            </p>
          </div>
          <a
            href={PERSONAL_DETAILS.emailLink}
            className='hover:text-primary-text text-sm font-semibold break-all transition-colors'
          >
            {PERSONAL_DETAILS.email}
          </a>
          <ul className='flex flex-col gap-3 border-t pt-5 text-sm'>
            {socials.map(({ platform, icon: Icon, url }) => (
              <li key={platform}>
                <Link
                  href={url}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='group text-muted-foreground hover:text-primary-text flex items-center gap-2 transition-colors'
                >
                  <Icon className='size-4 shrink-0' />
                  {platform}
                  <ArrowUpRightIcon
                    aria-hidden
                    className='ml-auto size-3.5 opacity-60 transition-opacity group-hover:opacity-100'
                  />
                </Link>
              </li>
            ))}
            <li>
              <DiscordMenu />
            </li>
          </ul>
        </aside>
      </div>
    </div>
  );
}
