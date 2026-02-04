export interface Link {
  label: string;
  url: string;
}

export const FOOTER_LINKS: Link[] = [
  { label: 'Imprint', url: '/imprint#top' },
  { label: 'Privacy', url: '/privacy#top' },
];

export const NAVBAR_LINKS: Link[] = [
  { label: 'Home', url: '/#top' },
  { label: 'Projects', url: '/projects#top' },
  { label: 'Contact', url: '/contact#top' },
];
