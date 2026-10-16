'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import {
  EllipsisIcon,
  ExternalLinkIcon,
  LinkIcon,
  PencilLineIcon,
  Trash2Icon,
} from 'lucide-react';
import { toast } from 'sonner';

import { deletePost } from '@/actions/post';
import { deleteProject } from '@/actions/project';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// The edit button and ⋯ menu at the end of a post's or project's row in the dashboard
export function ContentActions({
  kind,
  id,
  title,
  editHref,
  publicHref,
  isPublished,
}: {
  kind: 'post' | 'project';
  id: string;
  title: string;
  editHref: string;
  publicHref: string;
  isPublished: boolean;
}) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [pending, startTransition] = useTransition();

  const copyLink = () =>
    navigator.clipboard
      .writeText(`${window.location.origin}${publicHref}`)
      .then(() => toast.success('Link copied'))
      .catch(() => toast.error('The link couldn’t be copied'));

  const remove = () =>
    startTransition(async () => {
      try {
        const formData = new FormData();
        formData.set(kind === 'post' ? 'postId' : 'projectId', id);
        await (kind === 'post'
          ? deletePost(formData)
          : deleteProject(formData));
        toast.success(kind === 'post' ? 'Post deleted' : 'Project deleted');
        router.refresh();
      } catch {
        toast.error(`The ${kind} couldn’t be deleted. Please try again.`);
      } finally {
        setConfirming(false);
      }
    });

  return (
    <div className='flex justify-end gap-1'>
      <Button
        asChild
        variant='ghost'
        size='icon-sm'
        aria-label={`Edit ${title}`}
      >
        <Link href={editHref}>
          <PencilLineIcon />
        </Link>
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant='ghost'
            size='icon-sm'
            aria-label={`More actions for ${title}`}
          >
            <EllipsisIcon />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end' className='w-52'>
          <DropdownMenuItem asChild>
            <Link href={editHref}>
              <PencilLineIcon />
              Edit
            </Link>
          </DropdownMenuItem>
          {isPublished && (
            <>
              <DropdownMenuItem asChild>
                <Link href={publicHref}>
                  <ExternalLinkIcon />
                  View on site
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={copyLink}>
                <LinkIcon />
                Copy link
              </DropdownMenuItem>
            </>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem
            variant='destructive'
            onSelect={() => setConfirming(true)}
          >
            <Trash2Icon />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={confirming} onOpenChange={setConfirming}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete “{title}”?</AlertDialogTitle>
            <AlertDialogDescription>
              {kind === 'post'
                ? 'The post, its cover and its comments are deleted. This can’t be undone.'
                : 'The project and its pictures are deleted. This can’t be undone.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant='destructive'
              onClick={remove}
              disabled={pending}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
