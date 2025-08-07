import React from 'react';
import { ConfirmationModal } from '../../../components/module-management/ConfirmationModal';
import { ModuleEditModal } from '../../../components/module-management/ModuleEditModal';
import Alert from '../../../../ui/components/Alert';
import {
  useModuleAlerts,
  useModuleSelection,
  useModulesData,
  useModuleDeletion,
  useModalManagement,
  ModuleHeader,
  ModulesList
} from './modules-tab';

export const ModulesTab: React.FC = () => {
  
  // Initialize hooks
  const alerts = useModuleAlerts();
  
  // Create a placeholder function for initial module selection setup
  const moduleSelection = useModuleSelection(alerts.showErrorAlert, async () => {});
  
  const modulesData = useModulesData(
    alerts.showSuccessAlert,
    alerts.showErrorAlert,
    moduleSelection.currentModuleInfo,
    moduleSelection.saveCurrentModuleChanges
  );
  
  const moduleDeletion = useModuleDeletion(
    moduleSelection.currentModuleInfo,
    moduleSelection.setCurrentModuleInfo,
    modulesData.loadModulesForCourse
  );
  
  const modalManagement = useModalManagement();

  // Update module selection hook with the actual loadModulesForCourse function
  // const moduleSelectionWithData = useModuleSelection(alerts.showErrorAlert, modulesData.loadModulesForCourse);

  const handleCreateNewModule = () => {
    modalManagement.handleOpenCreateModal();
  };

  const handleCreateModule = async (moduleData: { title: string; description?: string; type?: string; content?: string }) => {
    modalManagement.setIsCreating(true);
    try {
      await modulesData.handleCreateModule(moduleData);
      modalManagement.handleCloseCreateModal();
    } catch (error) {
      // console.error('❌ Error creating module:', error);
    } finally {
      modalManagement.setIsCreating(false);
    }
  };

  const handleSaveModule = async (moduleData: any) => {
    modalManagement.setIsSaving(true);
    try {
      const success = await modulesData.handleSaveModule(moduleData, modalManagement.editingModule);
      if (success) {
        modalManagement.handleCloseEditModal();
      }
    } catch (error) {
      // console.error('❌ Error saving module:', error);
    } finally {
      modalManagement.setIsSaving(false);
    }
  };

  // Listen for auto-select event and trigger module selection
  React.useEffect(() => {
    const handler = async (e: any) => {      
      if (e.detail && e.detail.module) {
        
        try {
          await moduleSelection.handleModuleSelect(e.detail.module);
          
          // 🎯 NEW: Notify PageBuilderPage that auto-selection is complete
          setTimeout(() => {
            window.dispatchEvent(new CustomEvent('modulesTab:autoSelectComplete'));
          }, 500); // Small delay to ensure module content is loaded
          
        } catch (error) {
          // console.error('🎯 ModulesTab: Error during auto-selection:', error);
          // Even on error, dispatch completion to show content
          window.dispatchEvent(new CustomEvent('modulesTab:autoSelectComplete'));
        }
      } else {
        // console.error('🎯 ModulesTab: Invalid auto-select event, no module data');
        // Dispatch completion anyway
        window.dispatchEvent(new CustomEvent('modulesTab:autoSelectComplete'));
      }
    };
    
    window.addEventListener('modulesTab:autoSelectModule', handler);
    return () => {
      window.removeEventListener('modulesTab:autoSelectModule', handler);
    };
  }, [moduleSelection]);

  if (!modulesData.courseInfo) {
    return (
      <div className="h-full bg-gray-800 flex items-center justify-center">
        <div className="text-center text-gray-400">
          <div className="animate-pulse">
            <div className="w-16 h-16 bg-gray-700 rounded-lg mx-auto mb-4"></div>
            <div className="h-4 bg-gray-700 rounded w-48 mx-auto mb-2"></div>
            <div className="h-3 bg-gray-700 rounded w-32 mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto pb-36 px-4">
      {/* Header - Current Course Info */}
      <div className="pt-4">
        <ModuleHeader
          courseInfo={modulesData.courseInfo}
          currentModuleInfo={moduleSelection.currentModuleInfo}
        />
      </div>

      {/* Modules List */}
      <ModulesList
        modules={modulesData.modules}
        loading={modulesData.loading}
        currentModuleInfo={moduleSelection.currentModuleInfo}
        updatingModuleId={modulesData.updatingModuleId}
        isServerDown={moduleSelection.isServerDown}
        onModuleSelect={moduleSelection.handleModuleSelect}
        onDeleteModule={moduleDeletion.handleDeleteModule}
        onEditModule={modalManagement.handleEditModule}
        onStatusChange={modulesData.handleStatusChange}
        onCreateNewModule={handleCreateNewModule}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={moduleDeletion.isDeleteModalOpen}
        onConfirm={moduleDeletion.confirmDeleteModule}
        onClose={moduleDeletion.cancelDeleteModule}
        title="Confirmar eliminación"
        message={`¿Estás seguro de que deseas eliminar el módulo "${moduleDeletion.moduleToDelete?.title}"? Esta acción no se puede deshacer.`}
        type="danger"
        confirmText="Eliminar"
        cancelText="Cancelar"
      />

      {/* Module Edit Modal */}
      <ModuleEditModal
        isOpen={modalManagement.isEditModalOpen}
        module={modalManagement.editingModule}
        onClose={modalManagement.handleCloseEditModal}
        onSave={handleSaveModule}
        isSaving={modalManagement.isSaving}
      />

      {/* Module Create Modal */}
      <ModuleEditModal
        isOpen={modalManagement.isCreateModalOpen}
        module={null} // null for creating new module
        onClose={modalManagement.handleCloseCreateModal}
        onSave={handleCreateModule}
        isSaving={modalManagement.isCreating}
        title="Crear Nuevo Módulo"
        subtitle="Ingresa la información para crear un nuevo módulo"
      />

      {/* Module Update Alert */}
      {alerts.showAlert && (
        <Alert
          message={alerts.alertMessage}
          type={alerts.alertType}
          position="left-top"
          restartAlert={alerts.restartAlert}
        />
      )}
      {/* Add explicit spacer for bottom padding */}
      <div className="h-10" />
    </div>
  );
};
