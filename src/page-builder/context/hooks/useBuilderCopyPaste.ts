import { useCallback } from 'react';
import type { BuilderAction } from '../types';
import { canCopyElements, canPasteElements } from '../../utils/elementCloning';

/**
 * Hook for copy-paste operations
 */
export function useBuilderCopyPaste(
  dispatch: React.Dispatch<BuilderAction>,
  selectedElementIds: string[],
  clipboard: any[]
) {
  const copyElements = useCallback((elementIds: string[]) => {
    dispatch({
      type: 'COPY_ELEMENTS',
      payload: { elementIds }
    });
  }, [dispatch]);

  const pasteElements = useCallback((parentId?: string, offset?: { x: number; y: number }) => {
    dispatch({
      type: 'PASTE_ELEMENTS',
      payload: { parentId, offset }
    });
  }, [dispatch]);

  const canCopy = canCopyElements(selectedElementIds.map(id => ({ id } as any)));
  const canPaste = canPasteElements(clipboard);

  return {
    copyElements,
    pasteElements,
    canCopy,
    canPaste,
  };
}
