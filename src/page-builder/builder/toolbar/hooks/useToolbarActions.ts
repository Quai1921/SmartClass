import { useNavigate } from 'react-router';
import { createModule, updateModule } from '../../../../actions/modules/modules';
import { DraftCourseService } from '../../../services/draftCourseService';
import { DraftModuleService } from '../../../services/draftModuleService';
import type { ModuleContext, ConfirmModalState } from './useToolbarState';

interface UseToolbarActionsParams {
  // State setters
  setShowSaveNotification: (show: boolean) => void;
  setShowAlert: (show: boolean) => void;
  setAlertMessage: (message: string) => void;
  setAlertType: (type: 'error' | 'message' | 'alert') => void;
  setConfirmModal: (modal: ConfirmModalState | ((prev: ConfirmModalState) => ConfirmModalState)) => void;
  
  // Context and data
  moduleContext: ModuleContext;
  setModuleContext: (context: ModuleContext | ((prev: ModuleContext) => ModuleContext)) => void;
  course: any;
  elements: any[];
  
  // Builder functions
  saveProject: () => void;
  exportProject: () => string;
  createNewProject: () => void;
  updateElement: (id: string, updates: any) => void;
  markAsSaved: () => void;
  
  // Course builder functions
  currentPage: any;
  saveCurrentPage: () => Promise<boolean>;
}

/**
 * Hook to handle toolbar actions and business logic
 */
export const useToolbarActions = (params: UseToolbarActionsParams) => {
  const navigate = useNavigate();
  
  const {
    setShowSaveNotification,
    setShowAlert,
    setAlertMessage,
    setAlertType,
    setConfirmModal,
    moduleContext,
    setModuleContext,
    course,
    elements,
    saveProject,
    exportProject,
    createNewProject,
    updateElement,
    markAsSaved,
    currentPage,
    saveCurrentPage
  } = params;

  // Utility functions
  const getCourseIdFromUrl = () => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('courseId');
  };

  const showAlertWithMessage = (message: string, type: 'error' | 'message' | 'alert' = 'message') => {
    setAlertMessage(message);
    setAlertType(type);
    setShowAlert(true);
  };

  const restartAlert = () => {
    setShowAlert(false);
  };

  // Action handlers
  const handleBackNavigation = () => {
    const courseId = getCourseIdFromUrl();
    if (courseId) {
      // If we have a courseId, go back to modules for that course
      window.location.href = `/modules?courseId=${courseId}`;
    } else {
      // If no courseId, go back to courses
      window.location.href = '/courses';
    }
  };

  const handleSave = async () => {
    try {
      // Check if we're editing a course page
      if (currentPage) {
        // Save to course page
        const success = await saveCurrentPage();
        if (success) {
          markAsSaved(); // Mark changes as saved
          setShowSaveNotification(true);
          setTimeout(() => setShowSaveNotification(false), 2000);
        } else {
          // console.error('Failed to save course page');
        }
      } else {
        // Save as regular project
        saveProject();
        markAsSaved(); // Mark changes as saved
        setShowSaveNotification(true);
        setTimeout(() => setShowSaveNotification(false), 2000);
      }
    } catch (error) {
      // console.error('Save failed:', error);
    }
  };

  const handlePublish = async () => {
    try {
      const { courseId, moduleId, title, description } = moduleContext;
      
      // Debug the moduleContext to see what's actually in it
      
      // If moduleType is missing and we're creating/updating a module, prompt user or set default
      let moduleType = moduleContext.moduleType;
      
      if (!moduleType) {
        // For now, default to ACADEMIC, but in the future we could show a modal to ask the user
        moduleType = 'ACADEMIC';
        
        // Update the module context to include the type for future operations
        setModuleContext(prev => ({
          ...prev,
          moduleType: 'ACADEMIC'
        }));
      }
      
      
      if (!courseId || !moduleType || !title) {
        // console.error('❌ Missing required parameters:', { courseId, moduleType, title });
        showAlertWithMessage('Faltan parámetros requeridos para publicar el módulo', 'error');
        return;
      }

      // Import the page parser to create enhanced module content
      const { parseModulePages } = await import('../../../utils/modulePageParser');
      
      // Process elements for module content - enhanced version with page structure
      const processElementsForModule = (elements: any[]) => {
        return elements.map((element: any) => {
          const processedElement = { ...element };
          
          // Add container ID in format id:container-id (this goes into the content JSON)
          if (element.id) {
            processedElement.id = `id:${element.id}`;
          }
          
          // Handle background image - use URL directly if it exists
          if (element.props?.style?.backgroundImage) {
            const bgImage = element.props.style.backgroundImage;
            // Extract URL from CSS background-image property
            const urlMatch = bgImage.match(/url\(['"]?([^'")]+)['"]?\)/);
            if (urlMatch && urlMatch[1]) {
              processedElement.backgroundImageUrl = urlMatch[1];
              // Keep original format but also add clean URL
              processedElement.props = {
                ...processedElement.props,
                style: {
                  ...processedElement.props.style,
                  backgroundImageUrl: urlMatch[1]
                }
              };
            }
          }
          
          return processedElement;
        });
      };

      // Create enhanced module content with page structure
      const processedElements = processElementsForModule(elements);
      
      // Parse elements to create page structure
      const elementsString = JSON.stringify(processedElements);
      const pageInfo = parseModulePages(elementsString);
      
      // Create enhanced module content structure
      const enhancedModuleContent = {
        version: 2,
        elements: pageInfo.processedElements, // Processed elements with page classes
        pages: pageInfo.pages.map((page: any, index: number) => ({
          id: `page-${index + 1}`,
          title: page.containerName,
          pageNumber: page.pageNumber,
          containerId: page.containerId,
          elementIds: page.elements.map((el: any) => el.id),
          order: index
        })),
        currentPage: 1,
        totalPages: pageInfo.totalPages,
        metadata: {
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          moduleId: moduleId || 'new-module'
        }
      };
      
      const moduleContent = JSON.stringify(enhancedModuleContent);
      
      // Debug tracking
      const { debugSaveProcess } = await import('../../../utils/debug-save-process');
      debugSaveProcess.trackSaveFunction('useToolbarActions.handlePublish', moduleContent);
      const moduleTitle = title;
      const isNewModule = !moduleId || moduleContext.action === 'new-module';

      // Basic validation before API call
      if (!moduleTitle.trim()) {
        showAlertWithMessage('El título del módulo no puede estar vacío', 'error');
        return;
      }

      if (elements.length === 0) {
        // console.warn('⚠️ Creating module with no elements');
      }

      if (isNewModule) {
        
        const response = await createModule(courseId, {
          type: moduleType,
          title: moduleTitle,
          content: moduleContent,
          description: description || undefined, // Add description if provided
          status: 'PUBLISHED' // Publish the module by default - backend expects status
        });

        // Handle different response scenarios
        if (response.success) {
          showAlertWithMessage('Módulo creado y publicado exitosamente', 'message');
          markAsSaved();
          
          // Redirect back to modules page after success
          setTimeout(() => {
            navigate(`/modules?courseId=${courseId}`);
          }, 2000);
        } else {
          // Handle specific error cases
          // console.error('❌ Error creating module:', response.error, 'Status:', response.statusCode);
          
          if (response.statusCode === 500) {
            showAlertWithMessage(
              'Error del servidor: La base de datos no está disponible. Por favor, intenta más tarde.', 
              'error'
            );
          } else if (response.statusCode === 404) {
            showAlertWithMessage(
              'Curso no encontrado. Verifica que el curso existe y tienes permisos para acceder.', 
              'error'
            );
          } else if (response.statusCode === 401 || response.statusCode === 403) {
            // console.error('🔐 Authentication error - redirecting to login may be triggered');
            showAlertWithMessage(
              'Sesión expirada o sin permisos. Por favor, inicia sesión nuevamente.', 
              'error'
            );
            // Don't redirect automatically, let user handle authentication
          } else {
            showAlertWithMessage(
              `Error al crear el módulo: ${response.error || 'Error desconocido'}`, 
              'error'
            );
          }
        }
      } else {
        
        // Debug ALL sources of moduleType

        
        // Ensure moduleType has a valid value with fallback
        // Use the moduleType from context if available, otherwise fallback to moduleType variable or default
        let validModuleType = moduleContext.moduleType || moduleType || 'ACADEMIC';
        
        // If we still don't have a valid module type, update the context
        if (!moduleContext.moduleType) {
          setModuleContext(prev => ({
            ...prev,
            moduleType: validModuleType as 'ACADEMIC' | 'EVALUATIVE'
          }));
        }
        
        
        // Force the type to be a valid enum value regardless of what we have
        const finalModuleType: 'ACADEMIC' | 'EVALUATIVE' = 'ACADEMIC'; // Force ACADEMIC for now to test
        
        
        // Validate required fields before sending
        if (!finalModuleType || !moduleTitle || !moduleContent) {
          // console.error('❌ Missing required fields for module update:', {
          //   moduleType: finalModuleType, 
          //   moduleTitle, 
          //   hasContent: !!moduleContent,
          //   contentLength: moduleContent?.length || 0
          // });
          showAlertWithMessage('Error: Faltan campos requeridos para actualizar el módulo', 'error');
          return;
        }
        
        // Ensure we're sending the correct data types to match ModuleRequestDto
        const updatePayload = {
          type: finalModuleType,                               // Required: ModuleType enum (FORCED to ACADEMIC for testing)
          title: moduleTitle,                                  // Required: String
          content: moduleContent                               // Required: String (processed JSON)
        };
        
        
        const response = await updateModule(courseId, moduleId, updatePayload);

        // Handle different response scenarios for updates
        if (response.success) {
          showAlertWithMessage('Módulo actualizado y publicado exitosamente', 'message');
          markAsSaved();
        } else {
          // Handle specific error cases for updates
          // console.error('❌ Error updating module:', response.error, 'Status:', response.statusCode);
          
          if (response.statusCode === 500) {
            showAlertWithMessage(
              'Error del servidor: La base de datos no está disponible. Por favor, intenta más tarde.', 
              'error'
            );
          } else if (response.statusCode === 404) {
            showAlertWithMessage(
              'Módulo no encontrado. Puede haber sido eliminado por otro usuario.', 
              'error'
            );
          } else if (response.statusCode === 401 || response.statusCode === 403) {
            showAlertWithMessage(
              'No tienes permisos para editar este módulo.', 
              'error'
            );
          } else {
            showAlertWithMessage(
              `Error al actualizar el módulo: ${response.error || 'Error desconocido'}`, 
              'error'
            );
          }
        }
      }
    } catch (error: any) {
      // console.error('❌ Publish failed with exception:', error);
      
      // Handle network errors and other exceptions
      if (error.name === 'NetworkError' || error.message?.includes('fetch')) {
        showAlertWithMessage(
          'Error de conexión: Verifica tu conexión a internet e intenta nuevamente.', 
          'error'
        );
      } else if (error.code === 'ECONNREFUSED' || error.message?.includes('ECONNREFUSED')) {
        showAlertWithMessage(
          'No se puede conectar al servidor. El servicio puede estar temporalmente no disponible.', 
          'error'
        );
      } else {
        showAlertWithMessage(
          `Error inesperado al publicar el módulo: ${error.message || 'Error desconocido'}`, 
          'error'
        );
      }
    }
  };

  /**
   * Initialize module context for a new module with the specified type
   * This should be called when creating a new module from the modal
   */
  const initializeNewModule = (courseId: string, moduleType: 'ACADEMIC' | 'EVALUATIVE', title: string, description?: string) => {
    
    setModuleContext({
      courseId,
      moduleId: null,
      action: 'new-module',
      moduleType,
      title,
      description: description || null
    });
    
  };

  /**
   * Initialize module context for editing an existing module
   * This should be called when opening an existing module for editing
   */
  const initializeExistingModule = (
    courseId: string, 
    moduleId: string, 
    moduleType: 'ACADEMIC' | 'EVALUATIVE', 
    title: string, 
    description?: string
  ) => {
    
    setModuleContext({
      courseId,
      moduleId,
      action: 'edit-module',
      moduleType,
      title,
      description: description || null
    });
    
  };

  const handleExport = () => {
    try {
      const jsonData = exportProject();
      const blob = new Blob([jsonData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${course?.title || 'proyecto'}.json`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      // console.error('Export failed:', error);
    }
  };

  const handleNewProject = () => {
    setConfirmModal({
      isOpen: true,
      title: 'Crear Nuevo Proyecto',
      message: '¿Crear un nuevo proyecto? Los cambios no guardados se perderán.',
      variant: 'warning',
      onConfirm: () => {
        createNewProject();
        setConfirmModal(prev => ({ ...prev, isOpen: false }));
      }
    });
  };



  const closeConfirmModal = () => {
    setConfirmModal(prev => ({ ...prev, isOpen: false }));
  };

  const handlePreview = () => {
    // This would be handled by the parent component
  };

  const handleSaveDraft = () => {
    try {
      // Check if we're editing a module or creating a new course
      if (moduleContext?.courseId && (moduleContext?.moduleId || moduleContext?.action === 'new-module')) {
        // We're in module editing mode - save as module draft
        const moduleTitle = moduleContext?.title || 'Módulo sin título';
        const moduleType = moduleContext?.moduleType || 'ACADEMIC';
        
        // Convert elements to HTML content for module
        const moduleContent = elements && elements.length > 0 
          ? elements.map(el => `<div>${el.content || el.text || ''}</div>`).join('')
          : '<div>Contenido del módulo</div>';
        
        // Check if we're editing an existing draft or creating a new one
        if (moduleContext.moduleId && moduleContext.moduleId.startsWith('draft-')) {
          // Update existing draft
          const updatedDraft = DraftModuleService.updateDraft(moduleContext.moduleId, {
            title: moduleTitle,
            content: moduleContent,
            type: moduleType,
            updatedAt: new Date().toISOString(),
          });
          
          if (updatedDraft) {
            showAlertWithMessage('Borrador de módulo actualizado', 'message');
          } else {
            // console.error('❌ Failed to update draft module');
            showAlertWithMessage('Error al actualizar el borrador', 'error');
          }
        } else {
          // Create new draft
          const draftModule = DraftModuleService.saveDraft({
            courseId: moduleContext.courseId,
            type: moduleType,
            title: moduleTitle,
            content: moduleContent,
            order: 1, // Default order
            estimatedTime: 30, // Default estimated time
          });

          showAlertWithMessage('Borrador de módulo guardado localmente', 'message');
        }
        
        setShowSaveNotification(true);
        setTimeout(() => setShowSaveNotification(false), 2000);
        
      } else {
        // We're in course editing mode - save as course draft
        const moduleTitle = moduleContext?.title || 'Curso sin título';
        const moduleDescription = moduleTitle; // Use title as description for now
        const courseGrade = course?.grade ? parseInt(course.grade) : 1;
        
        // Create draft course with current builder state
        const draftCourse = DraftCourseService.saveDraft({
          title: moduleTitle,
          description: moduleDescription,
          grade: courseGrade,
          subject: course?.subject,
          group: course?.group,
          elements: elements || [],
          banner: course?.banner,
        });

        showAlertWithMessage('Borrador de curso guardado localmente', 'message');
        setShowSaveNotification(true);
        setTimeout(() => setShowSaveNotification(false), 2000);
      }
      
    } catch (error) {
      // console.error('❌ Error saving draft:', error);
      showAlertWithMessage('Error al guardar el borrador', 'error');
    }
  };

  return {
    // Navigation
    handleBackNavigation,
    
    // File operations
    handleSave,
    handleSaveDraft,
    handleExport,
    handleNewProject,
    
    // Module operations
    handlePublish,
    

    
    // Modal operations
    closeConfirmModal,
    handlePreview,
    
    // Alert operations
    showAlertWithMessage,
    restartAlert,
    initializeNewModule,
    initializeExistingModule
  };
};
