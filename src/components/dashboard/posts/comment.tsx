'use client';

import { useId, useState } from 'react';
import { toast } from 'sonner';

import type { Comment as CommentType } from '@/generated/prisma/browser';

import type { PublicUser } from '@/lib/data';

import { editComment } from '@/actions/post';

import { UserHover } from '@/components/common/user-hover';
import { CommentActions } from '@/components/dashboard/posts/comment-actions';
import { CommentForm } from '@/components/dashboard/posts/comment-form';
import { formatShortDate } from '@/lib/utils';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Field, FieldDescription, FieldLabel } from '@/components/ui/field';
import { Textarea } from '@/components/ui/textarea';

const MAX_DEPTH = 3;

export function Comment({
  depth,
  allComments,
  comment,
  isAdmin,
  userId,
  postSlug,
  editingCommentId,
  setEditingCommentIdAction,
}: {
  depth: number;
  allComments: (CommentType & { author: PublicUser })[];
  comment: CommentType & { author: PublicUser };
  isAdmin: boolean;
  userId: string;
  postSlug: string;
  editingCommentId: string | null;
  setEditingCommentIdAction: (commentId: string | null) => void;
}) {
  const [content, setContent] = useState(comment.content);
  const fieldId = useId();
  const [showReplyForm, setShowReplyForm] = useState(false);

  const replies = allComments.filter((c) => c.parentId === comment.id);

  return (
    <div className='flex flex-col'>
      <div className='relative flex items-start gap-3'>
        {(replies?.length ?? 0) > 0 && (
          // The thread line runs down from the middle of the 36px avatar
          <div className='border-border absolute top-9 bottom-0 left-[17px] border-l-2' />
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
            <UserHover user={comment.author}>
              <span className='truncate text-sm font-bold'>
                {comment.author.displayName || `@${comment.author.username}`}
              </span>
            </UserHover>
            <div className='flex items-center gap-2'>
              <time
                dateTime={new Date(comment.createdAt).toISOString()}
                className='text-muted-foreground text-xs'
              >
                {formatShortDate(comment.createdAt)}
              </time>
              <CommentActions
                commentId={comment.id}
                commentAuthorId={comment.authorId}
                commentAuthorDiscordId={comment.author.discordId}
                postSlug={postSlug}
                userId={userId}
                isAdmin={isAdmin}
                setEditingCommentIdAction={setEditingCommentIdAction}
                // Replies stop nesting at MAX_DEPTH, so the deepest comments don't offer Reply
                setShowReplyFormAction={
                  depth < MAX_DEPTH ? setShowReplyForm : undefined
                }
              />
            </div>
          </div>
          {editingCommentId === comment.id ? (
            <div className='mt-2'>
              <form
                onSubmit={(event) => {
                  event.preventDefault();

                  const formData = new FormData(event.currentTarget);
                  formData.append('commentId', comment.id);
                  formData.append('postId', comment.postId);
                  formData.append('postSlug', postSlug);

                  editComment(formData)
                    .then(({ error }) => {
                      if (error) {
                        toast.error('The comment wasn’t saved', {
                          description: error,
                        });
                        return;
                      }
                      setEditingCommentIdAction(null);
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
                    className={content.length >= 1000 ? 'text-destructive' : ''}
                  >
                    {content.trim().length}/1000 characters
                  </FieldDescription>
                </Field>
                <div className='flex justify-end gap-2'>
                  {content.trim().length > 0 && (
                    <Button
                      variant='outline'

                      onClick={() => setEditingCommentIdAction(null)}
                    >
                      Cancel
                    </Button>
                  )}
                  <Button
                    type='submit'

                    disabled={content.trim().length === 0}
                  >
                    Edit Comment
                  </Button>
                </div>
              </form>
            </div>
          ) : (
            <p className='text-body mt-1 text-sm wrap-break-word whitespace-pre-wrap'>
              {comment.content}
            </p>
          )}
          {showReplyForm && depth < MAX_DEPTH && (
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
        <div className='ml-[17px] flex flex-col'>
          {replies?.map((reply, index) => {
            const isLast = index === replies.length - 1;
            return (
              <div key={reply.id} className='relative pt-4 pl-5'>
                {!isLast && (
                  <>
                    <div className='border-border absolute top-0 bottom-0 left-0 border-l-2' />
                    <div className='border-border absolute top-0 left-0 h-[34px] w-5 border-b-2' />
                  </>
                )}

                {isLast && (
                  <div className='border-border absolute top-0 left-0 h-[34px] w-5 rounded-bl-xl border-b-2 border-l-2' />
                )}

                <Comment
                  depth={depth + 1}
                  comment={reply}
                  allComments={allComments}
                  postSlug={postSlug}
                  userId={userId}
                  isAdmin={isAdmin}
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
