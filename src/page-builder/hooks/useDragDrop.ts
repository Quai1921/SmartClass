import { useCallback } from 'react';
import { useBuilder } from './useBuilder';
import { createElementFromType } from '../utils/elementFactory';
import type { ElementType } from '../types';

export const useDragDrop = () => {
  const { addElement, moveElement } = useBuilder();

  const handleDropNewElement = useCallback(
    (elementType: ElementType, targetParentId?: string) => {
      const newElement = createElementFromType(elementType);
      addElement(newElement, targetParentId);
      return newElement;
    },
    [addElement]
  );

  const handleMoveElement = useCallback(
    (elementId: string, targetParentId?: string, index?: number) => {
      moveElement(elementId, targetParentId, index);
    },
    [moveElement]
  );

  return {
    handleDropNewElement,
    handleMoveElement,
  };
};
