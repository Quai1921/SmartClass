import React from 'react';
import { ToastProvider } from '../context/ToastContext';
import { LoadingSpinner } from './LoadingSpinner';
import Alert from '../../ui/components/Alert';
import {
  useModuleManagement,
  ModuleHeader,
  ModuleFilters,
  ModuleGrid,
  ConfirmationModal,
  CreateModuleModal,
  EditModuleModal
} from './module-management';
import '../styles/course-management.css';

export const ModuleManagementPage: React.FC = () => {
  const {
    // State
    course,
    modules,
    loading,
    searchTerm,
    typeFilter,
    statusFilter,
    showAlert,
    alertMessage,
    alertType,
    showConfirmation,
    showCreateModal,
    showEditModal,
    moduleToEdit,
    isInitialized,
    filteredModules,
    courseId,
    
    // Actions
    setSearchTerm,
    setTypeFilter,
    setStatusFilter,
    restartAlert,
    handleBackToCourses,
    handleCreateModule,
    handleCreateModuleWithType,
    closeCreateModal,
    handleEditModule,
    handleQuickEditModule,
    closeEditModal,
    handleSaveModuleChanges,
    handleDeleteModule,
    confirmDeleteModule,
    cancelDeleteModule,
    handlePublishModule,
    forceRefresh,
  } = useModuleManagement();

  // Show loading spinner while auth is initializing
  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-gray-900 text-white -m-6">
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <LoadingSpinner />
            <p className="text-white mt-4">Inicializando autenticación...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show error only if no courseId was provided
  if (!courseId) {
    return (
      <div className="min-h-screen bg-gray-900 text-white -m-6">
        <div className="flex items-center justify-center min-h-96">
          <div className="text-white text-center">
            <h2 className="text-2xl font-bold mb-4">ID de curso no encontrado</h2>
            <button 
              onClick={handleBackToCourses}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
            >
              Volver a Cursos
            </button>
          </div>
        </div>
      </div>
    );
  }

  // At this point, we should always have a course (either placeholder or real)
  if (!course) {
    // console.error('❌ ModuleManagement: Unexpected state - no course despite having courseId');
    return (
      <div className="min-h-screen bg-gray-900 text-white -m-6">
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <LoadingSpinner />
            <p className="text-white mt-4">Inicializando...</p>
          </div>
        </div>
      </div>
    );
  }



  return (
    <ToastProvider>
      <div className="min-h-screen bg-gray-900 text-white -m-6">
        {/* Header */}
        <ModuleHeader
          course={course!} // We've already checked course exists above
          onBackToCourses={handleBackToCourses}
          onCreateModule={handleCreateModule}
          onForceRefresh={forceRefresh}
          loading={loading}
        />

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Search and Filters */}
          <ModuleFilters
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            typeFilter={typeFilter}
            onTypeFilterChange={setTypeFilter}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
          />

          {/* Modules Grid with conditional loading */}
          {loading ? (
            <div className="flex items-center justify-center min-h-96">
              <div className="text-center">
                <LoadingSpinner />
                <p className="text-white mt-4">Cargando módulos...</p>
              </div>
            </div>
          ) : (
            <ModuleGrid
              filteredModules={filteredModules}
              searchTerm={searchTerm}
              onCreateModule={handleCreateModule}
              onEditModule={handleQuickEditModule}
              onEditContent={handleEditModule}
              onDeleteModule={handleDeleteModule}
              onPublishModule={handlePublishModule}
            />
          )}
        </div>

        {/* Alert Component */}
        {showAlert && (
          <Alert
            message={alertMessage}
            type={alertType}
            position="top"
            restartAlert={restartAlert}
          />
        )}

        {/* Confirmation Modal */}
        <ConfirmationModal
          isOpen={showConfirmation}
          onClose={cancelDeleteModule}
          onConfirm={confirmDeleteModule}
          title="Eliminar Módulo"
          message="¿Estás seguro de que deseas eliminar este módulo? Esta acción no se puede deshacer."
          confirmText="Eliminar"
          cancelText="Cancelar"
          type="danger"
        />

        {/* Create Module Modal */}
        <CreateModuleModal
          isOpen={showCreateModal}
          onClose={closeCreateModal}
          onCreateModule={handleCreateModuleWithType}
          courseName={course?.title || ''}
        />

        {/* Edit Module Modal */}
        <EditModuleModal
          isOpen={showEditModal}
          onClose={closeEditModal}
          onSave={handleSaveModuleChanges}
          module={moduleToEdit}
        />
      </div>
    </ToastProvider>
  );
};
