import { useCallback } from 'react';
import type { Course, Element } from '../../types';
import { PageBuilderStorageService } from '../../services/storageService';
import { resetElementCounters, updateElementCounters } from '../../utils/elementNaming';

/**
 * Hook for managing storage operations in the builder context
 */
export const useBuilderStorage = (
  dispatch: React.Dispatch<any>,
  state: { course: Course | null; elements: Element[] },
  saveImmediately: () => void
) => {
  const updateCourse = useCallback((updates: Partial<Course>) => {
    dispatch({ type: 'UPDATE_COURSE', payload: { updates } });
    // Trigger immediate save for course changes
    setTimeout(saveImmediately, 100);
  }, [dispatch, saveImmediately]);

  const saveProject = useCallback(() => {
    if (!state.course) return;
    try {
      PageBuilderStorageService.saveProject(state.course, state.elements);
    } catch (error) {
      // console.error('Failed to save project:', error);
    }
  }, [state.course, state.elements]);

  const loadProject = useCallback((id: string) => {
    try {
      const projectData = PageBuilderStorageService.loadProject(id);
      if (projectData) {
        // Add names to elements that don't have them (backward compatibility)
        const elementsWithNames = projectData.elements.map(element => {
          if (!element.name) {
            // For backward compatibility, generate names for existing elements
            const typeCounters: Record<string, number> = {};
            projectData.elements.forEach(el => {
              if (el.name) {
                const match = el.name.match(/(\w+)\s+(\d+)$/);
                if (match) {
                  const [, , num] = match;
                  const counter = parseInt(num, 10);
                  if (!typeCounters[el.type] || counter > typeCounters[el.type]) {
                    typeCounters[el.type] = counter;
                  }
                }
              }
            });
            
            typeCounters[element.type] = (typeCounters[element.type] || 0) + 1;
            const typeNames: Record<string, string> = {
              container: 'Contenedor',
              heading: 'Título',
              paragraph: 'Párrafo',
              text: 'Texto',
              image: 'Imagen',
              video: 'Video',
              button: 'Botón',
            };
            return {
              ...element,
              name: `${typeNames[element.type] || element.type} ${typeCounters[element.type]}`
            };
          }
          return element;
        });
        
        // Update element counters based on all elements (with generated names)
        updateElementCounters(elementsWithNames.map(el => ({ type: el.type, name: el.name })));
        
        dispatch({ type: 'LOAD_PROJECT', payload: { ...projectData, elements: elementsWithNames } });
      }
    } catch (error) {
      // console.error('Failed to load project:', error);
    }
  }, [dispatch]);

  const createNewProject = useCallback((title?: string, type?: 'Academico' | 'Evaluativo') => {
    try {
      // Reset counters for a fresh start
      resetElementCounters();
      const newCourse = PageBuilderStorageService.createNewProject(title, type);
      dispatch({ type: 'LOAD_PROJECT', payload: { course: newCourse, elements: [] } });
    } catch (error) {
      // console.error('Failed to create new project:', error);
    }
  }, [dispatch]);

  const exportProject = useCallback(() => {
    if (!state.course) return '';
    try {
      return PageBuilderStorageService.exportProject(state.course, state.elements);
    } catch (error) {
      // console.error('Failed to export project:', error);
      return '';
    }
  }, [state.course, state.elements]);

  const importProject = useCallback((jsonData: string) => {
    try {
      const projectData = PageBuilderStorageService.importProject(jsonData);
      if (projectData) {
        dispatch({ type: 'LOAD_PROJECT', payload: projectData });
      }
    } catch (error) {
      // console.error('Failed to import project:', error);
    }
  }, [dispatch]);

  return {
    updateCourse,
    saveProject,
    loadProject,
    createNewProject,
    exportProject,
    importProject,
  };
};
