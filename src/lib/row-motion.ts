// Short feedback on a dashboard row after something was done to it from its menu, so the change is easy to spot in a
// long list: the row a button sits in lights up, or fades away before the refreshed list leaves it out. Rows come from
// the server, so these animate the element itself rather than React state. With reduced motion they do nothing.

const reducedMotion = () =>
  matchMedia('(prefers-reduced-motion: reduce)').matches;

// The table row or list item an element, like a row's ⋯ button, sits in
const rowOf = (element: Element | null) =>
  element?.closest<HTMLElement>('tr, li') ?? null;

/**
 * Lights the row up in the accent colour, fading back over a second: after publishing it, say.
 */
export function flashRow(element: Element | null) {
  const row = rowOf(element);
  if (!row || reducedMotion()) return;
  row.animate(
    [
      {
        backgroundColor: 'color-mix(in oklab, var(--primary) 18%, transparent)',
      },
      { backgroundColor: 'transparent' },
    ],
    { duration: 1200, easing: 'ease-out' },
  );
}

/**
 * Fades the row out, for one that's about to leave the list; resolves once it's gone from view.
 */
export async function fadeOutRow(element: Element | null) {
  const row = rowOf(element);
  if (!row || reducedMotion()) return;
  await row.animate(
    [
      { opacity: 1, transform: 'none' },
      { opacity: 0, transform: 'translateX(8px)' },
    ],
    { duration: 220, easing: 'ease-in', fill: 'forwards' },
  ).finished;
}
