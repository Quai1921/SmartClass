import { useState, useEffect } from 'react';
import { useBuilder } from '../hooks/useBuilder';
import { useUnsavedChanges } from '../hooks/useUnsavedChanges';
import { useSimpleUnsavedChanges } from '../hooks/useSimpleUnsavedChanges';
import { createModule, updateModule } from '../../actions/modules/modules';
import { DraftModuleService } from '../services/draftModuleService';

export const useModuleManagement = () => {
  const { course, elements, updateElement } = useBuilder();
  const { markAsSaved } = useSimpleUnsavedChanges();

  // Module-related state
  const [moduleContext, setModuleContext] = useState<{
    courseId: string | null;
    moduleId: string | null;
    action: string | null;
  }>({ courseId: null, moduleId: null, action: null });

  // Alert state
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState<'error' | 'message' | 'alert'>('message');

  const handleSaveDraft = async () => {
    try {

      
      // Check if we're in module creation/editing context
      if (moduleContext.courseId) {
        const courseId = moduleContext.courseId;
        
        // Generate module content from current elements
        const moduleTitle = elements.length > 0 
          ? `Borrador - ${new Date().toLocaleDateString()}` 
          : `Borrador Vacío - ${new Date().toLocaleDateString()}`;
        const moduleContent = JSON.stringify(elements);
        


        // Save as draft using DraftModuleService
        const draftModule = DraftModuleService.saveDraft({
          courseId,
          type: 'ACADEMIC',
          title: moduleTitle,
          content: moduleContent,
          estimatedTime: 15 // Default estimated time
        });


        showAlertWithMessage('Borrador guardado localmente', 'message');
        markAsSaved();
        
      } else if (course) {
        // Save as draft with current course
        const moduleTitle = `Borrador - ${course.title} - ${new Date().toLocaleDateString()}`;
        const moduleContent = JSON.stringify(elements);
        
        const draftModule = DraftModuleService.saveDraft({
          courseId: course.id,
          type: 'ACADEMIC',
          title: moduleTitle,
          content: moduleContent,
          estimatedTime: 15
        });


        showAlertWithMessage('Borrador guardado localmente', 'message');
        markAsSaved();
      } else {
        showAlertWithMessage('No se puede guardar el borrador: No hay curso seleccionado', 'error');
      }
    } catch (error: any) {
      // console.error('❌ Save draft failed:', error);
      showAlertWithMessage(
        `Error al guardar borrador: ${error.message || 'Error desconocido'}`, 
        'error'
      );
    }
  };

  const handlePublish = async () => {

    
    try {
      // Check if we're in module creation/editing context
      if (moduleContext.courseId) {
        const courseId = moduleContext.courseId;
        const moduleId = moduleContext.moduleId;
        const isNewModule = moduleContext.action === 'new-module' || !moduleId;

        // Generate module content from current elements
        const moduleTitle = elements.length > 0 
          ? `Nuevo Módulo - ${new Date().toLocaleDateString()}` 
          : `Módulo Vacío - ${new Date().toLocaleDateString()}`;
        const moduleContent = JSON.stringify(elements);
        


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
            type: 'ACADEMIC',
            title: moduleTitle,
            content: moduleContent
          });

          // Handle different response scenarios
          if (response.success) {

            showAlertWithMessage('Módulo publicado exitosamente', 'message');
            markAsSaved();
            
            // Navigate to modules page
            setTimeout(() => {
              window.location.href = `/modules?courseId=${courseId}`;
            }, 1500);
          } else {
            // console.error('❌ Module creation failed:', response.error);
            showAlertWithMessage(
              `Error al crear el módulo: ${response.error || 'Error desconocido'}`, 
              'error'
            );
          }
        } else {

          
          // Get the module type from URL parameters or load from API
          let moduleType = 'ACADEMIC'; // Default fallback
          let moduleStatus = 'PUBLISHED'; // Default fallback
          
          // Check URL parameters first
          const urlParams = new URLSearchParams(window.location.search);
          const courseIdFromUrl = urlParams.get('courseId');
          const moduleIdFromUrl = urlParams.get('moduleId');
          
          if (courseIdFromUrl && moduleIdFromUrl) {
            try {

              const moduleResponse = await import('../../actions/modules/modules').then(m => 
                m.getModuleById(courseIdFromUrl, moduleIdFromUrl)
              );
              
              if (moduleResponse.success && moduleResponse.data?.type) {
                moduleType = moduleResponse.data.type;

                
                // Also get the status if available
                if (moduleResponse.data.status) {
                  moduleStatus = moduleResponse.data.status;

                }
                

              } else {

              }
            } catch (error) {
              // console.error('❌ Error loading module type:', error);
            }
          }
          
          const updatePayload = {
            type: moduleType as 'ACADEMIC' | 'EVALUATIVE', // ✅ Use dynamically loaded type
            title: moduleTitle,
            content: moduleContent,
            status: moduleStatus as 'DRAFT' | 'PUBLISHED' | 'IN_REVIEW' // ✅ Include status since backend now uses it
          };
          
          
          const response = await updateModule(courseId, moduleId, updatePayload);

          // Handle different response scenarios for updates
          if (response.success) {
            showAlertWithMessage('Módulo actualizado exitosamente', 'message');
            markAsSaved();
            
            // Navigate to modules page
            setTimeout(() => {
              window.location.href = `/modules?courseId=${courseId}`;
            }, 1500);
          } else {
            // console.error('❌ Module update failed:', response.error);
            showAlertWithMessage(
              `Error al actualizar el módulo: ${response.error || 'Error desconocido'}`, 
              'error'
            );
          }
        }
      } else {
        showAlertWithMessage('No se puede publicar: No hay curso seleccionado', 'error');
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

  // Helper functions for alerts
  const showAlertWithMessage = (message: string, type: 'error' | 'message' | 'alert' = 'message') => {
    setAlertMessage(message);
    setAlertType(type);
    setShowAlert(true);
  };

  const restartAlert = () => {
    setShowAlert(false);
  };

  // Detect module context from URL parameters
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const courseId = urlParams.get('courseId');
    const moduleId = urlParams.get('moduleId');
    const action = urlParams.get('action');
    
    setModuleContext({ courseId, moduleId, action });
  }, []);

  return {
    moduleContext,
    showAlert,
    alertMessage,
    alertType,
    handleSaveDraft,
    handlePublish,
    showAlertWithMessage,
    restartAlert
  };
};
