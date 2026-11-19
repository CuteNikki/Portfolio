import { SITE_URL } from '@/constants/metadata';
import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/dashboard/', '/account'],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
