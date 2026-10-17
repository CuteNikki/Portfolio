'use client';

import { ExternalLinkIcon, LinkIcon } from 'lucide-react';

import { IMAGE_SIZES, imageUrl, type ImageSize } from '@/lib/images';
import { toast } from '@/lib/toast';

import {
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from '@/components/ui/dropdown-menu';

// Largest first, as people mostly want the full picture
const SIZES: { size: ImageSize; label: string }[] = [
  { size: 'large', label: 'Large' },
  { size: 'small', label: 'Small' },
  { size: 'thumb', label: 'Thumbnail' },
];

/**
 * The first items of a picture's right-click menu on the Media page: open any of its stored copies in a new tab, or
 * copy the large one's link.
 */
export function PictureMenuItems({ url }: { url: string }) {
  const copyLink = () =>
    navigator.clipboard
      .writeText(url)
      .then(() => toast.success('Link copied'))
      .catch(() => toast.error("The link couldn't be copied"));

  return (
    <>
      <DropdownMenuSub>
        <DropdownMenuSubTrigger>
          <ExternalLinkIcon />
          Open in new tab
        </DropdownMenuSubTrigger>
        {/* Up by its padding, so its first item lines up with the row that opened it */}
        <DropdownMenuSubContent alignOffset={-6} className='w-44'>
          {SIZES.map(({ size, label }) => (
            <DropdownMenuItem
              key={size}
              onSelect={() =>
                window.open(
                  imageUrl(url, size),
                  '_blank',
                  'noopener,noreferrer',
                )
              }
            >
              {label}
              <span className='text-muted-foreground ml-auto text-xs tabular-nums'>
                {IMAGE_SIZES[size]}px
              </span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuSubContent>
      </DropdownMenuSub>
      <DropdownMenuItem onSelect={copyLink}>
        <LinkIcon />
        Copy link
      </DropdownMenuItem>
    </>
  );
}
