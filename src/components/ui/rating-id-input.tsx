import React from 'react';
import { Label } from './label';

interface RatingIdInputProps {
  id: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  profileUrlPattern: string;
  optional?: boolean;
}

export function RatingIdInput({
  id,
  label,
  value,
  onChange,
  placeholder,
  profileUrlPattern,
  optional = false
}: RatingIdInputProps) {
  const handleOpenProfile = () => {
    if (value) {
      window.open(profileUrlPattern.replace('{id}', value), '_blank');
    }
  };

  return (
    <div>
      <Label 
        htmlFor={id} 
        className="block text-xs font-medium text-gray-700 mb-0.5"
      >
        {label}{optional ? ' (optional)' : ''}
      </Label>
      <div className="flex items-center relative w-fit border-b border-gray-300 hover:border-gray-400 focus-within:border-b-2 focus-within:border-blue-500">
        <input 
          id={id}
          type="text" 
          placeholder={placeholder} 
          value={value}
          onChange={onChange}
          className="w-full max-w-[100px] py-1 text-xs text-gray-700 bg-transparent border-0 outline-none focus:ring-0 h-8"
        />
        {value && (
          <button
            type="button"
            className="flex items-center text-gray-500 hover:text-blue-600 transition-colors h-full"
            onClick={handleOpenProfile}
            title={`View ${label} profile`}
            aria-label={`View ${label} profile`}
          >
            <svg 
              className="w-3.5 h-3.5 mr-1" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2" 
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
} 