import { useState, useEffect, useImperativeHandle, forwardRef } from 'react';
import { Trash2, Edit, Eye, Plus, BookOpen } from 'lucide-react';
import { getModulesByCourse, type Module } from '../../../../actions/modules/modules';
import { DraftModuleService, type DraftModule } from '../../../services/draftModuleService';
import type { Course } from '../../../../actions/courses/get-courses';

interface DraftCourse {
  id: string;
  title: string;
  description: string;
  grade: number;
  subject?: string;
  group?: string;
  banner?: string;
  status: 'DRAFT';
  createdAt: string;
  updatedAt: string;
  isDraft: true;
}

interface CombinedModule {
  id: string;
  title: string;
  courseId: string;
  type: 'ACADEMIC' | 'EVALUATIVE';
  status: 'DRAFT' | 'PUBLISHED' | 'IN_REVIEW';
  isDraft: boolean;
  content?: string;
  createdAt?: string;
  estimatedTime?: number;
}

interface ModulesViewProps {
  course: Course | DraftCourse;
  onEditModule?: (module: CombinedModule) => void;
  onCreateModule?: (courseId: string) => void;
}

export interface ModulesViewRef {
  refresh: () => void;
}

export const ModulesView = forwardRef<ModulesViewRef, ModulesViewProps>(({
  course,
  onEditModule,
  onCreateModule
}, ref) => {
  const [modules, setModules] = useState<CombinedModule[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (course) {
      loadModules();
    }
  }, [course]);

  useImperativeHandle(ref, () => ({
    refresh: loadModules
  }));

  const loadModules = async () => {
    setLoading(true);
    try {
      const isDraftCourse = 'isDraft' in course && course.isDraft;
      
      if (isDraftCourse) {
        // For draft courses, only load draft modules (no backend call)
        const draftModules = DraftModuleService.getDraftsByCourse(course.id);
        
        const localDraftModules: CombinedModule[] = draftModules.map((draft: DraftModule) => ({
          id: draft.id,
          title: draft.title,
          courseId: draft.courseId,
          type: draft.type,
          status: 'DRAFT',
          isDraft: true,
          content: draft.content,
          createdAt: draft.createdAt,
          estimatedTime: draft.estimatedTime
        }));
        
        setModules(localDraftModules);
      } else {
        // For published courses, load both published and draft modules
        
        // Load published modules from backend
        const backendResponse = await getModulesByCourse(course.id);
        const backendModules = backendResponse.success ? (backendResponse.data || []) : [];
        
        // Load draft modules from local storage
        const draftModules = DraftModuleService.getDraftsByCourse(course.id);
        
        // Combine and transform modules
        const publishedModules: CombinedModule[] = backendModules.map((module: Module) => ({
          id: module.id,
          title: module.title,
          courseId: module.courseId || course.id,
          type: module.type,
          status: module.status || 'PUBLISHED',
          isDraft: false,
          content: module.content,
          createdAt: module.createdAt,
          estimatedTime: module.estimatedTime
        }));
        
        const localDraftModules: CombinedModule[] = draftModules.map((draft: DraftModule) => ({
          id: draft.id,
          title: draft.title,
          courseId: draft.courseId,
          type: draft.type,
          status: 'DRAFT',
          isDraft: true,
          content: draft.content,
          createdAt: draft.createdAt,
          estimatedTime: draft.estimatedTime
        }));
        
        setModules([...publishedModules, ...localDraftModules]);
      }
    } catch (error) {
      // console.error('Error loading modules:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteModule = async (module: CombinedModule) => {
    if (module.isDraft) {
      const confirmed = confirm(`¿Estás seguro de que quieres eliminar el borrador "${module.title}"?`);
      if (confirmed) {
        DraftModuleService.deleteDraft(module.id);
        loadModules(); // Refresh the list
      }
    } else {
      alert('La eliminación de módulos publicados no está implementada aún.');
    }
  };

  const handleEditModule = (module: CombinedModule) => {
    if (onEditModule) {
      onEditModule(module);
    }
  };

  const handleViewModule = (module: CombinedModule) => {
    // For now, same as edit
    handleEditModule(module);
  };

  const handleCreateModule = () => {
    if (onCreateModule) {
      onCreateModule(course.id);
    }
  };

  const isDraftCourse = 'isDraft' in course && course.isDraft;

  if (loading) {
    return (
      <div className="p-4 text-center">
        <div className="text-sm text-gray-400">Cargando módulos...</div>
      </div>
    );
  }

  return (
    <div className="h-full bg-gray-800">
      {/* Header */}
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-white">
            Módulos de {course.title}
            {isDraftCourse && (
              <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 border border-yellow-200">
                Curso Borrador
              </span>
            )}
          </h3>
          <button
            onClick={handleCreateModule}
            className="inline-flex items-center px-3 py-1.5 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4 mr-1" />
            {isDraftCourse ? 'Nuevo Borrador' : 'Nuevo'}
          </button>
        </div>
        <div className="text-sm text-gray-400">
          {modules.length} módulo{modules.length !== 1 ? 's' : ''} encontrado{modules.length !== 1 ? 's' : ''}
          {isDraftCourse && ' (todos son borradores)'}
        </div>
      </div>

      {/* Modules List */}
      <div className="p-4 space-y-3 overflow-y-auto">
        {modules.length === 0 ? (
          <div className="text-center py-8">
            <BookOpen className="w-12 h-12 text-gray-600 mx-auto mb-3" />
            <div className="text-sm text-gray-400 mb-2">
              {isDraftCourse 
                ? 'No hay módulos en este curso borrador' 
                : 'No hay módulos en este curso'
              }
            </div>
            <button
              onClick={handleCreateModule}
              className="text-blue-400 hover:text-blue-300 text-sm transition-colors"
            >
              {isDraftCourse 
                ? 'Crear tu primer módulo borrador' 
                : 'Crear tu primer módulo'
              }
            </button>
          </div>
        ) : (
          modules.map((module) => (
            <div
              key={module.id}
              className="bg-gray-700 border border-gray-600 rounded-lg p-3 hover:bg-gray-650 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-sm font-medium text-white truncate">
                      {module.title}
                    </h4>
                    
                    {/* Status Indicators */}
                    {module.isDraft && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 border border-yellow-200">
                        Borrador
                      </span>
                    )}
                    {!module.isDraft && module.status === 'PUBLISHED' && (
                      <div className="w-2 h-2 bg-green-400 rounded-full" title="Publicado"></div>
                    )}
                    {!module.isDraft && module.status !== 'PUBLISHED' && (
                      <div className="w-2 h-2 bg-gray-400 rounded-full" title="No publicado"></div>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-3 text-xs text-gray-400">
                    <span className="capitalize">{module.type.toLowerCase()}</span>
                    {module.estimatedTime && (
                      <span>{module.estimatedTime} min</span>
                    )}
                    <span>
                      {module.isDraft ? 'Guardado localmente' : 'En servidor'}
                    </span>
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="flex items-center gap-1 ml-2">
                  <button
                    onClick={() => handleViewModule(module)}
                    className="h-7 w-7 flex items-center justify-center text-gray-400 hover:text-gray-200 hover:bg-gray-600 rounded transition-colors"
                    title="Ver módulo"
                  >
                    <Eye className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => handleEditModule(module)}
                    className="h-7 w-7 flex items-center justify-center text-gray-400 hover:text-gray-200 hover:bg-gray-600 rounded transition-colors"
                    title="Editar módulo"
                  >
                    <Edit className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => handleDeleteModule(module)}
                    className="h-7 w-7 flex items-center justify-center text-red-400 hover:text-red-300 hover:bg-gray-600 rounded transition-colors"
                    title="Eliminar módulo"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
});
