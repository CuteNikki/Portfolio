'use client';

import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { toast } from 'sonner';

import { createPost } from '@/actions/post';

import { LINKS } from '@/constants/links';

import { MarkdownViewer } from '@/components/dashboard/posts/markdown';
import { NewActionButtons } from '@/components/dashboard/shared/actions-new';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';

export function NewPostForm() {
  const [content, setContent] = useState('');
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
        const post = await createPost(formData);

        toast.success(
          submitAction === 'publish'
            ? 'Post published successfully!'
            : 'Draft saved successfully!',
        );
        router.push(LINKS.dashboardPostEditWithId(post.id).url);
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
            placeholder='Why I switched to Linux...'
            required
          />
        </div>

        <div className='flex flex-col gap-2'>
          <label htmlFor='slug' className='text-sm font-medium'>
            URL Slug
          </label>
          <Input id='slug' name='slug' placeholder='why-i-switched-to-linux' />
        </div>
      </div>

      {/* The Editor */}
      <Tabs defaultValue='write' className='w-full'>
        <TabsList className='mb-1 grid w-full max-w-50 grid-cols-2'>
          <TabsTrigger value='write'>Write</TabsTrigger>
          <TabsTrigger value='preview'>Preview</TabsTrigger>
        </TabsList>

        <TabsContent value='write'>
          <Textarea
            name='content'
            placeholder='Write your post content here using Markdown...'
            className='min-h-100 resize-y font-mono'
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </TabsContent>

        <TabsContent value='preview'>
          <div className='prose catppuccin-macchiato:prose-invert dark:prose-invert min-h-100 w-full max-w-none border p-2 text-sm wrap-break-word'>
            {content ? (
              <MarkdownViewer content={content} />
            ) : (
              <p className='text-muted-foreground italic'>
                Nothing to preview yet...
              </p>
            )}
          </div>
        </TabsContent>
      </Tabs>

      <NewActionButtons
        isPending={isPending}
        isMissingRequiredFields={!content.trim()}
        action={submitAction}
        setAction={setSubmitAction}
      />
    </form>
  );
}
