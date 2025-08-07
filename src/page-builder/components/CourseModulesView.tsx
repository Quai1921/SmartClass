import React, { useState, useEffect } from 'react';
import { Book, Plus, Edit, Eye, Trash2, Clock, ArrowLeft, AlertCircle } from 'lucide-react';
import { getModules, type Module } from '../../actions/modules/modules';
import type { Course } from '../../actions/courses/get-courses';

interface CourseModulesViewProps {
  course: Course;
  onBack: () => void;
  onCreateModule?: (courseId: string) => void;
  onEditModule?: (courseId: string, moduleId: string) => void;
}

export const CourseModulesView: React.FC<CourseModulesViewProps> = ({
  course,
  onBack,
  onCreateModule,
  onEditModule,
}) => {
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedModuleId, setSelectedModuleId] = useState<string | null>(null);

  useEffect(() => {
    loadModules();
  }, [course.id]);

  const loadModules = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getModules(course.id);
      if (response.success && response.data) {
        setModules(response.data);
      } else {
        setError(response.error || 'Error al cargar los módulos');
      }
    } catch (error) {
      // console.error('Error loading modules:', error);
      setError('Error de conexión al cargar los módulos');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateModule = () => {
    if (onCreateModule) {
      onCreateModule(course.id);
    }
  };

  const handleEditModule = (moduleId: string) => {
    setSelectedModuleId(moduleId);
    if (onEditModule) {
      onEditModule(course.id, moduleId);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const getModuleTypeColor = (type: string) => {
    switch (type) {
      case 'ACADEMIC':
        return 'bg-blue-900 text-blue-300';
      case 'EVALUATIVE':
        return 'bg-purple-900 text-purple-300';
      default:
        return 'bg-gray-900 text-gray-300';
    }
  };

  const getModuleTypeName = (type: string) => {
    switch (type) {
      case 'ACADEMIC':
        return 'Académico';
      case 'EVALUATIVE':
        return 'Evaluativo';
      default:
        return type;
    }
  };

  if (loading) {
    return (
      <div className="h-full flex flex-col bg-gray-800 text-white">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-gray-800 text-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <div className="flex items-center space-x-3">
          <button
            onClick={onBack}
            className="p-1 text-gray-400 hover:text-white transition-colors"
            title="Volver a cursos"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <Book className="h-5 w-5 text-blue-400" />
          <div>
            <h2 className="text-lg font-semibold text-white truncate">
              {course.title}
            </h2>
            <p className="text-sm text-gray-400">
              {modules.length} módulos
            </p>
          </div>
        </div>
        <button
          onClick={handleCreateModule}
          className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">Nuevo</span>
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {error ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-8">
            <AlertCircle className="h-16 w-16 text-red-400 mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">
              Error al cargar módulos
            </h3>
            <p className="text-gray-400 mb-4 text-sm">
              {error}
            </p>
            <button
              onClick={loadModules}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Reintentar
            </button>
          </div>
        ) : modules.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-8">
            <Book className="h-16 w-16 text-gray-600 mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">
              No hay módulos creados
            </h3>
            <p className="text-gray-400 mb-4 text-sm">
              Crea tu primer módulo para comenzar a diseñar contenido educativo
            </p>
            <button
              onClick={handleCreateModule}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span>Crear Módulo</span>
            </button>
          </div>
        ) : (
          <div className="p-4 space-y-3">
            {modules.map((module, index) => (
              <div
                key={module.id}
                className={`border rounded-lg p-4 transition-colors cursor-pointer ${
                  selectedModuleId === module.id
                    ? 'border-blue-500 bg-gray-700'
                    : 'border-gray-600 bg-gray-750 hover:bg-gray-700'
                }`}
                onClick={() => handleEditModule(module.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className={`flex items-center justify-center w-8 h-8 text-white text-sm font-medium rounded-full ${
                        selectedModuleId === module.id ? 'bg-blue-500' : 'bg-blue-600'
                      }`}>
                        {index + 1}
                      </div>
                      <h3 className="text-lg font-medium text-white truncate">
                        {module.title}
                      </h3>
                    </div>
                    
                    <div className="flex items-center space-x-4 mt-3 text-sm text-gray-400">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getModuleTypeColor(module.type)}`}
                      >
                        {getModuleTypeName(module.type)}
                      </span>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          module.status === 'PUBLISHED'
                            ? 'bg-green-900 text-green-300'
                            : module.status === 'IN_REVIEW'
                            ? 'bg-blue-900 text-blue-300'
                            : 'bg-yellow-900 text-yellow-300'
                        }`}
                      >
                        {module.status === 'PUBLISHED' ? 'Publicado' : module.status === 'IN_REVIEW' ? 'En Revisión' : 'Borrador'}
                      </span>
                      {module.estimatedTime && (
                        <div className="flex items-center space-x-1">
                          <Clock className="h-3 w-3" />
                          <span>{module.estimatedTime} min</span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      <div className="text-sm text-gray-500">
                        Creado {formatDate(module.createdAt)}
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditModule(module.id);
                          }}
                          className={`flex items-center space-x-1 px-3 py-1 rounded-md transition-colors text-sm ${
                            selectedModuleId === module.id
                              ? 'bg-blue-500 text-white'
                              : 'bg-blue-600 text-white hover:bg-blue-700'
                          }`}
                        >
                          <Edit className="h-3 w-3" />
                          <span className="hidden sm:inline">
                            {selectedModuleId === module.id ? 'Editando' : 'Editar'}
                          </span>
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                          }}
                          className="p-1.5 text-gray-400 hover:text-blue-400 transition-colors"
                          title="Ver módulo"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                          }}
                          className="p-1.5 text-gray-400 hover:text-red-400 transition-colors"
                          title="Eliminar módulo"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
