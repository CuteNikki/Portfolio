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
  items: { name: string; icon: React.ReactNode }[];
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
  title: 'Developer & Designer',
  description: `Based in Germany and currently 20 years old, I bring fresh perspectives to my work.

I focus on creating accessible, user-friendly solutions that work seamlessly and look great.
I'm passionate about building products that make a difference and help people.
Working across the stack allows me to turn ideas into reality from start to finish.

Always eager to improve, I regularly explore new tools and technologies to keep my skills sharp and up-to-date. 

Feel free to explore my work or reach out — I'd love to connect!`,
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
    icon: <CodeIcon />,
    items: [
      {
        name: 'JavaScript',
        icon: <JavaScriptIcon />,
      },
      {
        name: 'TypeScript',
        icon: <TypeScriptIcon />,
      },
      {
        name: 'HTML',
        icon: <HTML5Icon />,
      },
      {
        name: 'CSS',
        icon: <CSS3Icon />,
      },
      {
        name: 'Java',
        icon: <JavaIcon />,
      },
      {
        name: 'Python',
        icon: <PythonIcon />,
      },
    ],
  },
  {
    name: 'Back-End',
    icon: <ServerIcon />,
    items: [
      {
        name: 'Node.js',
        icon: <NodeJSIcon />,
      },
      {
        name: 'Bun',
        icon: <BunIcon />,
      },
      {
        name: 'NPM',
        icon: <NPMIcon />,
      },
      {
        name: 'PNPM',
        icon: <PNPMIcon />,
      },
      {
        name: 'Yarn',
        icon: <YarnIcon />,
      },
      {
        name: 'Express',
        icon: <ExpressIcon />,
      },
      {
        name: 'Nest.js',
        icon: <NestJSIcon />,
      },
      {
        name: 'Discord.js',
        icon: <DiscordIcon />,
      },
    ],
  },
  {
    name: 'Front-End',
    icon: <GlobeIcon />,
    items: [
      {
        name: 'Next.js',
        icon: <NextJSIcon />,
      },
      {
        name: 'React',
        icon: <ReactIcon />,
      },
      {
        name: 'React Native',
        icon: <ReactNativeIcon />,
      },
      {
        name: 'Tailwind CSS',
        icon: <TailwindCSSIcon />,
      },
      {
        name: 'Shadcn/UI',
        icon: <ShadcnIcon />,
      },
    ],
  },
  {
    name: 'Databases',
    icon: <DatabaseIcon />,
    items: [
      {
        name: 'MongoDB',
        icon: <MongoDBIcon />,
      },
      {
        name: 'PostgreSQL',
        icon: <PostgreSQLIcon />,
      },
      {
        name: 'MySQL',
        icon: <MySQLIcon />,
      },
      {
        name: 'Redis',
        icon: <RedisIcon />,
      },
    ],
  },
  {
    name: 'Editors',
    icon: <LaptopIcon />,
    items: [
      {
        name: 'Visual Studio Code',
        icon: <VisualStudioCodeIcon />,
      },
      {
        name: 'Eclipse IDE',
        icon: <EclipseIDEIcon />,
      },
      {
        name: 'IntelliJ IDEA',
        icon: <IntelliJIDEAIcon />,
      },
      {
        name: 'WebStorm',
        icon: <WebStormIcon />,
      },
    ],
  },
  {
    name: 'Other Tools',
    icon: <WrenchIcon />,
    items: [
      {
        name: 'Git',
        icon: <GitIcon />,
      },
      {
        name: 'Copilot',
        icon: <CopilotIcon />,
      },
      {
        name: 'Figma',
        icon: <FigmaIcon />,
      },
      {
        name: 'Photoshop',
        icon: <PhotoshopIcon />,
      },
      {
        name: 'Illustrator',
        icon: <IllustratorIcon />,
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
    to: '08/2024',
    title: 'Freelancer',
    company: 'Self-Employed',
    location: 'Remote',
    description: 'Worked on various freelance projects, building websites and more for clients across different industries.',
  },
];
