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
    // The page's comments section has the heading; `id` is where links to the comments jump to
    <div id='comments' className='flex scroll-mt-24 flex-col gap-4'>
      {post.comments.length === 0 ? (
        <p className='text-muted-foreground text-sm'>
          No comments yet. Be the first!
        </p>
      ) : (
        <div className='flex flex-col gap-5'>
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
