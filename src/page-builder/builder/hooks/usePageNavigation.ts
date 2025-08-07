import { useCallback, useEffect } from 'react';
import { useBuilder } from '../../hooks/useBuilder';

/**
 * Hook for page navigation operations
 */
export function usePageNavigation() {
  const { course, currentPage, switchPage } = useBuilder();
  
  const pages = course?.pages || [];
  const currentPageIndex = pages.findIndex(page => page.id === currentPage?.id);
  
  // Debug tracking
  useEffect(() => {
    
    if (pages && pages.length > 0) {
      pages.forEach((page: any, index: number) => {
      });
    }
    
  }, [pages, currentPage]);

  const goToPreviousPage = useCallback(() => {
    if (currentPageIndex > 0) {
      switchPage(pages[currentPageIndex - 1].id);
    }
  }, [currentPageIndex, pages, switchPage]);

  const goToNextPage = useCallback(() => {
    if (currentPageIndex < pages.length - 1) {
      switchPage(pages[currentPageIndex + 1].id);
    }
  }, [currentPageIndex, pages, switchPage]);

  const canGoPrevious = currentPageIndex > 0;
  const canGoNext = currentPageIndex < pages.length - 1;

  return {
    pages,
    currentPageIndex,
    canGoPrevious,
    canGoNext,
    goToPreviousPage,
    goToNextPage,
  };
}
