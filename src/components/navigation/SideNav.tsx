'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronLeft, Calculator, BarChart2, Home, Menu, Mail } from 'lucide-react';

export default function SideNav() {
  const [showSidebar, setShowSidebar] = useState(false);
  const pathname = usePathname();
  
  // Close sidebar when route changes
  useEffect(() => {
    setShowSidebar(false);
  }, [pathname]);
  
  const isActive = (path: string) => pathname === path;
  
  return (
    <>
      {/* Toggle button - always visible */}
      <div className="fixed top-0 left-0 z-20 m-2">
        <button 
          onClick={() => setShowSidebar(true)}
          className="btn btn-square btn-ghost"
        >
          <Menu size={20} />
        </button>
      </div>
      
      {/* Overlay - appears when sidebar is open */}
      {showSidebar && (
        <div 
          className="fixed inset-0 bg-black/10 z-30" 
          onClick={() => setShowSidebar(false)} 
        />
      )}
      
      {/* Sidebar - fixed positioning so it doesn't affect content flow */}
      <aside 
        className={`fixed top-0 left-0 h-full w-64 bg-white text-gray-800 z-40 transition-transform duration-300 shadow-lg ${
          showSidebar ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <Link href="/" className="font-bold text-lg flex items-center text-gray-800">
            <span className="mr-2 text-blue-600">♞</span>
            Chess Companion
          </Link>
          <button 
            onClick={() => setShowSidebar(false)}
            className="btn btn-sm btn-ghost btn-square text-gray-800"
          >
            <ChevronLeft size={18} />
          </button>
        </div>
        
        <nav className="h-full overflow-y-auto py-4">
          <ul className="space-y-1 px-3">
            <li>
              <Link 
                href="/" 
                className={`flex items-center px-3 py-2 rounded-md transition-colors ${
                  isActive('/') 
                    ? 'bg-blue-50 text-blue-600 font-medium' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Home size={18} className="mr-3 flex-shrink-0" />
                <span>Home</span>
              </Link>
            </li>
            <li>
              <Link 
                href="/uschess-rating-estimator" 
                className={`flex items-center px-3 py-2 rounded-md transition-colors ${
                  isActive('/uschess-rating-estimator') 
                    ? 'bg-blue-50 text-blue-600 font-medium' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Calculator size={18} className="mr-3 flex-shrink-0" />
                <span>US Chess Rating Estimator</span>
              </Link>
            </li>
            <li>
              <Link 
                href="/fide-rating-estimator" 
                className={`flex items-center px-3 py-2 rounded-md transition-colors ${
                  isActive('/fide-rating-estimator') 
                    ? 'bg-blue-50 text-blue-600 font-medium' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <BarChart2 size={18} className="mr-3 flex-shrink-0" />
                <span>FIDE Rating Estimator</span>
              </Link>
            </li>
            <li>
              <Link 
                href="/contact" 
                className={`flex items-center px-3 py-2 rounded-md transition-colors ${
                  isActive('/contact') 
                    ? 'bg-blue-50 text-blue-600 font-medium' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Mail size={18} className="mr-3 flex-shrink-0" />
                <span>Contact Us</span>
              </Link>
            </li>
          </ul>
        </nav>
      </aside>
    </>
  );
} 