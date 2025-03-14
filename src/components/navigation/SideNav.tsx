'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, ChevronLeft, Home, Calculator, BarChart2, Info, Mail } from 'lucide-react';
import Image from 'next/image';

// Navigation items with icons directly included
const navItems = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'US Chess Rating Estimator', href: '/calculators/uscf', icon: Calculator },
  { name: 'FIDE Rating Estimator', href: '/calculators/fide', icon: BarChart2 },
  { name: 'ECF Rating Estimator', href: '/calculators/ecf', icon: Calculator },
  { name: 'About', href: '/about', icon: Info },
  { name: 'Contact', href: '/contact', icon: Mail },
];

export default function SideNav() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  
  // Close sidebar when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);
  
  return (
    <>
      {/* Hamburger Button - only visible when sidebar is closed */}
      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)} 
          className="fixed top-4 left-4 z-30 p-2 rounded-md bg-white shadow-sm hover:bg-gray-50 transition-colors"
          aria-label="Open navigation"
        >
          <Menu size={24} className="text-gray-700" />
        </button>
      )}
      
      {/* Remove overlay completely to keep main content visible */}
      
      {/* Sidebar - floating on all screen sizes */}
      <aside 
        className={`${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } fixed top-0 left-0 h-full w-64 bg-white shadow-sm z-20 transition-transform duration-300 ease-in-out flex flex-col border-r border-gray-200`}
      >
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <div className="flex items-center">
            <Image
              src="/logo.svg"
              alt="Logo"
              width={32}
              height={32}
              className="mr-2"
            />
            <span className="ml-2 text-xl font-semibold text-gray-800">Elo Estimate</span>
          </div>
          
          {/* Minimize button */}
          <button 
            onClick={() => setIsOpen(false)}
            className="p-1.5 rounded-md text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
            aria-label="Close navigation"
          >
            <ChevronLeft size={20} />
          </button>
        </div>
        
        <nav className="flex-1 p-4 overflow-y-auto">
          <ul className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              
              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={`flex items-center px-4 py-2.5 rounded-md transition-colors text-xs ${
                      isActive 
                        ? 'bg-blue-50 text-blue-600 font-medium' 
                        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <Icon size={18} className={isActive ? 'text-blue-600' : 'text-gray-500'} />
                    <span className="ml-3">{item.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="p-4 border-t border-gray-200 text-xs text-gray-500">
          <div className="text-center text-xs text-gray-500 mt-4">
            <p>© {new Date().getFullYear()} Elo Estimate</p>
          </div>
        </div>
      </aside>
    </>
  );
} 