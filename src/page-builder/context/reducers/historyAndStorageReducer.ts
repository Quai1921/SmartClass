import type { BuilderState, BuilderAction } from '../types';
import { updatePageAndCourse } from './helpers';
import { initialState } from '../builderReducer';

/**
 * Handles history and storage-related actions (UNDO, REDO, SET_COURSE, LOAD_PROJECT, RESET_PROJECT)
 */
export function historyAndStorageReducer(state: BuilderState, action: BuilderAction): BuilderState | null {
  switch (action.type) {
    case 'UNDO': {
      if (state.historyIndex > 0) {
        const newIndex = state.historyIndex - 1;
        const newElements = state.history[newIndex];
        
        const pageAndCourseUpdate = updatePageAndCourse(state, newElements);
        
        return {
          ...state,
          ...pageAndCourseUpdate,
          historyIndex: newIndex,
        };
      }
      return state;
    }

    case 'REDO': {
      if (state.historyIndex < state.history.length - 1) {
        const newIndex = state.historyIndex + 1;
        const newElements = state.history[newIndex];
        
        const pageAndCourseUpdate = updatePageAndCourse(state, newElements);
        
        return {
          ...state,
          ...pageAndCourseUpdate,
          historyIndex: newIndex,
        };
      }
      return state;
    }

    case 'UPDATE_COURSE': {
      const { updates } = action.payload;
      
      if (!state.course) return state;
      
      return {
        ...state,
        course: {
          ...state.course,
          ...updates,
          updatedAt: new Date(),
        },
      };
    }

    case 'SET_COURSE': {
      return {
        ...state,
        course: action.payload.course,
        elements: action.payload.course.pages?.[0]?.elements || [],
        currentPage: action.payload.course.pages?.[0] || null,
      };
    }

    case 'LOAD_PROJECT': {
      return {
        ...state,
        course: action.payload.course,
        elements: action.payload.course?.pages?.[0]?.elements || action.payload.elements || [],
        currentPage: action.payload.course?.pages?.[0] || null,
        selectedElementId: null,
        selectedElementIds: [], // Clear multi-selection on project load
        history: [action.payload.course?.pages?.[0]?.elements || action.payload.elements || []],
        historyIndex: 0,
      };
    }

    case 'RESET_PROJECT': {
      return {
        ...initialState,
        sidebarVisible: state.sidebarVisible,
        sidebarWidth: state.sidebarWidth,
      };
    }

    default:
      return null; // Not handled by this reducer
  }
}
