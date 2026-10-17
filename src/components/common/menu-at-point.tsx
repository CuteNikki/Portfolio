// Not a client boundary of its own: only client components use these, and MenuAtPoint takes functions, which a server
// component couldn't pass
import { useEffect, useRef, useState } from 'react';

import { ExternalLinkIcon } from 'lucide-react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

type Point = { x: number; y: number };

// Right-clicks that keep the browser's own menu: with Shift held, in a field or a picker, on text someone selected (to
// copy it), or on anything matching `passThrough`, like a picture someone may want to save
function keepsBrowserMenu(event: MouseEvent, passThrough?: string) {
  const target = event.target as Element | null;
  return (
    event.shiftKey ||
    !!target?.closest('input, textarea, select, [role="combobox"]') ||
    (!!passThrough && !!target?.closest(passThrough)) ||
    !!window.getSelection()?.toString()
  );
}

/**
 * Our own right-click menu, opened where the pointer is (see MenuAtPoint). A second right-click while it's open gives
 * the browser's menu instead, and touch always does, since a long press is easy to set off while scrolling.
 */
export function useMenuAtPoint({
  enabled = true,
  passThrough,
}: { enabled?: boolean; passThrough?: string } = {}) {
  const [point, setPoint] = useState<Point | null>(null);
  const lastPointer = useRef('mouse');
  // Set when a right-click closed the menu; that click's contextmenu event then goes to the browser
  const closedByRightClick = useRef(false);

  const onPointerDown = (event: PointerEvent | React.PointerEvent) => {
    lastPointer.current = event.pointerType;
  };

  const onContextMenu = (event: MouseEvent | React.MouseEvent) => {
    const native = 'nativeEvent' in event ? event.nativeEvent : event;
    const pointerType = (native as PointerEvent).pointerType;
    if (closedByRightClick.current) {
      closedByRightClick.current = false;
      return;
    }
    if (!enabled || (pointerType || lastPointer.current) === 'touch') return;
    if (point || keepsBrowserMenu(native, passThrough)) {
      setPoint(null);
      return;
    }
    event.preventDefault();
    setPoint({ x: native.clientX, y: native.clientY });
  };

  const menuProps = {
    point,
    onClose: () => setPoint(null),
    onRightClickOutside: () => {
      closedByRightClick.current = true;
    },
  };

  return { onContextMenu, onPointerDown, menuProps };
}

/**
 * The menu a right-click opened, from an empty point at the cursor. Its items are DropdownMenuItems.
 */
export function MenuAtPoint({
  point,
  onClose,
  onRightClickOutside,
  children,
}: {
  point: Point | null;
  onClose: () => void;
  onRightClickOutside: () => void;
  children: React.ReactNode;
}) {
  // Closes once the page scrolls, as the browser's own menu does, rather than staying put while what it was opened on
  // moves away. Scrolling inside the menu itself, or the submenu, doesn't count.
  const close = useRef(onClose);
  useEffect(() => {
    close.current = onClose;
  });
  const open = point !== null;
  // Where the menu hangs from, kept after it closes so it fades out where it was rather than in the window's corner
  const [anchor, setAnchor] = useState<Point>(point ?? { x: 0, y: 0 });
  if (point && point !== anchor) setAnchor(point);
  useEffect(() => {
    if (!open) return;
    const scrolled = (event: Event) => {
      const target = event.target;
      if (
        target instanceof Element &&
        target.closest('[data-slot^="dropdown-menu"]')
      ) {
        return;
      }
      close.current();
    };
    addEventListener('scroll', scrolled, { capture: true, passive: true });
    addEventListener('resize', scrolled);
    return () => {
      removeEventListener('scroll', scrolled, { capture: true });
      removeEventListener('resize', scrolled);
    };
  }, [open]);

  return (
    <DropdownMenu
      open={open}
      onOpenChange={(open) => !open && onClose()}
      modal={false}
    >
      <DropdownMenuTrigger asChild>
        <span
          aria-hidden
          tabIndex={-1}
          className='pointer-events-none fixed size-0'
          style={{ left: anchor.x, top: anchor.y }}
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align='start'
        sideOffset={2}
        className='w-52'
        // The cursor is where the menu opened, so focus stays put rather than jumping back to the empty point
        onCloseAutoFocus={(event) => event.preventDefault()}
        onPointerDownOutside={(event) => {
          if (event.detail.originalEvent.button === 2) onRightClickOutside();
        }}
      >
        {children}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/**
 * Opens a page in a new tab, as the browser's own menu would on a link: the right-click menus replace that one, so they
 * offer it themselves.
 */
export function NewTabItem({ href }: { href: string }) {
  return (
    <DropdownMenuItem
      onSelect={() => window.open(href, '_blank', 'noopener,noreferrer')}
    >
      <ExternalLinkIcon />
      Open in new tab
    </DropdownMenuItem>
  );
}

/**
 * A right-click menu for the element this sits in, the closest match of `within` (a table row or list item unless
 * told otherwise), for parts of a page rendered elsewhere: a row's ⋯ menu, say, or a picture's card. Its children are
 * the menu's DropdownMenuItems.
 */
export function ContextMenuFor({
  within = 'tr, li',
  children,
}: {
  within?: string;
  children: React.ReactNode;
}) {
  const marker = useRef<HTMLSpanElement>(null);
  const { onContextMenu, onPointerDown, menuProps } = useMenuAtPoint();

  // The handlers change with the menu's state, so the listeners go through a ref to the latest ones
  const handlers = useRef({ onContextMenu, onPointerDown });
  useEffect(() => {
    handlers.current = { onContextMenu, onPointerDown };
  });
  useEffect(() => {
    const element = marker.current?.closest(within);
    if (!element) return;
    const contextMenu = (event: Event) =>
      handlers.current.onContextMenu(event as MouseEvent);
    const pointerDown = (event: Event) =>
      handlers.current.onPointerDown(event as PointerEvent);
    element.addEventListener('contextmenu', contextMenu);
    element.addEventListener('pointerdown', pointerDown);
    return () => {
      element.removeEventListener('contextmenu', contextMenu);
      element.removeEventListener('pointerdown', pointerDown);
    };
  }, [within]);

  return (
    <>
      <span ref={marker} hidden />
      <MenuAtPoint {...menuProps}>{children}</MenuAtPoint>
    </>
  );
}
