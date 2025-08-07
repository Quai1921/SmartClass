/**
 * Pagination Hook
 * Step 3: React hook for managing paginated content state and operations
 */

import { useState, useCallback, useMemo } from 'react';
import type { Element } from '../types';
import type { 
  PaginatedContent, 
  PageData
} from '../types/pagination';
import { 
  PaginationUtils, 
  createInitialPaginatedContent, 
  getOrderedPages 
} from '../utils/pagination';

export const usePagination = (initialContent?: PaginatedContent) => {
  // Initialize state
  const [content, setContent] = useState<PaginatedContent>(
    initialContent || createInitialPaginatedContent()
  );
  const [isLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Utility instance
  const utils = useMemo(() => new PaginationUtils(), []);

  // Helper to mark changes
  const markChanged = useCallback(() => {
    setHasUnsavedChanges(true);
    setError(null);
  }, []);

  // Helper to update content and metadata
  const updateContent = useCallback((updater: (current: PaginatedContent) => PaginatedContent) => {
    setContent(current => {
      const updated = updater(current);
      return PaginationUtils.updateMetadata(updated);
    });
    markChanged();
  }, [markChanged]);

  // Page CRUD Operations
  const createPage = useCallback((title?: string): string => {
    const newPageId = PaginationUtils.getNextPageId(content);
    const newPageTitle = title || `Page ${parseInt(newPageId, 10)}`;
    const newOrder = content.totalPages + 1;
    
    const newPage = PaginationUtils.createEmptyPage(newPageId, newPageTitle, newOrder);
    
    updateContent(current => ({
      ...current,
      pages: {
        ...current.pages,
        [newPageId]: newPage
      },
      totalPages: current.totalPages + 1
    }));

    return newPageId;
  }, [content, updateContent]);

  const deletePage = useCallback((pageId: string): boolean => {
    if (content.totalPages <= 1) {
      setError("Cannot delete the last page");
      return false;
    }

    if (!content.pages[pageId]) {
      setError(`Page ${pageId} does not exist`);
      return false;
    }

    updateContent(current => {
      const newPages = { ...current.pages };
      delete newPages[pageId];

      // If deleting current page, switch to first available page
      let newCurrentPageId = current.currentPageId;
      if (current.currentPageId === pageId) {
        const remainingPageIds = Object.keys(newPages);
        newCurrentPageId = remainingPageIds[0] || "1";
      }

      // Reorder remaining pages
      const orderedPages = Object.values(newPages).sort((a, b) => a.order - b.order);
      const reorderedPages: Record<string, PageData> = {};
      orderedPages.forEach((page, index) => {
        reorderedPages[page.id] = { ...page, order: index + 1 };
      });

      return {
        ...current,
        pages: reorderedPages,
        currentPageId: newCurrentPageId,
        totalPages: orderedPages.length
      };
    });

    return true;
  }, [content, updateContent]);

  const updatePage = useCallback((pageId: string, updates: Partial<PageData>): boolean => {
    if (!content.pages[pageId]) {
      setError(`Page ${pageId} does not exist`);
      return false;
    }

    updateContent(current => ({
      ...current,
      pages: {
        ...current.pages,
        [pageId]: {
          ...current.pages[pageId],
          ...updates,
          updatedAt: new Date().toISOString()
        }
      }
    }));

    return true;
  }, [content, updateContent]);

  const reorderPages = useCallback((pageIds: string[]): boolean => {
    if (pageIds.length !== content.totalPages) {
      setError("Page IDs length doesn't match total pages");
      return false;
    }

    updateContent(current => {
      const reorderedPages: Record<string, PageData> = {};
      pageIds.forEach((pageId, index) => {
        if (current.pages[pageId]) {
          reorderedPages[pageId] = {
            ...current.pages[pageId],
            order: index + 1
          };
        }
      });

      return {
        ...current,
        pages: reorderedPages
      };
    });

    return true;
  }, [content, updateContent]);

  // Navigation Operations
  const switchToPage = useCallback((pageId: string): boolean => {
    if (!content.pages[pageId]) {
      setError(`Page ${pageId} does not exist`);
      return false;
    }

    setContent(current => ({
      ...current,
      currentPageId: pageId
    }));

    return true;
  }, [content]);

  const nextPage = useCallback((): boolean => {
    const orderedPages = getOrderedPages(content);
    const currentIndex = orderedPages.findIndex(page => page.id === content.currentPageId);
    
    if (currentIndex < orderedPages.length - 1) {
      return switchToPage(orderedPages[currentIndex + 1].id);
    }
    
    return false; // Already on last page
  }, [content, switchToPage]);

  const prevPage = useCallback((): boolean => {
    const orderedPages = getOrderedPages(content);
    const currentIndex = orderedPages.findIndex(page => page.id === content.currentPageId);
    
    if (currentIndex > 0) {
      return switchToPage(orderedPages[currentIndex - 1].id);
    }
    
    return false; // Already on first page
  }, [content, switchToPage]);

  // Element Operations
  const addElementToPage = useCallback((pageId: string, element: Element): boolean => {
    if (!content.pages[pageId]) {
      setError(`Page ${pageId} does not exist`);
      return false;
    }

    updateContent(current => ({
      ...current,
      pages: {
        ...current.pages,
        [pageId]: {
          ...current.pages[pageId],
          elements: [...current.pages[pageId].elements, element],
          updatedAt: new Date().toISOString()
        }
      }
    }));

    return true;
  }, [content, updateContent]);

  const removeElementFromPage = useCallback((pageId: string, elementId: string): boolean => {
    if (!content.pages[pageId]) {
      setError(`Page ${pageId} does not exist`);
      return false;
    }

    updateContent(current => ({
      ...current,
      pages: {
        ...current.pages,
        [pageId]: {
          ...current.pages[pageId],
          elements: current.pages[pageId].elements.filter(el => el.id !== elementId),
          updatedAt: new Date().toISOString()
        }
      }
    }));

    return true;
  }, [content, updateContent]);

  const updateElementInPage = useCallback((pageId: string, elementId: string, updates: Partial<Element>): boolean => {
    if (!content.pages[pageId]) {
      setError(`Page ${pageId} does not exist`);
      return false;
    }

    updateContent(current => ({
      ...current,
      pages: {
        ...current.pages,
        [pageId]: {
          ...current.pages[pageId],
          elements: current.pages[pageId].elements.map(el =>
            el.id === elementId ? { ...el, ...updates } : el
          ),
          updatedAt: new Date().toISOString()
        }
      }
    }));

    return true;
  }, [content, updateContent]);

  const moveElementBetweenPages = useCallback((elementId: string, fromPageId: string, toPageId: string): boolean => {
    const fromPage = content.pages[fromPageId];
    const toPage = content.pages[toPageId];

    if (!fromPage || !toPage) {
      setError("Source or destination page does not exist");
      return false;
    }

    const element = fromPage.elements.find(el => el.id === elementId);
    if (!element) {
      setError(`Element ${elementId} not found in page ${fromPageId}`);
      return false;
    }

    updateContent(current => ({
      ...current,
      pages: {
        ...current.pages,
        [fromPageId]: {
          ...fromPage,
          elements: fromPage.elements.filter(el => el.id !== elementId),
          updatedAt: new Date().toISOString()
        },
        [toPageId]: {
          ...toPage,
          elements: [...toPage.elements, element],
          updatedAt: new Date().toISOString()
        }
      }
    }));

    return true;
  }, [content, updateContent]);

  // Computed values
  const currentPage = content.pages[content.currentPageId];
  const orderedPages = getOrderedPages(content);
  const canGoNext = useMemo(() => {
    const currentIndex = orderedPages.findIndex(page => page.id === content.currentPageId);
    return currentIndex < orderedPages.length - 1;
  }, [orderedPages, content.currentPageId]);

  const canGoPrev = useMemo(() => {
    const currentIndex = orderedPages.findIndex(page => page.id === content.currentPageId);
    return currentIndex > 0;
  }, [orderedPages, content.currentPageId]);

  return {
    // State
    content,
    isLoading,
    error,
    hasUnsavedChanges,

    // Page Operations
    createPage,
    deletePage,
    updatePage,
    reorderPages,
    switchToPage,
    nextPage,
    prevPage,
    addElementToPage,
    removeElementFromPage,
    updateElementInPage,
    moveElementBetweenPages,

    // Computed values (additional helpers)
    currentPage,
    orderedPages,
    canGoNext,
    canGoPrev,
    
    // Utility methods
    markSaved: () => setHasUnsavedChanges(false),
    clearError: () => setError(null),
    validateContent: () => utils.validate(content)
  };
};
