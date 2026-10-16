import type { ExternalToast } from 'sonner';

// Toasts through sonner, which loads after the page is up instead of with every page's first scripts. Toasts shown
// before the toaster has mounted wait for it, since sonner drops the ones nobody is listening for yet.

let markReady: () => void = () => {};
const ready = new Promise<void>((resolve) => {
  markReady = resolve;
});

/** Called by the toaster once it listens for toasts. */
export function toasterMounted() {
  markReady();
}

type Message = Parameters<typeof import('sonner').toast.success>[0];

const show =
  (kind: 'success' | 'error' | 'warning') =>
  (message: Message, options?: ExternalToast) => {
    void ready
      .then(() => import('sonner'))
      .then(({ toast }) => toast[kind](message, options));
  };

export const toast = {
  success: show('success'),
  error: show('error'),
  warning: show('warning'),
};
