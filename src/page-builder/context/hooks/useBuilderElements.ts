import { useCallback } from 'react';
import type { Element } from '../../types';

/**
 * Hook for managing element operations in the builder context
 */
export const useBuilderElements = (
  dispatch: React.Dispatch<any>,
  saveImmediately: () => void
) => {
  const addElement = useCallback((element: Element, parentId?: string) => {
    dispatch({ type: 'ADD_ELEMENT', payload: { element, parentId } });
    // Trigger immediate save for structural changes
    // setTimeout(saveImmediately, 100); // Temporarily disabled
  }, [dispatch]);

  const removeElement = useCallback((elementId: string) => {
    dispatch({ type: 'REMOVE_ELEMENT', payload: { elementId } });
    // Trigger immediate save for structural changes
    // setTimeout(saveImmediately, 100); // Temporarily disabled
  }, [dispatch]);

  const updateElement = useCallback((elementId: string, updates: Partial<Element>) => {
    // Debug logging to catch ALL updates with width/height
    if ((updates.properties && ((updates.properties as any)?.width !== undefined || 
                                 (updates.properties as any)?.height !== undefined))) {
    }
    
    dispatch({ type: 'UPDATE_ELEMENT', payload: { elementId, updates } });
    // Trigger immediate save for content changes  
    // setTimeout(saveImmediately, 100); // Temporarily disabled  
  }, [dispatch]);

  const moveElement = useCallback((elementId: string, targetParentId?: string, index?: number) => {
    dispatch({ type: 'MOVE_ELEMENT', payload: { elementId, targetParentId, index } });
    // Trigger immediate save for structural changes
    setTimeout(saveImmediately, 100);
  }, [dispatch, saveImmediately]);

  const reorderElement = useCallback((elementId: string, direction: 'up' | 'down') => {
    dispatch({ type: 'REORDER_ELEMENT', payload: { elementId, direction } });
    // Trigger immediate save for structural changes
    setTimeout(saveImmediately, 100);
  }, [dispatch, saveImmediately]);

  return {
    addElement,
    removeElement,
    updateElement,
    moveElement,
    reorderElement,
  };
};
