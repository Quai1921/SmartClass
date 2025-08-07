import { useEffect, useCallback } from 'react';
import type { Course, Element } from '../../types';
import { PageBuilderStorageService } from '../../services/storageService';

/**
 * Hook for managing auto-save functionality in the builder context
 */
export const useBuilderAutoSave = (
  state: { course: Course | null; elements: Element[] }
) => {
  // Utility function for immediate save
  const saveImmediately = useCallback(() => {
    if (state.course && state.elements) {
      try {
        PageBuilderStorageService.saveProject(state.course, state.elements, { silent: true });
      } catch (error) {
        console.error('Immediate save failed:', error);
      }
    }
  }, [state.course, state.elements]);

  // Auto-save effect
  useEffect(() => {
    if (state.course && state.elements && state.elements.length >= 0) {
      // Debounce auto-save - save 2 seconds after last change
      const timeoutId = setTimeout(() => {
        try {
          PageBuilderStorageService.saveProject(state.course!, state.elements, { silent: true });
        } catch (error) {
          console.error('Auto-save failed:', error);
        }
      }, 2000);

      return () => clearTimeout(timeoutId);
    }
  }, [JSON.stringify({ course: state.course, elements: state.elements })]);

  // Save on page unload/reload
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (state.course && state.elements) {
        try {
          // Use synchronous save on page unload
          PageBuilderStorageService.saveProject(state.course, state.elements, { silent: true });
        } catch (error) {
          console.error('Failed to save before unload:', error);
        }
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [state.course, state.elements]);

  return {
    saveImmediately,
  };
};
