import { CodeIcon, DatabaseIcon, GlobeIcon, LaptopIcon, Mail, ServerIcon, WrenchIcon } from 'lucide-react';

import {
  BunIcon,
  CopilotIcon,
  CSS3Icon,
  DiscordIcon,
  EclipseIDEIcon,
  ExpressIcon,
  FigmaIcon,
  GitHubIcon,
  GitIcon,
  HTML5Icon,
  IllustratorIcon,
  InstagramIcon,
  IntelliJIDEAIcon,
  JavaIcon,
  JavaScriptIcon,
  MongoDBIcon,
  MySQLIcon,
  NestJSIcon,
  NextJSIcon,
  NodeJSIcon,
  NPMIcon,
  PhotoshopIcon,
  PNPMIcon,
  PostgreSQLIcon,
  PythonIcon,
  ReactIcon,
  ReactNativeIcon,
  RedisIcon,
  ShadcnIcon,
  TailwindCSSIcon,
  TwitterIcon,
  TypeScriptIcon,
  VisualStudioCodeIcon,
  WebStormIcon,
  YarnIcon,
} from '@/components/ui/icons';

/**
 *
 * Types
 *
 */
export type Education = {
  from: string;
  to: string;
  title: string;
  school: string;
  location: string;
  description: string;
};
export type Career = {
  from: string;
  to: string;
  title: string;
  company: string;
  location: string;
  description: string;
};
export type Social = {
  name: string;
  href: string;
  icon: React.ReactNode;
};
export type Category = {
  name: string;
  icon: React.ReactNode;
  items: { name: string; icon: React.ReactNode; description: string; url: string }[];
};
export type Skill = string;

/**
 *
 * Data exports
 *
 */

// About me
export const aboutMe = {
  email: 'contact@niso.moe',
  name: 'Nikki Sophie Berthold',
  title: 'Full Stack Developer & Designer',
  location: '📍 Bielefeld, Germany',
  dob: '2004-09-26',
  description: `I care deeply about building accessible, user-friendly experiences that not only work well but feel great to use.
I enjoy turning ideas into polished, functional products from start to finish.
Curious by nature, I'm always exploring new tools and technologies to stay sharp and evolve as a developer.`,
};

// Skills
export const skills: Skill[] = [
  'Focus on user experience',
  'Strong problem-solving abilities',
  'Commitment to continuous learning',
  'Collaborative and supportive',
];

// Socials
export const socials: Social[] = [
  {
    name: 'Mail',
    href: 'mailto:' + aboutMe.email,
    icon: <Mail />,
  },
  {
    name: 'GitHub',
    icon: <GitHubIcon />,
    href: 'https://github.com/cutenikki',
  },
  {
    name: 'Twitter/X',
    href: 'https://x.com/BlushingNikki',
    icon: <TwitterIcon />,
  },
  {
    name: 'Instagram',
    href: 'https://www.instagram.com/blushingnikki',
    icon: <InstagramIcon />,
  },
];

// Other categories (languages, back-end, front-end, editors, other tools)
export const categories: Category[] = [
  {
    name: 'Languages',
    icon: <CodeIcon className='size-4' />,
    items: [
      {
        name: 'JavaScript',
        icon: <JavaScriptIcon />,
        description: 'Dynamic scripting language for the web',
        url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript',
      },
      {
        name: 'TypeScript',
        icon: <TypeScriptIcon />,
        description: 'Typed superset of JavaScript',
        url: 'https://www.typescriptlang.org/',
      },
      {
        name: 'HTML',
        icon: <HTML5Icon />,
        description: 'Markup language for structuring web pages',
        url: 'https://developer.mozilla.org/en-US/docs/Web/HTML',
      },
      {
        name: 'CSS',
        icon: <CSS3Icon />,
        description: 'Style sheet language for web design',
        url: 'https://developer.mozilla.org/en-US/docs/Web/CSS',
      },
      {
        name: 'Java',
        icon: <JavaIcon />,
        description: 'Object-oriented language used across platforms',
        url: 'https://www.java.com/',
      },
      {
        name: 'Python',
        icon: <PythonIcon />,
        description: 'Readable, versatile scripting language',
        url: 'https://www.python.org/',
      },
    ],
  },
  {
    name: 'Back-End',
    icon: <ServerIcon className='size-4' />,
    items: [
      {
        name: 'Node',
        icon: <NodeJSIcon />,
        description: 'JavaScript runtime for back-end development',
        url: 'https://nodejs.org/',
      },
      {
        name: 'Bun',
        icon: <BunIcon />,
        description: 'Fast all-in-one JavaScript runtime',
        url: 'https://bun.sh/',
      },
      {
        name: 'NPM',
        icon: <NPMIcon />,
        description: 'Package manager for JavaScript',
        url: 'https://www.npmjs.com/',
      },
      {
        name: 'PNPM',
        icon: <PNPMIcon />,
        description: 'Efficient, fast package manager',
        url: 'https://pnpm.io/',
      },
      {
        name: 'Yarn',
        icon: <YarnIcon />,
        description: 'Alternative JavaScript package manager',
        url: 'https://yarnpkg.com/',
      },
      {
        name: 'Express',
        icon: <ExpressIcon />,
        description: 'Minimal web framework for Node',
        url: 'https://expressjs.com/',
      },
      {
        name: 'Nest.js',
        icon: <NestJSIcon />,
        description: 'Scalable Node framework with TypeScript',
        url: 'https://nestjs.com/',
      },
      {
        name: 'discord.js',
        icon: <DiscordIcon />,
        description: 'Library for building Discord bots',
        url: 'https://discord.js.org/',
      },
    ],
  },
  {
    name: 'Front-End',
    icon: <GlobeIcon className='size-4' />,
    items: [
      {
        name: 'React',
        icon: <ReactIcon />,
        description: 'Library for building user interfaces',
        url: 'https://react.dev/',
      },
      {
        name: 'React Native',
        icon: <ReactNativeIcon />,
        description: 'React-based framework for native apps',
        url: 'https://reactnative.dev/',
      },
      {
        name: 'Next.js',
        icon: <NextJSIcon />,
        description: 'React framework with SSR and routing',
        url: 'https://nextjs.org/',
      },
      {
        name: 'Tailwind CSS',
        icon: <TailwindCSSIcon />,
        description: 'Utility-first CSS framework',
        url: 'https://tailwindcss.com/',
      },
      {
        name: 'Shadcn/UI',
        icon: <ShadcnIcon />,
        description: 'Customizable UI components for React',
        url: 'https://ui.shadcn.com/',
      },
    ],
  },
  {
    name: 'Databases',
    icon: <DatabaseIcon className='size-4' />,
    items: [
      {
        name: 'MongoDB',
        icon: <MongoDBIcon />,
        description: 'NoSQL database using JSON-like docs',
        url: 'https://www.mongodb.com/',
      },
      {
        name: 'PostgreSQL',
        icon: <PostgreSQLIcon />,
        description: 'Advanced open-source SQL database',
        url: 'https://www.postgresql.org/',
      },
      {
        name: 'MySQL',
        icon: <MySQLIcon />,
        description: 'Popular open-source SQL database',
        url: 'https://www.mysql.com/',
      },
      {
        name: 'Redis',
        icon: <RedisIcon />,
        description: 'In-memory key-value store',
        url: 'https://redis.io/',
      },
    ],
  },
  {
    name: 'Editors',
    icon: <LaptopIcon className='size-4' />,
    items: [
      {
        name: 'Visual Studio Code',
        icon: <VisualStudioCodeIcon />,
        description: 'Lightweight code editor with extensions',
        url: 'https://code.visualstudio.com/',
      },
      {
        name: 'Eclipse IDE',
        icon: <EclipseIDEIcon />,
        description: 'Extensible IDE, mainly for Java',
        url: 'https://www.eclipse.org/',
      },
      {
        name: 'IntelliJ IDEA',
        icon: <IntelliJIDEAIcon />,
        description: 'Powerful IDE for JVM-based languages',
        url: 'https://www.jetbrains.com/idea/',
      },
      {
        name: 'WebStorm',
        icon: <WebStormIcon />,
        description: 'IDE for JavaScript and web development',
        url: 'https://www.jetbrains.com/webstorm/',
      },
    ],
  },
  {
    name: 'Other Tools',
    icon: <WrenchIcon className='size-4' />,
    items: [
      {
        name: 'Git',
        icon: <GitIcon />,
        description: 'Version control system for code tracking',
        url: 'https://git-scm.com/',
      },
      {
        name: 'Copilot',
        icon: <CopilotIcon />,
        description: 'AI-powered code completion tool',
        url: 'https://github.com/features/copilot',
      },
      {
        name: 'Figma',
        icon: <FigmaIcon />,
        description: 'Collaborative design and prototyping tool',
        url: 'https://www.figma.com/',
      },
      {
        name: 'Photoshop',
        icon: <PhotoshopIcon />,
        description: 'Image editing and design software',
        url: 'https://www.adobe.com/products/photoshop.html',
      },
      {
        name: 'Illustrator',
        icon: <IllustratorIcon />,
        description: 'Vector graphics design software',
        url: 'https://www.adobe.com/products/illustrator.html',
      },
    ],
  },
];

// Education and Career data
export const education: Education[] = [
  {
    from: '09/2024',
    to: '08/2027',
    title: 'Student',
    school: 'Carl-Severing-Berufskolleg',
    location: 'Bielefeld, Germany',
    description: 'Pursuing vocational education in software development, focusing on practical skills and theoretical knowledge.',
  },
  {
    from: '09/2015',
    to: '08/2021',
    title: 'Student',
    school: 'Bertolt-Brecht-Gesamtschule',
    location: 'Löhne, Germany',
    description: 'Completed secondary school education with a focus on science and technology subjects.',
  },
  {
    from: '09/2011',
    to: '08/2015',
    title: 'Student',
    school: 'Ev. Grundschule Obernbeck',
    location: 'Löhne, Germany',
    description: 'Completed primary/elementary school education, laying the foundation for further academic pursuits.',
  },
  {
    from: '2008',
    to: '08/2011',
    title: 'Kindergartner',
    school: 'Ev. Kindergarten Die Arche',
    location: 'Löhne, Germany',
    description: 'Attended kindergarten, developing social skills and preparing for formal education.',
  },
];

export const career: Career[] = [
  {
    from: '08/2024',
    to: 'Present',
    title: 'Application Developer',
    company: 'Prodress Software GmbH',
    location: 'Bielefeld, Germany',
    description: 'Developing and maintaining software applications, collaborating with cross-functional teams to deliver high-quality products.',
  },
  {
    from: '17/09/2022',
    to: '21/09/2022',
    title: 'Application Developer',
    company: 'Mittwald CM Service',
    location: 'Espelkamp, Germany',
    description: 'Completed an internship, gaining hands-on experience in application development and understanding industry practices.',
  },
  {
    from: '09/2015',
    to: 'Present',
    title: 'Freelancer',
    company: 'Self-Employed',
    location: 'Remote',
    description: 'Worked on various freelance projects, building websites and more for clients across different industries.',
  },
];
