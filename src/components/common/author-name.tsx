import { ArrowUpRightIcon } from 'lucide-react';

import type { Author } from '@/lib/data';
import { cn } from '@/lib/utils';

import { UserHover } from '@/components/common/user-hover';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

// An author's avatar and name on a post or project. Someone who signed in opens their card on hover; someone without
// an account links to their page when they have one.
export function AuthorName({
  author,
  size = 'md',
}: {
  author: Author;
  size?: 'sm' | 'md';
}) {
  const content = (
    <span className='flex items-center gap-2'>
      <Avatar
        className={cn(
          'rounded-md after:rounded-md',
          size === 'sm' ? 'size-5' : 'size-6',
        )}
      >
        {author.avatarUrl && (
          <AvatarImage src={author.avatarUrl} alt='' className='rounded-md' />
        )}
        <AvatarFallback
          className={cn(
            'rounded-md',
            size === 'sm' ? 'text-[9px]' : 'text-[10px]',
          )}
        >
          {author.name.slice(0, 2).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      {author.name}
    </span>
  );

  if (author.user) return <UserHover user={author.user}>{content}</UserHover>;

  if (author.url) {
    return (
      <a
        href={author.url}
        target='_blank'
        rel='noopener noreferrer'
        className='group hover:text-primary-text flex items-center gap-0.5 transition-colors'
      >
        {content}
        <ArrowUpRightIcon
          aria-hidden
          className='size-3.5 opacity-60 transition-opacity group-hover:opacity-100'
        />
      </a>
    );
  }

  return content;
}
