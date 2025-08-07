import { useState, useCallback } from 'react';
import { useBuilder } from './useBuilder';
import { ModuleContentMigrator, type ModuleContentV3 } from '../types/moduleContentV3';

/**
 * Enhanced module selection with V3 pagination support
 * This extends the existing useModuleSelection to add true pagination
 */
export const useModuleSelectionV3 = () => {
  const { importProject, elements } = useBuilder();
  const [currentModuleV3, setCurrentModuleV3] = useState<ModuleContentV3 | null>(null);
  const [currentPageId, setCurrentPageId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Load module content and migrate to V3 format
   */
  const loadModuleV3 = useCallback(async (moduleData: any, courseId: string) => {
    setIsLoading(true);
    
    try {
      
      // Parse existing content
      let parsedContent = null;
      if (moduleData.content) {
        try {
          parsedContent = JSON.parse(moduleData.content);
        } catch (error) {
          // console.error('Error parsing module content:', error);
          parsedContent = [];
        }
      }
      
      // Migrate to V3 format
      const v3Content = ModuleContentMigrator.migrateToV3(
        parsedContent,
        moduleData.id,
        courseId
      );
      
      
      // Set V3 content
      setCurrentModuleV3(v3Content);
      setCurrentPageId(v3Content.content.currentPageId);
      
      // Load current page onto canvas
      const currentPage = v3Content.content.pages[v3Content.content.currentPageId];
      if (currentPage) {
        await loadPageOntoCanvas(currentPage, moduleData);
      }
      
    } catch (error) {
      // console.error('Error loading V3 module:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Load specific page onto canvas
   */
  const loadPageOntoCanvas = useCallback(async (page: any, moduleData: any) => {
    const projectData = {
      id: moduleData.id,
      title: `${moduleData.title} - ${page.title}`,
      description: moduleData.description || moduleData.title,
      type: moduleData.type,
      elements: page.elements,
      courseId: moduleData.courseId,
      createdAt: moduleData.createdAt,
      updatedAt: moduleData.updatedAt,
      pages: [{
        id: page.id,
        title: page.title,
        elements: page.elements,
        order: page.order
      }]
    };
    

    
    importProject(JSON.stringify(projectData));
  }, [importProject]);

  /**
   * Switch to different page
   */
  const switchToPage = useCallback(async (pageId: string) => {
    if (!currentModuleV3) return;
    
    const page = currentModuleV3.content.pages[pageId];
    if (!page) {
      // console.error('Page not found:', pageId);
      return;
    }
    
    // Save current page elements first
    if (elements && elements.length > 0) {
      saveCurrentPageElements();
    }
    
    // Switch to new page
    setCurrentPageId(pageId);
    
    // Load new page
    await loadPageOntoCanvas(page, {
      id: currentModuleV3.content.metadata.moduleId,
      title: page.title,
      courseId: currentModuleV3.content.metadata.courseId
    });
    

  }, [currentModuleV3, elements, loadPageOntoCanvas]);

  /**
   * Save current canvas elements to current page
   */
  const saveCurrentPageElements = useCallback(() => {
    if (!currentModuleV3 || !elements || !currentPageId) return;
    
    const updatedContent = {
      ...currentModuleV3,
      content: {
        ...currentModuleV3.content,
        pages: {
          ...currentModuleV3.content.pages,
          [currentPageId]: {
            ...currentModuleV3.content.pages[currentPageId],
            elements: elements,
            updatedAt: new Date().toISOString()
          }
        }
      }
    };
    
    setCurrentModuleV3(updatedContent);
    

    
    return updatedContent;
  }, [currentModuleV3, elements, currentPageId]);

  /**
   * Create new page
   */
  const createNewPage = useCallback((title?: string) => {
    if (!currentModuleV3) return null;
    
    const newPageId = `${currentModuleV3.content.metadata.moduleId}-page-${Date.now()}`;
    const newPage = {
      id: newPageId,
      title: title || `Page ${currentModuleV3.content.totalPages + 1}`,
      elements: [],
      order: currentModuleV3.content.totalPages + 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    const updatedContent = {
      ...currentModuleV3,
      content: {
        ...currentModuleV3.content,
        pages: {
          ...currentModuleV3.content.pages,
          [newPageId]: newPage
        },
        totalPages: currentModuleV3.content.totalPages + 1,
        currentPageId: newPageId
      }
    };
    
    setCurrentModuleV3(updatedContent);
    setCurrentPageId(newPageId);
    

    return newPage;
  }, [currentModuleV3]);

  /**
   * Delete page
   */
  const deletePage = useCallback((pageId: string) => {
    if (!currentModuleV3 || currentModuleV3.content.totalPages <= 1) return false;
    
    const { [pageId]: deletedPage, ...remainingPages } = currentModuleV3.content.pages;
    const pageIds = Object.keys(remainingPages);
    
    // If deleting current page, switch to first available page
    let newCurrentPageId = currentPageId;
    if (pageId === currentPageId) {
      newCurrentPageId = pageIds.sort((a, b) => remainingPages[a].order - remainingPages[b].order)[0];
    }
    
    const updatedContent = {
      ...currentModuleV3,
      content: {
        ...currentModuleV3.content,
        pages: remainingPages,
        totalPages: pageIds.length,
        currentPageId: newCurrentPageId
      }
    };
    
    setCurrentModuleV3(updatedContent);
    setCurrentPageId(newCurrentPageId);
    

    return true;
  }, [currentModuleV3, currentPageId]);

  /**
   * Get serialized V3 content for saving
   */
  const getSerializedV3Content = useCallback(() => {
    if (!currentModuleV3) return '';
    
    // Save current page elements first
    const savedContent = saveCurrentPageElements();
    return JSON.stringify(savedContent || currentModuleV3);
  }, [currentModuleV3, saveCurrentPageElements]);

  return {
    // State
    currentModuleV3,
    currentPageId,
    isLoading,
    
    // Pages array for UI
    pages: currentModuleV3 ? Object.values(currentModuleV3.content.pages).sort((a, b) => a.order - b.order) : [],
    totalPages: currentModuleV3?.content.totalPages || 0,
    
    // Actions
    loadModuleV3,
    switchToPage,
    createNewPage,
    deletePage,
    saveCurrentPageElements,
    getSerializedV3Content
  };
};
