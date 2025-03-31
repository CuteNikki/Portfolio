import { BookMarkedIcon, ClipboardCopyIcon, ClipboardTypeIcon, LinkIcon, Mail, UserIcon, UsersIcon, WeightIcon } from 'lucide-react';

import { Career, Education, NameIcon, Skill, Social } from '@/lib/types';

import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

import {
  BunIcon,
  ChatGPTIcon,
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
  NextIcon,
  NodeJSIcon,
  NPMIcon,
  PhotoshopIcon,
  PNPMIcon,
  PostgreSQLIcon,
  ReactIcon,
  ReactNativeIcon,
  RedisIcon,
  ShadcnIcon,
  SQLiteIcon,
  TailwindCSSIcon,
  TwitterIcon,
  TypeScriptIcon,
  VisualStudioCodeIcon,
  WebStormIcon,
  YarnIcon,
} from '@/components/icons';

export const about = {
  image: '/avatar.png',
  avatar: '/avatar.png',
  name: 'Nikki Sophie Berthold',
  title: 'Developer & Designer',
  email: 'nikkisophieberthold@gmail.com',
  description: `Based in Germany and currently 20 years old, I bring fresh perspectives to my work.
  
I focus on creating accessible, user-friendly solutions that work seamlessly and look great.
I'm passionate about building products that make a difference and help people.
Working across the stack allows me to turn ideas into reality from start to finish.

Always eager to improve, I regularly explore new tools and technologies to keep my skills sharp and up-to-date.
`,
  addition: `Feel free to explore my work or reach out — I'd love to connect!`,
};

export const hero = {
  title: "Hey, I'm Nikki",
  subtitle: 'Welcome to very own portfolio.',
  buttons: [
    { href: '/about', text: 'Learn More' },
    { href: '/projects', text: 'View Projects' },
  ],
};

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

export const discord = {
  icon: <DiscordIcon />,
  username: 'cutenikki',
  id: '303142922780672013',
};

export const languages: NameIcon[] = [
  {
    name: 'HTML',
    icon: <HTML5Icon />,
  },
  {
    name: 'CSS',
    icon: <CSS3Icon />,
  },
  {
    name: 'JavaScript',
    icon: <JavaScriptIcon />,
  },
  {
    name: 'TypeScript',
    icon: <TypeScriptIcon />,
  },
  {
    name: 'Java',
    icon: <JavaIcon />,
  },
];

export const backend: NameIcon[] = [
  {
    name: 'Node',
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
];

export const frontend: NameIcon[] = [
  {
    name: 'Next',
    icon: <NextIcon />,
  },
  {
    name: 'React',
    icon: <ReactIcon />,
  },
  {
    name: 'Native',
    icon: <ReactNativeIcon />,
  },
  {
    name: 'Tailwind',
    icon: <TailwindCSSIcon />,
  },
  {
    name: 'Shadcn/UI',
    icon: <ShadcnIcon />,
  },
];

export const databases: NameIcon[] = [
  {
    name: 'MongoDB',
    icon: <MongoDBIcon />,
  },
  {
    name: 'MySQL',
    icon: <MySQLIcon />,
  },
  {
    name: 'PostgreSQL',
    icon: <PostgreSQLIcon />,
  },
  {
    name: 'SQLite',
    icon: <SQLiteIcon />,
  },
  {
    name: 'Redis',
    icon: <RedisIcon />,
  },
];

export const editors: NameIcon[] = [
  {
    name: 'VS Code',
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
];

export const tools: NameIcon[] = [
  {
    name: 'Git',
    icon: <GitIcon />,
  },
  {
    name: 'ChatGPT',
    icon: <ChatGPTIcon />,
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
];

export const socials: Social[] = [
  {
    name: 'Mail',
    url: 'mailto:' + about.email,
    icon: <Mail />,
  },
  {
    name: 'Twitter/X',
    url: 'https://x.com/BlushingNikki',
    icon: <TwitterIcon />,
  },
  {
    name: 'Instagram',
    url: 'https://www.instagram.com/blushingnikki',
    icon: <InstagramIcon />,
  },
  {
    name: 'GitHub',
    url: 'https://github.com/cutenikki',
    icon: <GitHubIcon />,
  },
];

export const skills: Skill[] = [
  {
    text: 'Focus on user experience',
    icon: <UserIcon className='size-4' />,
  },
  {
    text: 'Strong problem-solving abilities',
    icon: <WeightIcon className='size-4' />,
  },
  {
    text: 'Commitment to continuous learning',
    icon: <BookMarkedIcon className='size-4' />,
  },
  {
    text: 'Collaborative and supportive',
    icon: <UsersIcon className='size-4' />,
  },
];

export const discordButton = (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button variant='secondary'>
        <span className='size-4 fill-foreground'>{discord.icon}</span>
        Discord
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent>
      <DropdownMenuItem
        onClick={() => {
          navigator.clipboard.writeText(discord.username);
        }}
      >
        <ClipboardTypeIcon />
        Copy name
      </DropdownMenuItem>
      <DropdownMenuItem
        onClick={() => {
          navigator.clipboard.writeText(discord.id);
        }}
      >
        <ClipboardCopyIcon />
        Copy ID
      </DropdownMenuItem>
      <DropdownMenuItem asChild>
        <a href={`https://discord.com/users/${discord.id}`}>
          <LinkIcon />
          Profile Link
        </a>
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
);
