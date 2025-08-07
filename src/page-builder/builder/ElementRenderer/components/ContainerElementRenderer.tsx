import React from 'react';
import { ResizableContainer } from '../ResizableContainer';
import type { Element } from '../types';

interface ContainerElementRendererProps {
  element: Element;
  isSelected: boolean;
  isPreviewMode: boolean;
  openImageChoiceModal?: (containerId: string, context?: 'ADD_ELEMENT' | 'SET_BACKGROUND') => void;
}

export const ContainerElementRenderer: React.FC<ContainerElementRendererProps> = ({
  element,
  isSelected,
  isPreviewMode,
  openImageChoiceModal
}) => {
  const { type } = element;

  switch (type) {
    case 'container':
    case 'simple-container':
      // Don't wrap containers - they handle their own drag logic
      return (
        <ResizableContainer
          element={element}
          isSelected={isSelected}
          isPreviewMode={isPreviewMode}
          openImageChoiceModal={openImageChoiceModal}
        />
      );

    default:
      return null;
  }
}; 