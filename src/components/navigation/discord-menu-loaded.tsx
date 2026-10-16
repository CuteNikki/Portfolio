'use client';

import { useState } from 'react';

import { CheckIcon, CopyIcon, ExternalLinkIcon } from 'lucide-react';
import { toast } from '@/lib/toast';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import {
  DISCORD_URL as discordUrl,
  DISCORD_USERNAME as discordUsername,
  DiscordTrigger,
} from '@/components/navigation/discord-menu';

// The Discord menu itself, loaded on first use by DiscordMenu
export default function DiscordMenuLoaded({
  defaultOpen,
}: {
  defaultOpen?: boolean;
}) {
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
    <DropdownMenu defaultOpen={defaultOpen}>
      <DropdownMenuTrigger asChild>
        <DiscordTrigger />
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
