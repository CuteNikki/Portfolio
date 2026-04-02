'use client';

import React from 'react';
import { toast } from 'sonner';

import { createComment } from '@/actions/post';

import { Button } from '@/components/ui/button';
import { Field, FieldDescription, FieldLabel } from '@/components/ui/field';
import { Textarea } from '@/components/ui/textarea';

export function CommentForm({
  postId,
  slug,
  parentId,
  setShowReplyFormAction,
  isReplying = false,
}: {
  postId: string;
  slug: string;
  parentId?: string;
  setShowReplyFormAction?: (show: boolean) => void;
  isReplying?: boolean;
}) {
  const [content, setContent] = React.useState('');

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);
        formData.append('postId', postId);
        formData.append('postSlug', slug);
        if (parentId) {
          formData.append('parentId', parentId);
        }

        createComment(formData)
          .then(() => {
            setContent('');
            if (setShowReplyFormAction) {
              setShowReplyFormAction(false);
            }
            toast.success('Comment posted successfully!');
          })
          .catch((error) => {
            toast.error(`Failed to post comment!`, {
              description: error.message,
            });
          });
      }}
      className='flex flex-col gap-2'
    >
      <Field>
        <FieldLabel htmlFor='content' className='sr-only'>
          Your Comment
        </FieldLabel>
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          id='content'
          name='content'
        />
        <FieldDescription
          className={content.length >= 1000 ? 'text-destructive' : ''}
        >
          {content.trim().length}/1000 characters
        </FieldDescription>
      </Field>
      <div className='flex justify-end gap-2'>
        {(content.trim().length > 0 || setShowReplyFormAction) && (
          <Button
            variant='outline'
            size='sm'
            onClick={() => {
              setContent('');
              if (setShowReplyFormAction) {
                setShowReplyFormAction(false);
              }
            }}
          >
            Cancel
          </Button>
        )}
        <Button type='submit' size='sm' disabled={content.trim().length === 0}>
          {isReplying ? 'Post Reply' : 'Post Comment'}
        </Button>
      </div>
    </form>
  );
}
