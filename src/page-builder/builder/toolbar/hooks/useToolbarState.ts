import { useState, useEffect } from 'react';
import { getModuleById } from '../../../../actions/modules/modules';

export interface ModuleContext {
  courseId: string | null;
  moduleId: string | null;
  action: string | null;
  moduleType: 'ACADEMIC' | 'EVALUATIVE' | null;
  title: string | null;
  description: string | null;
}

export interface ConfirmModalState {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  variant?: 'danger' | 'warning' | 'info';
}

/**
 * Hook to manage all toolbar state
 */
export const useToolbarState = () => {
  const [showProjectsModal, setShowProjectsModal] = useState(false);
  const [showSaveNotification, setShowSaveNotification] = useState(false);
  
  // Module-related state
  const [moduleContext, setModuleContext] = useState<ModuleContext>({
    courseId: null,
    moduleId: null,
    action: null,
    moduleType: null,
    title: null,
    description: null
  });

  // Initialize module context from URL parameters
  useEffect(() => {
    const initializeModuleContext = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const courseId = urlParams.get('courseId');
      const moduleId = urlParams.get('moduleId');
      const action = urlParams.get('action');



      if (courseId && moduleId) {
        try {

          
          // Load the existing module data to get the type
          const moduleResponse = await getModuleById(courseId, moduleId);
          
          if (moduleResponse.success && moduleResponse.data) {
            const module = moduleResponse.data;
            

            
            // Set the module context with proper type information
            setModuleContext({
              courseId,
              moduleId,
              action: 'edit-module',
              moduleType: module.type || 'ACADEMIC',
              title: module.title || 'Módulo sin título',
              description: module.description || null
            });
            

            
          } else {
            // console.error('❌ Failed to load module data for toolbar:', moduleResponse.error);
            // Set basic context even if loading fails
            setModuleContext({
              courseId,
              moduleId,
              action: 'edit-module',
              moduleType: 'ACADEMIC',
              title: 'Módulo sin título',
              description: null
            });
          }
        } catch (error) {
          // console.error('❌ Error loading module data for toolbar:', error);
          // Set basic context even if loading fails
          setModuleContext({
            courseId,
            moduleId,
            action: 'edit-module',
            moduleType: 'ACADEMIC',
            title: 'Módulo sin título',
            description: null
          });
        }
      } else if (courseId) {
        // New module creation context
        setModuleContext({
          courseId,
          moduleId: null,
          action: 'new-module',
          moduleType: 'ACADEMIC',
          title: null,
          description: null
        });
      }
    };

    initializeModuleContext();
  }, []); // Run once on mount

  // Alert state
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState<'error' | 'message' | 'alert'>('message');
  
  // Preview modal state
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  
  const [confirmModal, setConfirmModal] = useState<ConfirmModalState>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {}
  });

  return {
    // Projects modal
    showProjectsModal,
    setShowProjectsModal,
    
    // Save notification
    showSaveNotification,
    setShowSaveNotification,
    
    // Module context
    moduleContext,
    setModuleContext,
    
    // Alert
    showAlert,
    setShowAlert,
    alertMessage,
    setAlertMessage,
    alertType,
    setAlertType,
    
    // Preview modal
    showPreviewModal,
    setShowPreviewModal,
    
    // Confirm modal
    confirmModal,
    setConfirmModal
  };
};
