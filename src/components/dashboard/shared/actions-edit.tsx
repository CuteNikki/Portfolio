import { useRouter } from 'next/navigation';

import {
  ArrowLeftIcon,
  LoaderCircleIcon,
  SaveIcon,
  SendHorizonalIcon,
  Trash2Icon,
} from 'lucide-react';

import { Button } from '@/components/ui/button';

export type EditAction = 'save' | 'publish' | 'delete';

// Reads which button submitted the form. Pressing Enter in a field submits with the first submit button in the form:
// Update for a published entry, so it stays live, and Save Draft for a draft. Delete comes last, so Enter never deletes.
export function getEditAction(
  event: React.SubmitEvent<HTMLFormElement>,
): EditAction {
  const value = (event.submitter as HTMLButtonElement | null)?.value;
  return value === 'publish' || value === 'delete' ? value : 'save';
}

export function EditActionButtons({
  publishedAt,
  isPending,
  isMissingRequiredFields,
  action,
}: {
  publishedAt: Date | null;
  isPending: boolean;
  isMissingRequiredFields: boolean;
  action: EditAction;
}) {
  const router = useRouter();

  const saveButton = (
    <Button
      type='submit'
      value='save'
      variant='secondary'
      disabled={isPending || isMissingRequiredFields}
    >
      {isPending && action === 'save' ? (
        <LoaderCircleIcon className='animate-spin' />
      ) : (
        <SaveIcon />
      )}
      {publishedAt ? 'Revert to Draft' : 'Save Draft'}
    </Button>
  );

  const publishButton = (
    <Button
      type='submit'
      value='publish'
      disabled={isPending || isMissingRequiredFields}
      // Comes first in the markup when published (see getEditAction), but still shows last
      className={publishedAt ? 'order-last' : undefined}
    >
      {isPending && action === 'publish' ? (
        <LoaderCircleIcon className='animate-spin' />
      ) : (
        <SendHorizonalIcon />
      )}
      {publishedAt ? 'Update' : 'Publish'}
    </Button>
  );

  return (
    <div className='flex flex-col items-center gap-1 lg:flex-row-reverse lg:justify-between'>
      {/* Other Action Buttons */}
      <div className='flex flex-col-reverse items-center justify-end gap-1 sm:flex-row'>
        {/* Cancel Button */}
        <Button
          type='button'
          variant='ghost'
          onClick={() => router.back()}
          disabled={isPending}
        >
          <ArrowLeftIcon />
          Cancel
        </Button>

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
      </div>

      {/* Delete Button */}
      <Button
        type='submit'
        value='delete'
        variant='destructive'
        disabled={isPending}
      >
        {isPending && action === 'delete' ? (
          <LoaderCircleIcon className='animate-spin' />
        ) : (
          <Trash2Icon />
        )}
        Delete
      </Button>
    </div>
  );
}
