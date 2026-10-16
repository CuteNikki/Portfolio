'use client';

import React from 'react';
import { toast } from '@/lib/toast';

import { createComment } from '@/actions/post';

import { Button } from '@/components/ui/button';
import { Field, FieldDescription, FieldLabel } from '@/components/ui/field';
import { Textarea } from '@/components/ui/textarea';

export function CommentForm({
  postId,
  slug,
  parentId,
  setShowReplyFormAction,
}: {
  postId: string;
  slug: string;
  parentId?: string;
  setShowReplyFormAction?: (show: boolean) => void;
}) {
  const [content, setContent] = React.useState('');
  // Each reply form needs its own id, or the label points at the first textarea on the page
  const fieldId = React.useId();

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
          .then(({ error }) => {
            if (error) {
              toast.error('The comment wasn’t posted', { description: error });
              return;
            }
            setContent('');
            if (setShowReplyFormAction) {
              setShowReplyFormAction(false);
            }
            toast.success('Comment posted');
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
        <FieldLabel htmlFor={fieldId} className='sr-only'>
          Your Comment
        </FieldLabel>
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          id={fieldId}
          name='content'
        />
        {/* Wraps in a narrow reply column, keeping the buttons on the right */}
        <div className='flex flex-wrap items-center justify-between gap-2'>
          <FieldDescription
            className={content.length >= 1000 ? 'text-destructive' : ''}
          >
            {content.trim().length}/1000
          </FieldDescription>
          <div className='ml-auto flex flex-wrap justify-end gap-2'>
            {(content.trim().length > 0 || setShowReplyFormAction) && (
              <Button
                variant='outline'
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
            <Button type='submit' disabled={content.trim().length === 0}>
              {setShowReplyFormAction ? 'Reply' : 'Comment'}
            </Button>
          </div>
        </div>
      </Field>
    </form>
  );
}
