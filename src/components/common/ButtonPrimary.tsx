import React from 'react';
import Link from 'next/link';

interface ButtonProps {
  onClick?: () => void;
  disabled?: boolean;
  children: React.ReactNode;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}

export function ButtonPrimary({ 
  onClick, 
  children, 
  className = '',
  type = 'button' 
}: Omit<ButtonProps, 'disabled'>) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white font-medium rounded hover:bg-blue-700 transition-colors shadow-sm ${className}`}
    >
      {children}
    </button>
  );
}

interface LinkButtonProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

export function LinkButtonPrimary({ 
  href, 
  children, 
  className = '' 
}: LinkButtonProps) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center justify-center px-6 py-3 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors shadow-sm hover:shadow-md ${className}`}
    >
      {children}
    </Link>
  );
} 