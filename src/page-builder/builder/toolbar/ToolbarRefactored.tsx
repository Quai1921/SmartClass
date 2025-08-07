import React from 'react';
import { SavedProjectsModal } from '../SavedProjectsModal';
import { ConfirmModal } from '../../components/ConfirmModal';
import { PageToolbar } from '../PageToolbar';
import { PreviewModal } from '../PreviewModal';
import Alert from '../../../ui/components/Alert';
import { useToolbar } from './useToolbar';
import {
  NavigationSection,
  FileOperationsSection,
  UndoRedoSection,
  PanelTogglesSection,
  PreviewPublishSection,
  SaveNotification
} from './components';

/**
 * Refactored Toolbar component using hooks and partitioned components
 * Preserves EXACT same functionality and styling as the original
 */
export const Toolbar: React.FC = () => {
  const {
    // State
    showProjectsModal,
    setShowProjectsModal,
    showSaveNotification,
    moduleContext,
    showAlert,
    alertMessage,
    alertType,
    showPreviewModal,
    setShowPreviewModal,
    confirmModal,


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
    handleBackNavigation,
    handleSave,
    handleExport,
    handleNewProject,
    handlePublish,

    closeConfirmModal,
    handlePreview,
    restartAlert
  } = useToolbar();

  return (
    <div className="toolbar bg-gray-800 border-b border-gray-600 px-2 sm:px-4 py-2 flex items-center justify-between flex-shrink-0 overflow-x-auto relative">
      {/* Save notification */}
      <SaveNotification show={showSaveNotification} />

      <div className="flex items-center space-x-2 sm:space-x-4 min-w-0">
        {/* Navigation Section */}
        <NavigationSection
          moduleContext={moduleContext}
          currentPage={currentPage}
          onBackNavigation={handleBackNavigation}
        />

        {/* Page Management Toolbar */}
        <PageToolbar />
        
        <div className="hidden sm:block h-6 border-l border-gray-600" />
        
        {/* Module Type Display and Preview/Publish */}
        <PreviewPublishSection
          moduleContext={moduleContext}
          onPreview={() => setShowPreviewModal(true)}
          onPublish={handlePublish}
        />
      </div>

      <div className="flex items-center space-x-3 sm:space-x-6">
        {/* File Operations */}
        <FileOperationsSection
          onSave={handleSave}
          onSaveDraft={() => {}}
          onShowProjectsModal={() => setShowProjectsModal(true)}
          onExport={handleExport}
          onNewProject={handleNewProject}
        />

        <div className="h-6 border-l border-gray-600" />
        
        {/* Undo/Redo */}
        <UndoRedoSection
          canUndo={canUndo}
          canRedo={canRedo}
          onUndo={undo}
          onRedo={redo}
        />

        <div className="h-6 border-l border-gray-600" />

        {/* Panel toggles */}
        <PanelTogglesSection
          sidebarVisible={sidebarVisible}
          propertyPanelVisible={propertyPanelVisible}
          onToggleSidebar={toggleSidebar}
          onTogglePropertyPanel={togglePropertyPanel}
        />
        
        <div className="hidden sm:block h-6 border-l border-gray-600" />
        
        {/* Preview/Publish - hidden on small screens */}
        <div className="hidden md:flex items-center space-x-2">
          <button 
            className="flex items-center space-x-1 px-3 py-1 text-sm border border-gray-600 text-gray-300 rounded hover:bg-gray-700 hover:text-gray-200" 
            onClick={() => setShowPreviewModal(true)}
            title="Vista Previa"
          >
            <span>Vista Previa</span>
          </button>
          <button 
            className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700" 
            onClick={handlePublish}
          >
            Publicar
          </button>
        </div>
      </div>

      {/* Saved Projects Modal */}
      {showProjectsModal && (
        <SavedProjectsModal onClose={() => setShowProjectsModal(false)} />
      )}

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        message={confirmModal.message}
        variant={confirmModal.variant}
        confirmText="Confirmar"
        cancelText="Cancelar"
        onConfirm={confirmModal.onConfirm}
        onCancel={closeConfirmModal}
      />

      {/* Alert Component */}
      {showAlert && (
        <Alert
          message={alertMessage}
          type={alertType}
          position="top"
          restartAlert={restartAlert}
        />
      )}

      {/* Preview Modal */}
      <PreviewModal
        isOpen={showPreviewModal}
        onClose={() => setShowPreviewModal(false)}
      />
    </div>
  );
};
