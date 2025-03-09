import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Calculator, BarChart2 } from 'lucide-react';

const Sidenav: React.FC = () => {
  const pathname = usePathname();
  
  const navItems = [
    {
      name: 'US Chess Rating Estimator',
      href: '/uschess-rating-estimator',
      icon: <Calculator className="h-5 w-5" />
    },
    {
      name: 'FIDE Rating Estimator',
      href: '/fide-rating-estimator',
      icon: <BarChart2 className="h-5 w-5" />
    }
    // ELO Rating Estimator, Resources and Settings removed
  ];
  
  return (
    <div className="w-64 bg-white border-r border-gray-200 h-screen flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <h1 className="text-xl font-bold">Chess Tools</h1>
      </div>
      <nav className="flex-1 overflow-y-auto p-4">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                  pathname === item.href
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {item.icon}
                <span className="ml-3">{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className="p-4 border-t border-gray-200">
        <a
          href="https://github.com/yourusername/chess-tools"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-gray-500 hover:text-gray-700"
        >
          © 2023 Chess Tools
        </a>
      </div>
    </div>
  );
};

export default Sidenav; 