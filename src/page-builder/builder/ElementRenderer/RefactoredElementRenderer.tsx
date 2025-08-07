import React, { memo } from 'react';
import { useBuilder } from '../hooks/useBuilder';
import type { Element } from '../types';
import { TextElementRenderer } from './components/TextElementRenderer';
import { MediaElementRenderer } from './components/MediaElementRenderer';
import { InteractiveElementRenderer } from './components/InteractiveElementRenderer';
import { ButtonElementRenderer } from './components/ButtonElementRenderer';
import { ContainerElementRenderer } from './components/ContainerElementRenderer';

interface ElementRendererProps {
  element: Element;
  isSelected?: boolean;
  isPreviewMode?: boolean;
  openImageChoiceModal?: (containerId: string, context?: 'ADD_ELEMENT' | 'SET_BACKGROUND') => void;
}

const ElementRendererComponent: React.FC<ElementRendererProps> = ({
  element,
  isSelected = false,
  isPreviewMode = false,
  openImageChoiceModal
}) => {
  
  const { updateElement } = useBuilder();
  
  // Early validation
  if (!element || !element.id || !element.type) {
    // console.error('ElementRenderer: Invalid element provided', element);
    return (
      <div className="p-4 border-2 border-dashed border-red-300 text-center text-red-500">
        Invalid element
      </div>
    );
  }
  
  const { type } = element;

  const handleTextChange = (newText: string) => {
    updateElement(element.id, { properties: { ...element.properties, text: newText } });
  };

  const handleUpdate = (updates: Record<string, unknown>) => {
    updateElement(element.id, { properties: { ...element.properties, ...updates } });
  };

  // Text elements
  if (['heading', 'paragraph', 'quote'].includes(type)) {
    return (
      <TextElementRenderer
        element={element}
        isSelected={isSelected}
        onTextChange={handleTextChange}
      />
    );
  }

  // Media elements
  if (['image', 'video', 'audio'].includes(type)) {
    return (
      <MediaElementRenderer
        element={element}
        isSelected={isSelected}
        isPreviewMode={isPreviewMode}
        onUpdate={handleUpdate}
      />
    );
  }

  // Interactive elements
  if ([
    'text-statement',
    'image-choice',
    'image-comparison',
    'audio-comparison',
    'audio-true-false',
    'fill-in-blanks',
    'single-choice',
    'math-calculator',
    'area-true-false',
    'speech-recognition',
    'connection-widget',
    'connection-text-node',
    'connection-image-node',
    'drag-drop-widget',
    'standalone-widget'
  ].includes(type)) {
    return (
      <InteractiveElementRenderer
        element={element}
        isSelected={isSelected}
        isPreviewMode={isPreviewMode}
        onUpdate={handleUpdate}
      />
    );
  }

  // Button elements
  if (type === 'button') {
    return (
      <ButtonElementRenderer
        element={element}
        isSelected={isSelected}
        isPreviewMode={isPreviewMode}
        onUpdate={handleUpdate}
      />
    );
  }

  // Container elements
  if (['container', 'simple-container'].includes(type)) {
    return (
      <ContainerElementRenderer
        element={element}
        isSelected={isSelected}
        isPreviewMode={isPreviewMode}
        openImageChoiceModal={openImageChoiceModal}
      />
    );
  }

  // Default fallback
  return (
    <div className="p-4 border-2 border-dashed border-gray-300 text-center text-gray-500">
      Tipo de elemento no soportado: {type}
    </div>
  );
};

// Export the memoized component to prevent unnecessary re-renders
export const RefactoredElementRenderer = memo(ElementRendererComponent, (prevProps, nextProps) => {
  // Only re-render if element properties or selection state actually changed
  return (
    prevProps.element.id === nextProps.element.id &&
    prevProps.isSelected === nextProps.isSelected &&
    JSON.stringify(prevProps.element.properties) === JSON.stringify(nextProps.element.properties)
  );
}); 