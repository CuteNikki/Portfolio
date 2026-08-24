'use client';

import { useState } from 'react';
import { CheckIcon, ChevronDownIcon, CopyIcon, ExternalLinkIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const discordUrl = 'https://discord.com/users/303142922780672013';
const discordUsername = 'cutenikki';

export function DiscordMenu() {
  const [copied, setCopied] = useState(false);

  async function copyUsername() {
    await navigator.clipboard.writeText(discordUsername);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' size='sm' className='text-muted-foreground hover:text-primary-text gap-2 px-2'>
          Discord
          <ChevronDownIcon data-icon='inline-end' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='w-52'>
        <DropdownMenuLabel>Connect on Discord</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={copyUsername}>
          {copied ? <CheckIcon /> : <CopyIcon />}
          {copied ? 'Username copied' : `Copy @${discordUsername}`}
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <a href={discordUrl} target='_blank' rel='noopener noreferrer'>
            <ExternalLinkIcon />
            Open profile
          </a>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
