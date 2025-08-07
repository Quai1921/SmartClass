import { useCallback, useMemo } from 'react';
import type { Element } from '../../types';

/**
 * Hook for managing text-specific properties (typography, content, alignment)
 */
export const useTextProperties = (
  selectedElement: Element | undefined,
  handlePropertyChange: (property: string, value: any) => void,
  _handleElementUpdate: (updates: Partial<Element>) => void // Prefix with underscore to indicate intentionally unused
) => {// Text content updates
  const updateTextContent = useCallback((content: string) => {
    handlePropertyChange('text', content);
  }, [handlePropertyChange]);

  // Typography updates
  const updateFontFamily = useCallback((fontFamily: string) => {
    handlePropertyChange('fontFamily', fontFamily);
  }, [handlePropertyChange]);

  const updateFontSize = useCallback((fontSize: string) => {
    handlePropertyChange('fontSize', fontSize);
  }, [handlePropertyChange]);

  const updateFontWeight = useCallback((fontWeight: string) => {
    handlePropertyChange('fontWeight', fontWeight);
  }, [handlePropertyChange]);

  const updateTextAlign = useCallback((textAlign: string) => {
    handlePropertyChange('textAlign', textAlign);
  }, [handlePropertyChange]);

  const updateColor = useCallback((color: string) => {
    handlePropertyChange('color', color);
  }, [handlePropertyChange]);

  const updateLineHeight = useCallback((lineHeight: string) => {
    handlePropertyChange('lineHeight', lineHeight);
  }, [handlePropertyChange]);

  // Get current text properties with defaults
  const textProperties = useMemo(() => {
    if (!selectedElement) return {};
    
    const props = selectedElement.properties || {};
    return {
      content: props.text || props.content || '',
      fontFamily: props.fontFamily || 'Inter',
      fontSize: props.fontSize || '16px',
      fontWeight: props.fontWeight || '400',
      textAlign: props.textAlign || 'left',
      color: props.color || '#374151',
      lineHeight: props.lineHeight || '1.5',
    };
  }, [selectedElement]);

  return {
    textProperties,
    updateTextContent,
    updateFontFamily,
    updateFontSize,
    updateFontWeight,
    updateTextAlign,
    updateColor,
    updateLineHeight,
  };
};
