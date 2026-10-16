import type { PublicUser } from '@/lib/data';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';

export function UserHover({
  user,
  className,
  children,
}: {
  user: PublicUser;
  // For the trigger, e.g. to let a long name shrink
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <HoverCard>
      <HoverCardTrigger className={className}>{children}</HoverCardTrigger>
      {/* Never wider than a small phone's screen */}
      <HoverCardContent className='flex w-80 max-w-[calc(100vw-2rem)] items-center justify-center gap-2 p-4'>
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
