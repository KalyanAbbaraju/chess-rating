'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { HomeIcon, CalculatorIcon, BarChartIcon, InfoIcon, MailIcon } from 'lucide-react';

// Map icon names to components
const iconMap = {
  'HomeIcon': HomeIcon,
  'CalculatorIcon': CalculatorIcon,
  'BarChartIcon': BarChartIcon,
  'InfoIcon': InfoIcon,
  'MailIcon': MailIcon,
};

export default function ClientSideNav() {
  const pathname = usePathname();
  
  useEffect(() => {
    // Add active state to current page
    const links = document.querySelectorAll('a[data-nav-icon]');
    links.forEach(link => {
      const href = link.getAttribute('href');
      if (href === pathname) {
        link.classList.add('bg-primary', 'text-white');
        link.classList.remove('text-gray-700', 'hover:bg-gray-100');
      }
      
      // Insert the icon
      const iconName = link.getAttribute('data-nav-icon');
      if (iconName && iconMap[iconName]) {
        const Icon = iconMap[iconName];
        const span = link.querySelector('span');
        if (span && !link.querySelector('svg')) {
          const iconEl = document.createElement('div');
          // This is a simplified approach - in a real app you'd use React DOM
          iconEl.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></svg>`;
          link.insertBefore(iconEl, span);
        }
      }
    });
  }, [pathname]);
  
  return null; // This component just enhances the server-rendered nav
} 