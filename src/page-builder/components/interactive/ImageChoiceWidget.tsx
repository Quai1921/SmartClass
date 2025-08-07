import React, { useMemo, useEffect, useRef } from 'react';
import { TrueFalseButtons } from './common/TrueFalseButtons';
import type { Element } from '../../types';

interface ImageChoiceWidgetProps {
  element: Element;
  isSelected?: boolean;
  isPreviewMode?: boolean;
  onUpdate?: (updates: Partial<Element['properties']>) => void;
}

export const ImageChoiceWidget: React.FC<ImageChoiceWidgetProps> = ({
  element,
  isSelected = false,
  isPreviewMode = false,
  onUpdate
}) => {
  const properties = element.properties;
  const hasAnswered = properties.userAnswer !== undefined;
  const isCorrect = properties.userAnswer === properties.correctAnswer;
  const showingResult = hasAnswered && properties.showResult;
  const widgetRef = useRef<HTMLDivElement>(null);

  const handleAnswer = (answer: boolean) => {
    if (!isPreviewMode && (properties.allowRetry || !hasAnswered)) {
      onUpdate?.({
        userAnswer: answer,
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

  // Button styling handled by shared component

  // Dynamic sizing logic based on widget dimensions and content state
  const dynamicStyles = useMemo(() => {
    const widgetWidth = parseInt(element.properties.width?.toString() || '400');
    const widgetHeight = parseInt(element.properties.height?.toString() || '300');
    
    // Determine if we need to compact layout based on content state
    const needsCompactLayout = showingResult && (widgetHeight < 400 || widgetWidth < 350);
    
    // Calculate responsive values
    const basePadding = Math.max(8, Math.min(16, widgetWidth * 0.04));
    const baseGap = needsCompactLayout ? Math.max(4, basePadding * 0.5) : Math.max(8, basePadding * 0.75);
    const buttonPadding = needsCompactLayout ? '6px 12px' : '12px 24px';
    const buttonFontSize = needsCompactLayout ? '0.8rem' : '1rem';
    
    // Calculate image container height based on available space
    const imageContainerHeight = showingResult 
      ? (needsCompactLayout ? '50%' : '60%')
      : '75%';
    
    return {
      padding: `${basePadding}px`,
      gap: `${baseGap}px`,
      buttonPadding,
      buttonFontSize,
      needsCompactLayout,
      imageContainerHeight
    };
  }, [element.properties.width, element.properties.height, showingResult]);

  return (
    <div 
      ref={widgetRef}
      className={`image-choice-widget ${properties.className || ''}`}
      style={{
        width: '100%',
        height: '100%',
        padding: dynamicStyles.padding,
        backgroundColor: properties.backgroundColor || '#f8fafc',
        borderRadius: typeof properties.borderRadius === 'number' ? `${properties.borderRadius}px` : properties.borderRadius,
        border: isSelected ? '2px solid #3b82f6' : '1px solid #e2e8f0',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: showingResult ? 'flex-start' : 'center',
        alignItems: 'center',
        gap: dynamicStyles.gap,
        overflow: 'hidden',
        boxSizing: 'border-box'
      }}
    >
      {/* Image Display */}
      <div 
        className="flex items-center justify-center w-full"
        style={{
          height: dynamicStyles.imageContainerHeight,
          minHeight: dynamicStyles.needsCompactLayout ? '80px' : '120px'
        }}
      >
        {properties.imageUrl ? (
          <img
            src={properties.imageUrl}
            alt={properties.imageAlt || 'Imagen para evaluar'}
            className="max-w-full max-h-full object-contain rounded"
            style={{ 
              maxHeight: '100%',
              maxWidth: '100%',
              height: 'auto',
              width: 'auto'
            }}
          />
        ) : (
          <div 
            className="w-full bg-gray-200 rounded flex items-center justify-center text-gray-500"
            style={{
              height: dynamicStyles.needsCompactLayout ? '80px' : '120px'
            }}
          >
            <div className="text-center">
              <div style={{ fontSize: dynamicStyles.needsCompactLayout ? '2rem' : '3rem' }}>
                🖼️
              </div>
              <div style={{ fontSize: dynamicStyles.needsCompactLayout ? '0.75rem' : '1rem' }}>
                Sin imagen seleccionada
              </div>
            </div>
          </div>
        )}
      </div>

      {/* True/False Buttons */}
      <TrueFalseButtons
        properties={properties}
        isPreviewMode={isPreviewMode}
        hasAnswered={hasAnswered}
        isCorrect={isCorrect}
        showingResult={showingResult}
        dynamicStyles={{
          gap: dynamicStyles.gap,
          buttonPadding: dynamicStyles.buttonPadding,
          buttonFontSize: dynamicStyles.buttonFontSize,
          needsCompactLayout: dynamicStyles.needsCompactLayout,
        }}
        onAnswer={handleAnswer}
        onReset={resetAnswer}
      />

      {/* Result and Feedback - Compact Layout */}
      {hasAnswered && properties.showResult && (
        <div 
          className="text-center"
          style={{
            maxHeight: showingResult ? '30%' : 'auto',
            overflow: 'auto',
            width: '100%'
          }}
        >
          <div 
            className={`font-medium mb-1 ${isCorrect ? 'text-green-600' : 'text-red-600'}`}
            style={{
              fontSize: dynamicStyles.needsCompactLayout ? '0.9rem' : '1.1rem',
              marginBottom: dynamicStyles.needsCompactLayout ? '4px' : '8px'
            }}
          >
            {isCorrect ? '¡Correcto!' : 'Incorrecto'}
          </div>
          {properties.feedbackMessage && (
            <div 
              className="text-gray-600"
              style={{
                fontSize: dynamicStyles.needsCompactLayout ? '0.75rem' : '0.875rem',
                marginBottom: dynamicStyles.needsCompactLayout ? '6px' : '12px',
                lineHeight: '1.3',
                maxHeight: dynamicStyles.needsCompactLayout ? '2.5em' : '3.5em',
                overflow: 'hidden',
                display: '-webkit-box',
                WebkitLineClamp: dynamicStyles.needsCompactLayout ? 2 : 3,
                WebkitBoxOrient: 'vertical',
                textOverflow: 'ellipsis'
              }}
            >
              {properties.feedbackMessage}
            </div>
          )}
          {null}
        </div>
      )}
    </div>
  );
};
