import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/api/',
        '/dashboard/',
        '/profile/',
        '/progress/goals/',
        '/admin/',
      ],
    },
    sitemap: 'https://care4brain.pro/sitemap.xml',
    host: 'https://care4brain.pro',
  };
}
