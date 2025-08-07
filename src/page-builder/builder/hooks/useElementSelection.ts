import { useMemo } from 'react';
import { useBuilder } from '../../hooks/useBuilder';

/**
 * Hook for managing element selection state in the PropertyPanel
 * Provides selected element and computed properties
 */
export const useElementSelection = () => {
  const { selectedElementId, elements } = useBuilder();

  // Find the selected element
  const selectedElement = useMemo(() => {
    return elements.find(el => el.id === selectedElementId);
  }, [elements, selectedElementId]);

  // Compute element type information
  const elementTypeInfo = useMemo(() => {
    if (!selectedElement) return null;

    const typeMap = {
      container: 'Contenedor',
      'simple-container': 'Contenedor Simple',
      heading: 'Título',
      paragraph: 'Párrafo',
      quote: 'Cita',
      button: 'Botón',
      image: 'Imagen',
      video: 'Video',
      link: 'Enlace',
      list: 'Lista',
      separator: 'Separador',
      'text-statement': 'Declaración',
      'image-choice': 'Imagen V/F',
      'image-comparison': 'Comparar Imagen',
      'audio-comparison': 'Comparar Audio',
    };

    return {
      type: selectedElement.type,
      displayName: typeMap[selectedElement.type as keyof typeof typeMap] || selectedElement.type,
      isTextElement: ['heading', 'paragraph', 'quote'].includes(selectedElement.type),
      isInteractiveElement: ['button', 'link', 'text-statement', 'image-choice', 'image-comparison', 'audio-comparison'].includes(selectedElement.type),
      isMediaElement: ['image', 'video'].includes(selectedElement.type),
    };
  }, [selectedElement]);

  // Check if element has specific properties
  const hasProperty = useMemo(() => {
    if (!selectedElement) return () => false;
    
    return (propertyPath: string) => {
      const properties = selectedElement.properties || {};
      return propertyPath in properties;
    };
  }, [selectedElement]);

  // Get property value with default
  const getPropertyValue = useMemo(() => {
    if (!selectedElement) return () => undefined;
    
    return (propertyPath: string, defaultValue: any = undefined) => {
      const properties = selectedElement.properties || {};
      return (properties as any)[propertyPath] || defaultValue;
    };
  }, [selectedElement]);  return {
    selectedElement,
    elementTypeInfo,
    hasProperty,
    getPropertyValue,
    hasSelectedElement: !!selectedElement,
  };
};
