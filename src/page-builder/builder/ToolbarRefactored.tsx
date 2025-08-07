import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { useBuilder } from '../hooks/useBuilder';
import { useUnsavedChanges } from '../hooks/useUnsavedChanges';
import { useSaveManagement } from '../hooks/useSaveManagement';
import { useExport } from '../hooks/useExport';
import { useModuleManagement } from '../hooks/useModuleManagement';
import { useNavigation } from '../hooks/useNavigation';


import { SavedProjectsModal } from './SavedProjectsModal';
import { ConfirmModal } from '../components/ConfirmModal';
import { PageToolbar } from './PageToolbar';
import { PreviewModal } from './PreviewModal';
import { ExportPreviewModal } from '../components/ExportPreviewModal';
import { FileManagerButton } from '../components/FileManagerButton';
import { CourseInfo } from '../components/CourseInfo';
import { ActionButtons } from '../components/ActionButtons';
import { ViewControls } from '../components/ViewControls';
import { ModuleActions } from '../components/ModuleActions';
import Alert from '../../ui/components/Alert';

export const Toolbar: React.FC = () => {
  const navigate = useNavigate();
  const { 
    undo, 
    redo, 
    canUndo, 
    canRedo, 
    course, 
    elements,
    sidebarVisible,
    toggleSidebar,
    propertyPanelVisible,
    togglePropertyPanel
  } = useBuilder();
  
  const { hasUnsavedChanges } = useUnsavedChanges();
  
  // Hooks for functionality
  const { showSaveNotification, handleSave, handleCourseTypeChange } = useSaveManagement();
  const { 
    showExportPreview, 
    exportPreviewData, 
    handleExport, 
    handleConfirmExport, 
    handleCancelExport 
  } = useExport();
  const { 
    showAlert, 
    alertMessage, 
    alertType, 
    handleSaveDraft, 
    handlePublish, 
    restartAlert 
  } = useModuleManagement();
  const { handleBackNavigation, handleNewProject } = useNavigation();


  // Local state
  const [showProjectsModal, setShowProjectsModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    variant?: 'danger' | 'warning' | 'info';
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {}
  });

  const closeConfirmModal = () => {
    setConfirmModal(prev => ({ ...prev, isOpen: false }));
  };

  const handlePreview = () => {
    setShowPreviewModal(true);
  };

  return (
    <div className="toolbar bg-gray-800 border-b border-gray-600 px-2 sm:px-4 py-2 flex items-center justify-between flex-shrink-0 overflow-x-auto relative">
      {/* Save notification */}
      {showSaveNotification && (
        <div className="absolute top-16 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-4 py-2 rounded shadow-lg z-50">
          ✅ Proyecto guardado
        </div>
      )}

      {/* Left side - Course info and page management */}
      <div className="flex items-center space-x-2 sm:space-x-4 min-w-0">
        <CourseInfo
          course={course}
          currentPage={null}
          onBackNavigation={handleBackNavigation}
          onCourseTypeChange={handleCourseTypeChange}
        />

        {/* Page Management Toolbar */}
        <PageToolbar />
      </div>

      {/* Right side - Actions */}
      <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
        {/* Action buttons */}
        <ActionButtons
          canUndo={canUndo}
          canRedo={canRedo}
          hasUnsavedChanges={hasUnsavedChanges}
          onUndo={undo}
          onRedo={redo}
          onSave={handleSave}
          onOpenProjects={() => setShowProjectsModal(true)}
          onExport={handleExport}
        />

        <div className="h-6 border-l border-gray-600" />

        {/* File Manager */}
        <FileManagerButton 
          className="p-2 rounded text-gray-300 hover:bg-gray-700 hover:text-gray-200"
          onFileSelect={(file) => {
          }}
        />

        <div className="h-6 border-l border-gray-600" />

        {/* View Controls */}
        <ViewControls
          sidebarVisible={sidebarVisible}
          propertyPanelVisible={propertyPanelVisible}
          onToggleSidebar={toggleSidebar}
          onTogglePropertyPanel={togglePropertyPanel}
          onNewProject={() => handleNewProject(setConfirmModal)}
          onPreview={handlePreview}
        />

        <div className="hidden sm:block h-6 border-l border-gray-600" />

        {/* Module Actions */}
        <ModuleActions
          onSaveDraft={handleSaveDraft}
          onPublish={handlePublish}
        />
      </div>

      {/* Modals */}
      {showProjectsModal && (
        <SavedProjectsModal onClose={() => setShowProjectsModal(false)} />
      )}

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

      {showAlert && (
        <Alert
          message={alertMessage}
          type={alertType}
          position="top"
          restartAlert={restartAlert}
        />
      )}

      <PreviewModal
        isOpen={showPreviewModal}
        onClose={() => setShowPreviewModal(false)}
      />

      <ExportPreviewModal
        isOpen={showExportPreview}
        onClose={handleCancelExport}
        onConfirmExport={handleConfirmExport}
        onCancel={handleCancelExport}
        projectData={exportPreviewData}
      />
    </div>
  );
};
