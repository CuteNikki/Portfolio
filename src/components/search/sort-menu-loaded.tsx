'use client';

import { SortTrigger, type SortMenuProps } from '@/components/search/sort-menu';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// The sort menu itself, loaded on first use by SortMenu
export default function SortMenuLoaded<T extends string>({
  options,
  value,
  onChange,
  defaultOpen,
}: SortMenuProps<T> & { defaultOpen?: boolean }) {
  const current = options.find((option) => option.id === value) ?? options[0];

  return (
    <DropdownMenu defaultOpen={defaultOpen}>
      <DropdownMenuTrigger asChild>
        <SortTrigger current={current} />
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
