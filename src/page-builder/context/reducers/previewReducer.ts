import type { BuilderState, BuilderAction } from '../types';

/**
 * Handles preview-related actions (TOGGLE_PREVIEW, SET_SLIDE_INDEX)
 */
export function previewReducer(state: BuilderState, action: BuilderAction): BuilderState | null {
  switch (action.type) {
    case 'TOGGLE_PREVIEW': {
      return {
        ...state,
        previewMode: !state.previewMode,
        currentSlideIndex: state.previewMode ? 0 : state.currentSlideIndex, // Reset slide index when exiting preview
      };
    }

    case 'SET_SLIDE_INDEX': {
      const { index } = action.payload;
      const maxIndex = state.course?.pages.length ? state.course.pages.length - 1 : 0;
      const clampedIndex = Math.max(0, Math.min(index, maxIndex));
      
      return {
        ...state,
        currentSlideIndex: clampedIndex,
      };
    }

    default:
      return null; // Not handled by this reducer
  }
}
