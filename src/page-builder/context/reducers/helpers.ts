import type { BuilderState } from '../types';
import type { Element } from '../../types';

/**
 * Helper function to update current page and course with new elements
 */
export function updatePageAndCourse(
  state: BuilderState, 
  newElements: Element[]
): Pick<BuilderState, 'elements' | 'course' | 'currentPage'> {
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
    elements: newElements,
    course: updatedCourse,
    currentPage: updatedCurrentPage,
  };
}

/**
 * Helper function to add history entry
 */
export function addHistoryEntry(
  state: BuilderState,
  newElements: Element[]
): Pick<BuilderState, 'history' | 'historyIndex'> {
  return {
    history: [...state.history.slice(0, state.historyIndex + 1), newElements],
    historyIndex: state.historyIndex + 1,
  };
}
