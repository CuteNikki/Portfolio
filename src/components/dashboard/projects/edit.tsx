'use client';

import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { toast } from 'sonner';

import { Project } from '@/generated/prisma/browser';

import { deleteProject, updateProject } from '@/actions/project';

import { LINKS } from '@/constants/links';
import { formatShortDate } from '@/lib/utils';

import {
  type AuthorOption,
  AuthorsField,
} from '@/components/dashboard/shared/authors-field';
import {
  CoverField,
  type GalleryImage,
  GalleryField,
} from '@/components/dashboard/shared/image-fields';
import { ProjectDetailFields } from '@/components/dashboard/projects/detail-fields';
import {
  EditActionButtons,
  getEditAction,
  type EditAction,
} from '@/components/dashboard/shared/actions-edit';
import {
  Field,
  FormCard,
  FormColumns,
  MarkdownField,
} from '@/components/dashboard/shared/form-parts';
import { Input } from '@/components/ui/input';

export function EditProjectForm({
  project,
  gallery,
  authorOptions,
  authorIds,
}: {
  project: Project;
  // The project's further pictures, in order
  gallery: GalleryImage[];
  authorOptions: AuthorOption[];
  authorIds: string[];
}) {
  const [description, setDescription] = useState(project.description);
  const [action, setAction] = useState<EditAction>('save');
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleSubmit = (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    const intent = getEditAction(event);
    setAction(intent);
    const formData = new FormData(event.currentTarget);

    // The textarea is unmounted while the Preview tab is open, so take the value from state
    formData.set('description', description);

    formData.append('projectId', project.id);
    formData.append('isPublished', intent === 'publish' ? 'true' : 'false');

    startTransition(async () => {
      try {
        const { error } = await updateProject(formData);
        if (error) {
          toast.error('The project wasn’t saved', { description: error });
          return;
        }
        toast.success(
          intent === 'publish' ? 'Project published' : 'Draft saved',
        );
        router.refresh();
      } catch (error) {
        toast.error('Something went wrong', {
          description: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    });
  };

  const remove = () => {
    setAction('delete');
    startTransition(async () => {
      try {
        const formData = new FormData();
        formData.set('projectId', project.id);
        const { error } = await deleteProject(formData);
        if (error) {
          toast.error('The project wasn’t deleted', { description: error });
          return;
        }
        toast.success('Project deleted');
        router.push(LINKS.dashboardProjects.url);
      } catch (error) {
        toast.error('Something went wrong', {
          description: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <FormColumns
        main={
          <>
            <FormCard>
              <div className='grid gap-4 sm:grid-cols-2'>
                <Field label='Title' htmlFor='title'>
                  <Input
                    id='title'
                    name='title'
                    placeholder='My project'
                    defaultValue={project.title}
                    required
                  />
                </Field>
                <Field label='Slug' htmlFor='slug'>
                  <Input
                    id='slug'
                    name='slug'
                    placeholder='Leave empty to use the title'
                    defaultValue={project.slug ?? undefined}
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
              <GalleryField defaultValue={gallery} />
            </FormCard>

            <FormCard title='Details'>
              <ProjectDetailFields project={project} />
            </FormCard>
          </>
        }
        side={
          <>
            <FormCard
              title='Publish'
              description={
                project.publishedAt
                  ? `Live since ${formatShortDate(project.publishedAt)}`
                  : 'A draft, only visible here'
              }
              className='order-last xl:order-first'
            >
              <Field label='Date' htmlFor='date'>
                <Input
                  id='date'
                  name='date'
                  type='date'
                  defaultValue={project.createdAt.toISOString().slice(0, 10)}
                  required
                />
              </Field>
              <EditActionButtons
                kind='project'
                title={project.title}
                publishedAt={project.publishedAt}
                isPending={isPending}
                isMissingRequiredFields={!description.trim()}
                action={action}
                onDelete={remove}
              />
            </FormCard>

            <FormCard>
              <AuthorsField options={authorOptions} defaultValue={authorIds} />
              <CoverField defaultValue={project.coverUrl} />
            </FormCard>
          </>
        }
      />
    </form>
  );
}
