import { useCallback } from 'react';

/**
 * Hook for managing UI state operations in the builder context
 */
export const useBuilderUI = (
  dispatch: React.Dispatch<any>
) => {
  const selectElement = useCallback((elementId: string | null, multiSelect = false) => {
    dispatch({ type: 'SELECT_ELEMENT', payload: { elementId, multiSelect } });
  }, [dispatch]);

  const setDraggedElement = useCallback((element: any) => {
    dispatch({ type: 'SET_DRAGGED_ELEMENT', payload: { element } });
  }, [dispatch]);

  const toggleSidebar = useCallback(() => {
    dispatch({ type: 'TOGGLE_SIDEBAR' });
  }, [dispatch]);  const setSidebarWidth = useCallback((width: number) => {
    dispatch({ type: 'SET_SIDEBAR_WIDTH', payload: { width } });
  }, [dispatch]);

  const togglePropertyPanel = useCallback(() => {
    dispatch({ type: 'TOGGLE_PROPERTY_PANEL' });
  }, [dispatch]);

  const setTextElementTab = useCallback((tab: 'basic' | 'styling' | 'templates' | null) => {
    dispatch({ type: 'SET_TEXT_ELEMENT_TAB', payload: { tab } });
  }, [dispatch]);

  // DEPRECATED: No longer used - resize state is now local to each container
  // const setResizeState = useCallback((elementId: string | null, dimensions: { width: number; height: number } | null, isResizing: boolean) => {
  //   dispatch({ type: 'SET_RESIZE_STATE', payload: { elementId, dimensions, isResizing } });
  // }, [dispatch]);
  return {
    selectElement,
    setDraggedElement,
    toggleSidebar,
    setSidebarWidth,
    togglePropertyPanel,
    setTextElementTab,
    // setResizeState, // REMOVED - no longer used
  };
};
