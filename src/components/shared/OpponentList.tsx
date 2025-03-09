import React, { useRef, KeyboardEvent } from 'react';
import { Plus, Trash2 } from 'lucide-react';

export interface OpponentData {
  id: string;
  rating: string;
  result: 'win' | 'loss' | 'draw';
}

interface OpponentListProps {
  opponents: OpponentData[];
  onAddOpponent: () => void;
  onRemoveOpponent: (index: number) => void;
  onRatingChange: (index: number, value: string) => void;
  onResultChange: (index: number, result: 'win' | 'loss' | 'draw') => void;
}

const OpponentList: React.FC<OpponentListProps> = ({
  opponents,
  onAddOpponent,
  onRemoveOpponent,
  onRatingChange,
  onResultChange
}) => {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number): void => {
    if (e.key === 'Enter' || e.key === 'ArrowDown') {
      e.preventDefault();
      const nextIndex = index + 1;
      if (nextIndex < inputRefs.current.length && inputRefs.current[nextIndex]) {
        inputRefs.current[nextIndex]?.focus();
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const prevIndex = index - 1;
      if (prevIndex >= 0 && inputRefs.current[prevIndex]) {
        inputRefs.current[prevIndex]?.focus();
      }
    }
  };

  return (
    <div className="mb-3">
      <div className="flex justify-between items-center mb-1">
        <label className="block text-xs font-medium text-gray-700">
          Opponents
        </label>
        <button
          onClick={onAddOpponent}
          className="p-1 text-xs text-blue-600 hover:text-blue-800 inline-flex items-center"
        >
          <Plus size={14} className="mr-1" />
          Add Opponent
        </button>
      </div>
      
      <div className="border border-gray-200 rounded-md overflow-hidden bg-gray-50">
        <div className="max-h-[180px] overflow-y-auto px-2 py-1">
          {opponents.map((opponent, index) => (
            <div key={opponent.id || index} className="flex items-center mb-1.5 last:mb-0">
              <span className="text-xs text-gray-500 w-5">{index + 1}.</span>
              <input
                type="text"
                value={opponent.rating}
                onChange={(e) => onRatingChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                ref={(el) => {
                  inputRefs.current[index] = el;
                }}
                placeholder="Rating"
                className="block px-2 py-1 text-sm border-0 border-b border-gray-300 focus:border-b focus:border-blue-500 focus:outline-none focus:ring-0 w-20 bg-white"
              />
              
              {/* Toggle buttons for W/L/D */}
              <div className="flex ml-2 text-xs">
                <button
                  type="button"
                  onClick={() => onResultChange(index, 'win')}
                  className={`px-2 py-0.5 rounded-l-md border ${
                    opponent.result === 'win' 
                      ? 'bg-green-100 border-green-300 text-green-800 font-medium' 
                      : 'bg-white border-gray-300 text-gray-700'
                  }`}
                >
                  W
                </button>
                <button
                  type="button"
                  onClick={() => onResultChange(index, 'draw')}
                  className={`px-2 py-0.5 border-t border-b ${
                    opponent.result === 'draw' 
                      ? 'bg-blue-100 border-blue-300 text-blue-800 font-medium' 
                      : 'bg-white border-gray-300 text-gray-700'
                  }`}
                >
                  D
                </button>
                <button
                  type="button"
                  onClick={() => onResultChange(index, 'loss')}
                  className={`px-2 py-0.5 rounded-r-md border ${
                    opponent.result === 'loss' 
                      ? 'bg-red-100 border-red-300 text-red-800 font-medium' 
                      : 'bg-white border-gray-300 text-gray-700'
                  }`}
                >
                  L
                </button>
              </div>
              
              <button
                onClick={() => onRemoveOpponent(index)}
                className="p-1 ml-auto text-gray-400 hover:text-red-500"
                title="Remove opponent"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OpponentList; 