'use client';

import { useRouter } from 'next/navigation';
import { useLayoutEffect, useRef, useState, useTransition } from 'react';
import { toast } from '@/lib/toast';

import { createProject } from '@/actions/project';

import type { AuthorEntry } from '@/lib/authors';
import { LINKS } from '@/constants/links';

import {
  type AuthorOption,
  AuthorsField,
} from '@/components/dashboard/shared/authors-field';
import {
  CoverField,
  GalleryField,
} from '@/components/dashboard/shared/image-fields';
import { ProjectDetailFields } from '@/components/dashboard/projects/detail-fields';
import {
  ALL_TONES,
  ToneField,
} from '@/components/dashboard/projects/tone-field';
import {
  getEditAction,
  type SubmitIntent,
} from '@/components/dashboard/shared/actions-edit';
import { NewActionButtons } from '@/components/dashboard/shared/actions-new';
import { useLeaveGuard } from '@/components/dashboard/shared/leave-guard';
import {
  Field,
  FormCard,
  FormColumns,
  MarkdownField,
} from '@/components/dashboard/shared/form-parts';
import { Input } from '@/components/ui/input';

export function NewProjectForm({
  authorOptions,
  authors,
}: {
  authorOptions: AuthorOption[];
  // Starts with whoever writes it
  authors: AuthorEntry[];
}) {
  const [description, setDescription] = useState('');
  const [isPending, startTransition] = useTransition();
  // Stays set once saved: the transition ends before the edit page has loaded, and a second click would save a copy
  const [isSaved, setIsSaved] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  // Changes after a save or when leaving without saving, so the fields start over with their defaults: authors,
  // cover and pictures included
  const [resetKey, setResetKey] = useState(0);
  const { confirmLeave } = useLeaveGuard(formRef, () => {
    setDescription('');
    setResetKey((key) => key + 1);
  });

  // Next keeps this page alive in the background and restores its state when coming back. After a save, start with an
  // empty, enabled form next time instead of the saved entry.
  useLayoutEffect(() => {
    if (!isSaved) return;

    const form = formRef.current;
    return () => {
      setIsSaved(false);
      setResetKey((key) => key + 1);
      setDescription('');
      form?.reset();
    };
  }, [isSaved]);

  const router = useRouter();

  const [action, setAction] = useState<SubmitIntent>('save');

  const handleSubmit = (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    const intent = getEditAction(event);
    setAction(intent);
    const formData = new FormData(event.currentTarget);
    formData.append('isPublished', intent === 'publish' ? 'true' : 'false');

    startTransition(async () => {
      try {
        const created = await createProject(formData);
        if (created.error || !created.id) {
          toast.error('The project wasn’t saved', {
            description: created.error ?? 'Please try again.',
          });
          return;
        }

        toast.success(
          intent === 'publish' ? 'Project published' : 'Draft saved',
        );
        setIsSaved(true);
        router.push(LINKS.dashboardProjectEditWithId(created.id).url);
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
        key={resetKey}
        main={
          <>
            <FormCard>
              <div className='grid gap-4 sm:grid-cols-2'>
                <Field label='Title' htmlFor='title'>
                  <Input
                    id='title'
                    name='title'
                    placeholder='My project'
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
              id='description'
              label='Description'
              placeholder='Describe the project in Markdown'
              value={description}
              onChange={setDescription}
            />

            <FormCard>
              <GalleryField defaultValue={[]} />
            </FormCard>

            <FormCard title='Details'>
              <ProjectDetailFields />
            </FormCard>
          </>
        }
        side={
          <>
            <FormCard
              title='Publish'
              description='Save a draft first or publish right away'
              className='order-last xl:order-first'
            >
              <Field
                label='Date'
                htmlFor='date'
                hint='Leave empty to use today’s date.'
              >
                <Input id='date' name='date' type='date' />
              </Field>
              <NewActionButtons
                isPending={isPending || isSaved}
                isMissingRequiredFields={!description.trim()}
                action={action}
                onBack={confirmLeave}
              />
            </FormCard>

            <FormCard>
              <AuthorsField options={authorOptions} defaultValue={authors} />
              <CoverField defaultValue={null} />
              <CoverField defaultValue={null} kind='dark' />
              {/* Until there's a cover to match, Auto has no one colour to show */}
              <ToneField defaultValue={null} autoTone={ALL_TONES} />
            </FormCard>
          </>
        }
      />
    </form>
  );
}
