import React from 'react';
import { CTAButton } from '@/components/CTAButton';

export default function HeroSection() {
  return (
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
            <CTAButton 
              href="/calculators/fide" 
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              Try FIDE Calculator
            </CTAButton>
            <CTAButton 
              href="/calculators/uscf" 
              variant="outline"
              className="border-indigo-600 text-indigo-600 hover:bg-indigo-50"
            >
              Try USCF Calculator
            </CTAButton>
          </div>
        </div>
      </div>
    </section>
  );
} 