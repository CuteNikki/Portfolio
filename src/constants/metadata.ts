import { Metadata } from 'next';

import { PERSONAL_DETAILS } from '@/constants/personal';

export const SITE_URL = 'https://niso.moe';
export const SITE_NAME = 'niso.moe';

// Next.js replaces (not merges) `openGraph` when a page sets its own, so pages
// that need custom Open Graph fields spread this in to keep the shared values.
export const SITE_OPEN_GRAPH = {
  siteName: SITE_NAME,
  locale: 'en_US',
  type: 'website',
} satisfies Metadata['openGraph'];

export const NO_INDEX = {
  index: false,
  follow: false,
} satisfies Metadata['robots'];

/**
 * The metadata of a public page. Link previews show the site name on their own, so the Open Graph title leaves it
 * out of the page title.
 *
 * @param page.title - The page's name, shown before the site name in the browser tab.
 * @param page.path - The page's canonical address.
 * @param page.locale - The Open Graph locale, for pages that aren't in English.
 * @param page.languages - The same page in other languages, by language code.
 */
export function pageMetadata({
  title,
  description,
  path,
  locale,
  languages,
}: {
  title: string;
  description: string;
  path: string;
  locale?: string;
  languages?: Record<string, string>;
}): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path, languages },
    openGraph: {
      ...SITE_OPEN_GRAPH,
      ...(locale && { locale }),
      title,
      url: path,
    },
  };
}

const IMPRINT_LANGUAGES = { en: '/imprint', de: '/impressum' };
const PRIVACY_LANGUAGES = { en: '/privacy', de: '/datenschutz' };

export const SITE_METADATA: Record<string, Metadata> = {
  root: {
    metadataBase: new URL(SITE_URL),
    title: {
      default: SITE_NAME,
      template: `%s - ${SITE_NAME}`,
    },
    description:
      'Full-stack developer building fast, accessible web apps from the ground up.',
    applicationName: SITE_NAME,
    authors: [{ name: PERSONAL_DETAILS.fullName, url: SITE_URL }],
    creator: PERSONAL_DETAILS.fullName,
    // Pages fill in their own title, description and image
    openGraph: SITE_OPEN_GRAPH,
    twitter: { card: 'summary_large_image' },
  },
  home: {
    ...pageMetadata({
      title: `${PERSONAL_DETAILS.firstName} ${PERSONAL_DETAILS.middleName} ${PERSONAL_DETAILS.lastName[0]}., full-stack developer`,
      description:
        'Full-stack developer building fast, accessible web apps from the ground up. See what I have built, read how I build it, or get in touch.',
      path: '/',
    }),
    // The tab shows the site name first on the home page
    title: { absolute: `${SITE_NAME} - Full-stack developer` },
  },
  projects: pageMetadata({
    title: 'Projects',
    description:
      'Things I have built, from web apps to games, each with the technologies behind it and a look at how it works.',
    path: '/projects',
  }),
  contact: pageMetadata({
    title: 'Contact',
    description:
      'Have a question, an idea or a project in mind? Send me a message and I will get back to you.',
    path: '/contact',
  }),
  notFound: {
    title: '404',
    description:
      'The page you are looking for does not exist. Please check the URL or return to the homepage.',
  },
  privacy: pageMetadata({
    title: 'Privacy Policy',
    description:
      'What this site stores about you, why, for how long, and how to download or delete it.',
    path: '/privacy',
    languages: PRIVACY_LANGUAGES,
  }),
  imprint: pageMetadata({
    title: 'Imprint',
    description: 'Legal information about this website and who runs it.',
    path: '/imprint',
    languages: IMPRINT_LANGUAGES,
  }),
  impressum: pageMetadata({
    title: 'Impressum',
    description: 'Rechtliche Angaben zu dieser Website und wer sie betreibt.',
    path: '/impressum',
    locale: 'de_DE',
    languages: IMPRINT_LANGUAGES,
  }),
  datenschutz: pageMetadata({
    title: 'Datenschutz',
    description:
      'Welche Daten diese Website über Sie speichert, wozu, wie lange, und wie Sie sie herunterladen oder löschen können.',
    path: '/datenschutz',
    locale: 'de_DE',
    languages: PRIVACY_LANGUAGES,
  }),
  posts: pageMetadata({
    title: 'Posts',
    description:
      'Notes on how I build things: deep dives into full-stack development, interface details and lessons from my projects.',
    path: '/posts',
  }),
  account: {
    title: 'Account',
    description:
      'Your profile, your comments and the devices you are signed in on.',
    robots: NO_INDEX,
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
  dashboardComments: {
    title: 'Comments',
    description: 'Every comment on every post, to read and moderate.',
  },
  dashboardMedia: {
    title: 'Media',
    description: 'Every picture the site uses and the space they take.',
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
