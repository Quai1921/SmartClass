import React, { useState, useCallback, useEffect } from 'react';
import { useBuilder } from '../hooks/useBuilder';
import type { Element } from '../types';

interface ModulePage {
  id: string;
  title: string;
  elements: Element[];
  order: number;
}

interface ModulePaginationProps {
  moduleContent: any; // Current module content
  onPageChange: (pageElements: Element[]) => void;
  onSave: (updatedContent: string) => void;
}

/**
 * Enhanced pagination component that integrates with existing module system
 */
export const ModulePagination: React.FC<ModulePaginationProps> = ({
  moduleContent,
  onPageChange,
  onSave
}) => {
  const { elements } = useBuilder();
  const [pages, setPages] = useState<ModulePage[]>([]);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [isInitialized, setIsInitialized] = useState(false);

  // Parse module content and extract pages
  useEffect(() => {
    if (!moduleContent || isInitialized) return;

  
    
    let parsedContent;
    try {
      parsedContent = typeof moduleContent === 'string' 
        ? JSON.parse(moduleContent) 
        : moduleContent;
    } catch (error) {
      // console.error('Error parsing module content:', error);
      parsedContent = [];
    }

    let extractedPages: ModulePage[] = [];

    // Handle different content formats
    if (parsedContent?.version === 3 && parsedContent?.content?.pages) {
      // V3 format with pagination structure
      const pageIds = Object.keys(parsedContent.content.pages);
      extractedPages = pageIds
        .map(id => parsedContent.content.pages[id])
        .sort((a, b) => a.order - b.order);
    } else if (parsedContent?.version === 2 && parsedContent?.pages) {
      // V2 format - migrate to page structure
      extractedPages = parsedContent.pages.map((page: any, index: number) => ({
        id: page.id,
        title: page.title,
        elements: page.elementIds
          ?.map((id: string) => parsedContent.elements?.find((el: any) => el.id === id))
          ?.filter(Boolean) || [],
        order: page.order || index + 1
      }));
    } else if (Array.isArray(parsedContent)) {
      // Legacy format - single page with all elements
      extractedPages = [{
        id: 'page-1',
        title: 'Page 1',
        elements: parsedContent,
        order: 1
      }];
    } else {
      // Empty or unknown format
      extractedPages = [{
        id: 'page-1',
        title: 'Page 1',
        elements: [],
        order: 1
      }];
    }

    setPages(extractedPages);
    setCurrentPageIndex(0);
    setIsInitialized(true);

    // Load first page
    if (extractedPages.length > 0) {
      onPageChange(extractedPages[0].elements);
    }
  }, [moduleContent, isInitialized, onPageChange]);

  // Save current page elements when canvas changes
  const saveCurrentPage = useCallback(() => {
    if (!elements || pages.length === 0) return;

    const updatedPages = [...pages];
    updatedPages[currentPageIndex] = {
      ...updatedPages[currentPageIndex],
      elements: elements
    };
    
    setPages(updatedPages);
    
    // Create updated module content in V3 format
    const v3Content = {
      version: 3,
      content: {
        pages: updatedPages.reduce((acc, page) => {
          acc[page.id] = {
            ...page,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };
          return acc;
        }, {} as any),
        currentPageId: updatedPages[currentPageIndex]?.id,
        totalPages: updatedPages.length,
        metadata: {
          moduleId: 'current-module',
          courseId: 'current-course',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      }
    };

    onSave(JSON.stringify(v3Content));
  }, [elements, pages, currentPageIndex, onSave]);

  // Handle page navigation
  const handlePageChange = useCallback((newPageIndex: number) => {
    if (newPageIndex < 0 || newPageIndex >= pages.length) return;

    // Save current page before switching
    saveCurrentPage();

    setCurrentPageIndex(newPageIndex);
    
    // Load new page elements
    if (pages[newPageIndex]) {
      onPageChange(pages[newPageIndex].elements);
    }
  }, [pages, saveCurrentPage, onPageChange]);

  // Create new page
  const handleCreatePage = useCallback((title?: string) => {
    const newPage: ModulePage = {
      id: `page-${Date.now()}`,
      title: title || `Page ${pages.length + 1}`,
      elements: [],
      order: pages.length + 1
    };

    const updatedPages = [...pages, newPage];
    setPages(updatedPages);
    
    // Switch to new page
    setCurrentPageIndex(updatedPages.length - 1);
    onPageChange([]);

  }, [pages, onPageChange]);

  // Delete page
  const handleDeletePage = useCallback((pageIndex: number) => {
    if (pages.length <= 1) return; // Can't delete last page

    const updatedPages = pages.filter((_, index) => index !== pageIndex);
    setPages(updatedPages);

    // Adjust current page index if needed
    const newCurrentIndex = pageIndex >= updatedPages.length 
      ? updatedPages.length - 1 
      : pageIndex;
    
    setCurrentPageIndex(newCurrentIndex);
    
    if (updatedPages[newCurrentIndex]) {
      onPageChange(updatedPages[newCurrentIndex].elements);
    }

  }, [pages, onPageChange]);

  if (!isInitialized || pages.length === 0) {
    return (
      <div className="bg-gray-800 text-white p-4 text-center">
        <div className="text-sm text-gray-400">Loading pages...</div>
      </div>
    );
  }

  const currentPage = pages[currentPageIndex];

  return (
    <div className="bg-gray-800 text-white">
      {/* Page Info */}
      <div className="px-4 py-2 border-b border-gray-600">
        <div className="flex justify-between items-center">
          <div className="text-sm">
            <span className="text-gray-400">Page:</span>
            <span className="ml-2 font-medium">{currentPage?.title}</span>
          </div>
          <div className="text-xs text-gray-400">
            {currentPage?.elements.length || 0} elements
          </div>
        </div>
      </div>

      {/* Pagination Controls */}
      <div className="p-4">
        {/* Simple pagination controls */}
        <div className="flex items-center justify-between mb-3">
          <button
            onClick={() => handlePageChange(currentPageIndex - 1)}
            disabled={currentPageIndex === 0}
            className="px-3 py-1 bg-gray-600 text-white rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-500"
          >
            ← Previous
          </button>
          
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-400">{currentPageIndex + 1} of {pages.length}</span>
            <select
              value={currentPageIndex}
              onChange={(e) => handlePageChange(Number(e.target.value))}
              className="bg-gray-700 text-white text-sm rounded px-2 py-1 border border-gray-600"
            >
              {pages.map((page, index) => (
                <option key={page.id} value={index}>
                  {page.title}
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
        
        {/* Page Actions */}
        <div className="flex gap-2 mt-3">
          <button
            onClick={() => handleCreatePage()}
            className="flex-1 bg-blue-600 text-white px-3 py-2 rounded text-sm hover:bg-blue-700 transition-colors"
          >
            + Add Page
          </button>
          {pages.length > 1 && (
            <button
              onClick={() => handleDeletePage(currentPageIndex)}
              className="bg-red-600 text-white px-3 py-2 rounded text-sm hover:bg-red-700 transition-colors"
            >
              Delete
            </button>
          )}
          <button
            onClick={saveCurrentPage}
            className="bg-green-600 text-white px-3 py-2 rounded text-sm hover:bg-green-700 transition-colors"
          >
            Save
          </button>
        </div>
      </div>

      {/* Pages List */}
      <div className="px-4 pb-4">
        <div className="text-xs text-gray-400 mb-2">Pages ({pages.length})</div>
        <div className="space-y-1 max-h-32 overflow-y-auto">
          {pages.map((page, index) => (
            <div
              key={page.id}
              className={`p-2 rounded text-sm cursor-pointer transition-colors ${
                index === currentPageIndex
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
              onClick={() => handlePageChange(index)}
            >
              <div className="flex justify-between items-center">
                <span>{page.title}</span>
                <span className="text-xs opacity-70">
                  {page.elements.length} items
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ModulePagination;
