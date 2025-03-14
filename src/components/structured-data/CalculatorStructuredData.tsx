import Script from 'next/script';

interface CalculatorStructuredDataProps {
  name: string;
  description: string;
  url: string;
  calculatorType: 'FIDE' | 'USCF' | 'ECF';
}

export default function CalculatorStructuredData({
  name,
  description,
  url,
  calculatorType
}: CalculatorStructuredDataProps) {
  // Create the structured data object
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name,
    description,
    applicationCategory: 'UtilityApplication',
    operatingSystem: 'Any',
    url,
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock'
    },
    audience: {
      '@type': 'Audience',
      audienceType: 'Chess Players'
    },
    featureList: `${calculatorType} Chess Rating Calculator`,
    keywords: `chess, rating calculator, ${calculatorType.toLowerCase()} rating, chess elo, chess rating system`,
    softwareVersion: '1.0',
    educationalLevel: 'Beginner to Advanced',
    educationalUse: 'Assessment',
    interactivityType: 'mixed',
    learningResourceType: 'calculator',
    accessibilityFeature: [
      'highContrastDisplay',
      'readingOrder',
      'structuralNavigation'
    ],
    accessibilityHazard: 'none',
    accessibilityControl: [
      'fullKeyboardControl',
      'fullMouseControl'
    ],
    browserRequirements: 'Requires JavaScript',
    inLanguage: 'en-US',
    copyrightYear: new Date().getFullYear(),
    license: 'https://creativecommons.org/licenses/by-nc-sa/4.0/',
    version: '1.0.0',
    softwareHelp: `${url}/help`,
    softwarePrerequisites: 'Modern web browser with JavaScript enabled',
    softwareApplicationCategory: 'UtilityApplication',
    softwareOperatingSystem: 'Any',
    softwarePlatform: 'Web',
    softwareRequirements: 'JavaScript',
  };

  return (
    <Script
      id={`${calculatorType.toLowerCase()}-calculator-structured-data`}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
} 