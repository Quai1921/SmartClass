import React, { useState, useEffect } from 'react';
import { useBuilder } from '../../hooks/useBuilder';

interface SimplePaginationProps {
  moduleContent: any;
  onPageChange?: (elements: any[]) => void;
}

/**
 * Simple pagination controls that work with V3 module content
 */
export const SimplePagination: React.FC<SimplePaginationProps> = ({
  moduleContent,
  onPageChange
}) => {
  const { importProject } = useBuilder();
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [pages, setPages] = useState<any[]>([]);

  // Parse module content and extract pages
  useEffect(() => {
    if (!moduleContent) return;

    let parsedContent;
    try {
      parsedContent = typeof moduleContent === 'string' 
        ? JSON.parse(moduleContent) 
        : moduleContent;
    } catch (error) {
      // console.error('Error parsing module content:', error);
      return;
    }

    let extractedPages: any[] = [];

    if (parsedContent?.version === 3 && parsedContent?.content?.pages) {
      // V3 format
      extractedPages = Object.values(parsedContent.content.pages)
        .sort((a: any, b: any) => a.order - b.order);
    } else if (parsedContent?.version === 2 && parsedContent?.pages) {
      // V2 format - map elementIds to elements
      extractedPages = parsedContent.pages.map((page: any) => ({
        id: page.id,
        title: page.title,
        elements: page.elementIds
          ?.map((id: string) => parsedContent.elements?.find((el: any) => el.id === id))
          ?.filter(Boolean) || [],
        order: page.order || 1
      }));
    } else {
      // Legacy or unknown format
      const elements = Array.isArray(parsedContent) ? parsedContent : [];
      extractedPages = [{
        id: 'page-1',
        title: 'Page 1',
        elements: elements,
        order: 1
      }];
    }

    setPages(extractedPages);
    setCurrentPageIndex(0);

    // Load first page
    if (extractedPages.length > 0 && onPageChange) {
      onPageChange(extractedPages[0].elements);
    }
  }, [moduleContent, onPageChange]);

  // Handle page navigation
  const handlePageChange = (newIndex: number) => {
    if (newIndex < 0 || newIndex >= pages.length) return;
    
    setCurrentPageIndex(newIndex);
    const newPage = pages[newIndex];
    
    if (onPageChange) {
      onPageChange(newPage.elements);
    }

    // Also update canvas directly
    const projectData = {
      elements: newPage.elements,
      pages: [{
        id: newPage.id,
        title: newPage.title,
        elements: newPage.elements,
        order: newPage.order
      }]
    };
    
    importProject(JSON.stringify(projectData));
  };

  if (pages.length <= 1) {
    return null; // Don't show pagination for single page
  }

  const currentPage = pages[currentPageIndex];

  return (
    <div className="bg-gray-800 text-white border-t border-gray-600 p-3">
      <div className="flex items-center justify-between">
        <button
          onClick={() => handlePageChange(currentPageIndex - 1)}
          disabled={currentPageIndex === 0}
          className="px-3 py-1 bg-gray-600 text-white rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-500"
        >
          ← Previous
        </button>
        
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-400">
            {currentPageIndex + 1} of {pages.length}
          </span>
          <select
            value={currentPageIndex}
            onChange={(e) => handlePageChange(Number(e.target.value))}
            className="bg-gray-700 text-white text-sm rounded px-2 py-1 border border-gray-600"
          >
            {pages.map((page, index) => (
              <option key={page.id} value={index}>
                {page.title} ({page.elements.length} items)
              </option>
            ))}
          </select>
        </div>
        
        <button
          onClick={() => handlePageChange(currentPageIndex + 1)}
          disabled={currentPageIndex >= pages.length - 1}
          className="px-3 py-1 bg-gray-600 text-white rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-500"
        >
          Next →
        </button>
      </div>
      
      {currentPage && (
        <div className="mt-2 text-xs text-gray-400 text-center">
          📄 {currentPage.title} • {currentPage.elements.length} elements
        </div>
      )}
    </div>
  );
};

export default SimplePagination;
