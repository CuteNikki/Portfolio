'use client';

import { useState } from 'react';

import { PlusIcon, XIcon } from 'lucide-react';

import { proxiedAvatarUrl } from '@/lib/utils';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export interface AuthorOption {
  id: string;
  name: string;
  username: string;
  avatarUrl: string;
}

// Picks a post's or project's authors from the writers and admins. The chips' order is the order the site shows
// them in, and there is always at least one. The ids go to the form as JSON in a hidden `authors` field.
export function AuthorsField({
  options,
  defaultValue,
}: {
  options: AuthorOption[];
  defaultValue: string[];
}) {
  const [ids, setIds] = useState(defaultValue);
  const byId = new Map(options.map((option) => [option.id, option]));
  const chosen = ids.flatMap((id) => byId.get(id) ?? []);
  const remaining = options.filter((option) => !ids.includes(option.id));

  return (
    <div className='flex flex-col gap-2'>
      <span id='authors-label' className='text-sm font-medium'>
        Authors
      </span>
      <input type='hidden' name='authors' value={JSON.stringify(ids)} />
      <ul
        aria-labelledby='authors-label'
        className='flex flex-wrap items-center gap-2'
      >
        {chosen.map((author) => (
          <li
            key={author.id}
            className='bg-card flex h-10 items-center gap-2 rounded-lg border pr-1 pl-1.5 text-[13px]'
          >
            <AuthorAvatar author={author} />
            <span className='font-medium'>{author.name}</span>
            <span className='text-muted-foreground hidden sm:inline'>
              @{author.username}
            </span>
            <Button
              type='button'
              variant='ghost'
              size='icon-sm'
              aria-label={`Remove ${author.name} from the authors`}
              disabled={ids.length === 1}
              onClick={() =>
                setIds((current) => current.filter((id) => id !== author.id))
              }
            >
              <XIcon />
            </Button>
          </li>
        ))}
        {remaining.length > 0 && (
          <li>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  type='button'
                  variant='outline'
                  className='border-dashed'
                >
                  <PlusIcon />
                  Add author
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align='start' className='w-72'>
                <DropdownMenuLabel className='text-muted-foreground px-2.5 pt-1.5 pb-1 text-[11px] font-normal tracking-widest uppercase'>
                  Writers and admins
                </DropdownMenuLabel>
                {remaining.map((option) => (
                  <DropdownMenuItem
                    key={option.id}
                    onSelect={() =>
                      setIds((current) => [...current, option.id])
                    }
                  >
                    <AuthorAvatar author={option} />
                    <span className='min-w-0'>
                      <span className='block truncate font-medium'>
                        {option.name}
                      </span>
                      <span className='text-muted-foreground block truncate text-xs'>
                        @{option.username}
                      </span>
                    </span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </li>
        )}
      </ul>
    </div>
  );
}

function AuthorAvatar({ author }: { author: AuthorOption }) {
  return (
    <Avatar className='size-7 rounded-md after:rounded-md'>
      <AvatarImage
        src={proxiedAvatarUrl(author.avatarUrl)}
        alt=''
        className='rounded-md'
      />
      <AvatarFallback className='rounded-md text-[10px]'>
        {author.name.slice(0, 2).toUpperCase()}
      </AvatarFallback>
    </Avatar>
  );
}
