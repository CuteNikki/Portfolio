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
  blog: {
    label: 'Blog',
    url: '/blog#top',
    icon: NewspaperIcon,
  },
  dashboard: {
    label: 'Dashboard',
    url: '/dashboard#top',
    icon: PanelsTopLeftIcon,
  },
  dashboardOverview: {
    label: 'Overview',
    url: '/dashboard#top',
    icon: PanelsTopLeftIcon,
  },
  dashboardUsers: {
    label: 'Users',
    url: '/dashboard/users#top',
    icon: Users2Icon,
  },
  dashboardPosts: {
    label: 'Posts',
    url: '/dashboard/blog#top',
    icon: NewspaperIcon,
  },
  dashboardPostNew: {
    label: 'New Post',
    url: '/dashboard/blog/new#top',
    icon: NewspaperIcon,
  },
  dashboardPostEdit: {
    label: 'Edit Post',
    url: '/dashboard/blog/edit#top',
    icon: NewspaperIcon,
  },
  dashboardPostEditWithId: (id: string) => ({
    label: 'Edit Post',
    url: `/dashboard/blog/edit/${id}#top`,
    icon: NewspaperIcon,
  }),
};

export const FOOTER_LINKS: Link[] = [LINKS.privacyShort, LINKS.imprint];

export const NAVBAR_LINKS: Link[] = [
  LINKS.about,
  LINKS.projects,
  LINKS.blog,
  LINKS.contact,
];

export const SIDEBAR_LINKS: Link[] = [
  LINKS.home,
  LINKS.projects,
  LINKS.blog,
  LINKS.contact,
];

export const DASHBOARD_LINKS: Link[] = [
  LINKS.dashboardOverview,
  LINKS.dashboardUsers,
  LINKS.dashboardPosts,
];
