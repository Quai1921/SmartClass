import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PageNavigationProps {
  currentPageIndex: number;
  totalPages: number;
  canGoPrevious: boolean;
  canGoNext: boolean;
  onPrevious: () => void;
  onNext: () => void;
}

export const PageNavigation: React.FC<PageNavigationProps> = ({
  currentPageIndex,
  totalPages,
  canGoPrevious,
  canGoNext,
  onPrevious,
  onNext,
}) => {
  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={onPrevious}
        disabled={!canGoPrevious}
        className="p-1.5 text-gray-400 hover:text-gray-200 hover:bg-gray-700 rounded disabled:opacity-50 disabled:cursor-not-allowed"
        title="Página anterior"
      >
        <ChevronLeft size={16} />
      </button>
      
      <span className="text-xs font-medium text-gray-300 px-2 whitespace-nowrap">
        {currentPageIndex + 1} de {totalPages}
      </span>
      
      <button
        onClick={onNext}
        disabled={!canGoNext}
        className="p-1.5 text-gray-400 hover:text-gray-200 hover:bg-gray-700 rounded disabled:opacity-50 disabled:cursor-not-allowed"
        title="Página siguiente"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
};
