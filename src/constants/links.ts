export interface Link {
  label: string;
  url: string;
}

export const LINKS = {
  privacy: {
    label: 'Privacy Policy',
    url: '/privacy#top',
  },
  datenschutz: {
    label: 'Datenschutz',
    url: '/datenschutz#top',
  },
  imprint: {
    label: 'Imprint',
    url: '/imprint#top',
  },
  impressum: {
    label: 'Impressum',
    url: '/impressum#top',
  },
  home: {
    label: 'Home',
    url: '/#top',
  },
  projects: {
    label: 'Projects',
    url: '/projects#top',
  },
  contact: {
    label: 'Contact',
    url: '/contact#top',
  },
  blog: {
    label: 'Blog',
    url: '/blog#top',
  },
};

export const FOOTER_LINKS: Link[] = [LINKS.privacy, LINKS.imprint];

export const NAVBAR_LINKS: Link[] = [
  LINKS.home,
  LINKS.projects,
  LINKS.contact,
  LINKS.blog,
];
