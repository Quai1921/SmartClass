import { useCallback } from 'react';
import type { BuilderAction, BuilderState } from '../types';
import type { Page } from '../../types';

export const useBuilderPages = (
  dispatch: React.Dispatch<BuilderAction>,
  state: BuilderState
) => {
  const addPage = useCallback((title?: string): string => {
    const pages = state.course?.pages || [];
    const newPage: Page = {
      id: crypto.randomUUID(),
      title: title || `Página ${pages.length + 1}`,
      elements: [],
      order: pages.length,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    dispatch({
      type: 'ADD_PAGE',
      payload: { page: newPage },
    });

    return newPage.id;
  }, [dispatch, state.course?.pages]);

  const removePage = useCallback((pageId: string) => {
    if (!state.course || state.course.pages.length <= 1) {
      // console.warn('Cannot remove the last page');
      return;
    }

    dispatch({
      type: 'REMOVE_PAGE',
      payload: { pageId },
    });
  }, [dispatch, state.course]);

  const duplicatePage = useCallback((pageId: string): string => {
    const page = state.course?.pages.find(p => p.id === pageId);
    if (!page || !state.course) {
      // console.error('Page not found for duplication:', pageId);
      return '';
    }

    const pages = state.course.pages;
    const duplicatedPage: Page = {
      id: crypto.randomUUID(),
      title: `${page.title} (Copia)`,
      elements: page.elements.map(element => ({
        ...element,
        id: crypto.randomUUID(), // Generate new IDs for all elements
      })),
      order: pages.length,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    dispatch({
      type: 'ADD_PAGE',
      payload: { page: duplicatedPage },
    });

    return duplicatedPage.id;
  }, [dispatch, state.course]);

  const updatePage = useCallback((pageId: string, updates: Partial<Page>) => {
    dispatch({
      type: 'UPDATE_PAGE',
      payload: { pageId, updates },
    });
  }, [dispatch]);

  const switchPage = useCallback((pageId: string) => {
    dispatch({
      type: 'SWITCH_PAGE',
      payload: { pageId },
    });
  }, [dispatch]);

  const reorderPages = useCallback((pageIds: string[]) => {
    dispatch({
      type: 'REORDER_PAGES',
      payload: { pageIds },
    });
  }, [dispatch]);

  return {
    addPage,
    removePage,
    duplicatePage,
    updatePage,
    switchPage,
    reorderPages,
  };
};
