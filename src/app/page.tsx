import React from 'react';
import Link from 'next/link';
import { Calculator, BarChart2, ChevronsRight } from 'lucide-react';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import HomeStructuredData from '@/components/structured-data/HomeStructuredData';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Elo Estimate - Chess Rating Calculators and Tools',
  description: 'Free chess rating calculators for FIDE, USCF, and ECF. Estimate your rating changes, analyze your performance, and improve your chess game with our tools.'
};

// Add custom styles to override any conflicting styles
const styles = {
  whiteText: {
    color: 'white !important',
  },
  lightBlueText: {
    color: '#bfdbfe !important', // text-blue-100
  },
  indigo700Text: {
    color: '#4338ca !important', // text-indigo-700
  },
  grayText: {
    color: '#4b5563 !important', // text-gray-600
  },
  darkGrayText: {
    color: '#374151 !important', // text-gray-700
  }
};

// Lazy load components below the fold
const FeatureSection = dynamic(() => import('@/components/sections/FeatureSection'), {
  loading: () => <div className="min-h-[300px] flex items-center justify-center">Loading...</div>
});

export default function Home() {
  return (
    <>
      <HomeStructuredData />
      <main>
        {/* Hero Section */}
        <section className="bg-white py-20">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col items-center text-center">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter text-gray-900 mb-6">
                Chess Rating Calculators
              </h1>
              <p className="text-xl text-gray-700 max-w-3xl mb-8">
                Easily calculate your FIDE, USCF, or ECF chess rating changes after tournaments.
                Accurate, up-to-date, and simple to use.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild className="bg-indigo-600 hover:bg-indigo-700 text-white">
                  <Link href="/calculators/fide">Try FIDE Calculator</Link>
                </Button>
                <Button asChild variant="outline" className="border-indigo-600 text-indigo-600 hover:bg-indigo-50">
                  <Link href="/calculators/uscf">Try USCF Calculator</Link>
                </Button>
                <Button asChild variant="outline" className="border-indigo-600 text-indigo-600 hover:bg-indigo-50">
                  <Link href="/calculators/ecf">Try ECF Calculator</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Feature Section (lazy loaded) */}
        <FeatureSection />

        {/* Calculator Options Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4 md:px-6">
            <h2 className="text-3xl font-bold text-center mb-12" style={styles.darkGrayText}>
              Our Calculators
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="bg-white shadow-sm hover:shadow-md transition-all duration-300">
                <CardContent className="p-6">
                  <div className="text-indigo-600 mb-4">
                    <Calculator size={28} />
                  </div>
                  <h3 className="text-xl font-semibold mb-2" style={styles.darkGrayText}>FIDE Rating Calculator</h3>
                  <p className="text-gray-700 mb-4">
                    Calculate your international chess rating changes using the official FIDE formula.
                  </p>
                  <Button asChild variant="outline" className="w-full border-indigo-600 text-indigo-600 hover:bg-indigo-50">
                    <Link href="/calculators/fide">Use Calculator</Link>
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-white shadow-sm hover:shadow-md transition-all duration-300">
                <CardContent className="p-6">
                  <div className="text-indigo-600 mb-4">
                    <BarChart2 size={28} />
                  </div>
                  <h3 className="text-xl font-semibold mb-2" style={styles.darkGrayText}>US Chess Calculator</h3>
                  <p className="text-gray-700 mb-4">
                    Calculate your USCF rating changes with accurate formulas for regular and quick ratings.
                  </p>
                  <Button asChild variant="outline" className="w-full border-indigo-600 text-indigo-600 hover:bg-indigo-50">
                    <Link href="/calculators/uscf">Use Calculator</Link>
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-white shadow-sm hover:shadow-md transition-all duration-300">
                <CardContent className="p-6">
                  <div className="text-indigo-600 mb-4">
                    <Calculator size={28} />
                  </div>
                  <h3 className="text-xl font-semibold mb-2" style={styles.darkGrayText}>ECF Rating Calculator</h3>
                  <p className="text-gray-700 mb-4">
                    Calculate your English Chess Federation rating changes using the official ECF formula.
                  </p>
                  <Button asChild variant="outline" className="w-full border-indigo-600 text-indigo-600 hover:bg-indigo-50">
                    <Link href="/calculators/ecf">Use Calculator</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-16 bg-indigo-600">
          <div className="container mx-auto px-4 md:px-6 text-center">
            <h2 className="text-3xl font-bold mb-4" style={styles.whiteText}>
              Start Calculating Your Chess Rating
            </h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto" style={styles.lightBlueText}>
              Our calculators use the official formulas from FIDE, USCF, and ECF to give you accurate results.
            </p>
            <Button asChild size="lg" className="bg-white text-indigo-600 hover:bg-indigo-50">
              <Link href="/calculators/fide">
                Get Started <ChevronsRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </section>
      </main>
    </>
  );
}
