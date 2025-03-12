'use client';

import { useState, useEffect } from 'react';

export default function OfflineNotice() {
  const [isOffline, setIsOffline] = useState(false);
  
  useEffect(() => {
    // Check initial state
    setIsOffline(!navigator.onLine);
    
    // Add event listeners
    const handleOffline = () => setIsOffline(true);
    const handleOnline = () => setIsOffline(false);
    
    window.addEventListener('offline', handleOffline);
    window.addEventListener('online', handleOnline);
    
    return () => {
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('online', handleOnline);
    };
  }, []);
  
  if (!isOffline) return null;
  
  return (
    <div className="bg-amber-50 border-l-4 border-amber-500 p-4 fixed bottom-4 right-4 z-50 shadow-md rounded">
      <div className="flex">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-amber-500" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="ml-3">
          <p className="text-sm text-amber-700">
            You are currently offline. Some features may be limited.
          </p>
        </div>
      </div>
    </div>
  );
} 