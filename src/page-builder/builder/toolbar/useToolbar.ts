import { useEffect } from 'react';
import { useBuilder } from '../../hooks/useBuilder';
import { useCourseBuilder } from '../../hooks/useCourseBuilder';
import { useUnsavedChanges } from '../../hooks/useUnsavedChanges';
import { useSimpleUnsavedChanges } from '../../hooks/useSimpleUnsavedChanges';
import { useToolbarState, useToolbarActions, useModuleContent } from './hooks';

/**
 * Main toolbar hook that combines all toolbar functionality
 */
export const useToolbar = () => {
  // Get builder context
  const {
    undo,
    redo,
    canUndo,
    canRedo,
    course,
    elements,
    saveProject,
    exportProject,
    importProject,
    createNewProject,
    updateElement,
    updateCourse,
    sidebarVisible,
    toggleSidebar,
    propertyPanelVisible,
    togglePropertyPanel
  } = useBuilder();

  const {
    currentPage,
    saveCurrentPage,
  } = useCourseBuilder();

  const { hasUnsavedChanges, markAsSaved, getDebugInfo } = useSimpleUnsavedChanges();

  // 🔍 DEBUG: Log toolbar state
  useEffect(() => {
    const debugInfo = getDebugInfo();
  }, [hasUnsavedChanges, getDebugInfo]);

  // Get toolbar state
  const toolbarState = useToolbarState();

  const {
    showProjectsModal,
    setShowProjectsModal,
    showSaveNotification,
    setShowSaveNotification,
    moduleContext,
    setModuleContext,
    showAlert,
    setShowAlert,
    alertMessage,
    setAlertMessage,
    alertType,
    setAlertType,
    showPreviewModal,
    setShowPreviewModal,
    confirmModal,
    setConfirmModal
  } = toolbarState;

  // Get toolbar actions
  const toolbarActions = useToolbarActions({
    setShowSaveNotification,
    setShowAlert,
    setAlertMessage,
    setAlertType,
    setConfirmModal,
    setModuleContext,
    moduleContext,
    course,
    elements,
    saveProject,
    exportProject,
    createNewProject,
    updateElement,
    markAsSaved,
    currentPage,
    saveCurrentPage
  });

  // Handle module content loading
  useModuleContent({
    moduleContext,
    setModuleContext,
    course,
    importProject,
    updateCourse,
    createNewProject
  });



  return {
    // State
    showProjectsModal,
    setShowProjectsModal,
    showSaveNotification,
    moduleContext,
    setModuleContext,
    showAlert,
    alertMessage,
    alertType,
    showPreviewModal,
    setShowPreviewModal,
    confirmModal,
    hasUnsavedChanges,

    // Builder state
    canUndo,
    canRedo,
    currentPage,
    sidebarVisible,
    propertyPanelVisible,

    // Builder actions
    undo,
    redo,
    toggleSidebar,
    togglePropertyPanel,

    // Toolbar actions
    ...toolbarActions
  };
};
