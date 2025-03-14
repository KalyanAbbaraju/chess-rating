/**
 * This script is used to test sitemap generation during development.
 * It generates a sitemap XML file based on the routes defined in the application.
 */

const fs = require('fs');
const path = require('path');

// Define the base URL for your site
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 
  process.env.VERCEL_URL && `https://${process.env.VERCEL_URL}` || 
  'https://eloestimate.com';

// Function to recursively get all page routes
function getPageRoutes(dir, basePath = '') {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  
  const routes = [];
  
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
function getContentFiles() {
  const contentPaths = [];
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
function getLastModifiedDate(filePath) {
  try {
    const stats = fs.statSync(filePath);
    return stats.mtime.toISOString();
  } catch (error) {
    // If there's an error, return current date
    return new Date().toISOString();
  }
}

// Generate the sitemap
function generateSitemap() {
  try {
    // Always include the homepage
    const homepagePath = path.join(process.cwd(), 'src', 'app', 'page.tsx');
    const homepageLastModified = fs.existsSync(homepagePath) 
      ? getLastModifiedDate(homepagePath)
      : new Date().toISOString();
      
    const staticPages = [
      {
        url: `${baseUrl}/`,
        lastModified: homepageLastModified,
        changeFrequency: 'monthly',
        priority: 1.0,
      },
    ];
    
    // Define priority levels for different types of pages
    const priorityMap = {
      'calculators/fide': 0.8,
      'calculators/uscf': 0.8,
      'calculators/ecf': 0.8,
      'about': 0.6,
      'contact': 0.6,
      'privacy': 0.4,
      'terms': 0.4,
    };
    
    // Define change frequency for different types of pages
    const changeFrequencyMap = {
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
    const dynamicPages = allRoutes.map(({ route, filePath }) => {
      // Determine priority based on route
      let priority = 0.5; // Default priority
      for (const [routePattern, priorityValue] of Object.entries(priorityMap)) {
        if (route === routePattern || route.startsWith(`${routePattern}/`)) {
          priority = priorityValue;
          break;
        }
      }
      
      // Determine change frequency based on route
      let changeFrequency = 'monthly'; // Default
      for (const [routePattern, frequency] of Object.entries(changeFrequencyMap)) {
        if (route === routePattern || route.startsWith(`${routePattern}/`)) {
          changeFrequency = frequency;
          break;
        }
      }
      
      // Get last modified date from file
      const lastModified = getLastModifiedDate(filePath);
      
      return {
        url: `${baseUrl}/${route}`,
        lastModified,
        changeFrequency,
        priority,
      };
    });
    
    // Combine static and dynamic pages
    const sitemapData = [...staticPages, ...dynamicPages];
    
    // Convert to XML format
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapData.map(entry => `  <url>
    <loc>${entry.url}</loc>
    <lastmod>${entry.lastModified}</lastmod>
    <changefreq>${entry.changeFrequency}</changefreq>
    <priority>${entry.priority}</priority>
  </url>`).join('\n')}
</urlset>`;
    
    // Write to both test and production files
    const testOutputPath = path.join(process.cwd(), 'public', 'sitemap-test.xml');
    const prodOutputPath = path.join(process.cwd(), 'public', 'sitemap.xml');
    
    fs.writeFileSync(testOutputPath, xml);
    fs.writeFileSync(prodOutputPath, xml);
    
    console.log(`Sitemap generated at ${testOutputPath} (test version)`);
    console.log(`Sitemap generated at ${prodOutputPath} (production version)`);
    console.log(`Found ${sitemapData.length} URLs`);
  } catch (error) {
    console.error('Error generating sitemap:', error);
  }
}

generateSitemap(); 