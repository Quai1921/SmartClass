import type { BuilderState, BuilderAction } from '../types';

/**
 * Handles UI-related actions (SELECT, DRAGGED, SIDEBAR, PROPERTY_PANEL, RESIZE)
 */
export function uiReducer(state: BuilderState, action: BuilderAction): BuilderState | null {
  switch (action.type) {
    case 'SELECT_ELEMENT': {
      const { elementId, multiSelect } = action.payload;
      
      if (multiSelect && elementId) {
        // Multi-select logic
        const isAlreadySelected = state.selectedElementIds.includes(elementId);
        const newSelectedIds = isAlreadySelected
          ? state.selectedElementIds.filter(id => id !== elementId)
          : [...state.selectedElementIds, elementId];
        
        return {
          ...state,
          selectedElementId: newSelectedIds.length > 0 ? newSelectedIds[newSelectedIds.length - 1] : null,
          selectedElementIds: newSelectedIds,
        };
      } else {
        // Single select logic
        return {
          ...state,
          selectedElementId: elementId,
          selectedElementIds: elementId ? [elementId] : [],
        };
      }
    }

    case 'SET_DRAGGED_ELEMENT': {
      return {
        ...state,
        draggedElement: action.payload.element,
      };
    }

    case 'TOGGLE_SIDEBAR': {
      return {
        ...state,
        sidebarVisible: !state.sidebarVisible,
      };
    }

    case 'SET_SIDEBAR_WIDTH': {
      return {
        ...state,
        sidebarWidth: action.payload.width,
      };
    }

    case 'TOGGLE_PROPERTY_PANEL': {
      return {
        ...state,
        propertyPanelVisible: !state.propertyPanelVisible,
      };
    }

    case 'SET_RESIZE_STATE': {
      const { elementId, dimensions, isResizing } = action.payload;
      
      // 🔍 DEBUG: Track resize state updates in context
      
      return {
        ...state,
        resizeState: {
          elementId,
          dimensions,
          isResizing,
        },
      };
    }

    default:
      return null; // Not handled by this reducer
  }
}
