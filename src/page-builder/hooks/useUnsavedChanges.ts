/**
 * DEPRECATED: This hook has been replaced by useSimpleUnsavedChanges
 * Keeping as stub to prevent import errors
 */
export const useUnsavedChanges = () => {
  // console.warn('� [DEPRECATED] useUnsavedChanges called - should use useSimpleUnsavedChanges instead');
  
  // Return dummy functions to prevent errors
  return {
    hasUnsavedChanges: false,
    markAsSaved: () => console.log('🚫 [DEPRECATED] markAsSaved called on old hook'),
    switchToModule: () => false,
    setInitialElements: () => console.log('� [DEPRECATED] setInitialElements called on old hook'),
    checkUnsavedChanges: () => false,
    currentModuleId: null
  };
};
