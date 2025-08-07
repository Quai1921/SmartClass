import { useCallback } from 'react';
import { useBuilder } from '../../hooks/useBuilder';
import type { Element } from '../../types';

/**
 * Hook for managing property updates in the PropertyPanel
 * Handles updating element properties and provides optimized update functions
 */
export const usePropertyUpdates = (selectedElement: Element | undefined) => {
  const { updateElement } = useBuilder();

  // Handle property changes for the selected element
  const handlePropertyChange = useCallback((property: string, value: any) => {
    if (!selectedElement) return;
    
    const newProperties = {
      ...selectedElement.properties,
      [property]: value,
    };
    
    updateElement(selectedElement.id, {
      properties: newProperties,
    });
  }, [selectedElement, updateElement]);

  // Handle direct element updates (name, content, etc.)
  const handleElementUpdate = useCallback((updates: Partial<Element>) => {
    if (!selectedElement) return;
    
    updateElement(selectedElement.id, updates);
  }, [selectedElement, updateElement]);
  // Handle nested property updates (e.g., style.color)
  const handleNestedPropertyChange = useCallback((parentProperty: string, childProperty: string, value: any) => {
    if (!selectedElement) return;
    
    const currentProperties = selectedElement.properties || {};
    const currentParentProperty = (currentProperties as any)[parentProperty] || {};
    
    updateElement(selectedElement.id, {
      properties: {
        ...currentProperties,
        [parentProperty]: {
          ...currentParentProperty,
          [childProperty]: value,
        },
      },
    });
  }, [selectedElement, updateElement]);

  return {
    handlePropertyChange,
    handleElementUpdate,
    handleNestedPropertyChange,
  };
};
