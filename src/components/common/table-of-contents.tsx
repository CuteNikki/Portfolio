'use client';

import { useEffect, useState } from 'react';

import { ArrowUpIcon } from 'lucide-react';

import { cn } from '@/lib/utils';

export interface TocItem {
  id: string;
  text: string;
  // Third level headings sit a little further in
  level?: 2 | 3;
}

// Headings jump to 80px below the top (scroll-mt-20), just under the navbar; a section counts as being read once its
// heading has passed this line
const READING_LINE = 100;

// Beside a post, project or legal page: its sections on a line, the one being read marked in violet. Only the colour
// and the line change, so nothing gets wider or wraps differently as you scroll.
export function TableOfContents({
  items,
  label = 'On this page',
  className,
}: {
  items: TocItem[];
  label?: string;
  className?: string;
}) {
  const [reading, setReading] = useState<string | null>(null);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      // At the very bottom, the last one, even if it's too short to reach the line
      const atBottom =
        innerHeight + scrollY >= document.documentElement.scrollHeight - 2;
      // The heading closest above the line, whatever order the list is in
      let current: string | null = null;
      let closest = -Infinity;
      for (const { id } of items) {
        const top = document.getElementById(id)?.getBoundingClientRect().top;
        if (top !== undefined && top <= READING_LINE && top > closest) {
          closest = top;
          current = id;
        }
      }
      setReading(
        atBottom
          ? (items.at(-1)?.id ?? null)
          : (current ?? items[0]?.id ?? null),
      );
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    addEventListener('scroll', schedule, { passive: true });
    addEventListener('resize', schedule);
    return () => {
      cancelAnimationFrame(frame);
      removeEventListener('scroll', schedule);
      removeEventListener('resize', schedule);
    };
  }, [items]);

  return (
    <nav aria-label={label} className={cn('text-[13px]', className)}>
      <h2 className='text-primary-text mb-3.5 text-[11px] font-semibold tracking-[0.14em] uppercase'>
        {label}
      </h2>
      <ol className='border-border border-l'>
        {items.map(({ id, text, level }) => (
          <li key={id}>
            <a
              href={`#${id}`}
              aria-current={reading === id ? 'location' : undefined}
              className={cn(
                '-ml-px block border-l-2 py-1.5 pr-2 leading-snug transition-colors',
                level === 3 ? 'pl-6' : 'pl-3.5',
                reading === id
                  ? 'border-primary text-foreground'
                  : 'text-muted-foreground hover:text-foreground border-transparent',
              )}
            >
              {text}
            </a>
          </li>
        ))}
      </ol>
      <a
        href='#top'
        className='text-muted-foreground hover:text-foreground mt-5 inline-flex items-center gap-1.5 transition-colors'
      >
        <ArrowUpIcon className='size-3.5' />
        Back to top
      </a>
    </nav>
  );
}
