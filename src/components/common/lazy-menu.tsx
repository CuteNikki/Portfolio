'use client';

import { cloneElement, useRef, useState } from 'react';

type Loaded<P> = React.ComponentType<P & { defaultOpen?: boolean }>;

// A dropdown that loads its menu code on first use. Until then it is only its trigger button, which looks the same,
// so pages don't download the menu library up front. Pointing at or focusing the button starts the download, and
// clicking it (or Enter, Space or the down arrow) opens the menu as soon as the code is there. From then on the full
// menu stays, with its own trigger.
export function LazyMenu<P extends object>({
  trigger,
  load,
  props,
}: {
  // The closed menu's button, looking exactly like the loaded menu's
  trigger: React.ReactElement<React.ComponentProps<'button'>>;
  load: () => Promise<Loaded<P>>;
  props: P;
}) {
  const [Menu, setMenu] = useState<Loaded<P> | null>(null);
  const loading = useRef<Promise<Loaded<P>> | null>(null);

  const preload = () => (loading.current ??= load());
  const open = () => {
    void preload().then((component) => setMenu(() => component));
  };

  if (Menu) return <Menu {...props} defaultOpen />;

  return cloneElement(trigger, {
    'aria-haspopup': 'menu',
    'aria-expanded': false,
    onPointerEnter: preload,
    onFocus: preload,
    onTouchStart: preload,
    onClick: open,
    onKeyDown: (event: React.KeyboardEvent<HTMLButtonElement>) => {
      if (event.key !== 'ArrowDown') return;
      event.preventDefault();
      open();
    },
  } as React.ComponentProps<'button'>);
}
