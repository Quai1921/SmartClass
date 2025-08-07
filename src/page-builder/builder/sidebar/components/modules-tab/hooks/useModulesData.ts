import { useState, useCallback, useEffect } from 'react';
import { useBuilder } from '../../../../../hooks/useBuilder';
import { useUnsavedChanges } from '../../../../../hooks/useUnsavedChanges';
import { useSimpleUnsavedChanges } from '../../../../../hooks/useSimpleUnsavedChanges';
import { DraftModuleService } from '../../../../../services/draftModuleService';
import { DraftCourseService } from '../../../../../services/draftCourseService';
import { getModulesByCourse, updateModule } from '../../../../../../actions/modules/modules';
import { getCourses } from '../../../../../../actions/courses/get-courses';
import { useUrlParams } from './useUrlParams';

export const useModulesData = (
  showSuccessAlert: (message: string) => void,
  showErrorAlert: (message: string) => void,
  currentModuleInfo: any,
  saveCurrentModuleChanges: (module: any) => Promise<void>
) => {
  const [modules, setModules] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [courseInfo, setCourseInfo] = useState<any>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [updatingModuleId, setUpdatingModuleId] = useState<string | null>(null);
  const [autoSelectModuleId, setAutoSelectModuleId] = useState<string | null>(null);
  
  const { elements, course } = useBuilder();
  const { markAsSaved } = useSimpleUnsavedChanges();
  const { getUrlParams } = useUrlParams();

  // Clean module title by removing date suffixes
  const cleanModuleTitle = useCallback((title: string) => {
    // Remove patterns like " - 6/29/2025" or " - 29/06/25" from the title
    return title.replace(/\s*-\s*\d{1,2}\/\d{1,2}\/\d{2,4}.*$/, '').trim();
  }, []);

  const loadModulesForCourse = useCallback(async (courseId: string, currentModuleId?: string | null) => {
    
    // Store the moduleId for auto-selection after modules are loaded
    setAutoSelectModuleId(currentModuleId || null);
    
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
      } else {

        // Load published modules from API
        const response = await getModulesByCourse(courseId);

        
        if (response.success && response.data) {

          const draftModules = DraftModuleService.getDraftsByCourse(courseId);

          
          const formattedDraftModules = draftModules.map(draft => ({
            id: draft.id,
            title: cleanModuleTitle(draft.title),
            type: draft.type,
            status: 'DRAFT' as const,
            isDraft: true,
            courseId: draft.courseId,
            createdAt: draft.createdAt,
            updatedAt: draft.updatedAt
          }));

          
          const allModules = [...publishedModules, ...formattedDraftModules];

          setModules(allModules);
        } else {

          setModules([]);
        }
      }
    } catch (error) {

      setModules([]);
    }
  }, [cleanModuleTitle]);

  const loadCourseAndModules = useCallback(async (courseId: string, moduleId?: string | null) => {

    
    setLoading(true);
    try {

      
      // Load course information
      let course: any = null;
      
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
        
        if (coursesResponse.success && coursesResponse.data) {;
          
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
  }, [loadModulesForCourse]);

  // Refresh modules function
  const handleRefreshModules = useCallback(async () => {
    const { courseId } = getUrlParams();
    if (courseId) {
      setIsRefreshing(true);
      try {
        await loadModulesForCourse(courseId, currentModuleInfo?.id);
      } catch (error) {
        // console.error('❌ Error refreshing modules:', error);
        showErrorAlert('Error al actualizar la lista de módulos');
      } finally {
        setIsRefreshing(false);
      }
    }
  }, [getUrlParams, loadModulesForCourse, currentModuleInfo?.id, showErrorAlert]);

  const handleStatusChange = useCallback(async (moduleId: string, newStatus: 'DRAFT' | 'PUBLISHED' | 'IN_REVIEW') => {
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
          showErrorAlert('Los módulos borradores deben publicarse para cambiar su estado');
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
  }, [getUrlParams, modules, showSuccessAlert, showErrorAlert]);

  const handleCreateModule = useCallback(async (moduleData: { title: string; description?: string; type?: string; content?: string }) => {
    const { courseId } = getUrlParams();
    if (!courseId || !courseInfo) return;

    try {

      const isDraftCourse = courseId.startsWith('draft-');
      
      // Use provided content or current elements or empty array as fallback
      const moduleContent = moduleData.content || 
                           (elements && elements.length > 0 ? JSON.stringify(elements) : JSON.stringify([]));
      
      if (isDraftCourse) {
        // Create draft module
        const draftModule = DraftModuleService.saveDraft({
          courseId: courseId,
          type: (moduleData.type || 'ACADEMIC') as 'ACADEMIC' | 'EVALUATIVE',
          title: moduleData.title,
          content: moduleContent,
          estimatedTime: 15
        });
        
        showSuccessAlert('Módulo borrador creado exitosamente');
        loadModulesForCourse(courseId); // Refresh the list
      } else {
        // Create published module via API
        const moduleTitle = moduleData.title;
        
        // Use the same logic as the existing handlePublish function
        const createResponse = await import('../../../../../../actions/modules/modules')
          .then(({ createModule }) => createModule(courseId, {
            type: (moduleData.type || 'ACADEMIC') as 'ACADEMIC' | 'EVALUATIVE',
            title: moduleTitle,
            content: moduleContent
          }));

        if (createResponse.success) {
          showSuccessAlert('Módulo creado exitosamente');
          loadModulesForCourse(courseId); // Refresh the list
        } else {
          // console.error('❌ Failed to create published module:', createResponse.error);
          showErrorAlert('Error al crear el módulo: ' + (createResponse.error || 'Error desconocido'));
        }
      }
    } catch (error) {
      // console.error('❌ Error creating module:', error);
      showErrorAlert('Error al crear el módulo');
    }
  }, [getUrlParams, courseInfo, elements, showSuccessAlert, showErrorAlert, loadModulesForCourse]);

  const handleSaveModule = useCallback(async (moduleData: any, editingModule: any) => {
    if (!editingModule || !courseInfo) return false;
    
    try {
      
      // Use current builder elements as content if we're editing the currently loaded module
      // Otherwise, preserve the existing module content
      const isEditingCurrentModule = currentModuleInfo?.id === editingModule.id;
      
      let currentContent = '';
      if (isEditingCurrentModule && elements && elements.length > 0) {
        // Import the page parser to create proper page structure
        const { parseModulePages } = await import('../../../../../utils/modulePageParser');
        
        // Create enhanced module content structure with course page information
        const coursePages = course?.pages || [];
        
        // Get current page elements (which might not be saved yet)
        const currentPageElements = elements || [];
        
        // 🚀 NEW: Use V3 format for multi-page modules
        let enhancedModuleContent: any;
        
        if (coursePages.length > 1) {
          // Modern format for multi-page modules
          enhancedModuleContent = {
            content: {
              pages: {},
              metadata: {
                courseId: editingModule.courseId || courseInfo.id,
                moduleId: editingModule.id,
                totalPages: coursePages.length
              }
            }
          };
          
          // Create modern pages with direct element storage
          coursePages.forEach((page: any, index: number) => {
            const pageId = `page-${index + 1}`;
            
            // 🔧 FIX: Use current builder elements for live editing
            let pageElements = page.elements || [];
            // In this context, we should prefer current elements when available
            if (currentPageElements.length > 0 && index === 0) {
              // Use current elements for the first page (typical case)
              pageElements = currentPageElements;
            }
            
            enhancedModuleContent.content.pages[pageId] = {
              id: pageId,
              title: page.title || `Page ${index + 1}`,
              elements: pageElements,
              order: index + 1
            };
          });
          
          // Set current page
          const firstPageId = Object.keys(enhancedModuleContent.content.pages)[0];
          enhancedModuleContent.content.currentPageId = firstPageId;
          
        } else {
          // Modern format for single page modules (consistency)
          enhancedModuleContent = {
            content: {
              pages: {
                "page-1": {
                  id: "page-1",
                  title: coursePages[0]?.title || 'Page 1',
                  elements: currentPageElements,
                  order: 1
                }
              },
              metadata: {
                courseId: editingModule.courseId || courseInfo.id,
                moduleId: editingModule.id,
                totalPages: 1
              }
            }
          };
        }
        
        currentContent = JSON.stringify(enhancedModuleContent);
        
        // Debug tracking
        const { debugSaveProcess } = await import('../../../../../utils/debug-save-process');
        debugSaveProcess.trackSaveFunction('useModulesData.handleSaveModule', currentContent);
      } else {
        currentContent = editingModule.content || '';
      }
      
      const response = await updateModule(courseInfo.id, editingModule.id, {
        type: (moduleData.type || editingModule.type) as 'ACADEMIC' | 'EVALUATIVE',
        title: moduleData.title || editingModule.title,
        content: currentContent,
        description: moduleData.description || editingModule.description,
        status: moduleData.status || editingModule.status
      });

      if (response.success) {
        showSuccessAlert('Módulo actualizado exitosamente');
        
        // Mark as saved if we're saving the currently loaded module content
        if (isEditingCurrentModule && elements && elements.length > 0) {
          markAsSaved();
        }
        
        // Refresh modules list
        const { courseId } = getUrlParams();
        if (courseId) {
          await loadModulesForCourse(courseId);
        }
        return true;
      } else {
        // console.error('❌ Failed to save module:', response.error);
        showErrorAlert('Error al guardar el módulo: ' + (response.error || 'Error desconocido'));
        return false;
      }
    } catch (error) {
      // console.error('❌ Error saving module:', error);
      showErrorAlert('Error al guardar el módulo');
      return false;
    }
  }, [courseInfo, currentModuleInfo, elements, showSuccessAlert, showErrorAlert, markAsSaved, getUrlParams, loadModulesForCourse]);

  // Initialize data on mount
  useEffect(() => {
    const { courseId, moduleId } = getUrlParams();
    
    if (courseId) {
      loadCourseAndModules(courseId, moduleId);
    } else {
      // console.warn('🎯 ModulesTab: No courseId found in URL parameters');
    }
  }, [getUrlParams, loadCourseAndModules]);

  // Listen for save events from toolbar
  useEffect(() => {
    const handleSaveCurrentModule = async () => {
      if (currentModuleInfo && elements && elements.length > 0) {
        
        // 🔧 WORKAROUND: Mark as saved immediately to update button state
        // This prevents the button from staying stuck while the async save happens
        markAsSaved();
        
        try {
          await saveCurrentModuleChanges(currentModuleInfo);
          
          // Show success alert
          showSuccessAlert(`Módulo "${currentModuleInfo.title}" guardado correctamente`);
          
          // Note: markAsSaved already called above for immediate UI feedback
          
        } catch (error: any) {
          // console.error('❌ [useModulesData] Failed to save module from toolbar:', error);
          // console.error('❌ Error details:', {
          //   message: error.message,
          //   stack: error.stack,
          //   name: error.name
          // });
          
          // 🔧 If save failed, we might want to revert the "saved" state
          // But for now, keep it as "saved" since the user clicked save
          showErrorAlert(`Error al guardar el módulo: ${error.message || 'Error desconocido'}`);
        }
      } else {
        
        // Show appropriate message
        if (!currentModuleInfo) {
          showErrorAlert('No hay módulo seleccionado para guardar');
        } else if (!elements || elements.length === 0) {
          showErrorAlert('No hay contenido para guardar en el módulo');
        }
      }
    };

    // Listen for both the original event and the new forwarded event
    window.addEventListener('saveCurrentModule', handleSaveCurrentModule);
    window.addEventListener('saveModuleFromGlobal', handleSaveCurrentModule);
    
    // Cleanup event listeners on unmount
    return () => {
      window.removeEventListener('saveCurrentModule', handleSaveCurrentModule);
      window.removeEventListener('saveModuleFromGlobal', handleSaveCurrentModule);
    };
  }, [currentModuleInfo, elements, saveCurrentModuleChanges, showSuccessAlert, showErrorAlert, markAsSaved]);

  // Auto-select module after modules are loaded if moduleId is present
  useEffect(() => {
    if (autoSelectModuleId && modules.length > 0) {

      
      // Check if the module to auto-select is already the current module
      if (currentModuleInfo && currentModuleInfo.id === autoSelectModuleId) {
        setAutoSelectModuleId(null);
        return;
      }
      
      const foundModule = modules.find(m => m.id === autoSelectModuleId);
      if (foundModule) {
        
        // Add a small delay to ensure the UI is ready
        setTimeout(() => {
          window.dispatchEvent(new CustomEvent('modulesTab:autoSelectModule', { 
            detail: { module: foundModule } 
          }));
          setAutoSelectModuleId(null); // Only auto-select once
        }, 100);
      } else {
        // console.warn('🎯 Module not found for auto-selection:', autoSelectModuleId);
        // console.warn('🎯 Available module IDs:', modules.map(m => m.id));
        setAutoSelectModuleId(null); // Clear invalid moduleId
      }
    }
  }, [autoSelectModuleId, modules, currentModuleInfo]);

  return {
    modules,
    loading,
    courseInfo,
    isRefreshing,
    updatingModuleId,
    loadCourseAndModules,
    loadModulesForCourse,
    handleRefreshModules,
    handleStatusChange,
    handleCreateModule,
    handleSaveModule
  };
};
