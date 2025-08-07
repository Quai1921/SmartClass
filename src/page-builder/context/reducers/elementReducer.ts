import type { BuilderState, BuilderAction } from '../types';
import { updatePageAndCourse, addHistoryEntry } from './helpers';

/**
 * Handles element-related actions (ADD, REMOVE, UPDATE, MOVE, REORDER)
 */
export function elementReducer(state: BuilderState, action: BuilderAction): BuilderState | null {
  switch (action.type) {
    case 'ADD_ELEMENT': {
      const { element, parentId } = action.payload;
      
      // Ensure element has correct parentId
      const newElement = parentId ? { ...element, parentId } : element;
      const newElements = [...state.elements, newElement];
      
      const pageAndCourseUpdate = updatePageAndCourse(state, newElements);
      const historyUpdate = addHistoryEntry(state, newElements);
      
      return {
        ...state,
        ...pageAndCourseUpdate,
        ...historyUpdate,
      };
    }

    case 'REMOVE_ELEMENT': {
      const newElements = state.elements.filter(el => el.id !== action.payload.elementId);
      
      const pageAndCourseUpdate = updatePageAndCourse(state, newElements);
      const historyUpdate = addHistoryEntry(state, newElements);
      
      return {
        ...state,
        ...pageAndCourseUpdate,
        ...historyUpdate,
        selectedElementId: state.selectedElementId === action.payload.elementId ? null : state.selectedElementId,
      };
    }

    case 'UPDATE_ELEMENT': {
      const { elementId, updates } = action.payload;
      
      // Validate that the element exists
      const elementExists = state.elements.some(el => el.id === elementId);
      if (!elementExists) {
        // console.error('Cannot update non-existent element:', elementId);
        return state;
      }
      
      // Validate grid properties if they exist
      if (updates.properties) {
        const props = updates.properties;
        if (props.gridRow !== undefined && (typeof props.gridRow !== 'number' || props.gridRow < 1)) {
          // console.error('Invalid gridRow value:', props.gridRow);
          // Remove invalid property
          const { gridRow, ...validProps } = props;
          updates.properties = validProps;
        }
        if (props.gridColumn !== undefined && (typeof props.gridColumn !== 'number' || props.gridColumn < 1)) {
          // console.error('Invalid gridColumn value:', props.gridColumn);
          // Remove invalid property
          const { gridColumn, ...validProps } = updates.properties;
          updates.properties = validProps;
        }
      }
      
      const newElements = state.elements.map(el =>
        el.id === elementId ? { ...el, ...updates } : el
      );
      
      const pageAndCourseUpdate = updatePageAndCourse(state, newElements);
      const historyUpdate = addHistoryEntry(state, newElements);
      
      return {
        ...state,
        ...pageAndCourseUpdate,
        ...historyUpdate,
      };
    }

    case 'MOVE_ELEMENT': {
      // Move element logic here
      const { elementId, targetParentId, index } = action.payload;
      
      const element = state.elements.find(el => el.id === elementId);
      if (!element) return state;
      
      const newElement = targetParentId 
        ? { ...element, parentId: targetParentId }
        : element;
      
      const otherElements = state.elements.filter(el => el.id !== elementId);
      const newElements = index !== undefined 
        ? [
            ...otherElements.slice(0, index),
            newElement,
            ...otherElements.slice(index)
          ]
        : [...otherElements, newElement];
      
      const pageAndCourseUpdate = updatePageAndCourse(state, newElements);
      const historyUpdate = addHistoryEntry(state, newElements);
      
      return {
        ...state,
        ...pageAndCourseUpdate,
        ...historyUpdate,
      };
    }

    case 'REORDER_ELEMENT': {
      const { elementId, direction } = action.payload;
      const elementIndex = state.elements.findIndex(el => el.id === elementId);
      
      if (elementIndex === -1) return state;
      
      const newElements = [...state.elements];
      const targetIndex = direction === 'up' ? elementIndex - 1 : elementIndex + 1;
      
      if (targetIndex < 0 || targetIndex >= newElements.length) return state;
      
      // Swap elements
      [newElements[elementIndex], newElements[targetIndex]] = [newElements[targetIndex], newElements[elementIndex]];
      
      const pageAndCourseUpdate = updatePageAndCourse(state, newElements);
      const historyUpdate = addHistoryEntry(state, newElements);
      
      return {
        ...state,
        ...pageAndCourseUpdate,
        ...historyUpdate,
      };
    }

    default:
      return null; // Not handled by this reducer
  }
}
