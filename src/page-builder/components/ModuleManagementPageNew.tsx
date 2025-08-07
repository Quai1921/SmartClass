import React from 'react';
import { ToastProvider } from '../context/ToastContext';
import { LoadingSpinner } from './LoadingSpinner';
import Alert from '../../ui/components/Alert';
import {
  useModuleManagement,
  ModuleHeader,
  ModuleFilters,
  ModuleGrid,
  ConfirmationModal
} from './module-management';
import '../styles/course-management.css';

export const ModuleManagementPage: React.FC = () => {
  try {
    const {
      // State
      course,
      loading,
      searchTerm,
      typeFilter,
      statusFilter,
      showAlert,
      alertMessage,
      alertType,
      showConfirmation,
      isInitialized,
      filteredModules,
    
      // Actions
      setSearchTerm,
      setTypeFilter,
      setStatusFilter,
      restartAlert,
      handleBackToCourses,
      handleCreateModule,
      handleEditModule,
      handleDeleteModule,
      confirmDeleteModule,
      cancelDeleteModule,
      handlePublishModule,
      forceRefresh,
    } = useModuleManagement();

    // Show loading spinner while auth is initializing
    if (!isInitialized) {
      return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center">
          <div className="text-center">
            <LoadingSpinner />
            <p className="text-white mt-4">Inicializando autenticación...</p>
          </div>
        </div>
      );
    }

    if (loading) {
      return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center">
          <div className="text-center">
            <LoadingSpinner />
            <p className="text-white mt-4">Cargando módulos...</p>
          </div>
        </div>
      );
    }

    if (!course) {
      return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center">
          <div className="text-white text-center">
            <h2 className="text-2xl font-bold mb-4">Curso no encontrado</h2>
            <button 
              onClick={handleBackToCourses}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
            >
              Volver a Cursos
            </button>
          </div>
        </div>
      );
    }

    return (
      <ToastProvider>
        <div className="min-h-screen bg-gray-900">
          {/* Header */}
          <ModuleHeader
            course={course}
            onBackToCourses={handleBackToCourses}
            onCreateModule={handleCreateModule}
            onForceRefresh={forceRefresh}
          />

          {/* Main Content */}
          <div className="p-6">
            {/* Search and Filters */}
            <ModuleFilters
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              typeFilter={typeFilter}
              onTypeFilterChange={setTypeFilter}
              statusFilter={statusFilter}
              onStatusFilterChange={setStatusFilter}
            />

            {/* Modules Grid */}
            <ModuleGrid
              filteredModules={filteredModules}
              searchTerm={searchTerm}
              onCreateModule={handleCreateModule}
              onEditModule={handleEditModule}
              onDeleteModule={handleDeleteModule}
              onPublishModule={handlePublishModule}
            />
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
        </div>
      </ToastProvider>
    );
  } catch (error) {
    // console.error('❌ ModuleManagementPage: Error rendering:', error);
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Error Loading Module Management</h1>
          <p className="text-gray-300">Check console for details</p>
          <pre className="mt-4 text-red-400 text-sm max-w-lg">{String(error)}</pre>
        </div>
      </div>
    );
  }
};
