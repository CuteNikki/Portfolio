'use client';

import { useEffect } from 'react';

// Holds back the page's data-reveal sections, cards and rows that start below the fold, and lets each rise in when it
// scrolls into view (see [data-reveal] in globals.css). Ones on screen keep the animation they start with as the page
// loads, so nothing visible ever waits for this script. Rendered once in the layout; it also picks up elements that
// appear later, such as cards after a search or a page Next shows without reloading.
export function RevealOnScroll() {
  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const reveal = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          (entry.target as HTMLElement).dataset.reveal = 'shown';
          reveal.unobserve(entry.target);
        }
      },
      { rootMargin: '0px 0px -8% 0px' },
    );

    const hold = () => {
      for (const element of document.querySelectorAll<HTMLElement>(
        '[data-reveal=""]',
      )) {
        const below = element.getBoundingClientRect().top > innerHeight;
        element.dataset.reveal = below ? 'waiting' : 'seen';
        if (below) reveal.observe(element);
      }
    };

    hold();
    const added = new MutationObserver(hold);
    added.observe(document.body, { childList: true, subtree: true });

    return () => {
      added.disconnect();
      reveal.disconnect();
    };
  }, []);

  return null;
}
