'use client';

import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { toast } from 'sonner';

import type { Post } from '@/generated/prisma/client';

import { deletePost, updatePost } from '@/actions/post';
import type { AuthorEntry } from '@/lib/authors';
import { LINKS } from '@/constants/links';
import { formatShortDate } from '@/lib/utils';

import {
  type AuthorOption,
  AuthorsField,
} from '@/components/dashboard/shared/authors-field';
import { CoverField } from '@/components/dashboard/shared/image-fields';
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

export function EditPostForm({
  post,
  authorOptions,
  authors,
}: {
  post: Post;
  authorOptions: AuthorOption[];
  authors: AuthorEntry[];
}) {
  const [content, setContent] = useState(post.content);
  const [action, setAction] = useState<EditAction>('save');
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleSubmit = (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    const intent = getEditAction(event);
    setAction(intent);
    const formData = new FormData(event.currentTarget);

    // The textarea is unmounted while the Preview tab is open, so take the value from state
    formData.set('content', content);

    formData.append('postId', post.id);
    formData.append('isPublished', intent === 'publish' ? 'true' : 'false');

    startTransition(async () => {
      try {
        const { error } = await updatePost(formData);
        if (error) {
          toast.error('The post wasn’t saved', { description: error });
          return;
        }
        toast.success(intent === 'publish' ? 'Post published' : 'Draft saved');
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
        formData.set('postId', post.id);
        const { error } = await deletePost(formData);
        if (error) {
          toast.error('The post wasn’t deleted', { description: error });
          return;
        }
        toast.success('Post deleted');
        router.push(LINKS.dashboardPosts.url);
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
                    placeholder='Why I switched to Linux'
                    defaultValue={post.title}
                    required
                  />
                </Field>
                <Field label='Slug' htmlFor='slug'>
                  <Input
                    id='slug'
                    name='slug'
                    placeholder='Leave empty to use the title'
                    defaultValue={post.slug ?? undefined}
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
              description={
                post.publishedAt
                  ? `Live since ${formatShortDate(post.publishedAt)}`
                  : 'A draft, only visible here'
              }
              className='order-last xl:order-first'
            >
              <EditActionButtons
                kind='post'
                title={post.title}
                publishedAt={post.publishedAt}
                isPending={isPending}
                isMissingRequiredFields={!content.trim()}
                action={action}
                onDelete={remove}
              />
            </FormCard>

            <FormCard>
              <AuthorsField options={authorOptions} defaultValue={authors} />
              <CoverField defaultValue={post.coverUrl} />
            </FormCard>
          </>
        }
      />
    </form>
  );
}
