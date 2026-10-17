'use client';

import { useEffect } from 'react';

// Something counts as in view once a tenth of it shows above the bottom 8% of the window, or a third of the window's
// height for something taller than that. The observer below watches the same part of the window, at small enough steps
// that it reports the moment that's true, also for something many times taller than the window.
const BOTTOM_MARGIN = 0.08;
const AMOUNT = 0.1;
const THRESHOLDS = [0, 0.01, 0.02, 0.03, 0.05, 0.075, 0.1, 0.2, 0.5, 1];

function isEnough(shown: number, height: number, visibleHeight: number) {
  return (
    height > 0 &&
    shown > 0 &&
    // A pixel's leeway, as the observer rounds what it measures
    shown >= Math.min(height * AMOUNT, visibleHeight / 3) - 1
  );
}

function inView(element: Element) {
  const { top, bottom, height } = element.getBoundingClientRect();
  const visibleBottom = innerHeight * (1 - BOTTOM_MARGIN);
  const shown = Math.min(bottom, visibleBottom) - Math.max(top, 0);
  return isEnough(shown, height, visibleBottom);
}

// Holds back the page's data-reveal headings, cards and rows that aren't in view as the page loads, and lets each rise
// in once it scrolls into view (see [data-reveal] in globals.css). Ones in view keep the animation they start with as
// the page loads, so nothing visible ever waits for this script. Ones that come into view together rise in one after
// another, top to bottom and left to right. Rendered once in the layout; it also picks up elements that appear later,
// such as cards after a search or a page Next shows without reloading.
export function RevealOnScroll() {
  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const show = (elements: HTMLElement[]) =>
      elements
        .map((element) => ({ element, box: element.getBoundingClientRect() }))
        .sort((a, b) => a.box.top - b.box.top || a.box.left - b.box.left)
        .forEach(({ element }, order) => {
          element.style.setProperty(
            '--reveal-order',
            String(Math.min(order, 6)),
          );
          element.dataset.reveal = 'shown';
          reveal.unobserve(element);
        });

    const reveal = new IntersectionObserver(
      // Judged by what the observer measured, so a report is never turned down by a measurement of its own that rounds
      // the other way
      (entries) =>
        show(
          entries
            .filter(
              ({ target, intersectionRect, boundingClientRect, rootBounds }) =>
                (target as HTMLElement).dataset.reveal === 'waiting' &&
                isEnough(
                  intersectionRect.height,
                  boundingClientRect.height,
                  rootBounds?.height ?? innerHeight,
                ),
            )
            .map(({ target }) => target as HTMLElement),
        ),
      {
        threshold: THRESHOLDS,
        rootMargin: `0px 0px -${BOTTOM_MARGIN * 100}% 0px`,
      },
    );

    // At the end of the page, something low down may never get far enough up to count as in view, so whatever shows
    // in the window then comes in anyway
    const atEnd = () => {
      if (innerHeight + scrollY < document.documentElement.scrollHeight - 2) {
        return;
      }
      show(
        [
          ...document.querySelectorAll<HTMLElement>('[data-reveal="waiting"]'),
        ].filter((element) => {
          const { top, bottom } = element.getBoundingClientRect();
          return top < innerHeight && bottom > 0;
        }),
      );
    };
    addEventListener('scroll', atEnd, { passive: true });

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
        // One that holds others only groups them
        if (element.querySelector('[data-reveal]')) continue;
        if (!hydrated(element)) {
          pending = true;
          continue;
        }
        const waiting = !inView(element);
        element.dataset.reveal = waiting ? 'waiting' : 'seen';
        if (waiting) reveal.observe(element);
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
      removeEventListener('scroll', atEnd);
      added.disconnect();
      reveal.disconnect();
    };
  }, []);

  return null;
}
