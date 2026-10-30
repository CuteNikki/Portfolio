'use client';

import { useEffect } from 'react';

const GLOWING = '.edge-glow, .card-lift';

// Tells the card under the mouse where it is, as --mx and --my from its top left corner, for the light along its
// border (see .edge-glow in globals.css) and the brighter grid in the contact card. One listener for the whole page, at
// most once a frame. Rendered once in the layout; touch screens skip it and keep the light at the top centre.
export function PointerGlow() {
  useEffect(() => {
    if (!matchMedia('(hover: hover) and (pointer: fine)').matches) return;

    let frame = 0;
    let x = 0;
    let y = 0;
    let target: Element | null = null;

    const update = () => {
      frame = 0;
      const card = target?.closest<HTMLElement>(GLOWING);
      if (!card) return;
      const box = card.getBoundingClientRect();
      card.style.setProperty('--mx', `${x - box.left}px`);
      card.style.setProperty('--my', `${y - box.top}px`);
    };

    const move = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return;
      x = event.clientX;
      y = event.clientY;
      target = event.target as Element;
      frame ||= requestAnimationFrame(update);
    };
    addEventListener('pointermove', move, { passive: true });

    return () => {
      removeEventListener('pointermove', move);
      cancelAnimationFrame(frame);
    };
  }, []);

  return null;
}
