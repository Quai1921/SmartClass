import { useState, useCallback } from 'react';
import { DraftModuleService } from '../../../../../services/draftModuleService';
import { useUrlParams } from './useUrlParams';

export const useModuleDeletion = (
  currentModuleInfo: any,
  setCurrentModuleInfo: (module: any) => void,
  loadModulesForCourse: (courseId: string, moduleId?: string | null) => Promise<void>
) => {
  const [moduleToDelete, setModuleToDelete] = useState<any>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const { getUrlParams } = useUrlParams();

  const handleDeleteModule = useCallback((module: any, event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent module selection when clicking delete
    setModuleToDelete(module);
    setIsDeleteModalOpen(true);
  }, []);

  const confirmDeleteModule = useCallback(() => {
    if (!moduleToDelete) return;

    try {
      if (moduleToDelete.isDraft) {
        // Delete draft module
        DraftModuleService.deleteDraft(moduleToDelete.id);
        
        // If the deleted module was the current one, clear current module info
        if (currentModuleInfo?.id === moduleToDelete.id) {
          setCurrentModuleInfo(null);
        }
        
        // Refresh the modules list
        const { courseId } = getUrlParams();
        if (courseId) {
          loadModulesForCourse(courseId);
        }
      } else {
        // Handle published module deletion (implement as needed)
        // You'd implement this with your existing module deletion logic
      }
    } catch (error) {
      // console.error('Error deleting module:', error);
    } finally {
      setIsDeleteModalOpen(false);
      setModuleToDelete(null);
    }
  }, [moduleToDelete, currentModuleInfo, setCurrentModuleInfo, getUrlParams, loadModulesForCourse]);

  const cancelDeleteModule = useCallback(() => {
    setIsDeleteModalOpen(false);
    setModuleToDelete(null);
  }, []);

  return {
    moduleToDelete,
    isDeleteModalOpen,
    handleDeleteModule,
    confirmDeleteModule,
    cancelDeleteModule
  };
};
