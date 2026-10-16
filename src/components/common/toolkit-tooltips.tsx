'use client';

import { useEffect } from 'react';

// Space kept between a tooltip and the window's edge
const MARGIN = 12;

// Keeps the home page's CSS tooltips ([data-tip]) inside the window: when one shows, it's measured and, if it would
// reach past an edge, moved back by setting --tip-shift on it. Renders nothing.
export function ToolkitTooltips() {
  useEffect(() => {
    const place = (event: PointerEvent) => {
      const tip = (event.target as Element | null)
        ?.closest('.group\\/skill')
        ?.querySelector<HTMLElement>('[data-tip]');
      if (!tip) return;

      tip.style.setProperty('--tip-shift', '0px');
      // Shown by :hover by now, so it can be measured
      const { left, right } = tip.getBoundingClientRect();
      const shift =
        left < MARGIN
          ? MARGIN - left
          : right > innerWidth - MARGIN
            ? innerWidth - MARGIN - right
            : 0;
      tip.style.setProperty('--tip-shift', `${Math.round(shift)}px`);
    };

    document.addEventListener('pointerover', place);
    return () => document.removeEventListener('pointerover', place);
  }, []);

  return null;
}
