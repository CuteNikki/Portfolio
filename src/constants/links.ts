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
  contact: {
    label: 'Contact',
    url: '/contact#top',
    icon: MailIcon,
  },
  posts: {
    label: 'Blog',
    url: '/posts#top',
    icon: NewspaperIcon,
  },
  postWithSlugOrId: (id: string) => ({
    label: 'Post',
    url: `/posts/${id}`,
    icon: NewspaperIcon,
  }),
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
};

export const FOOTER_LINKS: Link[] = [LINKS.privacyShort, LINKS.imprint];

export const NAVBAR_LINKS: Link[] = [
  LINKS.about,
  LINKS.projects,
  LINKS.posts,
  LINKS.contact,
  LINKS.dashboard,
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
];
