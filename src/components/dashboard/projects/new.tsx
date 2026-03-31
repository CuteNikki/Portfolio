'use client';

import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { toast } from 'sonner';

import { createProject } from '@/actions/project';

import { LINKS } from '@/constants/links';

import { NewActionButtons } from '@/components/dashboard/shared/actions-new';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

export function NewProjectForm() {
  const [description, setDescription] = useState('');
  const [isPending, startTransition] = useTransition();

  const router = useRouter();

  const [submitAction, setSubmitAction] = useState<'draft' | 'publish'>(
    'draft',
  );

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    formData.append(
      'isPublished',
      submitAction === 'publish' ? 'true' : 'false',
    );

    startTransition(async () => {
      try {
        const project = await createProject(formData);

        toast.success(
          submitAction === 'publish'
            ? 'Project published successfully!'
            : 'Draft saved successfully!',
        );
        router.push(LINKS.dashboardProjectEditWithId(project.id).url);
      } catch (error) {
        toast.error('Something went wrong', {
          description: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className='flex flex-col gap-6'>
      {/* Title & Slug */}
      <div className='grid gap-4 sm:grid-cols-2'>
        <div className='flex flex-col gap-2'>
          <label htmlFor='title' className='text-sm font-medium'>
            Title
          </label>
          <Input
            id='title'
            name='title'
            placeholder='My Awesome Project...'
            required
          />
        </div>

        <div className='flex flex-col gap-2'>
          <label htmlFor='slug' className='text-sm font-medium'>
            URL Slug
          </label>
          <Input id='slug' name='slug' placeholder='my-awesome-project' />
        </div>
      </div>

      {/* Description */}
      <div className='flex flex-col gap-2'>
        <label htmlFor='description' className='text-sm font-medium'>
          Description
        </label>
        <Textarea
          id='description'
          name='description'
          placeholder='Write your project description here'
          className='min-h-20 resize-y'
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </div>

      {/* Tags & Technologies */}
      <div className='grid gap-4 sm:grid-cols-2'>
        <div className='flex flex-col gap-2'>
          <label htmlFor='tags' className='text-sm font-medium'>
            Tags
          </label>
          <Input
            id='tags'
            name='tags'
            placeholder='Add tags separated by commas'
          />
        </div>
        <div className='flex flex-col gap-2'>
          <label htmlFor='technologies' className='text-sm font-medium'>
            Technologies
          </label>
          <Input
            id='technologies'
            name='technologies'
            placeholder='Add technologies separated by commas'
          />
        </div>
      </div>

      {/* Repository URL */}
      <div className='flex flex-col gap-2'>
        <label htmlFor='repository' className='text-sm font-medium'>
          Repository URL
        </label>
        <Input
          id='repository'
          name='repository'
          placeholder='https://github.com/username/repository'
        />
      </div>

      {/* Website URL */}
      <div className='flex flex-col gap-2'>
        <label htmlFor='website' className='text-sm font-medium'>
          Website URL
        </label>
        <Input
          id='website'
          name='website'
          placeholder='https://my-awesome-project.com'
        />
      </div>

      <NewActionButtons
        isPending={isPending}
        isMissingRequiredFields={!description.trim()}
        action={submitAction}
        setAction={setSubmitAction}
      />
    </form>
  );
}
