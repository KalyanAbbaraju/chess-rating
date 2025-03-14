# Dynamic Sitemap Generation

This document explains how the dynamic sitemap generation works in the Chess Companion application.

## Overview

The application uses Next.js's built-in sitemap generation capabilities to create a dynamic sitemap that includes:

1. All static pages in the application
2. Calculator pages (FIDE, USCF, ECF)
3. Content pages (info.md files)

The sitemap is generated at build time and is available at `/sitemap.xml`.

## Implementation Details

### Files

- `src/app/sitemap.ts`: The main sitemap generator
- `src/app/robots.ts`: The robots.txt generator
- `scripts/generate-sitemap.js`: A utility script for testing sitemap generation during development

### How It Works

1. **Page Discovery**: The sitemap generator scans the `src/app` directory to find all page components.
2. **Content Discovery**: It also scans the `public/content` directory to find all markdown content files.
3. **Metadata**: For each page, it determines:
   - Priority (how important the page is)
   - Change frequency (how often the page changes)
   - Last modified date (based on file modification time)
4. **Generation**: The sitemap is generated in the standard XML format during the build process.

### Priority Levels

Pages are assigned different priority levels based on their importance:

- Homepage: 1.0
- Calculator pages: 0.8
- About/Contact pages: 0.6
- Legal pages (Privacy, Terms): 0.4
- Other pages: 0.5 (default)

### Change Frequency

Pages are assigned different change frequencies based on how often they're updated:

- Calculator pages: monthly
- About/Contact pages: monthly
- Legal pages: yearly
- Other pages: monthly (default)

## Testing

You can test the sitemap generation locally by running:

```bash
npm run generate-sitemap
```

This will create a `sitemap-test.xml` file in the `public` directory.

## SEO Benefits

The dynamic sitemap provides several SEO benefits:

1. **Improved Indexing**: Search engines can discover all pages in the application.
2. **Content Prioritization**: More important pages are assigned higher priority.
3. **Freshness Signals**: Last modified dates help search engines understand when content was updated.
4. **Automatic Updates**: New pages are automatically included in the sitemap.

## Maintenance

When adding new pages to the application, you don't need to manually update the sitemap. The sitemap generator will automatically discover new pages during the build process.

If you want to customize the priority or change frequency for specific pages, you can update the `priorityMap` and `changeFrequencyMap` objects in `src/app/sitemap.ts`. 