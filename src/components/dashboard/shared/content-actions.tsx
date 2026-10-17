'use client';

import { useRef, useState, useTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import {
  EllipsisIcon,
  ExternalLinkIcon,
  EyeOffIcon,
  LinkIcon,
  PencilLineIcon,
  SendHorizonalIcon,
  Trash2Icon,
} from 'lucide-react';
import { fadeOutRow, flashRow } from '@/lib/row-motion';
import { toast } from '@/lib/toast';

import { deletePost, setPostPublished } from '@/actions/post';
import { deleteProject, setProjectPublished } from '@/actions/project';

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
  const actions = useRef<HTMLDivElement>(null);
  const [confirming, setConfirming] = useState(false);
  const [pending, startTransition] = useTransition();

  const copyLink = () =>
    navigator.clipboard
      .writeText(`${window.location.origin}${publicHref}`)
      .then(() => toast.success('Link copied'))
      .catch(() => toast.error("The link couldn't be copied"));

  // Publishes a draft or takes a published entry back to a draft
  const togglePublished = () =>
    startTransition(async () => {
      const publish = !isPublished;
      try {
        const { error } = await (kind === 'post'
          ? setPostPublished(id, publish)
          : setProjectPublished(id, publish));
        if (error) {
          toast.error(
            `The ${kind} couldn't be ${publish ? 'published' : 'unpublished'}`,
            { description: error },
          );
          return;
        }
        toast.success(
          `${kind === 'post' ? 'Post' : 'Project'} ${publish ? 'published' : 'back to a draft'}`,
        );
        flashRow(actions.current);
        router.refresh();
      } catch {
        toast.error('Something went wrong. Please try again.');
      }
    });

  const remove = () =>
    startTransition(async () => {
      try {
        const formData = new FormData();
        formData.set(kind === 'post' ? 'postId' : 'projectId', id);
        const { error } = await (kind === 'post'
          ? deletePost(formData)
          : deleteProject(formData));
        if (error) {
          toast.error(`The ${kind} couldn't be deleted`, {
            description: error,
          });
          return;
        }
        setConfirming(false);
        toast.success(kind === 'post' ? 'Post deleted' : 'Project deleted');
        await fadeOutRow(actions.current);
        router.refresh();
      } catch {
        toast.error(`The ${kind} couldn't be deleted. Please try again.`);
      } finally {
        setConfirming(false);
      }
    });

  return (
    <div ref={actions} className='flex justify-end gap-1'>
      {/* On phones the ⋯ menu's Edit does this, which leaves the title more room */}
      <Button
        asChild
        variant='ghost'
        size='icon-sm'
        aria-label={`Edit ${title}`}
        className='hidden sm:inline-flex'
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
          <DropdownMenuItem disabled={pending} onSelect={togglePublished}>
            {isPublished ? <EyeOffIcon /> : <SendHorizonalIcon />}
            {isPublished ? 'Unpublish' : 'Publish'}
          </DropdownMenuItem>
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
            <AlertDialogTitle>Delete "{title}"?</AlertDialogTitle>
            <AlertDialogDescription>
              {kind === 'post'
                ? "The post, its cover and its comments are deleted. This can't be undone."
                : "The project and its pictures are deleted. This can't be undone."}
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
