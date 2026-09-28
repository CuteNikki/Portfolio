import { Metadata } from 'next';

import { PERSONAL_DETAILS } from '@/constants/personal';

export const SITE_URL = 'https://niso.moe';
export const SITE_NAME = 'niso.moe';

// Next.js replaces (not merges) `openGraph` when a page sets its own, so pages
// that need custom Open Graph fields spread this in to keep the shared values.
export const SITE_OPEN_GRAPH = {
  siteName: SITE_NAME,
  locale: 'en_US',
} satisfies Metadata['openGraph'];

export const NO_INDEX = {
  index: false,
  follow: false,
} satisfies Metadata['robots'];

export const SITE_METADATA: Record<string, Metadata> = {
  root: {
    metadataBase: new URL(SITE_URL),
    title: {
      default: 'niso.moe - Portfolio',
      template: 'niso.moe - %s',
    },
    description:
      'Welcome to my personal portfolio website! Explore my projects, skills, and experience as you navigate through my portfolio.',
    applicationName: SITE_NAME,
    authors: [{ name: PERSONAL_DETAILS.fullName, url: SITE_URL }],
    creator: PERSONAL_DETAILS.fullName,
    // Title, description and image are filled in per page by Next.js
    openGraph: { ...SITE_OPEN_GRAPH, type: 'website' },
    twitter: { card: 'summary_large_image' },
  },
  home: {
    title: 'Home',
    description:
      'Welcome to my personal portfolio website! Explore my projects, skills, and experience as you navigate through my portfolio.',
    alternates: { canonical: '/' },
  },
  projects: {
    title: 'Projects',
    description:
      'Discover a curated selection of my projects, showcasing my skills and experience in development. Each project highlights the technologies used.',
    alternates: { canonical: '/projects' },
  },
  contact: {
    title: 'Contact',
    description:
      'Get in touch with me! Whether you have a question, want to collaborate, or just want to say hi, I would love to hear from you.',
    alternates: { canonical: '/contact' },
  },
  notFound: {
    title: '404',
    description:
      'The page you are looking for does not exist. Please check the URL or return to the homepage.',
  },
  privacy: {
    title: 'Privacy Policy',
    description:
      'Read about how I handle your data and protect your privacy on my portfolio website.',
    alternates: { canonical: '/privacy' },
  },
  imprint: {
    title: 'Imprint',
    description:
      'Learn more about the legal information and ownership of this portfolio website.',
    alternates: { canonical: '/imprint' },
  },
  impressum: {
    title: 'Impressum',
    description:
      'Erfahre mehr über die rechtlichen Informationen und den Eigentümern dieser Portfolio-Website.',
    alternates: { canonical: '/impressum' },
  },
  datenschutz: {
    title: 'Datenschutz',
    description:
      'Erfahre, wie deine Daten auf dieser Portfolio-Website verwaltet und deine Privatsphäre geschützt werden.',
    alternates: { canonical: '/datenschutz' },
  },
  posts: {
    title: 'Posts',
    description:
      'Read my latest posts on various topics related to development, technology and more. Stay updated with my insights and experiences.',
    alternates: { canonical: '/posts' },
  },
  dashboard: {
    title: 'Dashboard',
    description:
      'Welcome to the dashboard! Here you can write new posts, manage users and more. This area is protected and only accessible to authorized users.',
    robots: NO_INDEX,
  },
  dashboardUsers: {
    title: 'Users',
    description:
      'Manage users in the dashboard. Here you can view, edit and delete user accounts. This area is protected and only accessible to authorized users.',
  },
  dashboardNewPost: {
    title: 'New Post',
    description:
      'Create a new post! Use the editor to write content and publish it. This area is protected and only accessible to authorized users.',
  },
  dashboardPosts: {
    title: 'Posts',
    description:
      'Manage the posts in the dashboard. Here you can view, edit and delete posts. This area is protected and only accessible to authorized users.',
  },
  dashboardProjects: {
    title: 'Projects',
    description:
      'Manage the projects in the dashboard. Here you can view, edit and delete projects. This area is protected and only accessible to authorized users.',
  },
  dashboardNewProject: {
    title: 'New Project',
    description:
      'Create a new project! Use the editor to write content. This area is protected and only accessible to authorized users.',
  },
} as const;
