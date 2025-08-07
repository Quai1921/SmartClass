import { useCallback } from 'react';
import type { Element } from '../../types';

interface UsePropertyHandlersOptions {
  element: Element;
  onPropertyChange: (property: string, value: any) => void;
}

export const usePropertyHandlers = ({ element, onPropertyChange }: UsePropertyHandlersOptions) => {
  const { properties } = element;

  // Memoized callback for background color changes to prevent unnecessary re-renders
  const handleBackgroundColorChange = useCallback((color: string) => {
    onPropertyChange('backgroundColor', color);
  }, [onPropertyChange]);

  // Memoized callbacks for border changes to prevent unnecessary re-renders
  const handleBorderWidthChange = useCallback((width: number) => {
    onPropertyChange('borderWidth', width);
  }, [onPropertyChange]);

  const handleBorderColorChange = useCallback((color: string) => {
    onPropertyChange('borderColor', color);
  }, [onPropertyChange]);

  // Handle width unit changes - provide default numeric value when switching from CSS keywords to numeric units
  const handleWidthUnitChange = useCallback((unit: string) => {
    onPropertyChange('widthUnit', unit);
    
    // If switching from a CSS keyword to a numeric unit, provide a default value
    if ((properties.widthUnit === 'max-content' || properties.widthUnit === 'min-content' || properties.widthUnit === 'fit-content') &&
        (unit === 'px' || unit === 'vw' || unit === 'dvw' || unit === '%')) {
      if (typeof properties.width !== 'number' || !properties.width) {
        onPropertyChange('width', 200); // Provide a reasonable default
      }
    }
  }, [onPropertyChange, properties.widthUnit, properties.width]);

  // Handle height unit changes - provide default numeric value when switching from CSS keywords to numeric units  
  const handleHeightUnitChange = useCallback((unit: string) => {
    onPropertyChange('heightUnit', unit);
    
    // If switching from a CSS keyword to a numeric unit, provide a default value
    if ((properties.heightUnit === 'max-content' || properties.heightUnit === 'min-content' || properties.heightUnit === 'fit-content') &&
        (unit === 'px' || unit === 'vh' || unit === 'dvh' || unit === 'vw' || unit === 'dvw' || unit === '%')) {
      if (typeof properties.height !== 'number' || !properties.height) {
        onPropertyChange('height', 150); // Provide a reasonable default
      }
    }
  }, [onPropertyChange, properties.heightUnit, properties.height]);

  return {
    handleBackgroundColorChange,
    handleBorderWidthChange,
    handleBorderColorChange,
    handleWidthUnitChange,
    handleHeightUnitChange,
  };
};
