'use client';

import { SiDiscord } from '@icons-pack/react-simple-icons';

import { LazyMenu } from '@/components/common/lazy-menu';

export const DISCORD_URL = 'https://discord.com/users/303142922780672013';
export const DISCORD_USERNAME = 'cutenikki';

// The menu's button, the same before and after the menu has loaded
export function DiscordTrigger(props: React.ComponentProps<'button'>) {
  return (
    <button
      type='button'
      className='text-muted-foreground hover:text-primary-text focus-visible:text-primary-text focus-visible:outline-ring flex items-center gap-2 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2'
      {...props}
    >
      {/* The icon has its own "Discord" title, which screen readers would read before the label */}
      <SiDiscord className='size-4' title='' aria-hidden />
      Discord
    </button>
  );
}

const loadMenu = () =>
  import('@/components/navigation/discord-menu-loaded').then(
    (module) => module.default,
  );

// Copy the Discord username or open the profile. Its menu loads on first use (see LazyMenu).
export function DiscordMenu() {
  return <LazyMenu load={loadMenu} props={{}} trigger={<DiscordTrigger />} />;
}
