'use client';

import { useId, useState } from 'react';
import { toast } from '@/lib/toast';

import type { Comment as CommentType } from '@/generated/prisma/browser';

import type { PublicUser } from '@/lib/data';

import { editComment } from '@/actions/post';

import { MAX_COMMENT_DEPTH, MAX_COMMENT_LENGTH } from '@/constants/comments';

import { UserHover } from '@/components/common/user-hover';
import { CommentActions } from '@/components/dashboard/posts/comment-actions';
import { CommentForm } from '@/components/dashboard/posts/comment-form';
import { cn, formatShortDate } from '@/lib/utils';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Field, FieldDescription, FieldLabel } from '@/components/ui/field';
import { Textarea } from '@/components/ui/textarea';

// How many levels replies indent on phones; deeper ones stay in line
const MAX_PHONE_INDENT = 2;

export function Comment({
  depth,
  allComments,
  comment,
  canModerate,
  userId,
  postSlug,
  editingCommentId,
  setEditingCommentIdAction,
}: {
  depth: number;
  allComments: (CommentType & { author: PublicUser })[];
  comment: CommentType & { author: PublicUser };
  canModerate: boolean;
  userId: string;
  postSlug: string;
  editingCommentId: string | null;
  setEditingCommentIdAction: (commentId: string | null) => void;
}) {
  const [showReplyForm, setShowReplyForm] = useState(false);

  const replies = allComments.filter((c) => c.parentId === comment.id);

  return (
    <div className='flex flex-col'>
      <div className='relative flex items-start gap-3'>
        {(replies?.length ?? 0) > 0 && (
          // The thread line runs down from the middle of the 36px avatar
          <div className='border-border absolute top-9 bottom-0 left-4.25 border-l-2' />
        )}

        <Avatar className='z-10 size-9 rounded-lg after:rounded-lg'>
          <AvatarImage
            src={comment.author.avatarUrl}
            alt=''
            className='rounded-lg'
          />
          <AvatarFallback className='rounded-lg'>
            {comment.author.username.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>

        <div className='flex w-full min-w-0 flex-col'>
          <div className='xs:gap-2 xs:flex-row xs:items-center flex flex-col justify-between'>
            <UserHover user={comment.author} className='block min-w-0'>
              <span className='block truncate text-sm font-bold'>
                {comment.author.displayName || `@${comment.author.username}`}
              </span>
            </UserHover>
            <div className='flex items-center gap-2'>
              <time
                dateTime={new Date(comment.createdAt).toISOString()}
                className='text-muted-foreground text-xs whitespace-nowrap'
              >
                {formatShortDate(comment.createdAt)}
              </time>
              <CommentActions
                commentId={comment.id}
                commentAuthorId={comment.authorId}
                commentAuthorDiscordId={comment.author.discordId}
                postSlug={postSlug}
                userId={userId}
                canModerate={canModerate}
                setEditingCommentIdAction={setEditingCommentIdAction}
                // Replies stop nesting at MAX_COMMENT_DEPTH, so the deepest comments don't offer Reply
                setShowReplyFormAction={
                  depth < MAX_COMMENT_DEPTH ? setShowReplyForm : undefined
                }
              />
            </div>
          </div>
          {editingCommentId === comment.id ? (
            <div className='mt-2'>
              <EditCommentForm
                comment={comment}
                onClose={() => setEditingCommentIdAction(null)}
              />
            </div>
          ) : (
            <p className='text-body mt-1 text-sm wrap-break-word whitespace-pre-wrap'>
              {comment.content}
            </p>
          )}
          {showReplyForm && depth < MAX_COMMENT_DEPTH && (
            <div className='pt-2'>
              <CommentForm
                postId={comment.postId}
                parentId={comment.id}
                slug={postSlug}
                setShowReplyFormAction={setShowReplyForm}
              />
            </div>
          )}
        </div>
      </div>

      {(replies?.length ?? 0) > 0 && (
        <div
          className={cn(
            'ml-4.25 flex flex-col',
            // Phones run out of room after two levels: the deepest replies line up with the comment they answer
            depth >= MAX_PHONE_INDENT && 'max-sm:ml-0',
          )}
        >
          {replies?.map((reply, index) => {
            const isLast = index === replies.length - 1;
            const flatOnPhones = depth >= MAX_PHONE_INDENT;
            return (
              <div
                key={reply.id}
                className={cn(
                  'relative pt-4 pl-5',
                  flatOnPhones && 'max-sm:pl-0',
                )}
              >
                {!isLast && (
                  <>
                    <div
                      className={cn(
                        'border-border absolute top-0 bottom-0 left-0 border-l-2',
                        flatOnPhones && 'max-sm:hidden',
                      )}
                    />
                    <div
                      className={cn(
                        'border-border absolute top-0 left-0 h-8.5 w-5 border-b-2',
                        flatOnPhones && 'max-sm:hidden',
                      )}
                    />
                  </>
                )}

                {isLast && (
                  <div
                    className={cn(
                      'border-border absolute top-0 left-0 h-8.5 w-5 rounded-bl-xl border-b-2 border-l-2',
                      flatOnPhones && 'max-sm:hidden',
                    )}
                  />
                )}

                {/* In line on phones: the line runs straight down from the avatar above, on past this reply to the
                    next one */}
                {flatOnPhones && (
                  <div
                    className={cn(
                      'border-border absolute top-0 left-4.25 border-l-2 sm:hidden',
                      isLast ? 'h-4' : 'bottom-0',
                    )}
                  />
                )}

                <Comment
                  depth={depth + 1}
                  comment={reply}
                  allComments={allComments}
                  postSlug={postSlug}
                  userId={userId}
                  canModerate={canModerate}
                  editingCommentId={editingCommentId}
                  setEditingCommentIdAction={setEditingCommentIdAction}
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// Editing your own comment. It opens with the saved text each time, so changes that were cancelled don't come back.
function EditCommentForm({
  comment,
  onClose,
}: {
  comment: CommentType;
  onClose: () => void;
}) {
  const [content, setContent] = useState(comment.content);
  const fieldId = useId();

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);
        formData.append('commentId', comment.id);

        editComment(formData)
          .then(({ error }) => {
            if (error) {
              toast.error('The comment wasn’t saved', { description: error });
              return;
            }
            onClose();
            toast.success('Comment saved');
          })
          .catch((error) => {
            toast.error(`Failed to edit comment!`, {
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
        <FieldDescription
          className={
            content.length >= MAX_COMMENT_LENGTH ? 'text-destructive' : ''
          }
        >
          {content.trim().length}/{MAX_COMMENT_LENGTH}
        </FieldDescription>
      </Field>
      <div className='flex flex-wrap justify-end gap-2'>
        <Button type='button' variant='outline' onClick={onClose}>
          Cancel
        </Button>
        <Button type='submit' disabled={content.trim().length === 0}>
          Save
        </Button>
      </div>
    </form>
  );
}
