import type { MetadataRoute } from 'next';

import { SITE_URL } from '@/constants/metadata';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/dashboard/', '/test'],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
