import React from 'react';
import { RatingResult } from '@/lib/ratingTypes';
import { 
  ArrowUp, 
  ArrowDown,
  Plus, 
  ArrowRight,
  BarChart2, 
  ChevronDown, 
  AlertOctagon, 
  Scale, 
  Award
} from 'lucide-react';

interface RatingChangeVisualProps {
  results: RatingResult | null;
}

const RatingChangeVisual: React.FC<RatingChangeVisualProps> = ({ results }) => {
  if (!results) return null;

  // Get common properties
  const { 
    currentRating, 
    newRating, 
    ratingChange, 
    baseRatingChange,
    kFactor,
    expectedScore,
    actualScore,
  } = results;
  
  // Get system-specific properties using type guard
  const bonus = results.type === 'uschess' ? results.bonus : 0;
  const currentFloor = results.type === 'uschess' ? results.currentFloor : 0;
  const classification = results.type === 'fide' ? results.classification : 'NA';
  const dynamicKFactor = results.type === 'fide' ? results.dynamicKFactor : null;

  // Get performance rating (different property names in each system)
  const performanceRating = results.type === 'uschess' 
    ? results.fidePerformanceRating || 0
    : results.type === 'fide'
      ? results.performanceRating
      : undefined; // For ECF type

  // Common variables for both rating systems
  const isPositiveChange = ratingChange > 0;
  const isNegativeChange = ratingChange < 0;
  
  const formattedBaseChange = baseRatingChange >= 0 ? `+${Math.round(baseRatingChange)}` : `${Math.round(baseRatingChange)}`;
  const formattedBonus = bonus > 0 ? `+${bonus}` : '0';
  
  // For the score badge
  const scoreDifference = actualScore ? actualScore - expectedScore : 0;
  
  // Define thresholds for performance badges
  const highThreshold = 0.5; // 50% better than expected
  const lowThreshold = 0.2;  // 20% better than expected
  
  // Determine which badge to show
  let performanceBadge = {
    icon: <Scale size={16} />,
    text: 'Consistent Player',
    color: 'gray',
    description: 'Your performance was close to what the system predicted'
  };
  
  if (scoreDifference >= highThreshold) {
    performanceBadge = {
      icon: <Award size={16} />,
      text: 'Outstanding Performance',
      color: 'green',
      description: 'You significantly exceeded expectations by scoring much higher than predicted'
    };
  } else if (scoreDifference > lowThreshold) {
    performanceBadge = {
      icon: <BarChart2 size={16} />,
      text: 'Strong Showing',
      color: 'blue',
      description: 'You performed better than statistical expectations'
    };
  } else if (scoreDifference < -highThreshold) {
    performanceBadge = {
      icon: <AlertOctagon size={16} />,
      text: 'Needs Work',
      color: 'red',
      description: 'You scored significantly lower than what was expected'
    };
  } else if (scoreDifference < -lowThreshold) {
    performanceBadge = {
      icon: <ChevronDown size={16} />,
      text: 'Room for Improvement',
      color: 'orange',
      description: 'You scored somewhat below statistical expectations'
    };
  }
  
  // Get the badge color class
  const getBadgeColorClass = (color: string) => {
    switch (color) {
      case 'green': return 'bg-green-100 border-green-300 text-green-800';
      case 'blue': return 'bg-blue-100 border-blue-300 text-blue-800';
      case 'gray': return 'bg-gray-100 border-gray-300 text-gray-800';
      case 'orange': return 'bg-orange-100 border-orange-300 text-orange-800';
      case 'red': return 'bg-red-100 border-red-300 text-red-800';
      default: return 'bg-gray-100 border-gray-300 text-gray-800';
    }
  };

  return (
    <div className="mt-5 p-4 bg-white border border-gray-200 rounded-md">
      {/* Performance Badge - simplified */}
      <div className={`mb-4 p-3 border rounded-md ${getBadgeColorClass(performanceBadge.color)}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="mr-2">
              {performanceBadge.icon}
            </div>
            <div className="font-bold">{performanceBadge.text}</div>
          </div>
          <div className="text-sm flex items-center space-x-4">
            <span>Score: <strong>{actualScore ? actualScore.toFixed(1) : 'N/A'}</strong> vs <strong>{expectedScore.toFixed(2)}</strong></span>
            <span className={scoreDifference >= 0 ? 'text-green-600' : 'text-red-600'}>
              Diff: <strong>{scoreDifference >= 0 ? '+' : ''}{scoreDifference.toFixed(2)}</strong>
            </span>
          </div>
        </div>
      </div>
      
      {/* Clean Rating Calculation Visual */}
      <div className="mb-4">
        <div className="flex items-center justify-between">
          {/* Current Rating */}
          <div className={bonus > 0 ? "w-[22%]" : "w-[30%]"}>
            <div className="bg-blue-100 rounded-md p-2 text-center h-20 flex flex-col justify-center">
              <div className="text-xs text-gray-600 mb-1">Current Rating</div>
              <div className="font-bold">{currentRating}</div>
            </div>
          </div>
          
          {/* Plus sign - centered */}
          <div className="flex items-center justify-center w-[4%]">
            <Plus size={16} className="text-gray-500" />
          </div>
          
          {/* Adaptive change calculation section */}
          {bonus > 0 ? (
            // With Bonus (US Chess layout)
            <div className="w-[42%] flex">
              {/* Base Change */}
              <div className="w-1/2 pr-0.5">
                <div className={`rounded-md p-2 text-center h-20 flex flex-col justify-center ${baseRatingChange >= 0 ? 'bg-green-100' : 'bg-red-100'}`}>
                  <div className="text-xs text-gray-600 mb-1">Rating Change</div>
                  <div className="font-bold flex items-center justify-center">
                    {baseRatingChange >= 0 ? <ArrowUp size={14} className="mr-1" /> : <ArrowDown size={14} className="mr-1" />}
                    {formattedBaseChange}
                  </div>
                </div>
              </div>
              
              {/* Plus sign between base and bonus */}
              <div className="flex items-center justify-center w-[8%]">
                <Plus size={16} className="text-gray-500" />
              </div>
              
              {/* Bonus */}
              <div className="w-1/2 pl-0.5">
                <div className="bg-green-100 rounded-md p-2 text-center h-20 flex flex-col justify-center">
                  <div className="text-xs text-gray-600 mb-1">Bonus</div>
                  <div className="font-bold flex items-center justify-center">
                    <ArrowUp size={14} className="mr-1" />
                    {formattedBonus}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            // Without Bonus (FIDE layout)
            <div className="w-[30%]">
              <div className={`rounded-md p-2 text-center h-20 flex flex-col justify-center ${baseRatingChange >= 0 ? 'bg-green-100' : 'bg-red-100'}`}>
                <div className="text-xs text-gray-600 mb-1">Rating Change</div>
                <div className="font-bold flex items-center justify-center">
                  {baseRatingChange >= 0 ? <ArrowUp size={14} className="mr-1" /> : <ArrowDown size={14} className="mr-1" />}
                  {formattedBaseChange}
                </div>
              </div>
            </div>
          )}
          
          {/* Arrow right - centered */}
          <div className="flex items-center justify-center w-[4%]">
            <ArrowRight size={16} className="text-gray-500" />
          </div>
          
          {/* New Rating */}
          <div className={bonus > 0 ? "w-[22%]" : "w-[30%]"}>
            <div className={`rounded-md p-2 text-center h-20 flex flex-col justify-center ${isPositiveChange ? 'bg-green-100' : isNegativeChange ? 'bg-red-100' : 'bg-blue-100'}`}>
              <div className="text-xs text-gray-600 mb-1">New Rating</div>
              <div className="font-bold">{newRating}</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Flexible stats grid - simplified with just text, automatically adjusting layout */}
      <div className="mb-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-4 gap-y-5">
          {/* Common stats for both systems */}
          <div className="text-center">
            <div className="text-xs text-gray-600 mb-1">Performance Rating</div>
            <div className="text-lg font-bold">{performanceRating || 'N/A'}</div>
          </div>
          
          <div className="text-center">
            <div className="text-xs text-gray-600 mb-1">K-Factor</div>
            <div className="text-lg font-bold">{kFactor}</div>
          </div>
          
          {/* System-specific stats */}
          {results.type === 'uschess' && (
            <div className="text-center">
              <div className="text-xs text-gray-600 mb-1">Current Floor</div>
              <div className="text-lg font-bold">{currentFloor || 'N/A'}</div>
            </div>
          )}
          
          {results.type === 'uschess' && (
            <div className="text-center">
              <div className="text-xs text-gray-600 mb-1">Rating Category</div>
              <div className="text-lg font-bold">{results.ratingCategory}</div>
            </div>
          )}
          
          {results.type === 'fide' && (
            <div className="text-center">
              <div className="text-xs text-gray-600 mb-1">Classification</div>
              <div className="text-lg font-bold">{classification || 'N/A'}</div>
            </div>
          )}
          
          {results.type === 'fide' && dynamicKFactor && dynamicKFactor !== kFactor && (
            <div className="text-center">
              <div className="text-xs text-gray-600 mb-1">Dynamic K-Factor</div>
              <div className="text-lg font-bold">{dynamicKFactor}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RatingChangeVisual; 