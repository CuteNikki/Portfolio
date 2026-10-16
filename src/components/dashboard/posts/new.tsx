'use client';

import { useRouter } from 'next/navigation';
import { useLayoutEffect, useRef, useState, useTransition } from 'react';
import { toast } from 'sonner';

import { createPost } from '@/actions/post';

import { LINKS } from '@/constants/links';

import {
  type AuthorOption,
  AuthorsField,
} from '@/components/dashboard/shared/authors-field';
import { CoverField } from '@/components/dashboard/shared/image-fields';
import { NewActionButtons } from '@/components/dashboard/shared/actions-new';
import {
  Field,
  FormCard,
  FormColumns,
  MarkdownField,
} from '@/components/dashboard/shared/form-parts';
import { Input } from '@/components/ui/input';

export function NewPostForm({
  authorOptions,
  authorIds,
}: {
  authorOptions: AuthorOption[];
  // Starts with whoever writes it
  authorIds: string[];
}) {
  const [content, setContent] = useState('');
  const [isPending, startTransition] = useTransition();
  // Stays set once saved: the transition ends before the edit page has loaded, and a second click would save a copy
  const [isSaved, setIsSaved] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  // Next keeps this page alive in the background and restores its state when coming back. After a save, start with an
  // empty, enabled form next time instead of the saved entry.
  useLayoutEffect(() => {
    if (!isSaved) return;

    const form = formRef.current;
    return () => {
      setIsSaved(false);
      setContent('');
      form?.reset();
    };
  }, [isSaved]);

  const router = useRouter();

  const [submitAction, setSubmitAction] = useState<'draft' | 'publish'>(
    'draft',
  );

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    // The textarea is unmounted while the Preview tab is open, so take the value from state
    formData.set('content', content);

    formData.append(
      'isPublished',
      submitAction === 'publish' ? 'true' : 'false',
    );

    startTransition(async () => {
      try {
        const created = await createPost(formData);
        if (created.error || !created.id) {
          toast.error('The post wasn’t saved', {
            description: created.error ?? 'Please try again.',
          });
          return;
        }

        toast.success(
          submitAction === 'publish' ? 'Post published' : 'Draft saved',
        );
        setIsSaved(true);
        router.push(LINKS.dashboardPostEditWithId(created.id).url);
      } catch (error) {
        toast.error('Something went wrong', {
          description: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    });
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit}>
      <FormColumns
        main={
          <>
            <FormCard>
              <div className='grid gap-4 sm:grid-cols-2'>
                <Field label='Title' htmlFor='title'>
                  <Input
                    id='title'
                    name='title'
                    placeholder='Why I switched to Linux'
                    required
                  />
                </Field>
                <Field label='Slug' htmlFor='slug'>
                  <Input
                    id='slug'
                    name='slug'
                    placeholder='Leave empty to use the title'
                  />
                </Field>
              </div>
            </FormCard>

            <MarkdownField
              id='content'
              label='Content'
              placeholder='Write your post in Markdown'
              value={content}
              onChange={setContent}
            />
          </>
        }
        side={
          <>
            <FormCard
              title='Publish'
              description='Save a draft first or publish right away'
              className='order-last xl:order-first'
            >
              <NewActionButtons
                isPending={isPending || isSaved}
                isMissingRequiredFields={!content.trim()}
                action={submitAction}
                setAction={setSubmitAction}
              />
            </FormCard>

            <FormCard>
              <AuthorsField options={authorOptions} defaultValue={authorIds} />
              <CoverField defaultValue={null} />
            </FormCard>
          </>
        }
      />
    </form>
  );
}
