import React, { useMemo, useEffect, useRef } from 'react';
import { TrueFalseButtons } from './common/TrueFalseButtons';
import type { Element } from '../../types';

interface TextStatementWidgetProps {
  element: Element;
  isSelected?: boolean;
  isPreviewMode?: boolean;
  onUpdate?: (updates: Partial<Element['properties']>) => void;
}

export const TextStatementWidget: React.FC<TextStatementWidgetProps> = ({
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

  // Trigger border update when content state changes - SIMPLIFIED
  useEffect(() => {
    if (isSelected && widgetRef.current) {
      const timer = setTimeout(() => {
        if (widgetRef.current) {
          // Simple reflow trigger
          const element = widgetRef.current;
          void element.offsetHeight;
          
          // Single resize event dispatch
          const resizeEvent = new Event('resize');
          window.dispatchEvent(resizeEvent);
        }
      }, 150); // Increased delay to reduce frequency
      
      return () => clearTimeout(timer);
    }
  }, [showingResult, isSelected, element.id]);

  // Button styling is now handled by shared component

  // Dynamic sizing logic based on widget dimensions and content state
  const dynamicStyles = useMemo(() => {
    const widgetWidth = parseInt(element.properties.width?.toString() || '500');  // Updated to match factory
    const widgetHeight = parseInt(element.properties.height?.toString() || '200'); // Updated to match factory
    
    // Only use compact layout for very small sizes or when showing results in tight spaces
    const needsCompactLayout = showingResult && (widgetHeight < 160 || widgetWidth < 400);
    
    // Calculate responsive values
    const basePadding = Math.max(8, Math.min(16, widgetWidth * 0.04));
    const baseGap = needsCompactLayout ? Math.max(4, basePadding * 0.5) : Math.max(8, basePadding * 0.75);
    const baseFontSize = Math.max(12, Math.min(18, widgetWidth * 0.04));
    const buttonPadding = needsCompactLayout ? '6px 12px' : '12px 24px';
    const buttonFontSize = needsCompactLayout ? '0.8rem' : '1rem';
    
    return {
      padding: `${basePadding}px`,
      gap: `${baseGap}px`,
      fontSize: `${baseFontSize}px`,
      buttonPadding,
      buttonFontSize,
      needsCompactLayout
    };
  }, [element.properties.width, element.properties.height, showingResult]);

  return (
    <div 
      ref={widgetRef}
      className={`text-statement-widget ${properties.className || ''}`}
      style={{
        // Use direct width/height values instead of CSS custom properties
        width: `${element.properties.width || 500}px`,
        height: `${element.properties.height || 200}px`,
        padding: dynamicStyles.padding,
        backgroundColor: properties.backgroundColor || '#f8fafc',
        border: isSelected ? '2px solid #3b82f6' : '1px solid #e2e8f0',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center', // Always center content, don't change on result
        alignItems: 'center',
        gap: dynamicStyles.gap,
        overflow: 'visible', // Allow content to show fully
        boxSizing: 'border-box'
      }}
    >
      {/* Statement Text */}
      <div 
        style={{
          fontSize: properties.fontSize || dynamicStyles.fontSize,
          fontWeight: properties.fontWeight || (dynamicStyles.needsCompactLayout ? '500' : '600'),
          textAlign: properties.textAlign || 'center',
          color: properties.color || '#374151',
          marginBottom: dynamicStyles.gap, // Consistent spacing
          lineHeight: dynamicStyles.needsCompactLayout ? '1.3' : '1.5',
          // Remove height constraints to allow full text display
          overflow: 'visible',
          // Remove webkit line clamp to show full text
          whiteSpace: 'normal',
          wordWrap: 'break-word'
        }}
      >
        {properties.statement || 'Esta es una declaración de ejemplo'}
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
            maxHeight: '40%',
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
                maxHeight: dynamicStyles.needsCompactLayout ? '3em' : '4em',
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
          {/* retry button removed - duplication fixed */}
        </div>
      )}
    </div>
  );
};
