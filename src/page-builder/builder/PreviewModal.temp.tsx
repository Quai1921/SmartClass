import React, { useEffect, useLayoutEffect, useState, useRef, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useBuilder } from '../hooks/useBuilder';
import { ElementRenderer } from './ElementRenderer';

interface PreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PreviewModal: React.FC<PreviewModalProps> = ({ isOpen, onClose }) => {
  const { course, elements, currentPage, currentSlideIndex, nextSlide, prevSlide } = useBuilder();
  const pages = course?.pages || [];
  const computedPages = React.useMemo(
    () => pages.map(p => (p.id === currentPage?.id ? { ...p, elements } : p)),
    [pages, currentPage, elements]
  );
  const pageData = computedPages[currentSlideIndex];

  const modalRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0, scale: 1 });

  const calculateDimensions = useCallback(() => {
    if (!modalRef.current || !pageData?.elements?.length) {
      setDimensions({ width: 800, height: 600, scale: 1 });
      return;
    }

    const modalRect = modalRef.current.getBoundingClientRect();
    
    // Calculate content bounds
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    
    pageData.elements.forEach(element => {
      if (element.parentId) return;
      
      const left = element.properties.left || 0;
      const top = element.properties.top || 0;
      const width = typeof element.properties.width === 'number' ? element.properties.width : 200;
      const height = typeof element.properties.height === 'number' ? element.properties.height : 100;
      
      minX = Math.min(minX, left);
      minY = Math.min(minY, top);
      maxX = Math.max(maxX, left + width);
      maxY = Math.max(maxY, top + height);
    });

    // Ensure we have valid bounds
    if (minX === Infinity) {
      setDimensions({ width: 800, height: 600, scale: 1 });
      return;
    }

    const contentWidth = maxX - minX + 100; // Add padding
    const contentHeight = maxY - minY + 100;
    
    // Available space - less conservative padding to use more space
    const availableWidth = modalRect.width - 160; // 80px each side (navigation buttons)
    const availableHeight = modalRect.height - 160; // 80px top/bottom (close button, counter)
    
    // Calculate scale to fit - use more of the available space
    const scaleX = availableWidth / contentWidth;
    const scaleY = availableHeight / contentHeight;
    const scale = Math.min(scaleX, scaleY, 1); // Allow up to 100% scale
    
    setDimensions({
      width: contentWidth,
      height: contentHeight,
      scale: Math.max(scale, 0.1) // Minimum scale of 10%
    });
  }, [pageData]);

  useLayoutEffect(() => {
    if (isOpen) {
      setTimeout(calculateDimensions, 100); // Small delay to ensure DOM is ready
    }
  }, [isOpen, currentSlideIndex, calculateDimensions]);

  useEffect(() => {
    if (!isOpen) return;
    
    const handleResize = () => calculateDimensions();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isOpen, calculateDimensions]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <div 
        ref={modalRef}
        className="relative bg-white rounded-lg shadow-2xl w-[90vw] h-[90vh] max-w-6xl overflow-hidden"
      >
        {/* Close button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-30 p-2 text-gray-500 hover:text-gray-700 bg-white/80 hover:bg-white rounded-full shadow-lg transition-all"
        >
          <X size={20} />
        </button>

        {/* Navigation buttons */}
        <button 
          onClick={prevSlide}
          disabled={currentSlideIndex === 0}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-3 text-gray-500 hover:text-gray-700 bg-white/80 hover:bg-white rounded-full shadow-lg transition-all disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ChevronLeft size={24} />
        </button>

        <button 
          onClick={nextSlide}
          disabled={currentSlideIndex >= pages.length - 1}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-3 text-gray-500 hover:text-gray-700 bg-white/80 hover:bg-white rounded-full shadow-lg transition-all disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ChevronRight size={24} />
        </button>

        {/* Content area with strict overflow control */}
        <div className="w-full h-full flex items-center justify-center p-10 overflow-hidden">
          <div
            className="relative shadow-xl border border-gray-200 overflow-hidden"
            style={{
              width: `${dimensions.width}px`,
              height: `${dimensions.height}px`,
              transform: `scale(${dimensions.scale})`,
              transformOrigin: 'center center',
              backgroundColor: pageData?.background?.color || '#ffffff',
              backgroundImage: pageData?.background?.image 
                ? `url(${pageData.background.image})` 
                : pageData?.background?.gradient || undefined,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat'
            }}
          >
            {/* Render elements */}
            {pageData?.elements
              ?.filter(element => !element.parentId)
              ?.map(element => {
                const left = element.properties.left || 0;
                const top = element.properties.top || 0;
                
                return (
                  <div
                    key={element.id}
                    className="absolute"
                    style={{
                      left: left + 50, // Add padding offset
                      top: top + 50,
                      zIndex: element.properties.zIndex || 1
                    }}
                  >
                    <ElementRenderer 
                      element={element}
                      isSelected={false}
                      isPreviewMode={true}
                    />
                  </div>
                );
              })}
          </div>
        </div>

        {/* Slide counter */}
        {pages.length > 1 && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/60 text-white px-4 py-2 rounded-full text-sm font-medium">
            {currentSlideIndex + 1} / {pages.length}
          </div>
        )}
      </div>
    </div>
  );
};
