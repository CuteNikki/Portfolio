'use client';

import { SendIcon } from 'lucide-react';

import { LINKS } from '@/constants/links';

import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export function ShareButton({ postId }: { postId: string }) {
  return (
    <Button
      variant='outline'
      size='xs'
      onClick={() =>
        navigator.clipboard
          .writeText(
            `${window.location.origin}${LINKS.postWithSlugOrId(postId).url}`,
          )
          .then(() => {
            toast.success('Post URL copied to clipboard!');
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
