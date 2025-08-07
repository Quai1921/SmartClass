import { useEffect } from 'react';
import { PageBuilderStorageService } from '../../services/storageService';

interface BuilderInitializerProps {
  dispatch: React.Dispatch<any>;
}

/**
 * Component responsible for initializing the builder with saved data
 */
export const BuilderInitializer: React.FC<BuilderInitializerProps> = ({ dispatch }) => {
  // Load saved project on mount
  useEffect(() => {
    try {
      const savedProject = PageBuilderStorageService.loadCurrentProject();
      if (savedProject) {
        dispatch({ type: 'LOAD_PROJECT', payload: savedProject });
      } else {
        // Ensure we have a valid default state
        dispatch({ type: 'RESET_PROJECT' });
      }
    } catch (error) {
      // console.error('Failed to load saved project:', error);
      // If loading fails, reset to default state
      dispatch({ type: 'RESET_PROJECT' });
    }
  }, [dispatch]);

  return null; // This component doesn't render anything
};
