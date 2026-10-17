'use client';

import { useSyncExternalStore } from 'react';

// Whether whoever has the page open writes for the site, for the browser's side of public pages. Those pages are cached
// the same for everyone, so the navbar's account menu, which gets the session from the server, passes it on here. Only
// a convenience for menus: everything they do is checked again on the server.
let canWrite = false;
const listeners = new Set<() => void>();

export function setCanWrite(value: boolean) {
  if (canWrite === value) return;
  canWrite = value;
  listeners.forEach((listener) => listener());
}

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

export function useCanWrite() {
  return useSyncExternalStore(
    subscribe,
    () => canWrite,
    () => false,
  );
}
