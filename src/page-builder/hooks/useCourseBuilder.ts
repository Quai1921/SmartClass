import { useCallback } from 'react';
import { useCourseContext } from '../context/CourseContext';
import { useBuilder } from './useBuilder';
import type { Element } from '../types';

/**
 * Hook to integrate course management with the page builder
 * Provides methods to create, load, and save course pages
 */
export const useCourseBuilder = () => {
  const courseContext = useCourseContext();
  const { 
    elements, 
    createNewProject, 
    exportProject, 
    importProject 
  } = useBuilder();

  /**
   * Create a new page for a course and clear the canvas
   */
  const createNewPage = useCallback(async (courseId: string, title: string) => {
    try {
      // Clear the canvas
      createNewProject(title);
      
      // Create the page in course context
      await courseContext.createAndLoadNewPage(courseId, title);
      
      return true;
    } catch (error) {
      console.error('Error creating new page:', error);
      return false;
    }
  }, [courseContext, createNewProject]);

  /**
   * Load a course page into the page builder
   */
  const loadPage = useCallback(async (courseId: string, pageId: string) => {
    try {
      const page = await courseContext.loadPage(courseId, pageId);
      if (page && page.elements.length > 0) {
        // Import the page elements into the builder
        const exportData = {
          elements: page.elements,
          course: courseContext.currentCourse,
          version: '1.0',
          timestamp: new Date().toISOString()
        };
        
        importProject(JSON.stringify(exportData));
        
        // Update current page in context
        courseContext.setCurrentCourse(courseContext.currentCourse);
      }
      
      return page;
    } catch (error) {
      console.error('Error loading page:', error);
      return null;
    }
  }, [courseContext, importProject]);

  /**
   * Save the current canvas content to the active course page
   */
  const saveCurrentPage = useCallback(async () => {
    try {
      if (!courseContext.currentPage) {
        throw new Error('No active page to save');
      }

      // Get current elements from the builder
      await courseContext.saveCurrentPageFromBuilder(elements);
      
      return true;
    } catch (error) {
      console.error('Error saving page:', error);
      return false;
    }
  }, [courseContext, elements]);

  /**
   * Get the current course and page info
   */
  const getCurrentContext = useCallback(() => {
    return {
      course: courseContext.currentCourse,
      page: courseContext.currentPage,
      hasUnsavedChanges: elements.length > 0 && courseContext.currentPage
    };
  }, [courseContext.currentCourse, courseContext.currentPage, elements.length]);

  return {
    // Course context
    currentCourse: courseContext.currentCourse,
    currentPage: courseContext.currentPage,
    setCurrentCourse: courseContext.setCurrentCourse,
    
    // Integrated operations
    createNewPage,
    loadPage,
    saveCurrentPage,
    getCurrentContext,
    
    // Builder elements
    elements,
  };
};
