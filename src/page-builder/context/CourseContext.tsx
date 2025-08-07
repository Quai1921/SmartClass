import React, { createContext, useContext, useState, useCallback } from 'react';
import type { Course } from '../../actions/courses/get-courses';
import { CoursePageService, type CoursePage } from '../services/coursePageService';
import type { Element } from '../types';
import { useToast } from './ToastContext';

interface CourseContext {
  // Current course and page being edited
  currentCourse: Course | null;
  currentPage: CoursePage | null;
  
  // Course management
  setCurrentCourse: (course: Course | null) => void;
  
  // Page management
  createNewPage: (courseId: string, title: string) => Promise<CoursePage>;
  loadPage: (courseId: string, pageId: string) => Promise<CoursePage | null>;
  savePage: (pageId: string, elements: Element[]) => Promise<void>;
  deletePage: (pageId: string) => Promise<boolean>; // Add delete method
  
  // Page builder integration
  loadPageIntoBuilder: (courseId: string, pageId: string) => Promise<void>;
  saveCurrentPageFromBuilder: (elements: Element[]) => Promise<void>;
  createAndLoadNewPage: (courseId: string, title: string) => Promise<void>;
}

const CourseContextImpl = createContext<CourseContext | null>(null);

interface CourseProviderProps {
  children: React.ReactNode;
  onLoadElements?: (elements: Element[]) => void; // Callback to load elements into page builder
  onSaveComplete?: () => void; // Callback when save is complete
}

export const CourseProvider: React.FC<CourseProviderProps> = ({
  children,
  onLoadElements,
  onSaveComplete,
}) => {
  const [currentCourse, setCurrentCourse] = useState<Course | null>(null);
  const [currentPage, setCurrentPage] = useState<CoursePage | null>(null);
  const toast = useToast();

  const createNewPage = useCallback(async (courseId: string, title: string): Promise<CoursePage> => {
    try {
      const newPage: CoursePage = {
        id: `course-${courseId}-page-${Date.now()}`,
        courseId,
        title,
        elements: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Save to storage
      CoursePageService.savePage(newPage);
      toast.showSuccess(`Módulo "${title}" creado exitosamente`);
      
      return newPage;
    } catch (error) {
      // console.error('Error creating page:', error);
      toast.showError('Error al crear el módulo. Por favor, intenta de nuevo.');
      throw error;
    }
  }, [toast]);

  const loadPage = useCallback(async (courseId: string, pageId: string): Promise<CoursePage | null> => {
    try {
      const page = CoursePageService.getPage(pageId);
      if (page && page.courseId === courseId) {
        toast.showInfo(`Módulo "${page.title}" cargado`);
        return page;
      }
      toast.showWarning('Módulo no encontrado');
      return null;
    } catch (error) {
      // console.error('Error loading page:', error);
      toast.showError('Error al cargar el módulo');
      return null;
    }
  }, [toast]);

  const savePage = useCallback(async (pageId: string, elements: Element[]): Promise<void> => {
    try {
      const existingPage = CoursePageService.getPage(pageId);
      if (existingPage) {
        const updatedPage: CoursePage = {
          ...existingPage,
          elements,
          updatedAt: new Date().toISOString(),
        };
        CoursePageService.savePage(updatedPage);
        setCurrentPage(updatedPage);
        
        toast.showSuccess(`Módulo "${existingPage.title}" guardado exitosamente`);
        
        if (onSaveComplete) {
          onSaveComplete();
        }
      } else {
        toast.showError('No se pudo encontrar el módulo para guardar');
      }
    } catch (error) {
      // console.error('Error saving page:', error);
      toast.showError('Error al guardar el módulo. Los cambios pueden perderse.');
      throw error;
    }
  }, [onSaveComplete, toast]);

  const deletePage = useCallback(async (pageId: string): Promise<boolean> => {
    try {
      const success = CoursePageService.deletePage(pageId);
      if (success) {
        // If we're deleting the current page, clear it
        if (currentPage && currentPage.id === pageId) {
          setCurrentPage(null);
          if (onLoadElements) {
            onLoadElements([]);
          }
        }
        toast.showSuccess('Módulo eliminado exitosamente');
        return true;
      } else {
        toast.showError('Error al eliminar el módulo');
        return false;
      }
    } catch (error) {
      // console.error('Error deleting page:', error);
      toast.showError('Error al eliminar el módulo');
      return false;
    }
  }, [currentPage, onLoadElements, toast]);

  const loadPageIntoBuilder = useCallback(async (courseId: string, pageId: string): Promise<void> => {
    try {
      const page = await loadPage(courseId, pageId);
      if (page) {
        setCurrentPage(page);
        if (onLoadElements) {
          onLoadElements(page.elements);
        }
      } else {
        toast.showError('No se pudo cargar el módulo en el editor');
      }
    } catch (error) {
      // console.error('Error loading page into builder:', error);
      toast.showError('Error al cargar el módulo en el editor');
      throw error;
    }
  }, [loadPage, onLoadElements, toast]);

  const saveCurrentPageFromBuilder = useCallback(async (elements: Element[]): Promise<void> => {
    if (currentPage) {
      await savePage(currentPage.id, elements);
    } else {
      toast.showError('No hay un módulo activo para guardar');
      throw new Error('No current page to save');
    }
  }, [currentPage, savePage, toast]);

  const createAndLoadNewPage = useCallback(async (courseId: string, title: string): Promise<void> => {
    try {
      const newPage = await createNewPage(courseId, title);
      setCurrentPage(newPage);
      
      // Load empty elements into builder
      if (onLoadElements) {
        onLoadElements([]);
      }
    } catch (error) {
      // console.error('Error creating and loading new page:', error);
      toast.showError('Error al crear y cargar el nuevo módulo');
      throw error;
    }
  }, [createNewPage, onLoadElements, toast]);

  const contextValue: CourseContext = {
    currentCourse,
    currentPage,
    setCurrentCourse,
    createNewPage,
    loadPage,
    savePage,
    deletePage, // Add delete method
    loadPageIntoBuilder,
    saveCurrentPageFromBuilder,
    createAndLoadNewPage,
  };

  return (
    <CourseContextImpl.Provider value={contextValue}>
      {children}
    </CourseContextImpl.Provider>
  );
};

export const useCourseContext = (): CourseContext => {
  const context = useContext(CourseContextImpl);
  if (!context) {
    throw new Error('useCourseContext must be used within a CourseProvider');
  }
  return context;
};
