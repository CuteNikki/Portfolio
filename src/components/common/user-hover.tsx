import { type User } from '@/generated/prisma/browser';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';

export function UserHover({ user, children }: { user: User; children: React.ReactNode }) {
  return (
    <HoverCard>
      <HoverCardTrigger>
        {children}
      </HoverCardTrigger>
      <HoverCardContent className='flex items-center gap-2'>
        <Avatar>
          <AvatarImage src={user.avatarUrl} alt={user.username} />
          <AvatarFallback>
            {user.username.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className='flex flex-col'>
          <p className='font-medium'>
            {user.displayName
              ? `${user.displayName} (@${user.username})`
              : `@${user.username}`}
          </p>
          <div className='flex items-center gap-2'>
            <p className='capitalize'>{user.role.toLowerCase()}</p>-
            <p>
              Joined{' '}
              {new Date(user.createdAt).toLocaleDateString('en-US', {
                month: 'short',
                year: 'numeric',
                day: 'numeric',
              })}
            </p>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
