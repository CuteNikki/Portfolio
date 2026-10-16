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

    // React marks the elements it has taken over. Changing one before that would show as a hydration mismatch, which
    // streamed parts of a page, such as a project's content, can still be at this point; those are tried again shortly.
    const hydrated = (element: Element) =>
      Object.keys(element).some((key) => key.startsWith('__reactFiber$'));
    let retry: ReturnType<typeof setTimeout> | undefined;
    // Gives up after about five seconds; whatever is left keeps the animation it started with
    let tries = 0;

    const hold = () => {
      let pending = false;
      for (const element of document.querySelectorAll<HTMLElement>(
        '[data-reveal=""]',
      )) {
        if (!hydrated(element)) {
          pending = true;
          continue;
        }
        const below = element.getBoundingClientRect().top > innerHeight;
        element.dataset.reveal = below ? 'waiting' : 'seen';
        if (below) reveal.observe(element);
      }
      clearTimeout(retry);
      if (pending && tries++ < 50) retry = setTimeout(hold, 100);
    };

    // Elements an earlier run held back still need watching: the effect can start again while they wait, e.g. when
    // React pauses it for a page kept in the background, or Fast Refresh replaces it. Without this they'd stay hidden.
    for (const element of document.querySelectorAll(
      '[data-reveal="waiting"]',
    )) {
      reveal.observe(element);
    }
    hold();
    const added = new MutationObserver(hold);
    added.observe(document.body, { childList: true, subtree: true });

    return () => {
      clearTimeout(retry);
      added.disconnect();
      reveal.disconnect();
    };
  }, []);

  return null;
}
