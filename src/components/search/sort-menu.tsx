'use client';

import {
  ArrowDownUpIcon,
  ChevronDownIcon,
  type LucideIcon,
} from 'lucide-react';

import { LazyMenu } from '@/components/common/lazy-menu';
import { Button } from '@/components/ui/button';

export interface SortOption<T extends string> {
  id: T;
  label: string;
  // Shown on the button, e.g. "Newest" for "Newest first"
  short: string;
  icon: LucideIcon;
}

export interface SortMenuProps<T extends string> {
  options: SortOption<T>[];
  value: T;
  onChange: (value: T) => void;
}

// The menu's button, the same before and after the menu has loaded. On phones only its icon shows, so the search
// field keeps most of the width.
export function SortTrigger({
  current,
  ...props
}: {
  current: { label: string; short: string };
} & React.ComponentProps<'button'>) {
  return (
    <Button
      variant='outline'
      className='h-12 shrink-0 gap-2.5 px-3.5 font-normal'
      aria-label={`Sort: ${current.label}`}
      {...props}
    >
      <ArrowDownUpIcon className='text-muted-foreground' />
      <span className='hidden sm:inline'>{current.short}</span>
      <ChevronDownIcon className='text-muted-foreground size-3.5' />
    </Button>
  );
}

const loadMenu = () =>
  import('@/components/search/sort-menu-loaded').then(
    (module) => module.default,
  );

// The sort button next to a search field. Its menu loads on first use (see LazyMenu).
export function SortMenu<T extends string>(props: SortMenuProps<T>) {
  const current =
    props.options.find((option) => option.id === props.value) ??
    props.options[0];

  return (
    <LazyMenu
      load={loadMenu as () => Promise<React.ComponentType<SortMenuProps<T>>>}
      props={props}
      trigger={<SortTrigger current={current} />}
    />
  );
}
