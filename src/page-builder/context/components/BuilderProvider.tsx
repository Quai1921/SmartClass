import React, { useReducer, useMemo } from 'react';
import type { ReactNode } from 'react';
import type { BuilderContextType } from '../types';
import { BuilderContext } from '../BuilderContext';
import { builderReducer, initialState } from '../builderReducer';
import {
  useBuilderElements,
  useBuilderUI,
  useBuilderHistory,
  useBuilderStorage,
  useBuilderAutoSave,
} from '../hooks';
import { useBuilderPages } from '../hooks/useBuilderPages';
import { useBuilderPreview } from '../hooks/useBuilderPreview';
import { useBuilderCopyPaste } from '../hooks/useBuilderCopyPaste';
import { BuilderInitializer } from './BuilderInitializer';

interface BuilderProviderProps {
  children: ReactNode;
}

/**
 * Modular BuilderProvider component that uses custom hooks for different concerns
 * This component is partitioned to improve maintainability and performance
 */
export const BuilderProvider: React.FC<BuilderProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(builderReducer, initialState);
  
  // Auto-save functionality (handles background saving)
  const { saveImmediately } = useBuilderAutoSave(state);
  
  // Element operations (add, remove, update, move elements)
  const elementOperations = useBuilderElements(dispatch, saveImmediately);
  
  // UI operations (sidebar, selections, drag & drop)
  const uiOperations = useBuilderUI(dispatch);
  
  // History operations (undo/redo functionality)
  const historyOperations = useBuilderHistory(dispatch);
  
  // Storage operations (save, load, import, export projects)
  const storageOperations = useBuilderStorage(dispatch, state, saveImmediately);

  // Page management operations
  const pageOperations = useBuilderPages(dispatch, state);

  // Preview operations
  const previewOperations = useBuilderPreview(dispatch, state);

  // Copy-paste operations
  const copyPasteOperations = useBuilderCopyPaste(dispatch, state.selectedElementIds, state.clipboard);

  // Memoize the context value to prevent unnecessary re-renders
  const contextValue: BuilderContextType = useMemo(() => ({
    // Core state
    elements: state.elements,
    selectedElementId: state.selectedElementId,
    selectedElementIds: state.selectedElementIds,
    draggedElement: state.draggedElement,
    clipboard: state.clipboard,
    course: state.course,
    currentPage: state.currentPage,
    sidebarVisible: state.sidebarVisible,
    sidebarWidth: state.sidebarWidth,
    propertyPanelVisible: state.propertyPanelVisible,
    textElementTab: state.textElementTab,
    resizeState: state.resizeState,
    previewMode: state.previewMode,
    currentSlideIndex: state.currentSlideIndex,
    
    // Computed state
    canUndo: state.historyIndex > 0,
    canRedo: state.historyIndex < state.history.length - 1,
    
    // Element operations
    addElement: elementOperations.addElement,
    removeElement: elementOperations.removeElement,
    updateElement: elementOperations.updateElement,
    moveElement: elementOperations.moveElement,
    reorderElement: elementOperations.reorderElement,

    // UI operations
    selectElement: uiOperations.selectElement,
    setDraggedElement: uiOperations.setDraggedElement,
    toggleSidebar: uiOperations.toggleSidebar,
    setSidebarWidth: uiOperations.setSidebarWidth,
    togglePropertyPanel: uiOperations.togglePropertyPanel,
    setTextElementTab: uiOperations.setTextElementTab,
    
    // History operations
    undo: historyOperations.undo,
    redo: historyOperations.redo,
    
    // Copy-paste operations
    copyElements: copyPasteOperations.copyElements,
    pasteElements: copyPasteOperations.pasteElements,
    canCopy: copyPasteOperations.canCopy,
    canPaste: copyPasteOperations.canPaste,
    
    // Storage operations
    updateCourse: storageOperations.updateCourse,
    saveProject: storageOperations.saveProject,
    loadProject: storageOperations.loadProject,
    createNewProject: storageOperations.createNewProject,
    exportProject: storageOperations.exportProject,
    importProject: storageOperations.importProject,

    // Page management operations
    addPage: pageOperations.addPage,
    removePage: pageOperations.removePage,
    duplicatePage: pageOperations.duplicatePage,
    updatePage: pageOperations.updatePage,
    switchPage: pageOperations.switchPage,
    reorderPages: pageOperations.reorderPages,

    // Preview operations
    togglePreview: previewOperations.togglePreview,
    nextSlide: previewOperations.nextSlide,
    prevSlide: previewOperations.prevSlide,
    goToSlide: previewOperations.goToSlide,
  }), [
    // State dependencies
    state.elements,
    state.selectedElementId,
    state.selectedElementIds,
    state.draggedElement,
    state.clipboard,
    state.course,
    state.currentPage,
    state.sidebarVisible,
    state.sidebarWidth,
    state.propertyPanelVisible,
    state.textElementTab,
    state.resizeState,
    state.previewMode,
    state.currentSlideIndex,
    state.historyIndex,
    state.history.length,
    
    // Operation dependencies
    elementOperations.addElement,
    elementOperations.removeElement,
    elementOperations.updateElement,
    elementOperations.moveElement,
    elementOperations.reorderElement,
    uiOperations.selectElement,
    uiOperations.setDraggedElement,
    uiOperations.toggleSidebar,
    uiOperations.setSidebarWidth,
    uiOperations.togglePropertyPanel,
    uiOperations.setTextElementTab,
    historyOperations.undo,
    historyOperations.redo,
    copyPasteOperations.copyElements,
    copyPasteOperations.pasteElements,
    copyPasteOperations.canCopy,
    copyPasteOperations.canPaste,
    storageOperations.updateCourse,
    storageOperations.saveProject,
    storageOperations.loadProject,
    storageOperations.createNewProject,
    storageOperations.exportProject,
    storageOperations.importProject,
    pageOperations.addPage,
    pageOperations.removePage,
    pageOperations.duplicatePage,
    pageOperations.updatePage,
    pageOperations.switchPage,
    pageOperations.reorderPages,
    previewOperations.togglePreview,
    previewOperations.nextSlide,
    previewOperations.prevSlide,
    previewOperations.goToSlide,
  ]);

  return (
    <BuilderContext.Provider value={contextValue}>
      <BuilderInitializer dispatch={dispatch} />
      {children}
    </BuilderContext.Provider>
  );
};

export default BuilderProvider;
