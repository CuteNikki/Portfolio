import { Metadata } from 'next';

export const SITE_METADATA: Record<string, Metadata> = {
  root: {
    title: 'niso.moe - Portfolio',
    description:
      'Welcome to my personal portfolio website! Explore my projects, skills, and experience as you navigate through my portfolio.',
  },
  home: {
    title: 'niso.moe - Home',
    description:
      'Welcome to my personal portfolio website! Explore my projects, skills, and experience as you navigate through my portfolio.',
  },
  projects: {
    title: 'niso.moe - Projects',
    description:
      'Discover a curated selection of my projects, showcasing my skills and experience in development. Each project highlights the technologies used.',
  },
  contact: {
    title: 'niso.moe - Contact',
    description:
      'Get in touch with me! Whether you have a question, want to collaborate, or just want to say hi, I would love to hear from you.',
  },
  notFound: {
    title: 'niso.moe - 404',
    description:
      'The page you are looking for does not exist. Please check the URL or return to the homepage.',
  },
  privacy: {
    title: 'niso.moe - Privacy Policy',
    description:
      'Read about how I handle your data and protect your privacy on my portfolio website.',
  },
  imprint: {
    title: 'niso.moe - Imprint',
    description:
      'Learn more about the legal information and ownership of this portfolio website.',
  },
  impressum: {
    title: 'niso.moe - Impressum',
    description:
      'Erfahre mehr über die rechtlichen Informationen und den Eigentümern dieser Portfolio-Website.',
  },
  datenschutz: {
    title: 'niso.moe - Datenschutz',
    description:
      'Erfahre, wie deine Daten auf dieser Portfolio-Website verwaltet und deine Privatsphäre geschützt werden.',
  },
} as const;
