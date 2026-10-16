import {
  CoffeeIcon,
  type LucideIcon,
  MonitorIcon,
  MoonIcon,
  MoonStarIcon,
  SunIcon,
} from 'lucide-react';

export const THEMES: { id: string; label: string; icon: LucideIcon }[] = [
  { id: 'light', label: 'Light', icon: SunIcon },
  { id: 'dark', label: 'Dark', icon: MoonIcon },
  { id: 'system', label: 'System', icon: MonitorIcon },
  { id: 'catppuccin-latte', label: 'Catppuccin Latte', icon: CoffeeIcon },
  {
    id: 'catppuccin-macchiato',
    label: 'Catppuccin Macchiato',
    icon: MoonStarIcon,
  },
];

export const themeById = (id: string | undefined) =>
  THEMES.find((theme) => theme.id === id) ?? THEMES[2];
