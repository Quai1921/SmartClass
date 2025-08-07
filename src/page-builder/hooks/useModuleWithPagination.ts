import { useState, useCallback } from 'react';
import { useBuilder } from './useBuilder';
import { usePagination } from './usePagination';
import { ModuleContentMigrator, type ModuleContentV3 } from '../types/moduleContentV3';
import type { Element } from '../types';

/**
 * Enhanced module selection hook with pagination support
 * This integrates with the existing module system while adding pagination
 */
export const useModuleWithPagination = () => {
  const { importProject, elements, course } = useBuilder();
  const [currentModuleContent, setCurrentModuleContent] = useState<ModuleContentV3 | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Initialize pagination with module content
  const pagination = usePagination(
    currentModuleContent?.content || {
      pages: {},
      currentPageId: '',
      totalPages: 0
    }
  );

  /**
   * Load a module and migrate its content to v3 pagination structure
   */
  const loadModule = useCallback(async (moduleData: any, courseId: string) => {
    setIsLoading(true);
    
    try {

      
      let parsedContent = null;
      
      // Parse module content
      if (moduleData.content) {
        try {
          parsedContent = JSON.parse(moduleData.content);
        } catch (error) {
          // console.error('Error parsing module content:', error);
          parsedContent = [];
        }
      }
      
      // Migrate to v3 structure
      const v3Content = ModuleContentMigrator.migrateToV3(
        parsedContent,
        moduleData.id,
        courseId
      );
      

      
      // Set the migrated content
      setCurrentModuleContent(v3Content);
      
      // Initialize pagination with the migrated content
      pagination.setContent(v3Content.content);
      
      // Load the current page onto the canvas
      const currentPage = v3Content.content.pages[v3Content.content.currentPageId];
      if (currentPage) {
        await loadPageOntoCanvas(currentPage.elements, moduleData, [currentPage]);
      }
      
    } catch (error) {
      // console.error('Error loading module with pagination:', error);
    } finally {
      setIsLoading(false);
    }
  }, [pagination]);

  /**
   * Load page elements onto the canvas using existing importProject
   */
  const loadPageOntoCanvas = useCallback(async (
    pageElements: Element[],
    moduleData: any,
    pages: Array<{ id: string; title: string; elements: Element[]; order: number }>
  ) => {
    const projectData = {
      id: moduleData.id,
      title: moduleData.title,
      description: moduleData.description || moduleData.title,
      type: moduleData.type,
      elements: pageElements,
      courseId: moduleData.courseId,
      createdAt: moduleData.createdAt,
      updatedAt: moduleData.updatedAt,
      pages: pages.map(page => ({
        id: page.id,
        title: page.title,
        elements: page.elements,
        order: page.order
      }))
    };
    

    
    importProject(JSON.stringify(projectData));
  }, [importProject]);

  /**
   * Switch to a specific page
   */
  const switchToPage = useCallback(async (pageId: string) => {
    if (!currentModuleContent) return;
    
    const page = currentModuleContent.content.pages[pageId];
    if (!page) {
      // console.error('Page not found:', pageId);
      return;
    }
    
    
    // Update pagination state
    pagination.setCurrentPageId(pageId);
    
    // Load page elements onto canvas
    const allPages = Object.values(currentModuleContent.content.pages);
    await loadPageOntoCanvas(page.elements, { 
      id: currentModuleContent.content.metadata.moduleId,
      title: page.title,
      courseId: currentModuleContent.content.metadata.courseId
    }, allPages);
    
  }, [currentModuleContent, pagination, loadPageOntoCanvas]);

  /**
   * Create a new page
   */
  const createPage = useCallback((title: string) => {
    if (!currentModuleContent) return null;
    
    const newPageId = `${currentModuleContent.content.metadata.moduleId}-page-${Date.now()}`;
    const newPage = {
      id: newPageId,
      title: title || `Page ${currentModuleContent.content.totalPages + 1}`,
      elements: [],
      order: currentModuleContent.content.totalPages + 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    
    const updatedContent = {
      ...currentModuleContent,
      content: {
        ...currentModuleContent.content,
        pages: {
          ...currentModuleContent.content.pages,
          [newPageId]: newPage
        },
        totalPages: currentModuleContent.content.totalPages + 1,
        currentPageId: newPageId
      }
    };
    
    setCurrentModuleContent(updatedContent);
    pagination.setContent(updatedContent.content);
    
    return newPage;
  }, [currentModuleContent, pagination]);

  /**
   * Save current canvas elements to the current page
   */
  const saveCurrentPage = useCallback(() => {
    if (!currentModuleContent || !elements) return;
    
    const currentPageId = currentModuleContent.content.currentPageId;
    const currentPage = currentModuleContent.content.pages[currentPageId];
    
    if (!currentPage) return;
    
    
    const updatedContent = {
      ...currentModuleContent,
      content: {
        ...currentModuleContent.content,
        pages: {
          ...currentModuleContent.content.pages,
          [currentPageId]: {
            ...currentPage,
            elements: elements,
            updatedAt: new Date().toISOString()
          }
        }
      }
    };
    
    setCurrentModuleContent(updatedContent);
    return updatedContent;
  }, [currentModuleContent, elements]);

  /**
   * Get the serialized module content for saving to backend
   */
  const getSerializedContent = useCallback(() => {
    if (!currentModuleContent) return '';
    
    // Save current page before serializing
    const savedContent = saveCurrentPage();
    return JSON.stringify(savedContent || currentModuleContent);
  }, [currentModuleContent, saveCurrentPage]);

  return {
    // Module state
    currentModuleContent,
    isLoading,
    
    // Pagination state and actions
    ...pagination,
    
    // Module actions
    loadModule,
    switchToPage,
    createPage,
    saveCurrentPage,
    getSerializedContent,
    
    // Canvas integration
    loadPageOntoCanvas
  };
};
