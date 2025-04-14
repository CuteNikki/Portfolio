import { Globe } from 'lucide-react';

import { GitHubIcon } from '@/components/ui/icons';

export type Project = {
  name: string;
  description: string;
  technologies: string[];
  tags: string[];
  links: {
    type: string;
    href: string;
    icon: React.ReactNode;
  }[];
  image: string;
};

export const projects: Project[] = [
  {
    name: 'NisoPlugin',
    description: 'PaperMC plugin for Minecraft 1.21.4',
    tags: ['Back-End', 'Plugin', 'Minecraft'],
    technologies: ['Java', 'PostgreSQL'],
    links: [{ href: 'https://github.com/CuteNikki/NisoPlugin', type: 'Source', icon: <GitHubIcon className='!fill-primary-foreground' /> }],
    image: '/project_nisoplugin_image.png',
  },
  {
    name: 'Tinderhaj',
    description: "The world's first dating site exclusively for Blåhaj!",
    tags: ['Front-End', 'Back-End', 'Website', 'Dashboard', 'API'],
    technologies: ['Next.js', 'TypeScript', 'Tailwind CSS', 'shadcn/ui', 'Prisma', 'PostgreSQL'],
    links: [
      { href: 'https://tinderhaj.com', type: 'Website', icon: <Globe /> },
      { href: 'https://github.com/CuteNikki/tinderhaj', type: 'Source', icon: <GitHubIcon /> },
    ],
    image: '/project_tinderhaj_image.png',
  },
  {
    name: 'Code Goblins',
    description: 'Game development studio website.',
    tags: ['Front-End', 'Website'],
    technologies: ['Next.js', 'TypeScript', 'Tailwind CSS', 'shadcn/ui'],
    links: [{ href: 'https://codegoblins.com', type: 'Website', icon: <Globe /> }],
    image: '/project_codegoblins_image.png',
  },
  {
    name: 'Suki Website',
    description: 'Personal website made for Suki.',
    tags: ['Front-End', 'Website'],
    technologies: ['Next.js', 'TypeScript', 'Tailwind CSS', 'shadcn/ui', 'Lanyard'],
    links: [{ href: 'https://suki.elry.moe', type: 'Website', icon: <Globe /> }],
    image: '/project_website_image.png',
  },
  {
    name: 'Yanera Dashboard',
    description: 'A Discord bot dashboard.',
    tags: ['Front-End', 'Back-End', 'Website', 'Dashboard', 'API'],
    technologies: ['Next.js', 'TypeScript', 'Tailwind CSS', 'shadcn/ui'],
    links: [
      { href: 'https://yanera.xyz', type: 'Website', icon: <Globe /> },
      { href: 'https://github.com/CuteNikki/yanera-dashboard', type: 'Source', icon: <GitHubIcon /> },
    ],
    image: '/project_yanera_image.png',
  },
  {
    name: 'Yanera Bot',
    description: 'A Discord bot.',
    tags: ['Back-End', 'Bot'],
    technologies: ['TypeScript', 'Discord.js', 'MongoDB'],
    links: [
      { href: 'https://discord.com/discovery/applications/1042524598647926804', type: 'Website', icon: <Globe /> },
      { href: 'https://github.com/CuteNikki/discord-bot', type: 'Source', icon: <GitHubIcon /> },
    ],
    image: '/project_yanerabot_image.png',
  },
  {
    name: 'My Portfolio',
    description: "You're looking at it right now.",
    tags: ['Front-End', 'Website'],
    technologies: ['Next.js', 'TypeScript', 'Tailwind CSS', 'shadcn/ui'],
    links: [
      { href: '/', type: 'Website', icon: <Globe /> },
      { href: 'https://github.com/CuteNikki/portfolio', type: 'Source', icon: <GitHubIcon /> },
    ],
    image: '/project_portfolio_image.png',
  },
];
