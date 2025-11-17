import { Globe } from 'lucide-react';

import { DiscordIcon, GitHubIcon, JavaIcon, NextIcon, PostgreSQLIcon, ShadcnIcon, TailwindCSSIcon, TypeScriptIcon } from '@/components/icons';
import { Project } from '@/lib/types';

export const list: Project[] = [
  {
    name: 'NisoPlugin',
    description: 'PaperMC plugin for Minecraft 1.21.4',
    tags: ['Back-End', 'Plugin', 'Minecraft'],
    technologies: [
      {
        name: 'Java',
        icon: <JavaIcon />,
      },
      {
        name: 'PostgreSQL',
        icon: <PostgreSQLIcon />,
      },
    ],
    links: [
      {
        href: 'https://github.com/CuteNikki/NisoPlugin',
        label: 'Source',
        icon: <GitHubIcon />,
      },
    ],
    icon: 'https://placehold.co/100x100/png?text=Niso',
    image: 'project_nisoplugin_image.png',
  },
  {
    name: 'Tinderhaj',
    description: "The world's first dating site exclusively for Blåhaj!",
    tags: ['Front-End', 'Back-End', 'Website', 'Dashboard', 'API'],
    technologies: [
      {
        name: 'Next.js',
        icon: <NextIcon />,
      },
      {
        name: 'TypeScript',
        icon: <TypeScriptIcon />,
      },
      {
        name: 'Tailwind CSS',
        icon: <TailwindCSSIcon />,
      },
      {
        name: 'shadcn/ui',
        icon: <ShadcnIcon />,
      },
    ],
    links: [
      { href: 'https://tinderhaj.com', label: 'Website', icon: <Globe /> },
      {
        href: 'https://github.com/CuteNikki/tinderhaj',
        label: 'Source',
        icon: <GitHubIcon />,
      },
    ],
    icon: '/project_tinderhaj_icon.webp',
    image: '/project_tinderhaj_image.png',
  },
  {
    name: 'Code Goblins',
    description: 'Game development studio website.',
    tags: ['Front-End', 'Website'],
    technologies: [
      {
        name: 'Next.js',
        icon: <NextIcon />,
      },
      {
        name: 'TypeScript',
        icon: <TypeScriptIcon />,
      },
      {
        name: 'Tailwind CSS',
        icon: <TailwindCSSIcon />,
      },
      {
        name: 'shadcn/ui',
        icon: <ShadcnIcon />,
      },
    ],
    links: [{ href: 'https://codegoblins.com', label: 'Website', icon: <Globe /> }],
    icon: '/project_codegoblins_icon.png',
    image: 'project_codegoblins_image.png',
  },
  {
    name: 'Lucy Website',
    description: 'Personal website made for Lucy.',
    tags: ['Front-End', 'Website'],
    technologies: [
      {
        name: 'Next.js',
        icon: <NextIcon />,
      },
      {
        name: 'TypeScript',
        icon: <TypeScriptIcon />,
      },
      {
        name: 'Tailwind CSS',
        icon: <TailwindCSSIcon />,
      },
      {
        name: 'shadcn/ui',
        icon: <ShadcnIcon />,
      },
    ],
    links: [{ href: 'https://lucys.gg/', label: 'Website', icon: <Globe /> }],
    icon: 'https://placehold.co/100x100/png?text=Lucy',
    image: '/project_website_image.png',
  },
  {
    name: 'Yanera Dashboard',
    description: 'A Discord bot dashboard.',
    tags: ['Front-End', 'Back-End', 'Website', 'Dashboard', 'API'],
    technologies: [
      {
        name: 'Next.js',
        icon: <NextIcon />,
      },
      {
        name: 'TypeScript',
        icon: <TypeScriptIcon />,
      },
      {
        name: 'Tailwind CSS',
        icon: <TailwindCSSIcon />,
      },
      {
        name: 'shadcn/ui',
        icon: <ShadcnIcon />,
      },
    ],
    links: [
      { href: 'https://yanera.xyz', label: 'Website', icon: <Globe /> },
      {
        href: 'https://github.com/CuteNikki/yanera-dashboard',
        label: 'Source',
        icon: <GitHubIcon />,
      },
    ],
    icon: '/project_yanera_icon.png',
    image: '/project_yanera_image.png',
  },
  {
    name: 'Yanera Bot',
    description: 'A Discord bot.',
    tags: ['Back-End', 'Bot'],
    technologies: [
      {
        name: 'TypeScript',
        icon: <TypeScriptIcon />,
      },
      {
        name: 'Discord.js',
        icon: <DiscordIcon />,
      },
    ],
    links: [
      { href: 'https://discord.com/discovery/applications/1042524598647926804', label: 'Website', icon: <Globe /> },
      {
        href: 'https://github.com/CuteNikki/discord-bot',
        label: 'Source',
        icon: <GitHubIcon />,
      },
    ],
    icon: '/project_yanera_icon.png',
    image: '/project_yanerabot_image.png',
  },
  {
    name: 'My Portfolio',
    description: "You're looking at it right now.",
    tags: ['Front-End', 'Website'],
    technologies: [
      {
        name: 'Next.js',
        icon: <NextIcon />,
      },
      {
        name: 'TypeScript',
        icon: <TypeScriptIcon />,
      },
      {
        name: 'Tailwind CSS',
        icon: <TailwindCSSIcon />,
      },
      {
        name: 'shadcn/ui',
        icon: <ShadcnIcon />,
      },
    ],
    links: [
      { href: '/', label: 'Website', icon: <Globe /> },
      {
        href: 'https://github.com/CuteNikki/portfolio',
        label: 'Source',
        icon: <GitHubIcon />,
      },
    ],
    icon: '/project_portfolio_icon.png',
    image: '/project_portfolio_image.png',
  },
];
