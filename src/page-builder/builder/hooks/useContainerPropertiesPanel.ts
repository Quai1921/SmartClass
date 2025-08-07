import { useMemo } from 'react';
import type { Element } from '../../types';
import { useBuilder } from '../../hooks/useBuilder';

interface UseContainerPropertiesPanelOptions {
  element: Element;
  resizeState?: {
    elementId: string | null;
    dimensions: { width: number; height: number } | null;
    isResizing: boolean;
  };
}

export const useContainerPropertiesPanel = ({ 
  element, 
  resizeState 
}: UseContainerPropertiesPanelOptions) => {
  const { properties } = element;
  const { updateElement } = useBuilder(); // Only get updateElement, not resizeState
  // Check if this element is currently being resized and get real-time dimensions
  const isThisElementResizing = Boolean(resizeState?.isResizing && resizeState?.elementId === element.id);
  
  // Helper function to get numeric dimension value for display
  const getNumericDimension = (value: number | string | undefined, defaultValue: number): number => {
    if (typeof value === 'number') return value;
    return defaultValue;
  };
    // Memoize dimension calculations to prevent unnecessary recalculations
  const dimensions = useMemo(() => {
    const inputWidth = getNumericDimension(properties.width, 100);
    const inputHeight = getNumericDimension(properties.height, 160);
    
    // Since we removed real-time updates, always show stored dimensions
    // This eliminates the need for resize state updates during resize operations
    const displayWidth = inputWidth;
    const displayHeight = inputHeight;
      
    return {
      displayWidth,
      displayHeight,
      inputWidth,
      inputHeight,
    };
  }, [properties.width, properties.height]); // Removed resize state dependencies

  return {
    updateElement,
    isThisElementResizing,
    ...dimensions,
    getNumericDimension,
  };
};
