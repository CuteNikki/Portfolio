'use client';

import { useEffect } from 'react';
import { toast } from 'sonner';

// Used to trigger an error toast from server components when data fetching fails. The toast will be displayed on the client side when the component is rendered.
export function ErrorToast({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  useEffect(() => {
    toast.error(title, {
      description: description,
      duration: 10_000,
      icon: null,
    });
  }, [description, title]);

  return null;
}
