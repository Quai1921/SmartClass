import { useState, useCallback, useEffect } from 'react';
import type { Element } from '../../types';

export const useSelectionBorder = (element: Element, isSelected: boolean, widgetRef: React.RefObject<HTMLDivElement | null>) => {
  const [borderVersion, setBorderVersion] = useState(0);

  // Listen for element resize events to update selection border
  useEffect(() => {
    const handleElementResized = (event: CustomEvent) => {
      if (event.detail?.elementId === element.id && isSelected) {
        setBorderVersion(prev => prev + 1);
      }
    };

    window.addEventListener('elementResized', handleElementResized as EventListener);
    return () => {
      window.removeEventListener('elementResized', handleElementResized as EventListener);
    };
  }, [element.id, isSelected]);

  // Track changes to content-affecting properties
  useEffect(() => {
    setBorderVersion(prev => prev + 1);
  }, [
    element.properties.text,
    element.properties.content,
    element.properties.fontSize,
    element.properties.fontFamily,
    element.properties.width,
    element.properties.height,
    element.properties.padding,
    element.properties.lineHeight,
    // Add audio-true-false specific properties
    (element.properties as any).buttonPosition,
    (element.properties as any).userAnswer,
    (element.properties as any).showResult,
    (element.properties as any).trueButton,
    (element.properties as any).falseButton,
    isSelected
  ]);
  // Force border update when content changes - SIMPLIFIED to prevent infinite loops
  useEffect(() => {
    if (isSelected && widgetRef.current && borderVersion > 0) {
      const timer = setTimeout(() => {
        if (widgetRef.current) {
          const element = widgetRef.current;
          
          // Simple reflow trigger - no aggressive DOM manipulation
          void element.offsetHeight;
          
          // Single resize event dispatch
          const resizeEvent = new Event('resize');
          window.dispatchEvent(resizeEvent);
        }
      }, 100); // Increased delay to reduce frequency
      
      return () => clearTimeout(timer);
    }
  }, [borderVersion, isSelected]);

  const triggerBorderUpdate = useCallback(() => {
    setBorderVersion(prev => prev + 1);
  }, []);

  return {
    triggerBorderUpdate,
  };
};
