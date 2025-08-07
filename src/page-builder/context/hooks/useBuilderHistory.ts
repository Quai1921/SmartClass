import { useCallback } from 'react';

/**
 * Hook for managing history operations in the builder context
 */
export const useBuilderHistory = (
  dispatch: React.Dispatch<any>
) => {
  const undo = useCallback(() => {
    dispatch({ type: 'UNDO' });
  }, [dispatch]);

  const redo = useCallback(() => {
    dispatch({ type: 'REDO' });
  }, [dispatch]);

  return {
    undo,
    redo,
  };
};
