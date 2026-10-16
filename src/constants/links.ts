import {
  HomeIcon,
  LucideIcon,
  MailIcon,
  NewspaperIcon,
  PanelsTopLeftIcon,
  PresentationIcon,
  ScaleIcon,
  ShieldCheckIcon,
  User2Icon,
  Users2Icon,
} from 'lucide-react';

export interface Link {
  icon?: LucideIcon;
  // Shown to admins only, e.g. the users page
  requiresAdmin?: boolean;
  // For links to pages in another language, e.g. the German Impressum
  lang?: string;
  requiresAuth?: boolean;
  label: string;
  url: string;
}

export const LINKS = {
  privacy: {
    label: 'Privacy Policy',
    url: '/privacy#top',
    icon: ShieldCheckIcon,
  },
  privacyShort: {
    label: 'Privacy',
    url: '/privacy#top',
    icon: ShieldCheckIcon,
  },
  datenschutz: {
    label: 'Datenschutz',
    url: '/datenschutz#top',
    icon: ShieldCheckIcon,
    lang: 'de',
  },
  imprint: {
    label: 'Imprint',
    url: '/imprint#top',
    icon: ScaleIcon,
  },
  impressum: {
    label: 'Impressum',
    url: '/impressum#top',
    icon: ScaleIcon,
    lang: 'de',
  },
  home: {
    label: 'Home',
    url: '/#top',
    icon: HomeIcon,
  },
  about: {
    label: 'About',
    url: '/#top',
    icon: User2Icon,
  },
  projects: {
    label: 'Projects',
    url: '/projects#top',
    icon: PresentationIcon,
  },
  projectWithSlugOrId: (id: string) => ({
    label: 'Project',
    url: `/projects/${id}`,
    icon: PresentationIcon,
  }),
  contact: {
    label: 'Contact',
    url: '/contact#top',
    icon: MailIcon,
  },
  posts: {
    label: 'Posts',
    url: '/posts#top',
    icon: NewspaperIcon,
  },
  postWithSlugOrId: (id: string) => ({
    label: 'Post',
    url: `/posts/${id}`,
    icon: NewspaperIcon,
  }),
  account: {
    label: 'Account',
    url: '/account#top',
    icon: User2Icon,
    requiresAuth: true,
  },
  accountComments: {
    label: 'Your comments',
    url: '/account#comments',
    icon: User2Icon,
    requiresAuth: true,
  },
  dashboard: {
    label: 'Dashboard',
    url: '/dashboard#top',
    icon: PanelsTopLeftIcon,
    requiresAuth: true,
  },
  dashboardOverview: {
    label: 'Overview',
    url: '/dashboard#top',
    icon: PanelsTopLeftIcon,
    requiresAuth: true,
  },
  dashboardUsers: {
    label: 'Users',
    url: '/dashboard/users#top',
    icon: Users2Icon,
    requiresAuth: true,
    requiresAdmin: true,
  },
  dashboardPosts: {
    label: 'Posts',
    url: '/dashboard/posts#top',
    icon: NewspaperIcon,
    requiresAuth: true,
  },
  dashboardPostNew: {
    label: 'New Post',
    url: '/dashboard/posts/new#top',
    icon: NewspaperIcon,
    requiresAuth: true,
  },
  dashboardPostEdit: {
    label: 'Edit Post',
    url: '/dashboard/posts/edit#top',
    icon: NewspaperIcon,
    requiresAuth: true,
  },
  dashboardPostEditWithId: (id: string) => ({
    label: 'Edit Post',
    url: `/dashboard/posts/edit/${id}#top`,
    icon: NewspaperIcon,
    requiresAuth: true,
  }),
  dashboardProjects: {
    label: 'Projects',
    url: '/dashboard/projects#top',
    icon: PresentationIcon,
    requiresAuth: true,
  },
  dashboardProjectNew: {
    label: 'New Project',
    url: '/dashboard/projects/new#top',
    icon: PresentationIcon,
    requiresAuth: true,
  },
  dashboardProjectEdit: {
    label: 'Edit Project',
    url: '/dashboard/projects/edit#top',
    icon: PresentationIcon,
    requiresAuth: true,
  },
  dashboardProjectEditWithId: (id: string) => ({
    label: 'Edit Project',
    url: `/dashboard/projects/edit/${id}#top`,
    icon: PresentationIcon,
    requiresAuth: true,
  }),
};

// The German Impressum and Datenschutz pages are linked from the English ones, so the footer lists only one of each
export const FOOTER_LINKS: Link[] = [LINKS.imprint, LINKS.privacyShort];

// The site name links home, and the dashboard and account pages are in the account menu
export const NAVBAR_LINKS: Link[] = [
  LINKS.projects,
  LINKS.posts,
  LINKS.contact,
];

export const SIDEBAR_LINKS: Link[] = [
  LINKS.home,
  LINKS.projects,
  LINKS.posts,
  LINKS.contact,
];

export const DASHBOARD_LINKS: Link[] = [
  LINKS.dashboardOverview,
  LINKS.dashboardUsers,
  LINKS.dashboardPosts,
  LINKS.dashboardProjects,
];
