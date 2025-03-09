import React, { useState } from 'react';
import { Info, X } from 'lucide-react';

interface DisclaimerModalProps {
  shortText: string;
  title: string;
  detailedContent: React.ReactNode;
  linkText?: string;
  className?: string;
}

export default function DisclaimerModal({
  shortText,
  title,
  detailedContent,
  linkText = "Disclaimer Details",
  className = "",
}: DisclaimerModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className={`border-t ${className}`}>
      <div className="py-3 flex items-center justify-between gap-4 text-gray-600">
        <p className="text-sm">
          {shortText}
        </p>
        
        <button 
          onClick={() => setIsOpen(true)}
          className="flex items-center text-sm text-blue-600 hover:text-blue-800 underline"
        >
          <Info className="w-4 h-4 mr-1.5" /> {linkText}
        </button>
      </div>
      
      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div 
            className="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-gray-700 transition-colors"
                aria-label="Close dialog"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-4 text-gray-700 max-h-[50vh] overflow-y-auto">
              {detailedContent}
            </div>
            
            <div className="p-4 border-t bg-gray-50 flex justify-end">
              <button 
                onClick={() => setIsOpen(false)}
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
} 