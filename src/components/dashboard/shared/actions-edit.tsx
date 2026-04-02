import { useRouter } from 'next/navigation';

import {
  ArrowLeftIcon,
  LoaderCircleIcon,
  SaveIcon,
  SendHorizonalIcon,
  Trash2Icon,
} from 'lucide-react';

import { Button } from '@/components/ui/button';

export function EditActionButtons({
  publishedAt,
  isPending,
  isMissingRequiredFields,
  action,
  setAction,
}: {
  publishedAt: Date | null;
  isPending: boolean;
  isMissingRequiredFields: boolean;
  action: 'save' | 'publish' | 'delete';
  setAction: React.Dispatch<
    React.SetStateAction<'save' | 'publish' | 'delete'>
  >;
}) {
  const router = useRouter();

  return (
    <div className='flex flex-col-reverse items-center gap-2 sm:flex-row sm:justify-between'>
      {/* Delete Button */}
      <Button
        type='submit'
        variant='destructive'
        onClick={() => setAction('delete')}
        disabled={isPending}
      >
        {isPending && action === 'delete' ? (
          <LoaderCircleIcon className='animate-spin' />
        ) : (
          <Trash2Icon />
        )}
        Delete
      </Button>

      {/* Other Action Buttons */}
      <div className='xs:flex-row flex flex-col items-center gap-2'>
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

        {/* Save Draft Button */}
        <Button
          type='submit'
          variant='secondary'
          onClick={() => setAction('save')}
          disabled={isPending || isMissingRequiredFields}
        >
          {isPending && action === 'save' ? (
            <LoaderCircleIcon className='animate-spin' />
          ) : (
            <SaveIcon />
          )}
          {publishedAt ? 'Revert to Draft' : 'Save Draft'}
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
          {publishedAt ? 'Update' : 'Publish'}
        </Button>
      </div>
    </div>
  );
}
