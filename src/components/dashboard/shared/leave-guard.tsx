'use client';

import { useCallback, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

import { discardImages } from '@/actions/upload';

const QUESTION = 'Leave without saving? Your changes will be lost.';

type Entries = [string, string][];

// What a form would send, to tell whether anything changed since it was loaded or saved
function entriesOf(form: HTMLFormElement): Entries {
  return [...new FormData(form).entries()].map(([key, value]) => [
    key,
    typeof value === 'string' ? value : value.name,
  ]);
}

// The pictures a form holds: its cover and, for projects, the JSON list of further pictures
function imagesIn(entries: Entries) {
  return entries.flatMap(([key, value]) => {
    if (key === 'coverUrl') return value ? [value] : [];
    if (key !== 'gallery') return [];
    try {
      return (JSON.parse(value) as { url: string }[]).map(({ url }) => url);
    } catch {
      return [];
    }
  });
}

/**
 * Asks before leaving a form with unsaved changes. Reloading, closing the tab or going to another site gets the
 * browser's own question. Links within the site don't unload the page, so the browser never asks for them: those
 * clicks are caught before Next.js handles them and ask with the browser's confirm box instead.
 *
 * Leaving anyway, by any way, throws the changes away: pictures uploaded since the last save are deleted, and
 * `onDiscard` puts the fields back, since Next keeps the page alive in the background and would show them again.
 *
 * @returns `markSaved` to call after saving, and `confirmLeave` to wrap the form's own Back button.
 */
export function useLeaveGuard(
  formRef: React.RefObject<HTMLFormElement | null>,
  onDiscard: () => void,
) {
  const router = useRouter();
  // Taken once per visit: coming back to a page kept in the background must still count earlier changes
  const saved = useRef<string | null>(null);
  const discardFields = useRef(onDiscard);
  useEffect(() => {
    discardFields.current = onDiscard;
  });
  // React lets go of the form's ref before the effects clean up when the page is hidden, so this keeps hold of it
  const lastForm = useRef<HTMLFormElement | null>(null);
  const currentForm = useCallback(
    () => formRef.current ?? lastForm.current,
    [formRef],
  );

  const isDirty = useCallback(() => {
    const form = currentForm();
    return (
      !!form &&
      saved.current !== null &&
      JSON.stringify(entriesOf(form)) !== saved.current
    );
  }, [currentForm]);

  const markSaved = useCallback(() => {
    const form = currentForm();
    if (form) saved.current = JSON.stringify(entriesOf(form));
  }, [currentForm]);

  // Pictures uploaded since the last save, which nothing will use once the changes are gone
  const unsavedImages = useCallback(() => {
    const form = currentForm();
    if (!form || saved.current === null) return [];
    const before = new Set(imagesIn(JSON.parse(saved.current) as Entries));
    return imagesIn(entriesOf(form)).filter((url) => !before.has(url));
  }, [currentForm]);

  const discard = useCallback(() => {
    const images = unsavedImages();
    if (images.length > 0) void discardImages(images).catch(() => {});
    // Taken again from the reset fields when the page shows next time
    saved.current = null;
    discardFields.current();
  }, [unsavedImages]);

  const confirmLeave = useCallback(
    (leave: () => void) => {
      if (!isDirty()) return leave();
      if (!window.confirm(QUESTION)) return;
      discard();
      leave();
    },
    [isDirty, discard],
  );

  useEffect(() => {
    lastForm.current = formRef.current;
    if (saved.current === null) markSaved();

    const onBeforeUnload = (event: BeforeUnloadEvent) => {
      if (isDirty()) event.preventDefault();
    };

    // The page is going away after the browser's question: a server action can't finish now, a beacon can
    const onPageHide = () => {
      if (!isDirty()) return;
      const images = unsavedImages();
      if (images.length > 0) {
        navigator.sendBeacon(
          '/api/uploads/discard',
          new Blob([JSON.stringify({ urls: images })], {
            type: 'application/json',
          }),
        );
      }
    };

    // Runs before React's own handlers, so a cancelled click never reaches Next's Link
    const onClick = (event: MouseEvent) => {
      if (
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      )
        return;
      const link = (event.target as Element | null)?.closest?.('a[href]');
      if (!(link instanceof HTMLAnchorElement)) return;
      if (link.target === '_blank' || link.hasAttribute('download')) return;

      const url = new URL(link.href);
      // Other sites unload the page, which beforeunload covers; a jump within this page leaves nothing
      if (url.origin !== location.origin) return;
      if (url.pathname === location.pathname && url.search === location.search)
        return;
      if (!isDirty()) return;

      event.preventDefault();
      event.stopPropagation();
      if (!window.confirm(QUESTION)) return;
      discard();
      // A programmatic navigation, so this listener doesn't ask a second time
      router.push(url.pathname + url.search + url.hash);
    };

    window.addEventListener('beforeunload', onBeforeUnload);
    window.addEventListener('pagehide', onPageHide);
    document.addEventListener('click', onClick, true);
    return () => {
      window.removeEventListener('beforeunload', onBeforeUnload);
      window.removeEventListener('pagehide', onPageHide);
      document.removeEventListener('click', onClick, true);
      // The form went out of view with changes nobody saved, e.g. through the browser's back button, which can't be
      // stopped to ask. Leaving always throws them away, so it does here too.
      if (isDirty()) discard();
    };
  }, [formRef, isDirty, markSaved, unsavedImages, discard, router]);

  return { markSaved, confirmLeave };
}
