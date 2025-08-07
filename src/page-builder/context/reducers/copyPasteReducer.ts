import type { BuilderState, BuilderAction } from '../types';
import { findElementsByIds, cloneElements } from '../../utils/elementCloning';
import { updatePageAndCourse, addHistoryEntry } from './helpers';

/**
 * Handles copy-paste actions (COPY_ELEMENTS, PASTE_ELEMENTS)
 */
export function copyPasteReducer(state: BuilderState, action: BuilderAction): BuilderState | null {
  switch (action.type) {
    case 'COPY_ELEMENTS': {
      const { elementIds } = action.payload;
      const elementsToCopy = findElementsByIds(state.elements, elementIds);
      
      
      return {
        ...state,
        clipboard: elementsToCopy,
      };
    }

    case 'PASTE_ELEMENTS': {
      const { parentId, offset = { x: 20, y: 20 } } = action.payload;
      
      if (state.clipboard.length === 0) {
        return state;
      }
      
      // Clone elements with new IDs and optional offset
      const clonedElements = cloneElements(state.clipboard, parentId, offset);
      const newElements = [...state.elements, ...clonedElements];
      
      const pageAndCourseUpdate = updatePageAndCourse(state, newElements);
      const historyUpdate = addHistoryEntry(state, newElements);
      
      return {
        ...state,
        ...pageAndCourseUpdate,
        ...historyUpdate,
        // Select the first pasted element
        selectedElementId: clonedElements[0]?.id || null,
        selectedElementIds: clonedElements.map(el => el.id),
      };
    }

    default:
      return null; // Not handled by this reducer
  }
}
