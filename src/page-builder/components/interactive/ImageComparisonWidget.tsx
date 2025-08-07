import React, { useRef, useEffect } from 'react';
import type { Element } from '../../types';

interface ImageComparisonWidgetProps {
  element: Element;
  isSelected?: boolean;
  isPreviewMode?: boolean;
  onUpdate?: (updates: Partial<Element['properties']>) => void;
}

export const ImageComparisonWidget: React.FC<ImageComparisonWidgetProps> = ({
  element,
  isSelected = false,
  isPreviewMode = false,
  onUpdate
}) => {
  const properties = element.properties;
  const hasAnswered = properties.userAnswer !== undefined;
  const isCorrect = properties.userAnswer === true; // True means they selected the correct (true) image
  const showingResult = hasAnswered && properties.showResult;
  const widgetRef = useRef<HTMLDivElement>(null);

  const handleImageSelect = (isTrue: boolean) => {
    if (!isPreviewMode && (properties.allowRetry || !hasAnswered)) {
      onUpdate?.({
        userAnswer: isTrue,
        showResult: true
      });
    }
  };

  const resetAnswer = () => {
    if (!isPreviewMode && properties.allowRetry) {
      onUpdate?.({
        userAnswer: undefined,
        showResult: false
      });
    }
  };

  // Trigger border update when content state changes
  useEffect(() => {
    if (isSelected && widgetRef.current) {
      // Force a layout recalculation when content changes
      const timer = setTimeout(() => {
        if (widgetRef.current) {
          // Force reflow to update selection border
          const element = widgetRef.current;
          void element.offsetHeight;
          void element.getBoundingClientRect();
          
          // Dispatch a custom event to notify about content change
          const contentChangeEvent = new CustomEvent('elementContentChanged', {
            detail: { elementId: element.id, showingResult }
          });
          window.dispatchEvent(contentChangeEvent);
          
          // Also dispatch a resize event to update selection borders
          const resizeEvent = new Event('resize');
          window.dispatchEvent(resizeEvent);
        }
      }, 100); // Small delay to allow DOM updates
      
      return () => clearTimeout(timer);
    }
  }, [showingResult, isSelected, element.id]);

  const getImageStyle = (isTrue: boolean) => {
    const baseStyle = 'cursor-pointer rounded-lg border-2 transition-all duration-200 hover:scale-105';
    
    if (!hasAnswered || !properties.showResult) {
      return `${baseStyle} border-gray-300 hover:border-blue-400`;
    }
    
    if (properties.userAnswer === isTrue) {
      return isCorrect 
        ? `${baseStyle} border-green-500 ring-4 ring-green-200` 
        : `${baseStyle} border-red-500 ring-4 ring-red-200`;
    }
    
    if (isTrue) {
      return `${baseStyle} border-green-500 ring-2 ring-green-200`;
    }
    
    return `${baseStyle} border-gray-300`;
  };

  return (
    <div 
      ref={widgetRef}
      className={`image-comparison-widget ${properties.className || ''}`}
      style={{
        width: '100%',
        height: '100%',
        padding: '16px',
        backgroundColor: properties.backgroundColor || '#f8fafc',
        borderRadius: typeof properties.borderRadius === 'number' ? `${properties.borderRadius}px` : properties.borderRadius,
        border: isSelected ? '2px solid #3b82f6' : '1px solid #e2e8f0',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '16px'
      }}
    >
      {/* Instruction */}
      <div className="text-center text-gray-700 font-medium">
        Selecciona la imagen correcta:
      </div>

      {/* Images Side by Side */}
      <div className="flex gap-4 flex-1 w-full justify-center items-center">
        {/* True Image */}
        <div className="flex-1 max-w-xs">
          <div 
            className={getImageStyle(true)}
            onClick={() => handleImageSelect(true)}
            style={{
              pointerEvents: isPreviewMode || (hasAnswered && !properties.allowRetry) ? 'none' : 'auto'
            }}
          >
            {properties.trueImageUrl ? (
              <img
                src={properties.trueImageUrl}
                alt={properties.trueImageAlt || 'Opción A'}
                className="w-full h-32 object-cover rounded"
              />
            ) : (
              <div className="w-full h-32 bg-gray-200 rounded flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <div className="text-2xl mb-1">🖼️</div>
                  <div className="text-sm">Imagen A</div>
                </div>
              </div>
            )}
          </div>
          <div className="text-center mt-2 text-sm font-medium text-gray-600">
            Opción A
          </div>
        </div>

        {/* False Image */}
        <div className="flex-1 max-w-xs">
          <div 
            className={getImageStyle(false)}
            onClick={() => handleImageSelect(false)}
            style={{
              pointerEvents: isPreviewMode || (hasAnswered && !properties.allowRetry) ? 'none' : 'auto'
            }}
          >
            {properties.falseImageUrl ? (
              <img
                src={properties.falseImageUrl}
                alt={properties.falseImageAlt || 'Opción B'}
                className="w-full h-32 object-cover rounded"
              />
            ) : (
              <div className="w-full h-32 bg-gray-200 rounded flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <div className="text-2xl mb-1">🖼️</div>
                  <div className="text-sm">Imagen B</div>
                </div>
              </div>
            )}
          </div>
          <div className="text-center mt-2 text-sm font-medium text-gray-600">
            Opción B
          </div>
        </div>
      </div>

      {/* Result and Feedback */}
      {hasAnswered && properties.showResult && (
        <div className="text-center">
          <div className={`text-lg font-medium mb-2 ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
            {isCorrect ? '¡Correcto!' : 'Incorrecto'}
          </div>
          {properties.feedbackMessage && (
            <div className="text-sm text-gray-600 mb-3">
              {properties.feedbackMessage}
            </div>
          )}
          {properties.allowRetry && (
            <button
              onClick={resetAnswer}
              className="text-sm text-blue-600 hover:text-blue-800 underline"
            >
              Intentar de nuevo
            </button>
          )}
        </div>
      )}
    </div>
  );
};
