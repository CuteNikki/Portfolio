'use client';

import { useState } from 'react';

import type { Comment as CommentType } from '@/generated/prisma/browser';
import type { Role } from '@/generated/prisma/enums';

import type { PublicUser } from '@/lib/data';

import { Comment } from '@/components/dashboard/posts/comment';

export function CommentWrapper({
  post,
  viewer,
}: {
  post: {
    slug: string | null;
    comments: (CommentType & { author: PublicUser })[];
  };
  viewer: { id: string; role: Role } | null;
}) {
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);

  return (
    <div className='flex flex-col gap-4'>
      <h2 className='scroll-mt-20 text-2xl font-bold' id='comments'>
        Comments
      </h2>
      {post.comments.length === 0 ? (
        <p className='text-muted-foreground'>There are no comments yet.</p>
      ) : (
        <div className='flex flex-col gap-4'>
          {post.comments
            .filter((comment) => !comment.parentId)
            .map((comment) => (
              <div key={comment.id}>
                <Comment
                  allComments={post.comments}
                  comment={comment}
                  postSlug={post.slug || ''}
                  userId={viewer?.id || ''}
                  isAdmin={viewer?.role === 'ADMIN'}
                  editingCommentId={editingCommentId}
                  setEditingCommentIdAction={setEditingCommentId}
                  depth={0}
                />
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
