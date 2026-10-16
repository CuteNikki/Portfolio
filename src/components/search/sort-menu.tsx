'use client';

import {
  ArrowDownUpIcon,
  ChevronDownIcon,
  type LucideIcon,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export interface SortOption<T extends string> {
  id: T;
  label: string;
  // Shown on the button, e.g. "Newest" for "Newest first"
  short: string;
  icon: LucideIcon;
}

// The sort button next to a search field. On phones only its icon shows, so the field keeps most of the width.
export function SortMenu<T extends string>({
  options,
  value,
  onChange,
}: {
  options: SortOption<T>[];
  value: T;
  onChange: (value: T) => void;
}) {
  const current = options.find((option) => option.id === value) ?? options[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant='outline'
          className='h-12 shrink-0 gap-2.5 px-3.5 font-normal'
          aria-label={`Sort: ${current.label}`}
        >
          <ArrowDownUpIcon className='text-muted-foreground' />
          <span className='hidden sm:inline'>{current.short}</span>
          <ChevronDownIcon className='text-muted-foreground size-3.5' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='w-56'>
        <DropdownMenuLabel className='text-muted-foreground px-2.5 pt-1.5 pb-1 text-[11px] font-normal tracking-widest uppercase'>
          Sort by
        </DropdownMenuLabel>
        <DropdownMenuRadioGroup
          value={current.id}
          onValueChange={(id) => onChange(id as T)}
        >
          {options.map(({ id, label, icon: Icon }) => (
            <DropdownMenuRadioItem key={id} value={id}>
              <Icon className='text-muted-foreground' />
              {label}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
