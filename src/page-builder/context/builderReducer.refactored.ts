import type { BuilderState, BuilderAction } from './types';
import { elementReducer } from './reducers/elementReducer';
import { uiReducer } from './reducers/uiReducer';
import { copyPasteReducer } from './reducers/copyPasteReducer';
import { pageReducer } from './reducers/pageReducer';
import { historyAndStorageReducer } from './reducers/historyAndStorageReducer';
import { previewReducer } from './reducers/previewReducer';

export const initialState: BuilderState = {
  elements: [],
  selectedElementId: null,
  selectedElementIds: [], // New: multiple selection support
  draggedElement: null,
  clipboard: [], // Copied elements
  history: [[]],
  historyIndex: 0,
  sidebarVisible: true,
  sidebarWidth: 360,
  propertyPanelVisible: true,
  course: {
    id: 'default-course',
    title: '',
    description: '',
    type: 'Academico',
    pages: [{
      id: 'default-page',
      title: 'Página 1',
      elements: [],
      order: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    }],
    createdAt: new Date(),
    updatedAt: new Date(),
    status: 'DRAFT' as 'DRAFT' | 'PUBLISHED' | 'IN_REVIEW',
  },
  currentPage: {
    id: 'default-page',
    title: 'Página 1',
    elements: [],
    order: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  previewMode: false,
  currentSlideIndex: 0,
  resizeState: {
    elementId: null,
    dimensions: null,
    isResizing: false,
  },
};

/**
 * Modular builder reducer that delegates to specialized reducers
 * Maintains exact same functionality as the original monolithic reducer
 */
export function builderReducer(state: BuilderState, action: BuilderAction): BuilderState {
  // Try each specialized reducer in order
  const reducers = [
    elementReducer,
    uiReducer,
    copyPasteReducer,
    pageReducer,
    historyAndStorageReducer,
    previewReducer,
  ];

  for (const reducer of reducers) {
    const result = reducer(state, action);
    if (result !== null) {
      return result;
    }
  }

  // If no reducer handled the action, return the unchanged state
  // console.warn('Unhandled action type:', action.type);
  return state;
}
