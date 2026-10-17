'use client';

import { MoreHorizontalIcon } from 'lucide-react';

import { LazyMenu } from '@/components/common/lazy-menu';
import { Button } from '@/components/ui/button';

export interface CommentActionsProps {
  commentId: string;
  commentAuthorId: string;
  commentAuthorDiscordId: string;
  postSlug: string;
  userId: string;
  // Writers and admins can delete anyone's comment
  canModerate: boolean;
  setEditingCommentIdAction: (commentId: string | null) => void;
  setShowReplyFormAction?: (show: boolean) => void;
}

// The menu's button, the same before and after the menu has loaded
export function CommentActionsTrigger(props: React.ComponentProps<'button'>) {
  return (
    <Button variant='ghost' size='icon-sm' {...props}>
      <MoreHorizontalIcon />
      <span className='sr-only'>Open comment actions menu</span>
    </Button>
  );
}

const loadMenu = () =>
  import('@/components/dashboard/posts/comment-actions-loaded').then(
    (module) => module.default,
  );

// A comment's ⋯ menu: reply, copy the author's ID, edit or delete. Its menu loads on first use (see LazyMenu).
export function CommentActions(props: CommentActionsProps) {
  return (
    <LazyMenu
      load={loadMenu}
      props={props}
      trigger={<CommentActionsTrigger />}
    />
  );
}
