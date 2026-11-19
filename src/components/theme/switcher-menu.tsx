'use client';

import { useTheme } from 'next-themes';

import { themeById, THEMES } from '@/components/theme/themes';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// The theme menu itself, loaded on first use by ThemeSwitcher
export default function ThemeMenu({
  className,
  defaultOpen,
}: {
  className?: string;
  defaultOpen?: boolean;
}) {
  const { theme, setTheme } = useTheme();
  const current = themeById(theme);

  return (
    <DropdownMenu defaultOpen={defaultOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant='outline'
          size='icon'
          className={className}
          aria-label={`Theme: ${current.label}`}
        >
          <current.icon className='size-4.5' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='w-64'>
        <DropdownMenuLabel className='px-2.5 pt-1.5 pb-1 text-[11px] font-normal tracking-widest text-muted-foreground uppercase'>
          Theme
        </DropdownMenuLabel>
        <DropdownMenuRadioGroup value={current.id} onValueChange={setTheme}>
          {THEMES.map(({ id, label, icon: Icon }) => (
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
