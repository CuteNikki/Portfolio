import Link from 'next/link';

import { LanguagesIcon } from 'lucide-react';

import { cn } from '@/lib/utils';

import { Button } from '@/components/ui/button';

// The pieces the imprint and privacy pages share, in the site's look: the page header, a card per section and the
// tinted notes

export function LegalHeader({
  eyebrow,
  title,
  description,
  meta,
  switchHref,
  switchLabel,
}: {
  eyebrow: string;
  title: string;
  description: string;
  // E.g. when the text last changed
  meta?: string;
  // The same page in the other language
  switchHref: string;
  switchLabel: string;
}) {
  return (
    // In line with the text below it, which runs down the middle of the page (see ReadingColumns)
    <header className='relative isolate mx-auto flex w-full max-w-3xl flex-col gap-4 pt-6 pb-2 sm:pt-10'>
      <div
        aria-hidden
        className='grid-backdrop pointer-events-none absolute -top-16 left-1/2 -z-10 h-120 w-screen -translate-x-1/2 sm:-top-24'
      />
      <p className='animate-hero-in text-[13px] font-semibold tracking-[0.14em] text-primary-text uppercase'>
        {eyebrow}
      </p>
      <h1 className='animate-hero-in text-5xl leading-[1.04] font-bold tracking-[-0.06em] delay-1 sm:text-[64px]'>
        {title}
      </h1>
      <p className='animate-hero-in max-w-xl text-pretty text-body delay-2'>
        {description}
        {meta && (
          <span className='mt-1 block text-[13px] text-muted-foreground'>
            {meta}
          </span>
        )}
      </p>
      <div className='animate-hero-in pt-2 delay-3'>
        <Button asChild variant='outline'>
          <Link href={switchHref}>
            <LanguagesIcon />
            {switchLabel}
          </Link>
        </Button>
      </div>
    </header>
  );
}

export function LegalSection({
  id,
  icon,
  title,
  description,
  children,
}: {
  id?: string;
  icon: React.ReactNode;
  title: string;
  description?: string;
  children?: React.ReactNode;
}) {
  return (
    <section
      id={id}
      aria-labelledby={id ? `${id}-heading` : undefined}
      data-reveal=''
      className='scroll-mt-24 rounded-xl border bg-card p-5 sm:p-7'
    >
      <h2
        id={id ? `${id}-heading` : undefined}
        className='flex items-center gap-2.5 text-lg font-bold tracking-[-0.03em] [&_svg]:size-5 [&_svg]:text-primary-text'
      >
        {icon}
        {title}
      </h2>
      {description && (
        <p className='mt-2 text-sm leading-relaxed text-body'>{description}</p>
      )}
      {children && (
        <div className='mt-5 flex flex-col gap-4 text-sm leading-relaxed text-body'>
          {children}
        </div>
      )}
    </section>
  );
}

// A highlighted remark inside a section, or on its own at the top of a page
export function LegalNote({
  icon,
  className,
  children,
}: {
  icon?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        'flex gap-3 rounded-lg bg-primary-soft px-4 py-3 text-sm leading-relaxed text-foreground [&_svg]:mt-0.5 [&_svg]:size-4 [&_svg]:shrink-0 [&_svg]:text-primary-text',
        className
      )}
    >
      {icon}
      <div className='min-w-0'>{children}</div>
    </div>
  );
}

// A boxed group inside a section, e.g. an address or a list of collected data
export const LEGAL_BOX = 'bg-background/60 rounded-lg border p-4';
