'use client';

import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { toast } from 'sonner';

import { Project } from '@/generated/prisma/browser';

import { deleteProject, updateProject } from '@/actions/project';

import { LINKS } from '@/constants/links';

import { MarkdownViewer } from '@/components/dashboard/posts/markdown';
import { EditActionButtons } from '@/components/dashboard/shared/actions-edit';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';

export function EditProjectForm({ project }: { project: Project }) {
  const [description, setDescription] = useState(project.description);
  const [action, setAction] = useState<'save' | 'publish' | 'delete'>('save');
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleSubmit = (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    formData.append('projectId', project.id);
    formData.append('isPublished', action === 'publish' ? 'true' : 'false');

    startTransition(async () => {
      try {
        if (action === 'delete') {
          if (
            !window.confirm(
              'Are you sure you want to delete this project? This cannot be undone.',
            )
          )
            return;
          await deleteProject(formData);
          toast.success('Project deleted successfully');
          router.push(LINKS.dashboardProjects.url);
          return;
        }

        await updateProject(formData);
        toast.success(
          action === 'publish'
            ? 'Project published successfully!'
            : 'Draft saved successfully!',
        );
        router.refresh();
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
            defaultValue={project.title}
            required
          />
        </div>

        <div className='flex flex-col gap-2'>
          <label htmlFor='slug' className='text-sm font-medium'>
            URL Slug
          </label>
          <Input
            id='slug'
            name='slug'
            placeholder='my-awesome-project'
            defaultValue={project.slug ?? undefined}
          />
        </div>
      </div>

      {/* Description Editor & Preview */}
      <div className='flex flex-col gap-2'>
        <label htmlFor='description' className='text-sm font-medium'>
          Description
        </label>
        <Tabs defaultValue='write' className='w-full'>
          <div className='mb-1 flex items-center justify-between'>
            <TabsList className='grid w-full max-w-50 grid-cols-2'>
              <TabsTrigger value='write'>Write</TabsTrigger>
              <TabsTrigger value='preview'>Preview</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value='write'>
            <Textarea
              id='description'
              name='description'
              placeholder='Write your project description here'
              className='min-h-100 resize-y'
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </TabsContent>

          <TabsContent value='preview'>
            <div className='prose catppuccin-macchiato:prose-invert dark:prose-invert border-input min-h-100 w-full max-w-none rounded-md border p-3 text-sm wrap-break-word'>
              {description ? (
                <MarkdownViewer content={description} />
              ) : (
                <p className='text-muted-foreground italic'>
                  Nothing to preview yet...
                </p>
              )}
            </div>
          </TabsContent>
        </Tabs>
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
            defaultValue={project.tags?.join(',')}
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
            defaultValue={project.technologies?.join(',')}
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
          defaultValue={project.repository ?? undefined}
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
          defaultValue={project.website ?? undefined}
        />
      </div>

      <EditActionButtons
        publishedAt={project.publishedAt}
        isPending={isPending}
        isMissingRequiredFields={!description.trim()}
        action={action}
        setAction={setAction}
      />
    </form>
  );
}
