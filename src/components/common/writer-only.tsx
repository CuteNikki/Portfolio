import { Suspense } from 'react';

import { isWriter } from '@/lib/auth';

// Renders its children only for admins and writers. It reads the session, so it
// streams in after the prerendered page instead of making the page dynamic.
export function WriterOnly({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={null}>
      <WriterGate>{children}</WriterGate>
    </Suspense>
  );
}

async function WriterGate({ children }: { children: React.ReactNode }) {
  return (await isWriter()) ? children : null;
}
