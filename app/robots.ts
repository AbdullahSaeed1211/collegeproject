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
    sitemap: 'https://brain.abdullahsaeed.me/sitemap.xml',
    host: 'https://brain.abdullahsaeed.me',
  };
}
