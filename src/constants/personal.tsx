import {
  IconType,
  SiBun,
  SiClaude,
  SiCss,
  SiDiscord,
  SiDiscorddotjs,
  SiDocker,
  SiEclipseide,
  SiFigma,
  SiGit,
  SiHtml5,
  SiIntellijidea,
  SiJavascript,
  SiMongodb,
  SiNestjs,
  SiNextdotjs,
  SiNodedotjs,
  SiPostgresql,
  SiPython,
  SiReact,
  SiRedis,
  SiShadcnui,
  SiTailwindcss,
  SiTypescript,
} from '@icons-pack/react-simple-icons';
import { CoffeeIcon, LucideIcon, MailIcon } from 'lucide-react';

import { GithubIcon, LinkedinIcon } from '@/components/common/brand-icons';

// Express's own logo is a thin "ex" that's hard to see at badge size, so it's the letters cut out of a filled square
// instead, like the JavaScript and TypeScript icons. The cut-out shows whatever is behind it, in every theme.
function ExpressMonogram() {
  return (
    <svg viewBox='0 0 24 24' aria-hidden>
      <mask id='express-monogram'>
        <rect width='24' height='24' rx='3' fill='white' />
        <text
          x='12'
          y='16.5'
          textAnchor='middle'
          fontFamily='inherit'
          fontWeight='800'
          fontSize='12'
          fill='black'
        >
          ex
        </text>
      </mask>
      <rect
        width='24'
        height='24'
        rx='3'
        fill='currentColor'
        mask='url(#express-monogram)'
      />
    </svg>
  );
}

export interface SocialLink {
  icon: IconType | LucideIcon;
  platform: string;
  url: string;
}

export interface CareerEntry {
  from: Date;
  to: Date | 'Present';
  showDays?: boolean;
  title: string;
  company: string;
  location: string;
  description: string;
}

export interface EducationEntry {
  from: Date;
  to: Date | 'Present';
  title: string;
  school: string;
  location: string;
  description: string;
}

export interface SkillsTechnologies {
  [key: string]: SkillsTechnologiesEntry[];
}

export interface SkillsTechnologiesEntry {
  name: string;
  description: string;
  icon: React.ReactNode;
}

export const PERSONAL_DETAILS = {
  firstName: 'Nikki',
  middleName: 'Sophie',
  lastName: 'Berthold',
  title: 'Developer',
  description:
    'I do full-stack development and design, focusing on the intersection of code and user experience. I build fast, accessible, and well-structured applications from the ground up.',
  dateOfBirth: new Date('2004-09-26'),
  get age() {
    const today = new Date();
    let age = today.getFullYear() - this.dateOfBirth.getFullYear();
    const monthDiff = today.getMonth() - this.dateOfBirth.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < this.dateOfBirth.getDate())
    ) {
      age--;
    }
    return age;
  },
  get fullName() {
    return `${this.firstName} ${this.middleName} ${this.lastName}`;
  },
  email: 'contact@niso.moe',
  get emailLink() {
    return `mailto:${this.email}`;
  },
  phone: '+49 176 46236314',
  get phoneLink() {
    return `tel:${this.phone.replace(/[^0-9+]/g, '')}`;
  },
  address: {
    street: 'Friedrich-Karl-Straße',
    houseNumber: '28',
    city: 'Löhne',
    zip: '32584',
    country: 'Germany',
    flag: '🇩🇪',
    get lineOne() {
      return `${this.street} ${this.houseNumber}`;
    },
    get lineTwo() {
      return `${this.zip} ${this.city}`;
    },
    get lineTwoWithCountry() {
      return `${this.zip} ${this.city}, ${this.country}`;
    },
  } as const,
  get socials(): readonly SocialLink[] {
    return [
      {
        icon: GithubIcon,
        platform: 'GitHub',
        url: 'https://github.com/CuteNikki',
      },
      {
        icon: LinkedinIcon,
        platform: 'LinkedIn',
        url: 'https://linkedin.com/in/nikki-sophie-berthold/',
      },
      {
        icon: MailIcon,
        platform: 'Mail',
        url: this.emailLink,
      },
      {
        icon: SiDiscord,
        platform: 'Discord',
        url: 'https://discord.com/users/303142922780672013',
      },
    ] as const;
  },

  get education(): readonly EducationEntry[] {
    return [
      {
        from: new Date('2024-09'),
        to: new Date('2027-08'),
        title: 'Student',
        school: 'Carl-Severing-Berufskolleg',
        location: 'Bielefeld, Germany',
        description:
          'Pursuing vocational education in software development, focusing on practical skills and theoretical knowledge.',
      },
      {
        from: new Date('2015-09'),
        to: new Date('2021-08'),
        title: 'Student',
        school: 'Bertolt-Brecht-Gesamtschule',
        location: 'Löhne, Germany',
        description:
          'Completed secondary school education with a focus on science and technology subjects.',
      },
      {
        from: new Date('2011-09'),
        to: new Date('2015-08'),
        title: 'Student',
        school: 'Ev. Grundschule Obernbeck',
        location: 'Löhne, Germany',
        description:
          'Completed primary/elementary school education, laying the foundation for further academic pursuits.',
      },
      {
        from: new Date('2008-09'),
        to: new Date('2011-08'),
        title: 'Kindergartner',
        school: 'Ev. Kindergarten Die Arche',
        location: 'Löhne, Germany',
        description:
          'Attended kindergarten, developing social skills and preparing for formal education.',
      },
    ] as const;
  },
  get career(): readonly CareerEntry[] {
    return [
      {
        from: new Date('2024-08'),
        to: 'Present',
        title: 'Application Developer',
        company: 'Prodress Software',
        location: 'Bielefeld, Germany',
        description:
          'Developing and maintaining software applications, collaborating with teams to deliver high-quality products.',
      },
      {
        from: new Date('2022-09-17'),
        to: new Date('2022-09-21'),
        title: 'Application Developer',
        company: 'Mittwald CM Service',
        location: 'Espelkamp, Germany',
        description:
          'Completed an internship, gaining hands-on experience in application development and understanding industry practices.',
      },
      {
        from: new Date('2015-09'),
        to: 'Present',
        title: 'Freelancer',
        company: 'Self-Employed',
        location: 'Remote',
        description:
          'Working on various freelance projects, building web applications and more for clients across different industries.',
      },
    ] as const;
  },

  get skillsTechnologies(): SkillsTechnologies {
    return {
      languages: [
        {
          name: 'JavaScript',
          description: 'Dynamic scripting language for the web.',
          icon: <SiJavascript />,
        },
        {
          name: 'TypeScript',
          description: 'Superset of JavaScript with typing.',
          icon: <SiTypescript />,
        },
        {
          name: 'HTML',
          description: 'Markup language for structuring web content.',
          icon: <SiHtml5 />,
        },
        {
          name: 'CSS',
          description: 'Style sheet language for designing web pages.',
          icon: <SiCss />,
        },
        {
          name: 'Java',
          description:
            'Object-oriented programming language for various applications.',
          icon: <CoffeeIcon />,
        },
        {
          name: 'Python',
          description:
            'High-level programming language for general-purpose programming.',
          icon: <SiPython />,
        },
      ] as const,
      frontend: [
        {
          name: 'React',
          description: 'Library for building user interfaces.',
          icon: <SiReact />,
        },
        {
          name: 'React Native',
          description: 'React-based framework for native apps.',
          icon: <SiReact />,
        },
        {
          name: 'Next.js',
          description: 'React framework for SSR, static sites and routing.',
          icon: <SiNextdotjs />,
        },
        {
          name: 'Tailwind CSS',
          description: 'Utility-first CSS framework.',
          icon: <SiTailwindcss />,
        },
        {
          name: 'Shadcn/UI',
          description: 'Customizable UI components for React.',
          icon: <SiShadcnui />,
        },
      ] as const,

      backend: [
        {
          name: 'Node.js',
          description: 'JavaScript runtime for server-side development.',
          icon: <SiNodedotjs />,
        },
        {
          name: 'Bun',
          description: 'Fast all-in-one JavaScript toolkit/runtime/bundler.',
          icon: <SiBun />,
        },
        {
          name: 'Express.js',
          description: 'Minimalist web framework for Node.js.',
          icon: <ExpressMonogram />,
        },
        {
          name: 'Nest.js',
          description:
            'Progressive Node.js framework for building scalable server-side apps.',
          icon: <SiNestjs />,
        },
        {
          name: 'Discord.js',
          description: 'Library for interacting with the Discord API.',
          icon: <SiDiscorddotjs />,
        },
      ] as const,
      databases: [
        {
          name: 'MongoDB',
          description: 'NoSQL document database for flexible data storage.',
          icon: <SiMongodb />,
        },
        {
          name: 'PostgreSQL',
          description: 'Powerful open-source relational database system.',
          icon: <SiPostgresql />,
        },
        {
          name: 'Redis',
          description:
            'In-memory data structure store for caching and messaging.',
          icon: <SiRedis />,
        },
      ] as const,
      tools: [
        {
          name: 'Git',
          description: 'Version control system for tracking changes in code.',
          icon: <SiGit />,
        },
        {
          name: 'Claude',
          description:
            'AI assistant I pair with on code, reviews and research.',
          icon: <SiClaude />,
        },
        {
          name: 'Docker',
          description:
            'Platform for developing, shipping, and running applications in containers.',
          icon: <SiDocker />,
        },
        {
          name: 'Figma',
          description: 'Collaborative interface design and prototyping tool.',
          icon: <SiFigma />,
        },
        {
          name: 'Photoshop',
          description: 'Software for image editing and graphic design.',
          icon: (
            <svg
              width='48'
              height='48'
              viewBox='0 0 48 48'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                d='M3 18.2C3 12.8795 3 10.2193 4.03544 8.18709C4.94624 6.39955 6.39955 4.94624 8.18709 4.03544C10.2193 3 12.8795 3 18.2 3H29.8C35.1205 3 37.7807 3 39.8129 4.03544C41.6004 4.94624 43.0538 6.39955 43.9646 8.18709C45 10.2193 45 12.8795 45 18.2V29.8C45 35.1205 45 37.7807 43.9646 39.8129C43.0538 41.6004 41.6004 43.0538 39.8129 43.9646C37.7807 45 35.1205 45 29.8 45H18.2C12.8795 45 10.2193 45 8.18709 43.9646C6.39955 43.0538 4.94624 41.6004 4.03544 39.8129C3 37.7807 3 35.1205 3 29.8V18.2Z'
                fill='currentColor'
              />
              <path
                d='M12 33.7744V15.3051C12 15.1795 12.0525 15.1077 12.175 15.1077C13.9834 15.1077 15.7911 15 17.6 15C20.5352 15 23.7135 16.0036 24.8275 19.0744C25.09 19.8282 25.23 20.6 25.23 21.4077C25.23 22.9513 24.88 24.2256 24.18 25.2308C22.2246 28.0385 18.8355 27.9949 15.7975 27.9949V33.7564C15.8213 33.927 15.6759 34.0077 15.535 34.0077H12.21C12.07 34.0077 12 33.9359 12 33.7744ZM15.815 18.5718V24.6026C17.0196 24.6908 18.2801 24.7004 19.4375 24.3154C20.7152 23.9468 21.415 22.8407 21.415 21.5154C21.4505 20.386 20.8351 19.3024 19.7875 18.8949C18.644 18.4194 17.0493 18.3909 15.815 18.5718Z'
                className='fill-background'
              />
              <path
                d='M36.145 23.4111C35.6155 23.132 35.0515 22.9279 34.4686 22.8042C33.7194 22.6279 30.7647 22.0106 30.7636 23.5555C30.7898 24.4181 32.159 24.8407 32.7639 25.0871C34.8877 25.8162 37.291 27.1196 37.2438 29.7396C37.3087 33.0012 34.1486 34.3051 31.4397 34.3054C30.0295 34.32 28.5604 34.1016 27.2698 33.4962C27.1466 33.431 27.0673 33.2916 27.0726 33.1495V30.0286C27.0587 29.9034 27.193 29.7941 27.298 29.8841C28.5625 30.6488 30.0614 31.0201 31.5242 31.04C32.17 31.04 33.4499 30.9774 33.4402 30.0286C33.4402 29.118 31.9091 28.6994 31.2988 28.4681C30.4142 28.1523 29.5753 27.7148 28.8053 27.1677C27.7293 26.4002 27.0542 25.1695 27.0726 23.8156C27.0663 20.7445 29.9752 19.3661 32.5949 19.3654C33.8196 19.3553 35.1347 19.446 36.2748 19.9434C36.4387 19.9916 36.4727 20.1643 36.472 20.319V23.2377C36.4824 23.4188 36.2812 23.4805 36.145 23.4111Z'
                className='fill-background'
              />
            </svg>
          ),
        },
        {
          name: 'Illustrator',
          description: 'Software for vector graphics and illustration.',
          icon: (
            <svg
              width='48'
              height='48'
              viewBox='0 0 48 48'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                d='M3 18.2C3 12.8795 3 10.2193 4.03544 8.18709C4.94624 6.39955 6.39955 4.94624 8.18709 4.03544C10.2193 3 12.8795 3 18.2 3H29.8C35.1205 3 37.7807 3 39.8129 4.03544C41.6004 4.94624 43.0538 6.39955 43.9646 8.18709C45 10.2193 45 12.8795 45 18.2V29.8C45 35.1205 45 37.7807 43.9646 39.8129C43.0538 41.6004 41.6004 43.0538 39.8129 43.9646C37.7807 45 35.1205 45 29.8 45H18.2C12.8795 45 10.2193 45 8.18709 43.9646C6.39955 43.0538 4.94624 41.6004 4.03544 39.8129C3 37.7807 3 35.1205 3 29.8V18.2Z'
                fill='currentColor'
              />
              <path
                d='M23.3526 29.3944H16.8442L15.52 33.6134C15.4832 33.7702 15.3389 33.8812 15.1819 33.8735H11.8854C11.6974 33.8735 11.6317 33.7676 11.6882 33.5556L17.3231 16.9107C17.3795 16.7374 17.4359 16.5399 17.4922 16.3183C17.5659 15.9328 17.6037 15.5409 17.6049 15.148C17.5888 15.0319 17.6908 14.9294 17.8022 14.9457H22.2819C22.4132 14.9457 22.4883 14.9939 22.5073 15.0902L28.9031 33.5845C28.9594 33.7773 28.9031 33.8737 28.734 33.8735H25.0712C24.9428 33.8881 24.8201 33.8 24.7895 33.6712L23.3526 29.3944ZM17.8585 25.7533H22.3101C21.5787 23.2541 20.7533 20.7876 20.0843 18.2689C19.3625 20.7919 18.575 23.3047 17.8585 25.7533Z'
                className='fill-background'
              />
              <path
                d='M32.7064 18.0087C32.419 18.0206 32.1324 17.9701 31.8654 17.8605C31.5984 17.751 31.3569 17.5848 31.1568 17.373C30.9572 17.152 30.8021 16.8927 30.7006 16.61C30.599 16.3273 30.553 16.0268 30.565 15.7258C30.5548 15.4278 30.6059 15.1309 30.7152 14.8546C30.8244 14.5782 30.9893 14.3286 31.199 14.122C31.4066 13.9176 31.6518 13.7574 31.9202 13.6508C32.1886 13.5441 32.4749 13.4931 32.7627 13.5007C33.4389 13.5007 33.9696 13.7078 34.3546 14.122C34.549 14.3373 34.7 14.5897 34.7991 14.8649C34.8982 15.1401 34.9434 15.4327 34.9321 15.7258C34.9439 16.028 34.8964 16.3295 34.7923 16.6125C34.6883 16.8954 34.5298 17.1541 34.3264 17.373C34.1138 17.5879 33.8601 17.7554 33.5813 17.8648C33.3025 17.9742 33.0046 18.0232 32.7064 18.0087ZM30.7622 33.5844V19.7714C30.7622 19.5981 30.8371 19.5114 30.9877 19.5114H34.4532C34.6033 19.5114 34.6785 19.5981 34.6786 19.7714V33.5844C34.6786 33.7772 34.6035 33.8736 34.4532 33.8734H31.0159C30.8468 33.8734 30.7623 33.7771 30.7622 33.5844Z'
                className='fill-background'
              />
            </svg>
          ),
        },
      ] as const,
      editors: [
        {
          name: 'VS Code',
          description: 'Lightweight code editor with extensions.',
          icon: (
            <svg
              xmlns='http://www.w3.org/2000/svg'
              width='800px'
              height='800px'
              viewBox='-0.55 0 235.1 235.1'
            >
              <path
                fill='currentColor'
                d='M83.3 143.9l-58 45.2L0 176.5V58.7L25.2 46l57.6 45.3L174 0l60 23.9v186.9l-59.7 24.3-91-91.2zm88.9 15.9V75.3l-54.6 42.3 54.6 42.2zM27.3 144.6L56 118.5 27.3 89.9v54.7z'
              />
            </svg>
          ),
        },
        {
          name: 'IntelliJ IDEA',
          description: 'Integrated development environment for Java and more.',
          icon: <SiIntellijidea />,
        },
        {
          name: 'Eclipse IDE',
          description: 'Open-source IDE for Java and other languages.',
          icon: <SiEclipseide />,
        },
      ] as const,
    } as const;
  },
} as const;

// The three short cards under the home page's introduction
export const WHAT_I_DO = [
  {
    area: 'frontend',
    title: 'Interfaces',
    description:
      'Fast, accessible interfaces that hold up on every screen size, built as components that are easy to change later.',
    tools: ['TypeScript', 'React', 'Next.js', 'Tailwind CSS', 'shadcn/ui'],
  },
  {
    area: 'backend',
    title: 'APIs and data',
    description:
      'Servers, sign-in and data models that stay simple as the product grows, with Postgres underneath.',
    tools: ['Node.js', 'Bun', 'NestJS', 'PostgreSQL', 'Redis', 'Prisma'],
  },
  {
    area: 'delivery',
    title: 'Design to deployment',
    description:
      'From the first Figma frame to a containerised app running on my own server.',
    tools: ['Figma', 'Docker', 'Git', 'Linux VPS'],
  },
] as const;
