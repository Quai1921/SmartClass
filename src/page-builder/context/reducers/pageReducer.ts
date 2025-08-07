import type { BuilderState, BuilderAction } from '../types';

/**
 * Handles page-related actions (ADD_PAGE, REMOVE_PAGE, UPDATE_PAGE, SWITCH_PAGE, REORDER_PAGES)
 */
export function pageReducer(state: BuilderState, action: BuilderAction): BuilderState | null {
  switch (action.type) {
    case 'ADD_PAGE': {
      if (!state.course) return state;
      
      const newPage = action.payload.page;
      const updatedCourse = {
        ...state.course,
        pages: [...state.course.pages, newPage],
        updatedAt: new Date(),
      };
      
      return {
        ...state,
        course: updatedCourse,
      };
    }

    case 'REMOVE_PAGE': {
      if (!state.course) return state;
      
      const { pageId } = action.payload;
      const updatedPages = state.course.pages.filter(page => page.id !== pageId);
      
      const updatedCourse = {
        ...state.course,
        pages: updatedPages,
        updatedAt: new Date(),
      };
      
      return {
        ...state,
        course: updatedCourse,
      };
    }

    case 'UPDATE_PAGE': {
      if (!state.course) return state;
      
      const { pageId, updates } = action.payload;
      const updatedPages = state.course.pages.map(page =>
        page.id === pageId ? { ...page, ...updates, updatedAt: new Date() } : page
      );
      
      const updatedCourse = {
        ...state.course,
        pages: updatedPages,
        updatedAt: new Date(),
      };
      
      // Update currentPage if it's the one being updated
      const updatedCurrentPage = state.currentPage?.id === pageId
        ? { ...state.currentPage, ...updates, updatedAt: new Date() }
        : state.currentPage;
      
      return {
        ...state,
        course: updatedCourse,
        currentPage: updatedCurrentPage,
      };
    }

    case 'SWITCH_PAGE': {
      if (!state.course) return state;
      
      const { pageId } = action.payload;
      const targetPage = state.course.pages.find(page => page.id === pageId);
      
      if (!targetPage) {
        // console.error('Page not found:', pageId);
        return state;
      }
      
      return {
        ...state,
        currentPage: targetPage,
        elements: targetPage.elements,
        selectedElementId: null,
        selectedElementIds: [], // Clear selection when switching pages
      };
    }

    case 'REORDER_PAGES': {
      if (!state.course) return state;
      
      const { pageIds } = action.payload;
      const pageMap = new Map(state.course.pages.map(page => [page.id, page]));
      const reorderedPages = pageIds.map(id => pageMap.get(id)).filter(Boolean) as any[];
      
      const updatedCourse = {
        ...state.course,
        pages: reorderedPages,
        updatedAt: new Date(),
      };
      
      return {
        ...state,
        course: updatedCourse,
      };
    }

    default:
      return null; // Not handled by this reducer
  }
}
