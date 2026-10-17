import {
  ArrowLeftIcon,
  LoaderCircleIcon,
  SaveIcon,
  SendHorizonalIcon,
} from 'lucide-react';

import type { SubmitIntent } from '@/components/dashboard/shared/actions-edit';
import { Button } from '@/components/ui/button';

// The buttons of the Publish card on a new post or project, stacked with the main one on top. Save draft comes first
// in the markup, so pressing Enter in a field saves a draft rather than publishing (see getEditAction).
export function NewActionButtons({
  isPending,
  isMissingRequiredFields,
  action,
  onBack,
}: {
  isPending: boolean;
  isMissingRequiredFields: boolean;
  // The button that was pressed, which shows a spinner while it saves
  action: SubmitIntent;
  // Asks first when there are unsaved changes
  onBack: (back: () => void) => void;
}) {
  return (
    <div className='flex flex-col gap-2'>
      <Button
        type='submit'
        value='save'
        variant='outline'
        disabled={isPending || isMissingRequiredFields}
      >
        {isPending && action === 'save' ? (
          <LoaderCircleIcon className='animate-spin' />
        ) : (
          <SaveIcon />
        )}
        Save draft
      </Button>

      <Button
        type='submit'
        value='publish'
        disabled={isPending || isMissingRequiredFields}
        className='order-first'
      >
        {isPending && action === 'publish' ? (
          <LoaderCircleIcon className='animate-spin' />
        ) : (
          <SendHorizonalIcon />
        )}
        Publish
      </Button>

      <Button
        type='button'
        variant='ghost'
        onClick={() => onBack(() => window.history.back())}
        disabled={isPending}
      >
        <ArrowLeftIcon />
        Back
      </Button>
    </div>
  );
}
