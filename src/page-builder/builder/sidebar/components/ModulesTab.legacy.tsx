import React, { useState, useEffect } from 'react';
import { BookOpen, FileText, Plus, Trash2, Edit, Settings } from 'lucide-react';
import { useCourseContext } from '../../../context/CourseContext';
import { useBuilder } from '../../../hooks/useBuilder';
import { DraftModuleService } from '../../../services/draftModuleService';
import { DraftCourseService } from '../../../services/draftCourseService';
import { getModulesByCourse, updateModule } from '../../../../actions/modules/modules';
import { getCourses } from '../../../../actions/courses/get-courses';
import { ConfirmationModal } from '../../../components/module-management/ConfirmationModal';
import { ModuleEditModal } from '../../../components/module-management/ModuleEditModal';
import { formatDateRelative } from '../../../../utils/dateUtils';
import Alert from '../../../../ui/components/Alert';

export const ModulesTab: React.FC = () => {
  
  const { loadPage } = useCourseContext();
  const { importProject } = useBuilder();
  const [modules, setModules] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [courseInfo, setCourseInfo] = useState<any>(null);
  const [currentModuleInfo, setCurrentModuleInfo] = useState<any>(null);
  const [moduleToDelete, setModuleToDelete] = useState<any>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [updatingModuleId, setUpdatingModuleId] = useState<string | null>(null);
  
  // Edit Modal State
  const [editingModule, setEditingModule] = useState<any>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // Create Module Modal State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  
  // Alert state for module updates
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState<'error' | 'message' | 'alert'>('message');
  
  // Alert management functions
  const restartAlert = () => {
    setShowAlert(false);
  };

  const showSuccessAlert = (message: string) => {
    setAlertMessage(message);
    setAlertType('message');
    setShowAlert(true);
  };

  const showErrorAlert = (message: string) => {
    setAlertMessage(message);
    setAlertType('error');
    setShowAlert(true);
  };
  
  // Clean module title by removing date suffixes
  const cleanModuleTitle = (title: string) => {
    // Remove patterns like " - 6/29/2025" or " - 29/06/25" from the title
    return title.replace(/\s*-\s*\d{1,2}\/\d{1,2}\/\d{2,4}.*$/, '').trim();
  };

  // Format date for display
  // Use the imported formatDateRelative function instead of local formatDate
  
  // Get URL parameters
  const getUrlParams = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const params = {
      courseId: urlParams.get('courseId'),
      moduleId: urlParams.get('moduleId'),
      action: urlParams.get('action')
    };
    return params;
  };

  // Load course and module info from URL parameters
  useEffect(() => {
    const { courseId, moduleId } = getUrlParams();
    
    if (courseId) {
      loadCourseAndModules(courseId, moduleId);
    } else {
      // console.warn('🎯 ModulesTab: No courseId found in URL parameters');
    }
  }, []);

  const loadCourseAndModules = async (courseId: string, moduleId?: string | null) => {
    
    setLoading(true);
    try {
      
      // Load course information
      let course = null;
      
      if (courseId.startsWith('draft-')) {
        // Load draft course
        const draftCourse = DraftCourseService.getDraft(courseId);
        if (draftCourse) {
          course = {
            id: draftCourse.id,
            title: draftCourse.title,
            description: draftCourse.description,
            isDraft: true
          };
        } else {
          // console.warn('🎯 ModulesTab: Draft course not found');
        }
      } else {
        // Load published course
        const coursesResponse = await getCourses();
        
        if (coursesResponse.success && coursesResponse.data) {

          
          // Convert courseId to number for comparison since API returns numeric IDs
          const courseIdNumber = parseInt(courseId, 10);

          
          course = coursesResponse.data.find((c: any) => c.id === courseIdNumber);
        } else {
          // console.error('🎯 ModulesTab: Failed to get courses:', coursesResponse.error);
        }
      }
      
      setCourseInfo(course);
      
      if (course) {
        await loadModulesForCourse(courseId, moduleId);
      } else {
        // console.warn('🎯 ModulesTab: No course found, skipping module loading');
      }
    } catch (error) {
      // console.error('❌ ModulesTab: Error loading course and modules:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadModulesForCourse = async (courseId: string, currentModuleId?: string | null) => {
    
    try {
      const isDraftCourse = courseId.startsWith('draft-');
      
      if (isDraftCourse) {
        // Load draft modules
        const draftModules = DraftModuleService.getDraftsByCourse(courseId);
        
        const formattedModules = draftModules.map(draft => ({
          id: draft.id,
          title: cleanModuleTitle(draft.title),
          type: draft.type,
          status: 'DRAFT' as const, // Draft modules always have DRAFT status
          isDraft: true,
          courseId: draft.courseId,
          createdAt: draft.createdAt,
          updatedAt: draft.updatedAt
        }));
        setModules(formattedModules);
        
        // Set current module info if we have a moduleId
        if (currentModuleId) {
          const currentModule = formattedModules.find(m => m.id === currentModuleId);
          setCurrentModuleInfo(currentModule);
        }
      } else {
        // Load published modules from API
        const response = await getModulesByCourse(courseId);
        
        if (response.success && response.data) {
          const publishedModules = response.data.map(module => ({
            id: module.id,
            title: cleanModuleTitle(module.title),
            type: module.type,
            status: module.status, // Preserve the status field
            isDraft: module.status === 'DRAFT',
            courseId: module.courseId || courseId,
            createdAt: module.createdAt,
            updatedAt: module.updatedAt
          }));
          

          
          // Also load draft modules for published courses

          const draftModules = DraftModuleService.getDraftsByCourse(courseId);
          
          const formattedDraftModules = draftModules.map(draft => ({
            id: draft.id,
            title: cleanModuleTitle(draft.title),
            type: draft.type,
            status: 'DRAFT' as const, // Draft modules always have DRAFT status
            isDraft: true,
            courseId: draft.courseId,
            createdAt: draft.createdAt,
            updatedAt: draft.updatedAt
          }));
          
          const allModules = [...publishedModules, ...formattedDraftModules];
          setModules(allModules);
          
          // Set current module info if we have a moduleId
          if (currentModuleId) {
            const currentModule = allModules.find(m => m.id === currentModuleId);
            setCurrentModuleInfo(currentModule);
          }
        } else {
          // console.warn('🔍 ModulesTab: API call failed or no data returned');
          // console.warn('🔍 ModulesTab: Response:', response);
          setModules([]);
        }
      }
    } catch (error) {
      // console.error('❌ ModulesTab: Error loading modules:', error);
      setModules([]);
    }
  };

  const handleModuleSelect = async (module: any) => {
    try {
      if (module.isDraft) {
        // Load draft module seamlessly without page reload
        
        // Update the current module info immediately for UI feedback
        setCurrentModuleInfo(module);
        
        // Navigate to the draft module by updating the URL
        const newUrl = new URL(window.location.href);
        newUrl.searchParams.set('moduleId', module.id);
        newUrl.searchParams.set('action', 'edit');
        
        // Update the URL without page reload
        window.history.pushState({}, '', newUrl.toString());
        
        // Load draft content into page builder
        const draftModule = DraftModuleService.getDraft(module.id);
        if (draftModule && draftModule.content) {
          try {
            // Parse the elements from the draft content
            const elements = JSON.parse(draftModule.content);
            
            // Create a proper project structure for the importProject method
            const projectData = {
              id: module.id,
              title: module.title,
              description: `Draft module: ${module.title}`,
              type: module.type,
              elements: elements,
              courseId: module.courseId,
              createdAt: draftModule.createdAt,
              updatedAt: draftModule.updatedAt,
              pages: [{
                id: `${module.id}-page-1`,
                title: 'Page 1',
                elements: elements,
                order: 0
              }]
            };
            
            // Import the project with proper structure
            importProject(JSON.stringify(projectData));
          } catch (parseError) {
            // console.error('Error parsing draft content:', parseError);
            // If content is invalid, create empty project
            const emptyProjectData = {
              id: module.id,
              title: module.title,
              description: `Draft module: ${module.title}`,
              type: module.type,
              elements: [],
              courseId: module.courseId,
              createdAt: draftModule.createdAt,
              updatedAt: draftModule.updatedAt,
              pages: [{
                id: `${module.id}-page-1`,
                title: 'Page 1',
                elements: [],
                order: 0
              }]
            };
            importProject(JSON.stringify(emptyProjectData));
          }
        } else {
          // No content yet, load empty builder
          const emptyProjectData = {
            id: module.id,
            title: module.title,
            description: `Draft module: ${module.title}`,
            type: module.type,
            elements: [],
            courseId: module.courseId,
            createdAt: module.createdAt,
            updatedAt: module.updatedAt,
            pages: [{
              id: `${module.id}-page-1`,
              title: 'Page 1',
              elements: [],
              order: 0
            }]
          };
          importProject(JSON.stringify(emptyProjectData));
        }
      } else {
        // Load published module using the CourseContext
        await loadPage(module.courseId, module.id);
        setCurrentModuleInfo(module);
      }
    } catch (error) {
      // console.error('Error loading module:', error);
    }
  };

  const handleCreateNewModule = () => {
    const { courseId } = getUrlParams();
    if (!courseId || !courseInfo) return;
    
    // Open the create module modal instead of using browser prompt
    handleOpenCreateModal();
  };

  const handleDeleteModule = (module: any, event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent module selection when clicking delete
    setModuleToDelete(module);
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteModule = () => {
    if (!moduleToDelete) return;

    try {
      if (moduleToDelete.isDraft) {
        // Delete draft module
        DraftModuleService.deleteDraft(moduleToDelete.id);
        
        // If the deleted module was the current one, clear current module info
        if (currentModuleInfo?.id === moduleToDelete.id) {
          setCurrentModuleInfo(null);
          // Optionally redirect to course management or first available module
        }
        
        // Refresh the modules list
        const { courseId } = getUrlParams();
        if (courseId) {
          loadModulesForCourse(courseId);
        }
      } else {
        // Handle published module deletion (implement as needed)
        // You'd implement this with your existing module deletion logic
      }
    } catch (error) {
      // console.error('Error deleting module:', error);
    } finally {
      setIsDeleteModalOpen(false);
      setModuleToDelete(null);
    }
  };

  const cancelDeleteModule = () => {
    setIsDeleteModalOpen(false);
    setModuleToDelete(null);
  };

  const handleStatusChange = async (moduleId: string, newStatus: 'DRAFT' | 'PUBLISHED' | 'IN_REVIEW') => {
    const { courseId } = getUrlParams();
    if (!courseId) return;

    try {
      setUpdatingModuleId(moduleId);
      
      const module = modules.find(m => m.id === moduleId);
      
      // For draft modules stored locally, we can update their status in memory but warn about API limitations
      if (module?.isDraft) {
        // Update local state for draft modules
        setModules(prevModules => 
          prevModules.map(module => 
            module.id === moduleId 
              ? { ...module, status: newStatus }
              : module
          )
        );
        
        if (newStatus !== 'DRAFT') {
          // console.warn('Note: Draft modules with non-DRAFT status may need to be published to persist changes via API.');
        }
        return;
      }

      // Update published module status via API
      const response = await updateModule(courseId, moduleId, {
        type: (module.type || 'ACADEMIC') as 'ACADEMIC' | 'EVALUATIVE',
        title: module.title,
        content: module.content || '',
        description: module.description,
        status: newStatus
      });

      if (response.success) {
        // Update local state
        setModules(prevModules => 
          prevModules.map(module => 
            module.id === moduleId 
              ? { ...module, status: newStatus }
              : module
          )
        );
        
        showSuccessAlert('Estado del módulo actualizado exitosamente');
      } else {
        // console.error('Failed to update module status:', response.error);
        showErrorAlert('Error al actualizar el estado del módulo: ' + (response.error || 'Error desconocido'));
      }
    } catch (error) {
      // console.error('Error updating module status:', error);
      showErrorAlert('Error al actualizar el estado del módulo');
    } finally {
      setUpdatingModuleId(null);
    }
  };

  // Handle edit modal
  const handleEditModule = (module: any) => {
    setEditingModule(module);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setEditingModule(null);
    setIsSaving(false);
  };

  // Handle create modal
  const handleOpenCreateModal = () => {
    setIsCreateModalOpen(true);
  };

  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
    setIsCreating(false);
  };

  const handleCreateModule = async (moduleData: { title: string; description?: string; type?: string }) => {
    const { courseId } = getUrlParams();
    if (!courseId || !courseInfo) return;

    try {
      setIsCreating(true);

      const isDraftCourse = courseId.startsWith('draft-');
      
      if (isDraftCourse) {
        // Create draft module
        const draftModule = DraftModuleService.saveDraft({
          courseId: courseId,
          type: (moduleData.type || 'ACADEMIC') as 'ACADEMIC' | 'EVALUATIVE',
          title: moduleData.title,
          content: JSON.stringify([]),
          estimatedTime: 15
        });
        
        showSuccessAlert('Módulo borrador creado exitosamente');
        loadModulesForCourse(courseId); // Refresh the list
      } else {
        // Create published module via API
        const moduleTitle = moduleData.title;
        const moduleContent = JSON.stringify([]);
        
        // Use the same logic as the existing handlePublish function
        const createResponse = await import('../../../../actions/modules/modules')
          .then(({ createModule }) => createModule(courseId, {
            type: (moduleData.type || 'ACADEMIC') as 'ACADEMIC' | 'EVALUATIVE',
            title: moduleTitle,
            content: moduleContent
          }));

        if (createResponse.success) {
          showSuccessAlert('Módulo creado exitosamente');
          loadModulesForCourse(courseId); // Refresh the list
        } else {
          // console.error('❌ Module creation failed:', createResponse.error);
          showErrorAlert('Error al crear el módulo: ' + (createResponse.error || 'Error desconocido'));
        }
      }
      
      handleCloseCreateModal();
    } catch (error) {
      // console.error('❌ Error creating module:', error);
      showErrorAlert('Error al crear el módulo');
    } finally {
      setIsCreating(false);
    }
  };

  const handleSaveModule = async (moduleData: any) => {
    if (!editingModule || !courseInfo) return;
    
    try {
      setIsSaving(true);
      
      const response = await updateModule(courseInfo.id, editingModule.id, {
        type: (moduleData.type || editingModule.type) as 'ACADEMIC' | 'EVALUATIVE',
        title: moduleData.title || editingModule.title,
        content: moduleData.content || editingModule.content || '',
        description: moduleData.description || editingModule.description,
        status: moduleData.status || editingModule.status
      });

      if (response.success) {
        showSuccessAlert('Módulo actualizado exitosamente');
        // Refresh modules list
        const { courseId } = getUrlParams();
        if (courseId) {
          await loadModulesForCourse(courseId);
        }
        handleCloseEditModal();
      } else {
        showErrorAlert('Error al guardar el módulo: ' + (response.error || 'Error desconocido'));
      }
    } catch (error) {
      showErrorAlert('Error al guardar el módulo');
    } finally {
      setIsSaving(false);
    }
  };

  if (!courseInfo) {
    return (
      <div className="h-full bg-gray-800 flex items-center justify-center">
        <div className="text-center text-gray-400">
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400 mx-auto mb-2"></div>
              <p>Cargando curso...</p>
            </>
          ) : (
            <>
              <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No hay curso cargado</p>
              <p className="text-sm mt-2">Selecciona un curso para ver sus módulos</p>
            </>
          )}
        </div>
      </div>
    );
  }

  // Get status-based styling for module cards
  const getModuleCardStyling = (module: any) => {
    const isCurrentModule = currentModuleInfo?.id === module.id;
    
    if (isCurrentModule) {
      return {
        border: 'border-blue-500 bg-blue-500/15 shadow-xl shadow-blue-500/25 ring-1 ring-blue-500/20',
        stripe: 'bg-gradient-to-r from-blue-500 via-blue-400 to-cyan-400 shadow-sm shadow-blue-500/50'
      };
    }
    
    if (module.isDraft) {
      return {
        border: 'border-orange-500/50 bg-orange-500/8 hover:bg-orange-500/15 hover:border-orange-500/70 hover:shadow-lg hover:shadow-orange-500/10',
        stripe: 'bg-gradient-to-r from-orange-500 via-orange-400 to-yellow-400 group-hover:shadow-sm group-hover:shadow-orange-500/30'
      };
    }
    
    // Status-based styling for published modules
    switch (module.status) {
      case 'PUBLISHED':
        return {
          border: 'border-green-500/50 bg-green-500/8 hover:bg-green-500/15 hover:border-green-500/70 hover:shadow-lg hover:shadow-green-500/10',
          stripe: 'bg-gradient-to-r from-green-500 via-green-400 to-emerald-400 group-hover:shadow-sm group-hover:shadow-green-500/30'
        };
      case 'IN_REVIEW':
        return {
          border: 'border-purple-500/50 bg-purple-500/8 hover:bg-purple-500/15 hover:border-purple-500/70 hover:shadow-lg hover:shadow-purple-500/10',
          stripe: 'bg-gradient-to-r from-purple-500 via-purple-400 to-violet-400 group-hover:shadow-sm group-hover:shadow-purple-500/30'
        };
      default:
        return {
          border: 'border-gray-600 hover:border-gray-500 hover:bg-gray-700/40 hover:shadow-lg',
          stripe: 'bg-gradient-to-r from-gray-600 via-gray-500 to-gray-400 group-hover:from-gray-500 group-hover:to-gray-400'
        };
    }
  };

  // Get status-based icon styling for module cards
  const getModuleIconStyling = (module: any) => {
    const isCurrentModule = currentModuleInfo?.id === module.id;
    
    if (isCurrentModule) {
      return 'bg-blue-500 text-white shadow-blue-500/30 ring-2 ring-blue-400/20';
    }
    
    if (module.isDraft) {
      return 'bg-orange-500 text-white shadow-orange-500/20 group-hover:shadow-orange-500/30 group-hover:scale-105';
    }
    
    // Status-based styling for published modules
    switch (module.status) {
      case 'PUBLISHED':
        return 'bg-green-500 text-white shadow-green-500/20 group-hover:shadow-green-500/30 group-hover:scale-105';
      case 'IN_REVIEW':
        return 'bg-purple-500 text-white shadow-purple-500/20 group-hover:shadow-purple-500/30 group-hover:scale-105';
      default:
        return 'bg-gray-600 text-gray-300 group-hover:bg-gray-500 group-hover:text-gray-200 group-hover:scale-105';
    }
  };

  return (
    <div className="h-full bg-gray-800 flex flex-col">
      {/* Header - Current Course Info */}
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center space-x-2 mb-2">
          <BookOpen className="w-5 h-5 text-blue-400" />
          <h3 className="font-medium text-white truncate">{courseInfo.title}</h3>
          {courseInfo.isDraft && (
            <span className="px-2 py-1 text-xs bg-orange-500 text-white rounded">
              BORRADOR
            </span>
          )}
        </div>
        
        {/* Current Module Info */}
        {currentModuleInfo && (
          <div className="flex items-center space-x-2 text-sm text-gray-300">
            <FileText className="w-4 h-4" />
            <span>Módulo actual: {currentModuleInfo.title}</span>
          </div>
        )}
      </div>

      {/* Modules List */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-5">
          <div className="flex items-center justify-between mb-5">
            <h4 className="text-sm font-semibold text-gray-200">
              Módulos del curso ({modules.length})
            </h4>
            <button
              onClick={handleCreateNewModule}
              className="flex items-center space-x-2 px-3 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white text-xs rounded-lg transition-all duration-200 shadow-sm hover:shadow-md hover:scale-105"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Nuevo</span>
            </button>
          </div>

          {loading ? (
            <div className="text-center text-gray-400 py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400 mx-auto mb-2"></div>
              <p>Cargando módulos...</p>
            </div>
          ) : modules.length === 0 ? (
            <div className="text-center text-gray-400 py-12">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gray-700/50 flex items-center justify-center">
                <FileText className="w-8 h-8 opacity-60" />
              </div>
              <p className="mb-2 text-gray-300 font-medium">No hay módulos en este curso</p>
              <p className="mb-6 text-sm text-gray-500">Crea el primer módulo para empezar</p>
              <button
                onClick={handleCreateNewModule}
                className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white text-sm rounded-xl transition-all duration-200 mx-auto shadow-lg hover:shadow-xl hover:scale-105"
              >
                <Plus className="w-4 h-4" />
                <span>Crear primer módulo</span>
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              {modules.map((module) => {
                // Debug: Log what we're rendering                
                return (
                <div
                  key={module.id}
                  className={`relative overflow-hidden rounded-xl transition-all duration-300 group hover:shadow-xl border backdrop-blur-sm ${
                    getModuleCardStyling(module).border
                  }`}
                >
                  {/* Status indicator stripe at top */}
                  <div className={`h-1.5 w-full transition-all duration-300 ${
                    getModuleCardStyling(module).stripe
                  }`}></div>
                  
                  <div className="p-3">
                    <div className="flex items-start gap-3">
                      {/* Icon */}
                      <div className="flex-shrink-0 mt-0.5">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300 shadow-sm ${
                          getModuleIconStyling(module)
                        }`}>
                          <FileText className="w-4 h-4" />
                        </div>
                      </div>
                      
                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        {/* Title and badges row */}
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <h4 
                            className="text-sm font-semibold text-white truncate leading-tight cursor-pointer hover:text-blue-300 transition-colors"
                            onClick={() => handleModuleSelect(module)}
                            title={module.title}
                          >
                            {module.title}
                          </h4>
                          
                          <div className="flex items-center gap-1 flex-shrink-0">
                            {/* Current Module Badge */}
                            {currentModuleInfo?.id === module.id && (
                              <span className="px-2 py-0.5 text-xs bg-blue-500 text-white rounded-md font-medium">
                                ACTUAL
                              </span>
                            )}
                            
                            {/* Edit/Manage Button */}
                            <button
                              onClick={() => handleEditModule(module)}
                              className="px-2 py-1 bg-gray-600 hover:bg-gray-500 text-white text-xs rounded-md transition-all duration-200 hover:scale-105 flex items-center gap-1"
                              title="Editar módulo"
                            >
                              <Settings className="w-3 h-3" />
                              <span>Editar</span>
                            </button>
                          </div>
                        </div>
                        
                        {/* Module info row */}
                        <div className="flex items-center justify-between text-xs mb-2">
                          <span className="text-gray-300 font-medium uppercase tracking-wide">
                            {module.type}
                          </span>
                          <div className="flex items-center gap-3 text-gray-400">
                            <span title={`Creado: ${module.createdAt ? new Date(module.createdAt).toLocaleString() : 'Desconocido'}`}>
                              {(() => {
                                return formatDateRelative(module.createdAt);
                              })()}
                            </span>
                            {module.updatedAt && module.updatedAt !== module.createdAt && (
                              <span className="text-orange-400" title={`Actualizado: ${new Date(module.updatedAt).toLocaleString()}`}>
                                • {formatDateRelative(module.updatedAt)}
                              </span>
                            )}
                          </div>
                        </div>
                        
                        {/* Progress bar */}
                        <div className="w-full bg-gray-700/50 rounded-full h-2 mb-1 overflow-hidden">
                          <div 
                            className={`h-2 rounded-full transition-all duration-500 shadow-sm ${
                              module.status === 'PUBLISHED' ? 'bg-gradient-to-r from-green-500 to-emerald-400 w-full shadow-green-500/20' :
                              module.status === 'IN_REVIEW' ? 'bg-gradient-to-r from-yellow-500 to-amber-400 w-3/4 shadow-yellow-500/20' :
                              'bg-gradient-to-r from-orange-500 to-red-400 w-1/3 shadow-orange-500/20'
                            }`}
                          ></div>
                        </div>
                        
                        {/* Status text */}
                        <div className="text-xs text-gray-400">
                          {module.status === 'PUBLISHED' ? 'Módulo publicado' :
                           module.status === 'IN_REVIEW' ? 'En revisión' :
                           'Borrador'}
                        </div>
                      </div>
                      
                      {/* Delete Button - Only for draft modules */}
                      {module.isDraft && (
                        <button
                          onClick={(e) => handleDeleteModule(module, e)}
                          className="opacity-0 group-hover:opacity-100 transition-all duration-300 p-2 hover:bg-red-500/20 rounded-lg text-gray-400 hover:text-red-400 flex-shrink-0 hover:scale-110 hover:shadow-sm"
                          title="Eliminar módulo"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onConfirm={confirmDeleteModule}
        onClose={cancelDeleteModule}
        title="Confirmar eliminación"
        message={`¿Estás seguro de que deseas eliminar el módulo "${moduleToDelete?.title}"? Esta acción no se puede deshacer.`}
        type="danger"
        confirmText="Eliminar"
        cancelText="Cancelar"
      />

      {/* Module Edit Modal */}
      <ModuleEditModal
        isOpen={isEditModalOpen}
        module={editingModule}
        onClose={handleCloseEditModal}
        onSave={handleSaveModule}
        isSaving={isSaving}
      />

      {/* Module Create Modal */}
      <ModuleEditModal
        isOpen={isCreateModalOpen}
        module={null} // null for creating new module
        onClose={handleCloseCreateModal}
        onSave={handleCreateModule}
        isSaving={isCreating}
        title="Crear Nuevo Módulo"
        subtitle="Ingresa la información para crear un nuevo módulo"
      />

      {/* Module Update Alert */}
      {showAlert && (
        <Alert
          message={alertMessage}
          type={alertType}
          position="left-top"
          restartAlert={restartAlert}
        />
      )}
    </div>
  );
};
