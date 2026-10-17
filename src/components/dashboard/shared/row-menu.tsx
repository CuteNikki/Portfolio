'use client';

import { EllipsisIcon } from 'lucide-react';

import { ContextMenuFor } from '@/components/common/menu-at-point';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

/**
 * A table row's actions: the ⋯ button at its end, and the same menu where the row is right-clicked, which also works
 * while the ⋯ is scrolled out of view.
 */
export function RowMenu({
  label,
  children,
}: {
  // For the ⋯ button, e.g. "More actions for Hello World"
  label: string;
  // The menu's items, the same in both menus
  children: React.ReactNode;
}) {
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant='ghost' size='icon-sm' aria-label={label}>
            <EllipsisIcon />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end' className='w-52'>
          {children}
        </DropdownMenuContent>
      </DropdownMenu>
      <ContextMenuFor>{children}</ContextMenuFor>
    </>
  );
}
