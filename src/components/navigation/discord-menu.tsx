'use client';

import { useState } from 'react';
import { CheckIcon, CopyIcon, ExternalLinkIcon } from 'lucide-react';
import { SiDiscord } from '@icons-pack/react-simple-icons';

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
      <DropdownMenuTrigger>
        <div className='text-muted-foreground hover:text-primary-text flex items-center gap-2 text-sm transition-colors'>
          <SiDiscord className='size-4' />
          Discord
        </div>
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
