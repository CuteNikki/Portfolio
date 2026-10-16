'use client';

import { SendIcon } from 'lucide-react';
import { toast } from '@/lib/toast';

import { Button } from '@/components/ui/button';

// Copies the link to a post or project. Pass the slug-based path, so the copied link is the canonical one.
export function ShareButton({
  path,
  label,
  size = 'xs',
}: {
  path: string;
  label: 'Post' | 'Project';
  size?: 'xs' | 'default';
}) {
  return (
    <Button
      variant='outline'
      size={size}
      onClick={() =>
        navigator.clipboard
          .writeText(`${window.location.origin}${path}`)
          .then(() => {
            toast.success(`${label} URL copied to clipboard!`);
          })
          .catch((err) => {
            toast.error('Failed to copy URL: ' + err.message);
          })
      }
    >
      <SendIcon />
      Share
    </Button>
  );
}
