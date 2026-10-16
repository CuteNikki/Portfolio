import {
  ArrowLeftIcon,
  LoaderCircleIcon,
  SaveIcon,
  SendHorizonalIcon,
} from 'lucide-react';

import { Button } from '@/components/ui/button';

// The buttons of the Publish card on a new post or project, stacked with the main one on top. Save draft comes first
// in the markup, so pressing Enter in a field saves a draft rather than publishing.
export function NewActionButtons({
  isPending,
  isMissingRequiredFields,
  action,
  setAction,
  onBack,
}: {
  isPending: boolean;
  isMissingRequiredFields: boolean;
  action: 'draft' | 'publish';
  setAction: React.Dispatch<React.SetStateAction<'draft' | 'publish'>>;
  // Asks first when there are unsaved changes
  onBack: (back: () => void) => void;
}) {
  return (
    <div className='flex flex-col gap-2'>
      <Button
        type='submit'
        variant='outline'
        onClick={() => setAction('draft')}
        disabled={isPending || isMissingRequiredFields}
      >
        {isPending && action === 'draft' ? (
          <LoaderCircleIcon className='animate-spin' />
        ) : (
          <SaveIcon />
        )}
        Save draft
      </Button>

      <Button
        type='submit'
        onClick={() => setAction('publish')}
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
