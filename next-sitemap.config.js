/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_BASE_URL || 'https://eloestimate.com',
  generateRobotsTxt: true,
  robotsTxtOptions: {
    policies: [
      { userAgent: '*', allow: '/' },
      { userAgent: 'GPTBot', disallow: ['/'] },
      { userAgent: 'CCBot', disallow: ['/'] },
      { userAgent: 'ChatGPT-User', disallow: ['/'] },
      { userAgent: 'Google-Extended', allow: ['/'] },
      { userAgent: 'anthropic-ai', disallow: ['/'] },
    ],
  },
  // Custom transform function to set priorities and change frequencies
  transform: async (config, path) => {
    // Define priority levels for different types of pages
    const priorityMap = {
      '/': 1.0,
      '/calculators/fide': 0.8,
      '/calculators/uscf': 0.8,
      '/calculators/ecf': 0.8,
      '/about': 0.6,
      '/contact': 0.6,
      '/privacy': 0.4,
      '/terms': 0.4,
    };
    
    // Define change frequency for different types of pages
    const changeFreqMap = {
      '/': 'monthly',
      '/calculators': 'monthly',
      '/about': 'monthly',
      '/contact': 'monthly',
      '/privacy': 'yearly',
      '/terms': 'yearly',
    };
    
    // Determine priority based on path
    let priority = 0.5; // Default priority
    for (const [routePattern, priorityValue] of Object.entries(priorityMap)) {
      if (path === routePattern || path.startsWith(`${routePattern}/`)) {
        priority = priorityValue;
        break;
      }
    }
    
    // Determine change frequency based on path
    let changefreq = 'monthly'; // Default
    for (const [routePattern, frequency] of Object.entries(changeFreqMap)) {
      if (path === routePattern || path.startsWith(`${routePattern}/`)) {
        changefreq = frequency;
        break;
      }
    }
    
    return {
      loc: path,
      changefreq,
      priority,
      lastmod: new Date().toISOString(),
    };
  },
};
