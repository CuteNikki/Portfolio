'use client';

import { useId, useState } from 'react';

import { LinkIcon, PlusIcon, UserPlusIcon, XIcon } from 'lucide-react';
import { Dialog } from 'radix-ui';

import type { AuthorEntry } from '@/lib/authors';
import { proxiedAvatarUrl } from '@/lib/utils';

import { Field } from '@/components/dashboard/shared/form-parts';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';

export interface AuthorOption {
  id: string;
  name: string;
  username: string;
  avatarUrl: string;
  // Writers and admins come first in the list
  isWriter: boolean;
}

// The server keeps at most this many
const MAX_AUTHORS = 10;

const GROUP_LABEL =
  'text-muted-foreground px-2.5 pt-1.5 pb-1 text-[11px] font-normal tracking-widest uppercase';

// Picks a post's or project's authors: anyone who has signed in, or someone without an account by name and an
// optional link. The chips' order is the order the site shows them in, and there is always at least one. They go to
// the form as JSON in a hidden `authors` field.
export function AuthorsField({
  options,
  defaultValue,
}: {
  options: AuthorOption[];
  defaultValue: AuthorEntry[];
}) {
  const [authors, setAuthors] = useState(defaultValue);
  const [addingGuest, setAddingGuest] = useState(false);

  const byId = new Map(options.map((option) => [option.id, option]));
  const chosenIds = new Set(
    authors.flatMap((author) => ('userId' in author ? [author.userId] : [])),
  );
  const remaining = options.filter((option) => !chosenIds.has(option.id));
  const writers = remaining.filter((option) => option.isWriter);
  const others = remaining.filter((option) => !option.isWriter);

  const add = (author: AuthorEntry) =>
    setAuthors((current) => [...current, author]);
  const removeAt = (index: number) =>
    setAuthors((current) => current.filter((_, i) => i !== index));

  return (
    <div className='flex flex-col gap-2'>
      <span id='authors-label' className='text-sm font-medium'>
        Authors
      </span>
      <input type='hidden' name='authors' value={JSON.stringify(authors)} />
      <ul
        aria-labelledby='authors-label'
        className='flex flex-wrap items-center gap-2'
      >
        {authors.map((author, index) => {
          const user = 'userId' in author ? byId.get(author.userId) : null;
          if ('userId' in author && !user) return null;
          const name = user ? user.name : 'name' in author ? author.name : '';
          const url = 'url' in author ? author.url : null;

          return (
            <li
              key={user ? user.id : `${index}-${name}`}
              title={user ? `@${user.username}` : (url ?? 'No account')}
              className='bg-card flex h-10 max-w-full min-w-0 items-center gap-2 rounded-lg border pr-1 pl-1.5 text-[13px]'
            >
              <AuthorAvatar name={name} avatarUrl={user?.avatarUrl ?? null} />
              <span className='truncate font-medium'>{name}</span>
              {url && (
                <LinkIcon
                  aria-label='Has a link'
                  className='text-muted-foreground size-3.5 shrink-0'
                />
              )}
              <Button
                type='button'
                variant='ghost'
                size='icon-sm'
                aria-label={`Remove ${name} from the authors`}
                disabled={authors.length === 1}
                onClick={() => removeAt(index)}
              >
                <XIcon />
              </Button>
            </li>
          );
        })}
        {authors.length < MAX_AUTHORS && (
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
              <DropdownMenuContent align='start' className='max-h-96 w-72'>
                {writers.length > 0 && (
                  <DropdownMenuLabel className={GROUP_LABEL}>
                    Writers and admins
                  </DropdownMenuLabel>
                )}
                {writers.map((option) => (
                  <OptionItem
                    key={option.id}
                    option={option}
                    onSelect={() => add({ userId: option.id })}
                  />
                ))}
                {others.length > 0 && (
                  <DropdownMenuLabel className={GROUP_LABEL}>
                    Everyone else
                  </DropdownMenuLabel>
                )}
                {others.map((option) => (
                  <OptionItem
                    key={option.id}
                    option={option}
                    onSelect={() => add({ userId: option.id })}
                  />
                ))}
                {remaining.length > 0 && <DropdownMenuSeparator />}
                <DropdownMenuItem onSelect={() => setAddingGuest(true)}>
                  <UserPlusIcon />
                  Someone without an account
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </li>
        )}
      </ul>

      <GuestDialog
        open={addingGuest}
        onOpenChange={setAddingGuest}
        onAdd={(guest) => {
          add(guest);
          setAddingGuest(false);
        }}
      />
    </div>
  );
}

function OptionItem({
  option,
  onSelect,
}: {
  option: AuthorOption;
  onSelect: () => void;
}) {
  return (
    <DropdownMenuItem onSelect={onSelect}>
      <AuthorAvatar name={option.name} avatarUrl={option.avatarUrl} />
      <span className='min-w-0'>
        <span className='block truncate font-medium'>{option.name}</span>
        <span className='text-muted-foreground block truncate text-xs'>
          @{option.username}
        </span>
      </span>
    </DropdownMenuItem>
  );
}

// Asks for the name and, if they have one, the link of someone without an account. Not a <form>: it would sit inside
// the post's form, and submitting it would submit that one too.
function GuestDialog({
  open,
  onOpenChange,
  onAdd,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (guest: { name: string; url: string | null }) => void;
}) {
  const id = useId();
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');

  const submit = () => {
    if (!name.trim()) return;
    const link = url.trim();
    // People often leave out the https://
    onAdd({
      name: name.trim(),
      url: link
        ? /^https?:\/\//i.test(link)
          ? link
          : `https://${link}`
        : null,
    });
    setName('');
    setUrl('');
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== 'Enter') return;
    event.preventDefault();
    submit();
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className='data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0 fixed inset-0 z-50 bg-black/10 duration-100 supports-backdrop-filter:backdrop-blur-xs' />
        <Dialog.Content className='bg-popover text-popover-foreground ring-foreground/10 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95 fixed top-1/2 left-1/2 z-50 grid w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 -translate-y-1/2 gap-5 rounded-xl p-5 ring-1 duration-100 outline-none'>
          <div>
            <Dialog.Title className='text-[15px] font-bold'>
              Add someone without an account
            </Dialog.Title>
            <Dialog.Description className='text-muted-foreground mt-1 text-xs'>
              Their name shows with the other authors, linking to their page if
              you add one.
            </Dialog.Description>
          </div>
          <Field label='Name' htmlFor={`${id}-name`}>
            <Input
              id={`${id}-name`}
              value={name}
              maxLength={80}
              onChange={(event) => setName(event.target.value)}
              onKeyDown={onKeyDown}
              autoComplete='off'
            />
          </Field>
          <Field label='Link' htmlFor={`${id}-url`} hint='Optional'>
            <Input
              id={`${id}-url`}
              value={url}
              inputMode='url'
              placeholder='https://example.com'
              onChange={(event) => setUrl(event.target.value)}
              onKeyDown={onKeyDown}
              autoComplete='off'
            />
          </Field>
          <div className='flex justify-end gap-2'>
            <Dialog.Close asChild>
              <Button type='button' variant='outline'>
                Cancel
              </Button>
            </Dialog.Close>
            <Button type='button' disabled={!name.trim()} onClick={submit}>
              <PlusIcon />
              Add
            </Button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function AuthorAvatar({
  name,
  avatarUrl,
}: {
  name: string;
  avatarUrl: string | null;
}) {
  return (
    <Avatar className='size-7 shrink-0 rounded-md after:rounded-md'>
      {avatarUrl && (
        <AvatarImage
          src={proxiedAvatarUrl(avatarUrl)}
          alt=''
          className='rounded-md'
        />
      )}
      <AvatarFallback className='rounded-md text-[10px]'>
        {name.slice(0, 2).toUpperCase()}
      </AvatarFallback>
    </Avatar>
  );
}
