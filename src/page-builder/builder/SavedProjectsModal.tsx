import React, { useState, useEffect } from 'react';
import { X, Trash2, FileText, Calendar, Eye } from 'lucide-react';
import { useBuilder } from '../hooks/useBuilder';
import { StorageAdapter, type SavedProject } from '../../config/adapters/storage-adapter';
import { ConfirmModal } from '../components/ConfirmModal';

interface SavedProjectsModalProps {
  onClose: () => void;
}

export const SavedProjectsModal: React.FC<SavedProjectsModalProps> = ({ onClose }) => {
  const { loadProject } = useBuilder();
  const [projects, setProjects] = useState<SavedProject[]>([]);
  const [loading, setLoading] = useState(true);
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

  useEffect(() => {
    const loadProjects = () => {
      try {
        const savedProjects = StorageAdapter.getAllProjects();
        setProjects(savedProjects);
      } catch (error) {
        // console.error('Failed to load projects:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProjects();
  }, []);
  const handleLoadProject = (project: SavedProject) => {
    setConfirmModal({
      isOpen: true,
      title: 'Cargar Proyecto',
      message: `¿Cargar el proyecto "${project.title}"? Los cambios no guardados se perderán.`,
      variant: 'warning',
      onConfirm: () => {
        loadProject(project.id);
        onClose();
        setConfirmModal(prev => ({ ...prev, isOpen: false }));
      }
    });
  };
  const handleDeleteProject = (project: SavedProject, e: React.MouseEvent) => {
    e.stopPropagation();
    setConfirmModal({
      isOpen: true,
      title: 'Eliminar Proyecto',
      message: `¿Eliminar permanentemente el proyecto "${project.title}"?`,
      variant: 'danger',
      onConfirm: () => {
        StorageAdapter.deleteProject(project.id);
        setProjects(projects.filter(p => p.id !== project.id));
        setConfirmModal(prev => ({ ...prev, isOpen: false }));
      }    });
  };

  const closeConfirmModal = () => {
    setConfirmModal(prev => ({ ...prev, isOpen: false }));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getElementsSummary = (elements: any[]) => {
    if (!elements || elements.length === 0) return 'Proyecto vacío';
    
    const types = elements.reduce((acc, el) => {
      acc[el.type] = (acc[el.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const summary = Object.entries(types)
      .map(([type, count]) => `${count} ${type}`)
      .slice(0, 3)
      .join(', ');
    
    return summary + (Object.keys(types).length > 3 ? '...' : '');
  };  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-md flex items-center justify-center" style={{ zIndex: 100000 }}>
      <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl max-h-[80vh] overflow-hidden">{/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-600">
          <h2 className="text-xl font-semibold text-gray-200">Proyectos Guardados</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-200 rounded"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-gray-400">Cargando proyectos...</div>
            </div>
          ) : projects.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-gray-400">
              <FileText size={48} className="mb-4" />
              <p className="text-lg mb-2">No hay proyectos guardados</p>
              <p className="text-sm">Crea y guarda tu primer proyecto para verlo aquí</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className="bg-gray-700 rounded-lg p-4 cursor-pointer hover:bg-gray-600 transition-colors group"
                  onClick={() => handleLoadProject(project)}
                >
                  {/* Project Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-200 truncate">
                        {project.title}
                      </h3>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className={`text-xs px-2 py-1 rounded ${
                          project.type === 'Academico' 
                            ? 'bg-blue-900 text-blue-200' 
                            : 'bg-purple-900 text-purple-200'
                        }`}>
                          {project.type}
                        </span>
                        {project.status === 'PUBLISHED' && (
                          <span className="text-xs px-2 py-1 rounded bg-green-900 text-green-200">
                            <Eye size={12} className="inline mr-1" />
                            Publicado
                          </span>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={(e) => handleDeleteProject(project, e)}
                      className="opacity-0 group-hover:opacity-100 p-1 text-red-400 hover:text-red-300 transition-opacity"
                      title="Eliminar proyecto"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  {/* Project Description */}
                  {project.description && (
                    <p className="text-sm text-gray-400 mb-3 line-clamp-2">
                      {project.description}
                    </p>
                  )}

                  {/* Elements Summary */}
                  <p className="text-xs text-gray-500 mb-3">
                    {getElementsSummary(project.elements)}
                  </p>

                  {/* Project Footer */}
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center">
                      <Calendar size={12} className="mr-1" />
                      {formatDate(project.updatedAt)}
                    </div>
                    <div className="text-gray-600">
                      v{project.version}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-600 bg-gray-750">
          <div className="text-sm text-gray-400">
            {projects.length} proyecto{projects.length !== 1 ? 's' : ''} guardado{projects.length !== 1 ? 's' : ''}
          </div>          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm border border-gray-600 text-gray-300 rounded hover:bg-gray-700"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>

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
    </div>
  );
};
