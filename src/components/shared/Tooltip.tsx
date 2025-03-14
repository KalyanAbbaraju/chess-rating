import React, { useState, useRef, useEffect } from 'react';

interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
  side?: 'top' | 'right' | 'bottom' | 'left';
  delay?: number;
  className?: string;
}

const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  side = 'top',
  delay = 0,
  className = '',
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const tooltipRef = useRef<HTMLDivElement>(null);
  const childRef = useRef<HTMLDivElement>(null);
  
  const showTooltip = () => {
    setTimeout(() => {
      setIsVisible(true);
    }, delay);
  };
  
  const hideTooltip = () => {
    setIsVisible(false);
  };
  
  useEffect(() => {
    if (isVisible && childRef.current && tooltipRef.current) {
      const childRect = childRef.current.getBoundingClientRect();
      const tooltipRect = tooltipRef.current.getBoundingClientRect();
      
      let top = 0;
      let left = 0;
      
      switch (side) {
        case 'top':
          top = childRect.top - tooltipRect.height - 8;
          left = childRect.left + (childRect.width / 2) - (tooltipRect.width / 2);
          break;
        case 'right':
          top = childRect.top + (childRect.height / 2) - (tooltipRect.height / 2);
          left = childRect.right + 8;
          break;
        case 'bottom':
          top = childRect.bottom + 8;
          left = childRect.left + (childRect.width / 2) - (tooltipRect.width / 2);
          break;
        case 'left':
          top = childRect.top + (childRect.height / 2) - (tooltipRect.height / 2);
          left = childRect.left - tooltipRect.width - 8;
          break;
      }
      
      // Ensure tooltip stays within viewport
      const rightEdge = left + tooltipRect.width;
      const bottomEdge = top + tooltipRect.height;
      
      if (rightEdge > window.innerWidth) {
        left = window.innerWidth - tooltipRect.width - 8;
      }
      
      if (left < 0) {
        left = 8;
      }
      
      if (bottomEdge > window.innerHeight) {
        top = window.innerHeight - tooltipRect.height - 8;
      }
      
      if (top < 0) {
        top = 8;
      }
      
      setPosition({
        top: top + window.scrollY,
        left: left + window.scrollX
      });
    }
  }, [isVisible, side]);
  
  return (
    <>
      <div 
        ref={childRef}
        onMouseEnter={showTooltip}
        onMouseLeave={hideTooltip}
        onFocus={showTooltip}
        onBlur={hideTooltip}
        style={{ display: 'inline-block' }}
      >
        {children}
      </div>
      
      {isVisible && (
        <div
          ref={tooltipRef}
          role="tooltip"
          className={`absolute z-50 p-2 bg-gray-800 text-white text-xs rounded-md shadow-md max-w-xs ${className}`}
          style={{
            top: `${position.top}px`,
            left: `${position.left}px`,
          }}
        >
          {content}
          <div 
            className={`absolute w-2 h-2 bg-gray-800 transform rotate-45 ${
              side === 'top' ? 'bottom-0 translate-y-1' : 
              side === 'right' ? 'left-0 -translate-x-1' : 
              side === 'bottom' ? 'top-0 -translate-y-1' : 
              'right-0 translate-x-1'
            }`}
            style={{
              left: side === 'top' || side === 'bottom' ? 'calc(50% - 4px)' : undefined,
              top: side === 'left' || side === 'right' ? 'calc(50% - 4px)' : undefined,
            }}
          />
        </div>
      )}
    </>
  );
};

export default Tooltip; 