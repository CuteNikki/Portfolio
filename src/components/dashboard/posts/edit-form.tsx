'use client';

import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { toast } from 'sonner';

import { LoaderCircleIcon, SaveIcon, SendIcon, Trash2Icon } from 'lucide-react';

import { deletePost, updatePost } from '@/actions/post';
import type { Post } from '../../../../generated/prisma/client';

import { MarkdownViewer } from '@/components/dashboard/posts/markdown';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { LINKS } from '@/constants/links';

export function EditPostForm({ post }: { post: Post }) {
  const router = useRouter();
  const [content, setContent] = useState(post.content);
  const [isPending, startTransition] = useTransition();

  // Track the intent of the form submission
  const [action, setAction] = useState<'save' | 'publish' | 'delete'>('save');

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    // Add metadata for the server actions
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
        router.refresh(); // Update the server data without a full reload
      } catch (error) {
        toast.error('Something went wrong', {
          description: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    });
  };

  return (
    <form onSubmit={onSubmit} className='flex flex-col gap-6'>
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
            defaultValue={post.slug}
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

      {/* Action Buttons */}
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
          Delete Post
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
            Cancel
          </Button>

          {/* Save Draft Button */}
          <Button
            type='submit'
            variant='secondary'
            onClick={() => setAction('save')}
            disabled={isPending || !content.trim()}
          >
            {isPending && action === 'save' ? (
              <LoaderCircleIcon className='animate-spin' />
            ) : (
              <SaveIcon />
            )}
            {post.published ? 'Revert to Draft' : 'Save Draft'}
          </Button>

          {/* Publish Button */}
          <Button
            type='submit'
            onClick={() => setAction('publish')}
            disabled={isPending || !content.trim()}
          >
            {isPending && action === 'publish' ? (
              <LoaderCircleIcon className='animate-spin' />
            ) : (
              <SendIcon />
            )}
            {post.published ? 'Update Published' : 'Publish Post'}
          </Button>
        </div>
      </div>
    </form>
  );
}
