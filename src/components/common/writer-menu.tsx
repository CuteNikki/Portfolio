'use client';

import { useTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import {
  EyeOffIcon,
  LinkIcon,
  PencilLineIcon,
  SendHorizonalIcon,
} from 'lucide-react';

import { useCanWrite } from '@/lib/can-write';
import { toast } from '@/lib/toast';

import { LINKS } from '@/constants/links';

import { setPostPublished } from '@/actions/post';
import { setProjectPublished } from '@/actions/project';

import {
  MenuAtPoint,
  NewTabItem,
  useMenuAtPoint,
} from '@/components/common/menu-at-point';
import {
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';

/**
 * For writers and admins, a menu of their own where a post or project is right-clicked on the public pages: open it in
 * a new tab, copy its link, edit it, or publish or unpublish it. Everyone else keeps the browser's menu. Wraps its
 * children without a box of its own, so the layout around them stays as it is.
 */
export function WriterMenu({
  kind,
  id,
  title,
  href,
  isDraft,
  passThrough,
  children,
}: {
  kind: 'post' | 'project';
  id: string;
  title: string;
  // Its public page
  href: string;
  isDraft: boolean;
  // Parts that keep the browser's menu, e.g. "a[href], img" on a post's own page
  passThrough?: string;
  children: React.ReactNode;
}) {
  const canWrite = useCanWrite();
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const { onContextMenu, onPointerDown, menuProps } = useMenuAtPoint({
    enabled: canWrite,
    passThrough,
  });

  const editHref =
    kind === 'post'
      ? LINKS.dashboardPostEditWithId(id).url
      : LINKS.dashboardProjectEditWithId(id).url;
  const noun = kind === 'post' ? 'Post' : 'Project';

  const copyLink = () =>
    navigator.clipboard
      .writeText(`${window.location.origin}${href}`)
      .then(() => toast.success('Link copied'))
      .catch(() => toast.error("The link couldn't be copied"));

  const togglePublished = () =>
    startTransition(async () => {
      const publish = isDraft;
      try {
        const { error } = await (kind === 'post'
          ? setPostPublished(id, publish)
          : setProjectPublished(id, publish));
        if (error) {
          toast.error(
            `"${title}" couldn't be ${publish ? 'published' : 'unpublished'}`,
            { description: error },
          );
          return;
        }
        toast.success(`${noun} ${publish ? 'published' : 'back to a draft'}`);
        router.refresh();
      } catch {
        toast.error('Something went wrong. Please try again.');
      }
    });

  return (
    <>
      <div
        className='contents'
        onContextMenu={onContextMenu}
        onPointerDown={onPointerDown}
      >
        {children}
      </div>
      {canWrite && (
        <MenuAtPoint {...menuProps}>
          {/* Its page, then changing it, as in the dashboard's menus */}
          <NewTabItem href={href} />
          <DropdownMenuItem onSelect={copyLink}>
            <LinkIcon />
            Copy link
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href={editHref}>
              <PencilLineIcon />
              Edit
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem disabled={pending} onSelect={togglePublished}>
            {isDraft ? <SendHorizonalIcon /> : <EyeOffIcon />}
            {isDraft ? 'Publish' : 'Unpublish'}
          </DropdownMenuItem>
        </MenuAtPoint>
      )}
    </>
  );
}
