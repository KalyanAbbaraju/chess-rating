import { MetadataRoute } from 'next';
import fs from 'fs';
import path from 'path';

// Get the base URL from environment variables or use a default
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 
  process.env.VERCEL_URL && `https://${process.env.VERCEL_URL}` || 
  'https://eloestimate.com';

// Function to recursively get all page routes
function getPageRoutes(dir: string, basePath: string = ''): Array<{ route: string, filePath: string }> {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  
  const routes: Array<{ route: string, filePath: string }> = [];
  
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    const relativePath = path.join(basePath, entry.name);
    
    // Skip API routes, layout files, and other non-page files
    if (
      entry.name.startsWith('_') || 
      entry.name.startsWith('.') || 
      entry.name === 'api' || 
      entry.name === 'not-found.tsx' ||
      entry.name === 'layout.tsx' || 
      entry.name === 'sitemap.ts' ||
      entry.name === 'robots.ts' ||
      entry.name === 'page.tsx' && basePath === '' // Skip root page.tsx as it's handled separately
    ) {
      continue;
    }
    
    if (entry.isDirectory()) {
      // Recursively get routes from subdirectories
      routes.push(...getPageRoutes(fullPath, relativePath));
    } else if (entry.name === 'page.tsx') {
      // Found a page file, add its route
      // Convert the basePath to a URL path format
      const routePath = basePath.replace(/\\/g, '/');
      routes.push({ 
        route: routePath, 
        filePath: fullPath 
      });
    }
  }
  
  return routes;
}

// Function to get content file paths
function getContentFiles(): Array<{ route: string, filePath: string }> {
  const contentPaths: Array<{ route: string, filePath: string }> = [];
  const contentDir = path.join(process.cwd(), 'public', 'content');
  
  // Check if content directory exists
  if (!fs.existsSync(contentDir)) {
    return contentPaths;
  }
  
  // Get all calculator types (fide, uscf, ecf)
  const calculatorTypes = fs.readdirSync(contentDir, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);
  
  // For each calculator type, check if info.md exists
  for (const calcType of calculatorTypes) {
    const infoPath = path.join(contentDir, calcType, 'info.md');
    if (fs.existsSync(infoPath)) {
      contentPaths.push({
        route: `calculators/${calcType}/info`,
        filePath: infoPath
      });
    }
  }
  
  return contentPaths;
}

// Get the last modified date of a file
function getLastModifiedDate(filePath: string): string {
  try {
    const stats = fs.statSync(filePath);
    return stats.mtime.toISOString();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (_) {
    // If there's an error, return current date
    return new Date().toISOString();
  }
}

export default function sitemap(): MetadataRoute.Sitemap {
  // Always include the homepage
  const homepagePath = path.join(process.cwd(), 'src', 'app', 'page.tsx');
  const homepageLastModified = fs.existsSync(homepagePath) 
    ? getLastModifiedDate(homepagePath)
    : new Date().toISOString();
    
  const staticPages = [
    {
      url: `${baseUrl}/`,
      lastModified: homepageLastModified,
      changeFrequency: 'monthly' as const,
      priority: 1.0,
    },
  ];
  
  // Define priority levels for different types of pages
  const priorityMap: Record<string, number> = {
    'calculators/fide': 0.8,
    'calculators/uscf': 0.8,
    'calculators/ecf': 0.8,
    'about': 0.6,
    'contact': 0.6,
    'privacy': 0.4,
    'terms': 0.4,
  };
  
  // Define change frequency for different types of pages
  const changeFrequencyMap: Record<string, 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never'> = {
    'calculators': 'monthly',
    'about': 'monthly',
    'contact': 'monthly',
    'privacy': 'yearly',
    'terms': 'yearly',
  };
  
  // Get all page routes by scanning the app directory
  const appDir = path.join(process.cwd(), 'src', 'app');
  const dynamicRoutes = getPageRoutes(appDir);
  
  // Get content file paths
  const contentRoutes = getContentFiles();
  
  // Combine all routes
  const allRoutes = [...dynamicRoutes, ...contentRoutes];
  
  // Convert routes to sitemap entries
  const dynamicPages = allRoutes.map((route) => {
    // Extract route and filePath properties safely
    const routePath = 'route' in route ? route.route : '';
    const filePath = 'filePath' in route ? route.filePath : '';
    
    // Determine priority based on route
    let priority = 0.5; // Default priority
    for (const [routePattern, priorityValue] of Object.entries(priorityMap)) {
      if (routePath === routePattern || routePath.startsWith(`${routePattern}/`)) {
        priority = priorityValue;
        break;
      }
    }
    
    // Determine change frequency based on route
    let changeFrequency: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never' = 'monthly'; // Default
    for (const [routePattern, frequency] of Object.entries(changeFrequencyMap)) {
      if (routePath === routePattern || routePath.startsWith(`${routePattern}/`)) {
        changeFrequency = frequency;
        break;
      }
    }
    
    // Get last modified date from file
    const lastModified = filePath ? getLastModifiedDate(filePath) : new Date().toISOString();
    
    return {
      url: `${baseUrl}/${routePath}`,
      lastModified,
      changeFrequency,
      priority,
    };
  });
  
  // Add additional routes
  const additionalRoutes = [
    {
      url: `${baseUrl}/help`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/faq`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }
  ];
  
  // Combine static and dynamic pages
  return [...staticPages, ...dynamicPages, ...additionalRoutes];
} 