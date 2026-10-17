'use client';

import { useEffect, useRef } from 'react';

import { EllipsisIcon } from 'lucide-react';

import { MenuAtPoint, useMenuAtPoint } from '@/components/common/menu-at-point';
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
  const marker = useRef<HTMLSpanElement>(null);
  const { onContextMenu, onPointerDown, menuProps } = useMenuAtPoint();

  // The row isn't ours to render, so the right-click is picked up from it here. The handlers change with the menu's
  // state, so the listeners go through a ref to the latest ones.
  const handlers = useRef({ onContextMenu, onPointerDown });
  useEffect(() => {
    handlers.current = { onContextMenu, onPointerDown };
  });
  useEffect(() => {
    const row = marker.current?.closest('tr, li');
    if (!row) return;
    const contextMenu = (event: Event) =>
      handlers.current.onContextMenu(event as MouseEvent);
    const pointerDown = (event: Event) =>
      handlers.current.onPointerDown(event as PointerEvent);
    row.addEventListener('contextmenu', contextMenu);
    row.addEventListener('pointerdown', pointerDown);
    return () => {
      row.removeEventListener('contextmenu', contextMenu);
      row.removeEventListener('pointerdown', pointerDown);
    };
  }, []);

  return (
    <>
      <span ref={marker} hidden />
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
      <MenuAtPoint {...menuProps}>{children}</MenuAtPoint>
    </>
  );
}
