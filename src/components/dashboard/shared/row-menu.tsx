'use client';

import { useEffect, useRef, useState } from 'react';

import { EllipsisIcon, ExternalLinkIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// Right-clicks that should keep the browser's own menu: in a field or a picker, on text someone selected (to copy it),
// or with Shift held
function keepsBrowserMenu(event: MouseEvent) {
  const target = event.target as Element | null;
  return (
    event.shiftKey ||
    !!target?.closest('input, textarea, select, [role="combobox"]') ||
    !!window.getSelection()?.toString()
  );
}

/**
 * A table row's actions: the ⋯ button at its end, and the same menu where the row is right-clicked, which also works
 * while the ⋯ is scrolled out of view. Both start with Open in new tab for the row's page, which the right-click menu
 * needs in place of the browser's own. Touch keeps the ⋯ only, since a long press is easy to set off while scrolling.
 */
export function RowMenu({
  label,
  newTabHref,
  children,
}: {
  // For the ⋯ button, e.g. "More actions for Hello World"
  label: string;
  newTabHref?: string;
  // The menu's items, the same in both menus
  children: React.ReactNode;
}) {
  const anchor = useRef<HTMLSpanElement>(null);
  const items = (
    <>
      {newTabHref && (
        <>
          <DropdownMenuItem
            onSelect={() =>
              window.open(newTabHref, '_blank', 'noopener,noreferrer')
            }
          >
            <ExternalLinkIcon />
            Open in new tab
          </DropdownMenuItem>
          <DropdownMenuSeparator />
        </>
      )}
      {children}
    </>
  );
  const [point, setPoint] = useState<{ x: number; y: number } | null>(null);
  const lastPointer = useRef<string>('mouse');

  useEffect(() => {
    const row = anchor.current?.closest('tr, li');
    if (!row) return;

    const pointerDown = (event: Event) => {
      lastPointer.current = (event as PointerEvent).pointerType;
    };
    const contextMenu = (event: Event) => {
      const mouse = event as MouseEvent;
      const pointerType = (event as PointerEvent).pointerType;
      if ((pointerType || lastPointer.current) === 'touch') return;
      if (keepsBrowserMenu(mouse)) return;
      mouse.preventDefault();
      setPoint({ x: mouse.clientX, y: mouse.clientY });
    };

    row.addEventListener('pointerdown', pointerDown);
    row.addEventListener('contextmenu', contextMenu);
    return () => {
      row.removeEventListener('pointerdown', pointerDown);
      row.removeEventListener('contextmenu', contextMenu);
    };
  }, []);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant='ghost' size='icon-sm' aria-label={label}>
            <EllipsisIcon />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end' className='w-52'>
          {items}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* The right-click menu opens from an empty point at the cursor */}
      <DropdownMenu
        open={point !== null}
        onOpenChange={(open) => !open && setPoint(null)}
        modal={false}
      >
        <DropdownMenuTrigger asChild>
          <span
            ref={anchor}
            aria-hidden
            tabIndex={-1}
            className='pointer-events-none fixed size-0'
            style={{ left: point?.x ?? 0, top: point?.y ?? 0 }}
          />
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align='start'
          sideOffset={2}
          className='w-52'
          // The cursor is where the menu opened, so focus stays put rather than jumping to the first item
          onCloseAutoFocus={(event) => event.preventDefault()}
        >
          {items}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
