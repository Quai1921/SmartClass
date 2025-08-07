import { useCallback, useMemo } from 'react';
import type { Element } from '../../types';

/**
 * Hook for managing layout properties (dimensions, spacing, positioning)
 */
export const useLayoutProperties = (
  selectedElement: Element | undefined,
  handlePropertyChange: (property: string, value: any) => void
) => {
  // Dimension updates
  const updateWidth = useCallback((width: string) => {
    handlePropertyChange('width', width);
  }, [handlePropertyChange]);

  const updateHeight = useCallback((height: string) => {
    handlePropertyChange('height', height);
  }, [handlePropertyChange]);

  const updateMinWidth = useCallback((minWidth: string) => {
    handlePropertyChange('minWidth', minWidth);
  }, [handlePropertyChange]);

  const updateMaxWidth = useCallback((maxWidth: string) => {
    handlePropertyChange('maxWidth', maxWidth);
  }, [handlePropertyChange]);

  // Spacing updates
  const updatePadding = useCallback((padding: string) => {
    handlePropertyChange('padding', padding);
  }, [handlePropertyChange]);

  const updateMargin = useCallback((margin: string) => {
    handlePropertyChange('margin', margin);
  }, [handlePropertyChange]);

  // Border updates
  const updateBorderRadius = useCallback((borderRadius: string) => {
    handlePropertyChange('borderRadius', borderRadius);
  }, [handlePropertyChange]);

  const updateBorderWidth = useCallback((borderWidth: string) => {
    handlePropertyChange('borderWidth', borderWidth);
  }, [handlePropertyChange]);

  const updateBorderColor = useCallback((borderColor: string) => {
    handlePropertyChange('borderColor', borderColor);
  }, [handlePropertyChange]);

  // Background updates
  const updateBackgroundColor = useCallback((backgroundColor: string) => {
    handlePropertyChange('backgroundColor', backgroundColor);
  }, [handlePropertyChange]);

  // Get current layout properties with defaults
  const layoutProperties = useMemo(() => {
    if (!selectedElement) return {};
    
    const props = selectedElement.properties || {};
    return {
      width: props.width || 'auto',
      height: props.height || 'auto',
      minWidth: props.minWidth || 'auto',
      maxWidth: props.maxWidth || 'none',
      padding: props.padding || '0px',
      margin: props.margin || '0px',
      borderRadius: props.borderRadius || '0px',
      borderWidth: props.borderWidth || '0px',
      borderColor: props.borderColor || '#d1d5db',
      backgroundColor: props.backgroundColor || 'transparent',
    };
  }, [selectedElement]);

  return {
    layoutProperties,
    updateWidth,
    updateHeight,
    updateMinWidth,
    updateMaxWidth,
    updatePadding,
    updateMargin,
    updateBorderRadius,
    updateBorderWidth,
    updateBorderColor,
    updateBackgroundColor,
  };
};
