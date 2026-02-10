import { Metadata } from 'next';

export const SITE_METADATA = {
  root: {
    title: 'niso.moe - Portfolio',
    description:
      'Welcome to my personal portfolio website! Explore my projects, skills, and experience as you navigate through my portfolio.',
  } satisfies Metadata,
  home: {
    title: 'niso.moe - Home',
    description:
      'Welcome to my personal portfolio website! Explore my projects, skills, and experience as you navigate through my portfolio.',
  } satisfies Metadata,
  projects: {
    title: 'niso.moe - Projects',
    description:
      'Discover a curated selection of my projects, showcasing my skills and experience in development. Each project highlights the technologies used.',
  } satisfies Metadata,
  contact: {
    title: 'niso.moe - Contact',
    description:
      'Get in touch with me! Whether you have a question, want to collaborate, or just want to say hi, I would love to hear from you.',
  } satisfies Metadata,
  notFound: {
    title: 'niso.moe - 404',
    description:
      'The page you are looking for does not exist. Please check the URL or return to the homepage.',
  } satisfies Metadata,
  privacy: {
    title: 'niso.moe - Privacy Policy',
    description:
      'Read about how I handle your data and protect your privacy on my portfolio website.',
  } satisfies Metadata,
  imprint: {
    title: 'niso.moe - Imprint',
    description:
      'Learn more about the legal information and ownership of this portfolio website.',
  } satisfies Metadata,
  impressum: {
    title: 'niso.moe - Impressum',
    description:
      'Erfahre mehr über die rechtlichen Informationen und den Eigentümern dieser Portfolio-Website.',
  } satisfies Metadata,
  datenschutz: {
    title: 'niso.moe - Datenschutz',
    description:
      'Erfahre, wie deine Daten auf dieser Portfolio-Website verwaltet und deine Privatsphäre geschützt werden.',
  } satisfies Metadata,
} as const;
