import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-100 border-t border-gray-200 py-6 md:py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          <div>
            <h3 className="font-semibold text-lg mb-3 md:mb-4">Chess Companion</h3>
            <p className="text-gray-600 text-sm mb-4">
              Tools and resources for chess players of all levels.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-3 md:mb-4">Quick Links</h3>
            <ul className="space-y-1.5 md:space-y-2">
              <li>
                <Link href="/" className="text-gray-600 hover:text-blue-600 text-sm">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/uschess-rating-estimator" className="text-gray-600 hover:text-blue-600 text-sm">
                  US Chess Rating Estimator
                </Link>
              </li>
              <li>
                <Link href="/fide-rating-estimator" className="text-gray-600 hover:text-blue-600 text-sm">
                  FIDE Rating Estimator
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-600 hover:text-blue-600 text-sm">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-3 md:mb-4">Legal</h3>
            <ul className="space-y-1.5 md:space-y-2">
              <li>
                <Link href="/privacy" className="text-gray-600 hover:text-blue-600 text-sm">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-600 hover:text-blue-600 text-sm">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-200 mt-6 md:mt-8 pt-4 md:pt-6 text-center text-gray-500 text-xs md:text-sm">
          <p>© {new Date().getFullYear()} Chess Companion. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
} 