import type { BuilderState, BuilderAction } from './types';
import { findElementsByIds, cloneElements } from '../utils/elementCloning';

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
  textElementTab: null, // null means use default tab
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
    status: 'DRAFT',
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

export function builderReducer(state: BuilderState, action: BuilderAction): BuilderState {
  switch (action.type) {
    case 'ADD_ELEMENT': {
      const { element, parentId } = action.payload;
      
      // Ensure element has correct parentId
      const newElement = parentId ? { ...element, parentId } : element;
      const newElements = [...state.elements, newElement];
      
      // Update current page with new elements
      let updatedCourse = state.course;
      let updatedCurrentPage = state.currentPage;
      
      if (state.currentPage && state.course) {
        updatedCurrentPage = {
          ...state.currentPage,
          elements: newElements,
          updatedAt: new Date(),
        };
        
        const pages = state.course.pages.map(page =>
          page.id === state.currentPage!.id ? updatedCurrentPage! : page
        );
        
        updatedCourse = {
          ...state.course,
          pages,
          updatedAt: new Date(),
        };
      }
      
      return {
        ...state,
        elements: newElements,
        course: updatedCourse,
        currentPage: updatedCurrentPage,
        history: [...state.history.slice(0, state.historyIndex + 1), newElements],
        historyIndex: state.historyIndex + 1,
      };
    }

    case 'REMOVE_ELEMENT': {
      const newElements = state.elements.filter(el => el.id !== action.payload.elementId);
      
      // Update current page with new elements
      let updatedCourse = state.course;
      let updatedCurrentPage = state.currentPage;
      
      if (state.currentPage && state.course) {
        updatedCurrentPage = {
          ...state.currentPage,
          elements: newElements,
          updatedAt: new Date(),
        };
        
        const pages = state.course.pages.map(page =>
          page.id === state.currentPage!.id ? updatedCurrentPage! : page
        );
        
        updatedCourse = {
          ...state.course,
          pages,
          updatedAt: new Date(),
        };
      }
      
      return {
        ...state,
        elements: newElements,
        course: updatedCourse,
        currentPage: updatedCurrentPage,
        selectedElementId: state.selectedElementId === action.payload.elementId ? null : state.selectedElementId,
        history: [...state.history.slice(0, state.historyIndex + 1), newElements],
        historyIndex: state.historyIndex + 1,
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
      
      // Update current page with new elements
      let updatedCourse = state.course;
      let updatedCurrentPage = state.currentPage;
      
      if (state.currentPage && state.course) {
        updatedCurrentPage = {
          ...state.currentPage,
          elements: newElements,
          updatedAt: new Date(),
        };
        
        const pages = state.course.pages.map(page =>
          page.id === state.currentPage!.id ? updatedCurrentPage! : page
        );
        
        updatedCourse = {
          ...state.course,
          pages,
          updatedAt: new Date(),
        };
      }
      
      return {
        ...state,
        elements: newElements,
        course: updatedCourse,
        currentPage: updatedCurrentPage,
        history: [...state.history.slice(0, state.historyIndex + 1), newElements],
        historyIndex: state.historyIndex + 1,
      };
    }

    case 'UPDATE_COURSE': {
      if (!state.course) return state;
      return {
        ...state,
        course: {
          ...state.course,
          ...action.payload.updates,
          updatedAt: new Date(),
        },
      };
    }

    case 'MOVE_ELEMENT': {
      const { elementId, targetParentId, index } = action.payload;
      
      // Find the element to move
      const elementIndex = state.elements.findIndex(el => el.id === elementId);
      if (elementIndex === -1) {
        // console.error('Element not found for move operation:', elementId);
        return state;
      }
      
      const element = state.elements[elementIndex];
      
      // Validate that we're not creating circular dependencies
      if (targetParentId) {
        let currentParent: string | undefined = targetParentId;
        while (currentParent) {
          if (currentParent === elementId) {
            // console.error('Circular dependency detected, ignoring move:', { elementId, targetParentId });
            return state;
          }
          const parent = state.elements.find(el => el.id === currentParent);
          currentParent = parent?.parentId;
        }
      }
      
      // Create new elements array safely
      let newElements = [...state.elements];
      
      // Update the element's parent
      const updatedElement = { ...element, parentId: targetParentId };
      newElements[elementIndex] = updatedElement;
      
      // If index is specified, reorder within the parent
      if (typeof index === 'number' && index >= 0) {
        // Remove element from current position
        newElements.splice(elementIndex, 1);
        
        // Calculate safe insertion index
        const safeIndex = Math.min(index, newElements.length);
        
        // Insert at new position
        newElements.splice(safeIndex, 0, updatedElement);
      }
      
      // Update current page with new elements
      let updatedCourse = state.course;
      let updatedCurrentPage = state.currentPage;
      
      if (state.currentPage && state.course) {
        updatedCurrentPage = {
          ...state.currentPage,
          elements: newElements,
          updatedAt: new Date(),
        };
        
        const pages = state.course.pages.map(page =>
          page.id === state.currentPage!.id ? updatedCurrentPage! : page
        );
        
        updatedCourse = {
          ...state.course,
          pages,
          updatedAt: new Date(),
        };
      }
      
      return {
        ...state,
        elements: newElements,
        course: updatedCourse,
        currentPage: updatedCurrentPage,
        history: [...state.history.slice(0, state.historyIndex + 1), newElements],
        historyIndex: state.historyIndex + 1,
      };
    }

    case 'REORDER_ELEMENT': {
      const { elementId, direction } = action.payload;
      const elementIndex = state.elements.findIndex(el => el.id === elementId);
      
      if (elementIndex === -1) return state;
      
      let newIndex: number;
      if (direction === 'up') {
        newIndex = Math.max(0, elementIndex - 1);
      } else {
        newIndex = Math.min(state.elements.length - 1, elementIndex + 1);
      }
      
      if (newIndex === elementIndex) return state; // No change needed
      
      const newElements = [...state.elements];
      const [movedElement] = newElements.splice(elementIndex, 1);
      newElements.splice(newIndex, 0, movedElement);
      
      // Update current page with new elements
      let updatedCourse = state.course;
      let updatedCurrentPage = state.currentPage;
      
      if (state.currentPage && state.course) {
        updatedCurrentPage = {
          ...state.currentPage,
          elements: newElements,
          updatedAt: new Date(),
        };
        
        const pages = state.course.pages.map(page =>
          page.id === state.currentPage!.id ? updatedCurrentPage! : page
        );
        
        updatedCourse = {
          ...state.course,
          pages,
          updatedAt: new Date(),
        };
      }
      
      return {
        ...state,
        elements: newElements,
        course: updatedCourse,
        currentPage: updatedCurrentPage,
        history: [...state.history.slice(0, state.historyIndex + 1), newElements],
        historyIndex: state.historyIndex + 1,
      };
    }

    case 'SELECT_ELEMENT': {
      const { elementId, multiSelect } = action.payload;
      
      if (!multiSelect) {
        // Check if we're trying to select a container immediately after selecting a text element
        // This prevents container interference with text element context menu actions
        const isSelectingContainer = elementId && state.elements.find(el => el.id === elementId)?.type === 'container';
        const currentSelectedIsText = state.selectedElementId && ['heading', 'paragraph', 'quote'].includes(
          state.elements.find(el => el.id === state.selectedElementId)?.type || ''
        );
        const hasActiveTextTab = state.textElementTab === 'styling';
        
        if (isSelectingContainer && currentSelectedIsText && hasActiveTextTab) {
          // Instead of completely blocking, allow selection but reset the text tab
          return {
            ...state,
            selectedElementId: elementId,
            selectedElementIds: elementId ? [elementId] : [],
            textElementTab: null, // Reset text tab when selecting container
          };
        }
        
        // Single select - clear all other selections
        // Only reset textElementTab if we're selecting a different element
        const shouldResetTab = elementId !== state.selectedElementId;
        return {
          ...state,
          selectedElementId: elementId,
          selectedElementIds: elementId ? [elementId] : [],
          textElementTab: shouldResetTab ? null : state.textElementTab, // Only reset tab when selecting different element
        };
      }
      
      // Multi-select logic
      if (!elementId) {
        // Deselect all
        return {
          ...state,
          selectedElementId: null,
          selectedElementIds: [],
          textElementTab: null, // Reset when deselecting all
        };
      }
      
      const currentSelection = state.selectedElementIds;
      const isAlreadySelected = currentSelection.includes(elementId);
      
      if (isAlreadySelected) {
        // Remove from selection
        const newSelection = currentSelection.filter(id => id !== elementId);
        return {
          ...state,
          selectedElementId: newSelection.length > 0 ? newSelection[newSelection.length - 1] : null,
          selectedElementIds: newSelection,
          textElementTab: null, // Reset when changing selection
        };
      } else {
        // Add to selection
        const newSelection = [...currentSelection, elementId];
        return {
          ...state,
          selectedElementId: elementId,
          selectedElementIds: newSelection,
          textElementTab: null, // Reset when changing selection
        };
      }
    }

    case 'SET_DRAGGED_ELEMENT':
      return {
        ...state,
        draggedElement: action.payload.element,
      };

    // Page management actions
    case 'ADD_PAGE': {
      const { page } = action.payload;
      const updatedCourse = state.course ? {
        ...state.course,
        pages: [...state.course.pages, page],
        updatedAt: new Date(),
      } : null;

      return {
        ...state,
        course: updatedCourse,
      };
    }

    case 'REMOVE_PAGE': {
      const { pageId } = action.payload;
      if (!state.course) return state;

      const pages = state.course.pages.filter(p => p.id !== pageId);
      
      // If removing current page, switch to first remaining page
      let newCurrentPage = state.currentPage;
      let newElements = state.elements;
      
      if (state.currentPage?.id === pageId && pages.length > 0) {
        newCurrentPage = pages[0];
        newElements = pages[0].elements;
      } else if (pages.length === 0) {
        newCurrentPage = null;
        newElements = [];
      }

      return {
        ...state,
        course: {
          ...state.course,
          pages,
          updatedAt: new Date(),
        },
        currentPage: newCurrentPage,
        elements: newElements,
        selectedElementId: null,
        selectedElementIds: [],
      };
    }

    case 'UPDATE_PAGE': {
      const { pageId, updates } = action.payload;
      if (!state.course) return state;

      const pages = state.course.pages.map(page =>
        page.id === pageId 
          ? { ...page, ...updates, updatedAt: new Date() }
          : page
      );

      let newCurrentPage = state.currentPage;
      if (state.currentPage?.id === pageId) {
        newCurrentPage = { ...state.currentPage, ...updates, updatedAt: new Date() };
      }

      return {
        ...state,
        course: {
          ...state.course,
          pages,
          updatedAt: new Date(),
        },
        currentPage: newCurrentPage,
      };
    }

    case 'SWITCH_PAGE': {
      const { pageId } = action.payload;
      if (!state.course) return state;

      const targetPage = state.course.pages.find(p => p.id === pageId);
      if (!targetPage) return state;

      // Save current page elements before switching
      let updatedCourse = state.course;
      if (state.currentPage) {
        const pages = state.course.pages.map(page =>
          page.id === state.currentPage!.id
            ? { ...page, elements: state.elements, updatedAt: new Date() }
            : page
        );
        updatedCourse = { ...state.course, pages, updatedAt: new Date() };
      }

      return {
        ...state,
        course: updatedCourse,
        currentPage: targetPage,
        elements: targetPage.elements,
        selectedElementId: null,
        selectedElementIds: [],
        history: [targetPage.elements],
        historyIndex: 0,
      };
    }

    case 'REORDER_PAGES': {
      const { pageIds } = action.payload;
      if (!state.course) return state;

      const pageMap = new Map(state.course.pages.map(page => [page.id, page]));
      const reorderedPages = pageIds
        .map(id => pageMap.get(id))
        .filter(Boolean)
        .map((page, index) => ({ ...page!, order: index }));

      return {
        ...state,
        course: {
          ...state.course,
          pages: reorderedPages,
          updatedAt: new Date(),
        },
      };
    }

    // Preview actions
    case 'TOGGLE_PREVIEW': {
      return {
        ...state,
        previewMode: !state.previewMode,
        currentSlideIndex: state.previewMode ? 0 : state.currentSlideIndex,
      };
    }

    case 'SET_SLIDE_INDEX': {
      const { index } = action.payload;
      const maxIndex = state.course ? state.course.pages.length - 1 : 0;
      const clampedIndex = Math.max(0, Math.min(index, maxIndex));

      return {
        ...state,
        currentSlideIndex: clampedIndex,
      };
    }
      case 'TOGGLE_SIDEBAR':
      return {
        ...state,
        sidebarVisible: !state.sidebarVisible,
      };
    
    case 'SET_SIDEBAR_WIDTH':
      return {
        ...state,
        sidebarWidth: Math.max(200, Math.min(600, action.payload.width)),
      };

    case 'TOGGLE_PROPERTY_PANEL':
      return {
        ...state,
        propertyPanelVisible: !state.propertyPanelVisible,
      };
    
    case 'UNDO': {
      if (state.historyIndex > 0) {
        const newIndex = state.historyIndex - 1;
        const newElements = state.history[newIndex];
        
        // Update current page with new elements
        let updatedCourse = state.course;
        let updatedCurrentPage = state.currentPage;
        
        if (state.currentPage && state.course) {
          updatedCurrentPage = {
            ...state.currentPage,
            elements: newElements,
            updatedAt: new Date(),
          };
          
          const pages = state.course.pages.map(page =>
            page.id === state.currentPage!.id ? updatedCurrentPage! : page
          );
          
          updatedCourse = {
            ...state.course,
            pages,
            updatedAt: new Date(),
          };
        }
        
        return {
          ...state,
          elements: newElements,
          course: updatedCourse,
          currentPage: updatedCurrentPage,
          historyIndex: newIndex,
        };
      }
      return state;
    }
    
    case 'REDO': {
      if (state.historyIndex < state.history.length - 1) {
        const newIndex = state.historyIndex + 1;
        const newElements = state.history[newIndex];
        
        // Update current page with new elements
        let updatedCourse = state.course;
        let updatedCurrentPage = state.currentPage;
        
        if (state.currentPage && state.course) {
          updatedCurrentPage = {
            ...state.currentPage,
            elements: newElements,
            updatedAt: new Date(),
          };
          
          const pages = state.course.pages.map(page =>
            page.id === state.currentPage!.id ? updatedCurrentPage! : page
          );
          
          updatedCourse = {
            ...state.course,
            pages,
            updatedAt: new Date(),
          };
        }
        
        return {
          ...state,
          elements: newElements,
          course: updatedCourse,
          currentPage: updatedCurrentPage,
          historyIndex: newIndex,
        };
      }
      return state;
    }

    case 'SET_COURSE':
      return {
        ...state,
        course: action.payload.course,
        elements: action.payload.course.pages?.[0]?.elements || [],
        currentPage: action.payload.course.pages?.[0] || null,
      };

    case 'LOAD_PROJECT':
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
    
    case 'RESET_PROJECT':
      return {
        ...initialState,
        sidebarVisible: state.sidebarVisible,
        sidebarWidth: state.sidebarWidth,
      };

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

    case 'SET_TEXT_ELEMENT_TAB': {
      const { tab } = action.payload;
      return {
        ...state,
        textElementTab: tab,
      };
    }

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
      
      // Update current page with new elements
      let updatedCourse = state.course;
      let updatedCurrentPage = state.currentPage;
      
      if (state.currentPage && state.course) {
        updatedCurrentPage = {
          ...state.currentPage,
          elements: newElements,
          updatedAt: new Date(),
        };
        
        const pages = state.course.pages.map(page =>
          page.id === state.currentPage!.id ? updatedCurrentPage! : page
        );
        
        updatedCourse = {
          ...state.course,
          pages,
          updatedAt: new Date(),
        };
      }
      
      return {
        ...state,
        elements: newElements,
        course: updatedCourse,
        currentPage: updatedCurrentPage,
        history: [...state.history.slice(0, state.historyIndex + 1), newElements],
        historyIndex: state.historyIndex + 1,
        // Select the first pasted element
        selectedElementId: clonedElements[0]?.id || null,
        selectedElementIds: clonedElements.map(el => el.id),
      };
    }

    default:
      return state;
  }
}
