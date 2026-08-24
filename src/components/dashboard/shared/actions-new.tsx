import {
  ArrowLeftIcon,
  LoaderCircleIcon,
  SaveIcon,
  SendHorizonalIcon,
} from 'lucide-react';

import { Button } from '@/components/ui/button';

export function NewActionButtons({
  isPending,
  isMissingRequiredFields,
  action,
  setAction,
}: {
  isPending: boolean;
  isMissingRequiredFields: boolean;
  action: 'draft' | 'publish';
  setAction: React.Dispatch<React.SetStateAction<'draft' | 'publish'>>;
}) {
  return (
    <div className='flex flex-col-reverse items-center justify-end gap-1 sm:flex-row'>
      {/* Cancel Button */}
      <Button
        type='button'
        variant='ghost'
        onClick={() => window.history.back()}
        disabled={isPending}
      >
        <ArrowLeftIcon />
        Cancel
      </Button>

      {/* Save Draft Button */}
      <Button
        type='submit'
        variant='secondary'
        onClick={() => setAction('draft')}
        disabled={isPending || isMissingRequiredFields}
      >
        {isPending && action === 'draft' ? (
          <LoaderCircleIcon className='animate-spin' />
        ) : (
          <SaveIcon />
        )}
        Save Draft
      </Button>

      {/* Publish Button */}
      <Button
        type='submit'
        onClick={() => setAction('publish')}
        disabled={isPending || isMissingRequiredFields}
      >
        {isPending && action === 'publish' ? (
          <LoaderCircleIcon className='animate-spin' />
        ) : (
          <SendHorizonalIcon />
        )}
        Publish
      </Button>
    </div>
  );
}
