import { clsx, type ClassValue } from 'clsx';
import { RefObject, useEffect, useState } from 'react';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function useIndicatorPosition(navRef: RefObject<HTMLElement | null>, pathname: string, mounted: boolean) {
  const [style, setStyle] = useState({ left: 0, width: 0 });

  useEffect(() => {
    if (!mounted) return;
    if (typeof window === 'undefined') return;

    const nav = navRef.current;
    if (!nav) return;

    function update() {
      if (!nav) return;
      const activeLink = nav.querySelector('a[data-active="true"]') as HTMLElement | null;
      if (activeLink) {
        setStyle({ left: activeLink.offsetLeft, width: activeLink.offsetWidth });
      } else {
        setStyle({ left: 0, width: 0 });
      }
    }

    update();

    window.addEventListener('resize', update);

    return () => {
      window.removeEventListener('resize', update);
    };
  }, [pathname, navRef, mounted]);

  return style;
}
