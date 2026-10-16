'use client';

import dynamic from 'next/dynamic';

// The toaster loads once the page is up: no page shows a toast before someone does something
const LoadedToaster = dynamic(() => import('@/providers/toaster'), {
  ssr: false,
});

export function ToastProvider() {
  return <LoadedToaster />;
}
