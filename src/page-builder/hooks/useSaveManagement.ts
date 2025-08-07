import { useState } from 'react';
import { useBuilder } from '../hooks/useBuilder';
import { useCourseBuilder } from '../hooks/useCourseBuilder';
import { useUnsavedChanges } from '../hooks/useUnsavedChanges';
import { useSimpleUnsavedChanges } from '../hooks/useSimpleUnsavedChanges';

export const useSaveManagement = () => {
  const { saveProject, course, updateCourse } = useBuilder();
  const { currentPage, saveCurrentPage } = useCourseBuilder();
  const { markAsSaved } = useSimpleUnsavedChanges();
  const [showSaveNotification, setShowSaveNotification] = useState(false);

  const handleSave = async () => {
    try {
      // Priority 1: If we have elements (indicating we're in the page builder), 
      // try to save module content using window event system
      const urlParams = new URLSearchParams(window.location.search);
      const moduleId = urlParams.get('moduleId');
      
      if (moduleId) {

        
        // Dispatch a custom event that the save system can listen to
        const saveModuleEvent = new CustomEvent('saveCurrentModule');
        window.dispatchEvent(saveModuleEvent);
        
        // Show save notification (the actual save result will be handled by the listener)
        setShowSaveNotification(true);
        setTimeout(() => setShowSaveNotification(false), 2000);
        return;
      }
      
      // Priority 2: Check if we're editing a course page
      if (currentPage) {
        // Save to course page
        const success = await saveCurrentPage();
        if (success) {
          markAsSaved(); // Mark changes as saved
          setShowSaveNotification(true);
          setTimeout(() => setShowSaveNotification(false), 2000);
        } else {
          // console.error('Failed to save course page');
        }
      } else {
        // Priority 3: Save as regular project
        saveProject();
        markAsSaved(); // Mark changes as saved
        setShowSaveNotification(true);
        setTimeout(() => setShowSaveNotification(false), 2000);
      }
    } catch (error) {
      // console.error('Save failed:', error);
    }
  };

  const handleCourseTypeChange = (type: 'Academico' | 'Evaluativo') => {
    if (course) {
      updateCourse({ type });
    }
  };

  return {
    showSaveNotification,
    handleSave,
    handleCourseTypeChange
  };
};
