import { useState } from 'react';
import { useRouter } from 'next/navigation';

import {
  ArrowLeftIcon,
  LoaderCircleIcon,
  SaveIcon,
  SendHorizonalIcon,
  Trash2Icon,
} from 'lucide-react';

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

// What submitting a post or project form does: save it (as a draft, or unpublished) or publish it
export type SubmitIntent = 'save' | 'publish';
export type EditAction = SubmitIntent | 'delete';

// Reads which button submitted the form, new or edit. Pressing Enter in a field submits with the first submit button in
// the form: Update for a published entry, so it stays live, and Save draft otherwise. Delete isn't a submit button, so
// Enter never deletes.
export function getEditAction(
  event: React.SubmitEvent<HTMLFormElement>,
): SubmitIntent {
  const value = (event.submitter as HTMLButtonElement | null)?.value;
  return value === 'publish' ? 'publish' : 'save';
}

// The buttons of the Publish card on an edit page, stacked with the main one on top
export function EditActionButtons({
  kind,
  title,
  publishedAt,
  isPending,
  isMissingRequiredFields,
  action,
  onDelete,
  onBack,
}: {
  kind: 'post' | 'project';
  title: string;
  publishedAt: Date | null;
  isPending: boolean;
  isMissingRequiredFields: boolean;
  action: EditAction;
  onDelete: () => void;
  // Asks first when there are unsaved changes
  onBack: (back: () => void) => void;
}) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);

  const spinnerOr = (intent: EditAction, icon: React.ReactNode) =>
    isPending && action === intent ? (
      <LoaderCircleIcon className='animate-spin' />
    ) : (
      icon
    );

  const saveButton = (
    <Button
      type='submit'
      value='save'
      variant='outline'
      disabled={isPending || isMissingRequiredFields}
    >
      {spinnerOr('save', <SaveIcon />)}
      {publishedAt ? 'Unpublish' : 'Save draft'}
    </Button>
  );

  const publishButton = (
    <Button
      type='submit'
      value='publish'
      disabled={isPending || isMissingRequiredFields}
      // Comes after Save draft in the markup for a draft (see getEditAction), but still shows on top
      className={publishedAt ? undefined : 'order-first'}
    >
      {spinnerOr('publish', <SendHorizonalIcon />)}
      {publishedAt ? 'Update' : 'Publish'}
    </Button>
  );

  return (
    <div className='flex flex-col gap-2'>
      {publishedAt ? (
        <>
          {publishButton}
          {saveButton}
        </>
      ) : (
        <>
          {saveButton}
          {publishButton}
        </>
      )}

      <div className='grid grid-cols-2 gap-2'>
        <Button
          type='button'
          variant='ghost'
          onClick={() => onBack(() => router.back())}
          disabled={isPending}
        >
          <ArrowLeftIcon />
          Back
        </Button>
        <Button
          type='button'
          variant='destructive'
          onClick={() => setConfirming(true)}
          disabled={isPending}
        >
          {spinnerOr('delete', <Trash2Icon />)}
          Delete
        </Button>
      </div>

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
            <AlertDialogAction variant='destructive' onClick={onDelete}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
