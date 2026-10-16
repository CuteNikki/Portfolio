'use client';

import { useState } from 'react';

import { SiDiscord } from '@icons-pack/react-simple-icons';
import { CheckIcon, CopyIcon, ExternalLinkIcon } from 'lucide-react';
import { toast } from 'sonner';

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
      .catch(() => {
        toast.error('Could not copy the username');
      })
      .finally(() => {
        window.setTimeout(() => setCopied(false), 1600);
      });
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className='text-muted-foreground hover:text-primary-text focus-visible:text-primary-text focus-visible:outline-ring flex items-center gap-2 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2'>
        {/* The icon has its own "Discord" title, which screen readers would read before the label */}
        <SiDiscord className='size-4' title='' aria-hidden />
        Discord
      </DropdownMenuTrigger>
      <DropdownMenuContent align='center' className='w-52'>
        <DropdownMenuLabel className='text-center'>
          Connect on Discord
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {/* Stays open so "Username copied" can be seen */}
        <DropdownMenuItem
          onSelect={(event) => {
            event.preventDefault();
            void copyUsername();
          }}
        >
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
