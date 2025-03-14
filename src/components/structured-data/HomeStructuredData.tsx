import Script from 'next/script';

export default function HomeStructuredData() {
  // Create the structured data object for the homepage
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Elo Estimate',
    alternateName: 'Elo Estimate',
    url: process.env.NEXT_PUBLIC_BASE_URL || 'https://eloestimate.com',
    description: 'Estimate your chess rating changes with professional-grade tools for US Chess, FIDE, and ECF',
    potentialAction: {
      '@type': 'SearchAction',
      'target': {
        '@type': 'EntryPoint',
        'urlTemplate': `${process.env.NEXT_PUBLIC_BASE_URL || 'https://eloestimate.com'}/search?q={search_term_string}`
      },
      'query-input': 'required name=search_term_string'
    }
  };

  // Create organization structured data
  const organizationData = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Elo Estimate',
    url: process.env.NEXT_PUBLIC_BASE_URL || 'https://eloestimate.com',
    logo: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://eloestimate.com'}/icons/icon-512x512.png`,
    sameAs: [
      // Add social media profiles if available
    ]
  };

  return (
    <>
      <Script
        id="website-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <Script
        id="organization-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationData) }}
      />
    </>
  );
} 