'use client';

import { useState } from 'react';

import { SiDiscord } from '@icons-pack/react-simple-icons';
import { CheckIcon, CopyIcon, ExternalLinkIcon } from 'lucide-react';

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
    await navigator.clipboard
      .writeText(discordUsername)
      .then(() => {
        setCopied(true);
      })
      .catch((err) => {
        console.error('Failed to copy text: ', err);
      })
      .finally(() => {
        window.setTimeout(() => setCopied(false), 1600);
      });
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <div className='text-muted-foreground hover:text-primary-text flex items-center gap-2 text-sm transition-colors'>
          <SiDiscord className='size-4' />
          Discord
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='center' className='w-52'>
        <DropdownMenuLabel className='text-center'>
          Connect on Discord
        </DropdownMenuLabel>
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
