import { MetadataRoute } from 'next';

// Get the base URL from environment variables or use a default
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 
  process.env.VERCEL_URL && `https://${process.env.VERCEL_URL}` || 
  'https://eloestimate.com';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/_next/', '/private/', '/admin/'],
      },
      {
        userAgent: 'GPTBot',
        disallow: ['/'],
      },
      {
        userAgent: 'CCBot',
        disallow: ['/'],
      },
      {
        userAgent: 'ChatGPT-User',
        disallow: ['/'],
      },
      {
        userAgent: 'Google-Extended',
        allow: ['/'],
      },
      {
        userAgent: 'anthropic-ai',
        disallow: ['/'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
} 
