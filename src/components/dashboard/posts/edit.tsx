'use client';

import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { toast } from 'sonner';

import type { Post } from '@/generated/prisma/client';

import { deletePost, updatePost } from '@/actions/post';
import { LINKS } from '@/constants/links';

import { MarkdownViewer } from '@/components/dashboard/posts/markdown';
import { EditActionButtons } from '@/components/dashboard/shared/actions-edit';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';

export function EditPostForm({ post }: { post: Post }) {
  const [content, setContent] = useState(post.content);
  const [action, setAction] = useState<'save' | 'publish' | 'delete'>('save');
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleSubmit = async (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    formData.append('postId', post.id);
    formData.append('isPublished', action === 'publish' ? 'true' : 'false');

    startTransition(async () => {
      try {
        if (action === 'delete') {
          if (
            !window.confirm(
              'Are you sure you want to delete this post? This cannot be undone.',
            )
          )
            return;
          await deletePost(formData);
          toast.success('Post deleted successfully');
          router.push(LINKS.dashboardPosts.url);
          return;
        }

        await updatePost(formData);
        toast.success(
          action === 'publish' ? 'Post published!' : 'Draft saved!',
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
            placeholder='Why I switched to Linux...'
            defaultValue={post.title}
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
            placeholder='why-i-switched-to-linux'
            defaultValue={post.slug ?? undefined}
          />
        </div>
      </div>

      {/* Markdown Editor */}
      <Tabs defaultValue='write' className='w-full'>
        <div className='mb-1 flex items-center justify-between'>
          <TabsList className='grid w-full max-w-50 grid-cols-2'>
            <TabsTrigger value='write'>Write</TabsTrigger>
            <TabsTrigger value='preview'>Preview</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value='write'>
          <Textarea
            name='content'
            className='min-h-100 resize-y'
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

      <EditActionButtons
        publishedAt={post.publishedAt}
        isPending={isPending}
        isMissingRequiredFields={!content.trim()}
        action={action}
        setAction={setAction}
      />
    </form>
  );
}
