export interface Link {
  label: string;
  url: string;
}

export const LINKS = {
  privacy: {
    label: 'Privacy Policy',
    url: '/privacy#top',
  },
  privacyShort: {
    label: 'Privacy',
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
  about: {
    label: 'About',
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

export const FOOTER_LINKS: Link[] = [LINKS.privacyShort, LINKS.imprint];

export const NAVBAR_LINKS: Link[] = [
  LINKS.about,
  LINKS.projects,
  LINKS.blog,
  LINKS.contact,
];
