import React from 'react';
import Link from 'next/link';
import { Calculator, BarChart2, ChevronsRight, Award, Users, Clock, ExternalLink } from 'lucide-react';

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

export const metadata = {
  title: 'Chess Rating Estimator | Professional Chess Tools',
  description: 'Estimate your chess rating changes with professional-grade tools for US Chess and FIDE and more',
};

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - Full Width with overflow technique */}
      <section className="relative w-[100vw] left-[50%] translate-x-[-50%] bg-gradient-to-br from-indigo-600 via-blue-700 to-blue-900">
        <div className="w-full max-w-7xl mx-auto px-4 md:px-6 py-16 md:py-24">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 space-y-6">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight" style={styles.whiteText}>
                Estimate Your Chess Rating Changes
              </h1>
              <p className="text-lg md:text-xl" style={styles.lightBlueText}>
                Professional-grade chess rating estimators using official formulas from FIDE, US Chess, and more.
              </p>
              <div className="pt-4">
                <Link 
                  href="/uschess-rating-estimator" 
                  className="inline-flex items-center px-6 py-3 text-base font-medium rounded-md bg-white hover:bg-blue-50 focus:outline-none transition-colors shadow-md"
                >
                  <span style={styles.indigo700Text}>Try US Chess Rating Estimator</span>
                  <ChevronsRight className="ml-2 h-5 w-5" style={styles.indigo700Text} />
                </Link>
              </div>
            </div>
            <div className="md:w-1/2 mt-10 md:mt-0 flex justify-center">
              <div className="bg-white p-8 rounded-full shadow-xl bg-opacity-90">
                <Calculator className="w-32 h-32 md:w-48 md:h-48" style={styles.indigo700Text} />
              </div>
            </div>
          </div>
        </div>
        
        {/* Full width diagonal divider */}
        <div className="h-8 w-full relative overflow-hidden">
          <div className="absolute bottom-0 left-0 right-0 h-8 bg-white" 
               style={{ clipPath: 'polygon(0 100%, 100% 100%, 100% 30%, 0 100%)' }}>
          </div>
        </div>
      </section>

      {/* Calculators Section - moved closer to hero */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-3xl font-bold text-center mb-10" style={styles.darkGrayText}>
            Choose Your Rating Estimator
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            
            {/* US Chess Card */}
            <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 flex flex-col transform hover:-translate-y-1">
              <div className="bg-gradient-to-r from-red-700 to-red-900 px-6 py-5">
                <h3 className="text-xl font-semibold" style={styles.whiteText}>US Chess Rating</h3>
              </div>
              <div className="p-6 flex-grow">
                <div className="mb-4 text-red-700">
                  <Calculator size={32} />
                </div>
                <p className="text-gray-600 mb-6">
                  Calculate your US Chess rating changes with bonus points, rating floors, and special category adjustments.
                </p>
                <ul className="space-y-2 mb-6 text-sm text-gray-700">
                  <li className="flex items-center">
                    <span className="bg-red-100 p-1 rounded-full mr-2 text-red-700">✓</span>
                    <span className="text-gray-700">Official USCF formula</span>
                  </li>
                  <li className="flex items-center">
                    <span className="bg-red-100 p-1 rounded-full mr-2 text-red-700">✓</span>
                    <span className="text-gray-700">Quick, Regular & Dual rating modes</span>
                  </li>
                  <li className="flex items-center">
                    <span className="bg-red-100 p-1 rounded-full mr-2 text-red-700">✓</span>
                    <span className="text-gray-700">Rating floor protection</span>
                  </li>
                </ul>
              </div>
              <div className="px-6 pb-6">
                <Link href="/uschess-rating-estimator" className="block w-full py-2.5 px-4 bg-gradient-to-r from-red-700 to-red-900 hover:from-red-800 hover:to-red-950 text-center rounded-md transition-colors">
                  <span style={styles.whiteText}>Open Calculator</span>
                </Link>
              </div>
            </div>

            {/* FIDE Card */}
            <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 flex flex-col transform hover:-translate-y-1">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-5">
                <h3 className="text-xl font-semibold" style={styles.whiteText}>FIDE Rating</h3>
              </div>
              <div className="p-6 flex-grow">
                <div className="mb-4" style={styles.indigo700Text}>
                  <BarChart2 size={32} />
                </div>
                <p className="mb-6" style={styles.grayText}>
                  Estimate international Elo rating changes using the official FIDE formula for standard, rapid, and blitz games.
                </p>
                <ul className="space-y-2 mb-6 text-sm text-gray-700">
                  <li className="flex items-center">
                    <span className="bg-indigo-100 p-1 rounded-full mr-2 text-indigo-600">✓</span>
                    <span className="text-gray-700">Official FIDE K-factor rules</span>
                  </li>
                  <li className="flex items-center">
                    <span className="bg-indigo-100 p-1 rounded-full mr-2 text-indigo-600">✓</span>
                    <span className="text-gray-700">Performance rating calculator</span>
                  </li>
                  <li className="flex items-center">
                    <span className="bg-indigo-100 p-1 rounded-full mr-2 text-indigo-600">✓</span>
                    <span className="text-gray-700">Expected score tables</span>
                  </li>
                </ul>
              </div>
              <div className="px-6 pb-6">
                <Link href="/fide-rating-estimator" className="block w-full py-2.5 px-4 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-center rounded-md transition-colors">
                  <span style={styles.whiteText}>Open Calculator</span>
                </Link>
              </div>
            </div>
            
            {/* Coming Soon Card */}
            <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 flex flex-col transform hover:-translate-y-1">
              <div className="bg-gradient-to-r from-slate-600 to-slate-800 px-6 py-5">
                <h3 className="text-xl font-semibold" style={styles.whiteText}>More Coming Soon</h3>
              </div>
              <div className="p-6 flex-grow">
                <div className="mb-4 text-slate-600">
                  <Clock size={32} />
                </div>
                <p className="text-gray-600 mb-6">
                  We&apos;re working on adding more rating calculators for different chess federations and rating systems.
                </p>
                <ul className="space-y-2 mb-6 text-sm">
                  <li className="flex items-center">
                    <span className="bg-slate-100 p-1 rounded-full mr-2 text-slate-400">○</span>
                    <span className="text-gray-500">ECF (England) Rating Calculator</span>
                  </li>
                  <li className="flex items-center">
                    <span className="bg-slate-100 p-1 rounded-full mr-2 text-slate-400">○</span>
                    <span className="text-gray-500">CFC (Canada) Rating Calculator</span>
                  </li>
                  <li className="flex items-center">
                    <span className="bg-slate-100 p-1 rounded-full mr-2 text-slate-400">○</span>
                    <span className="text-gray-500">Custom Tournament Simulations</span>
                  </li>
                </ul>
              </div>
              <div className="px-6 pb-6">
                <button disabled className="block w-full py-2.5 px-4 bg-gradient-to-r from-slate-400 to-slate-500 text-center rounded-md cursor-not-allowed">
                  <span style={styles.whiteText}>Coming Soon</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-3xl font-bold text-center mb-12" style={styles.darkGrayText}>
            Why Use Our Calculators
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 bg-gradient-to-br from-white to-indigo-50">
              <div className="text-indigo-600 mb-4">
                <Calculator size={26} />
              </div>
              <h3 className="text-xl font-semibold mb-2" style={styles.darkGrayText}>Accurate Formulas</h3>
              <p className="text-gray-700">
                All calculators use the official, up-to-date formulas from their respective chess federations.
              </p>
            </div>
            
            <div className="p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 bg-gradient-to-br from-white to-indigo-50">
              <div className="text-indigo-600 mb-4">
                <Award size={26} />
              </div>
              <h3 className="text-xl font-semibold mb-2" style={styles.darkGrayText}>Special Rules</h3>
              <p className="text-gray-700">
                Accounts for special cases like rating floors, bonus points, and category adjustments.
              </p>
            </div>
            
            <div className="p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 bg-gradient-to-br from-white to-indigo-50">
              <div className="text-indigo-600 mb-4">
                <Users size={26} />
              </div>
              <h3 className="text-xl font-semibold mb-2" style={styles.darkGrayText}>Made for Players</h3>
              <p className="text-gray-700">
                Designed by chess players for chess players, with intuitive interfaces and helpful explanations.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Resource Links */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-3xl font-bold text-center mb-12" style={styles.darkGrayText}>
            Chess Rating Resources
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <a href="https://www.fide.com/FIDE/handbook/LawsOfChess.pdf" target="_blank" rel="noopener noreferrer" 
               className="bg-white p-5 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 flex items-center border border-gray-200 hover:border-indigo-200 transform hover:-translate-y-1">
              <div className="mr-4 text-indigo-600">
                <ExternalLink size={24} />
              </div>
              <div>
                <h3 className="font-semibold" style={styles.darkGrayText}>FIDE Rating Regulations</h3>
                <p className="text-sm" style={styles.grayText}>Official rating regulations handbook from FIDE</p>
              </div>
            </a>
            
            <a href="https://new.uschess.org/sites/default/files/media/documents/us-chess-rule-book-online-only-edition-chapters-1-2-11-9-21.pdf" target="_blank" rel="noopener noreferrer"
               className="bg-white p-5 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 flex items-center border border-gray-200 hover:border-red-200 transform hover:-translate-y-1">
              <div className="mr-4 text-red-700">
                <ExternalLink size={24} />
              </div>
              <div>
                <h3 className="font-semibold" style={styles.darkGrayText}>US Chess Rating System</h3>
                <p className="text-sm" style={styles.grayText}>US Chess Federation&apos;s official rating documentation</p>
              </div>
            </a>
          </div>
        </div>
      </section>
      
      {/* Call to Action */}
      <section className="bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
        <div className="container mx-auto px-4 md:px-6 py-16 text-center">
          <h2 className="text-3xl font-bold mb-6" style={styles.whiteText}>Ready to Calculate Your Rating?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto" style={styles.lightBlueText}>
            Try our chess rating calculators to predict your post-tournament rating changes.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/fide-rating-estimator" 
                  className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md bg-white hover:bg-indigo-50 transition-colors shadow-md">
              <span style={styles.indigo700Text}>FIDE Calculator</span>
            </Link>
            <Link href="/uschess-rating-estimator"
                  className="inline-flex items-center justify-center px-6 py-3 border border-indigo-300 text-base font-medium rounded-md bg-transparent hover:bg-indigo-800 transition-colors shadow-md">
              <span style={styles.whiteText}>US Chess Calculator</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
