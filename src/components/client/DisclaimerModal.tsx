'use client';

import React, { useState, useEffect } from 'react';
import { Info, X } from 'lucide-react';

interface DisclaimerModalProps {
  shortText: string;
  title: string;
  organization: 'FIDE' | 'USCF';
  className?: string;
}

const DisclaimerModal: React.FC<DisclaimerModalProps> = ({
  shortText,
  title,
  organization,
  className = ''
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [detailsContent, setDetailsContent] = useState<React.ReactNode | null>(null);
  
  // Effect to hydrate the details content from the server component
  useEffect(() => {
    if (isModalOpen) {
      const contentEl = document.querySelector(`[data-disclaimer-content="${organization}"] .disclaimer-details-content`);
      if (contentEl) {
        setDetailsContent(contentEl.innerHTML);
      } else {
        console.error(`Could not find disclaimer content for ${organization}`);
      }
    }
  }, [organization, isModalOpen]);

  return (
    <div className={`flex justify-between items-center text-xs text-gray-500 ${className}`}>
      <div>{shortText}</div>
      
      <button 
        className="text-xs text-gray-600 hover:text-gray-900 flex items-center"
        onClick={() => setIsModalOpen(true)}
        aria-label={`View ${title}`}
      >
        <Info className="w-4 h-4 inline mr-1" /> Disclaimer Details
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" onClick={() => setIsModalOpen(false)}>
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="text-gray-500 hover:text-gray-700"
                aria-label="Close disclaimer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {detailsContent ? (
              <div 
                className="p-4 text-gray-700 max-h-[50vh] overflow-y-auto"
                dangerouslySetInnerHTML={{ __html: detailsContent }}
              />
            ) : (
              <div className="p-4 text-gray-700 max-h-[50vh] overflow-y-auto">
                <p>Loading disclaimer details...</p>
              </div>
            )}
            
            <div className="p-4 border-t border-gray-200 bg-gray-50 flex justify-end">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DisclaimerModal; 