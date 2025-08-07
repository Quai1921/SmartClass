import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { getCourses, type Course } from '../../../../actions/courses/get-courses';
import { getModulesByCourse, updateModule, deleteModule, createModule, type Module } from '../../../../actions/modules/modules';
import { useAuthStore } from '../../../../ui/store/auth/useAuthStore';
import { StorageAdapter } from '../../../../config/adapters/storage-adapter';
import { testBackendConnectivity, testCoursesEndpoint, clearAllCaches } from '../../../../utils/debug-backend';
import { runCompleteVerification, displayVerificationResults } from '../../../../utils/verification-suite';
import inspectCurrentToken from '../../../../utils/inspect-token';
import { DraftModuleService } from '../../../services/draftModuleService';
import { DraftCourseService } from '../../../services/draftCourseService';

interface ModuleManagementState {
  course: Course | null;
  modules: Module[];
  loading: boolean;
  searchTerm: string;
  typeFilter: string;
  statusFilter: string;
  showAlert: boolean;
  alertMessage: string;
  alertType: 'error' | 'message' | 'alert';
  showConfirmation: boolean;
  moduleToDelete: string | null;
  showCreateModal: boolean;
  showEditModal: boolean;
  moduleToEdit: Module | null;
}

export const useModuleManagement = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { status, isInitialized, role } = useAuthStore();
  
  // Get courseId from URL parameters
  const courseId = searchParams.get('courseId');

  // Create initial state with placeholder course if courseId exists
  const getInitialState = (): ModuleManagementState => {
    const baseState: ModuleManagementState = {
      course: null,
      modules: [],
      loading: true,
      searchTerm: '',
      typeFilter: 'Todos los tipos',
      statusFilter: 'Todos los estados',
      showAlert: false,
      alertMessage: '',
      alertType: 'message',
      showConfirmation: false,
      moduleToDelete: null,
      showCreateModal: false,
      showEditModal: false,
      moduleToEdit: null,
    };

    // If we have courseId, set placeholder course for instant header
    if (courseId) {

    }

    return baseState;
  };

  const [state, setState] = useState<ModuleManagementState>(getInitialState());

  // Alert helper functions
  const showAlertWithMessage = useCallback((message: string, type: 'error' | 'message' | 'alert' = 'message') => {
    setState(prev => ({
      ...prev,
      alertMessage: message,
      alertType: type,
      showAlert: true
    }));
  }, []);

  const restartAlert = useCallback(() => {

    setState(prev => ({
      ...prev,
      showAlert: false,
      alertMessage: ''
    }));
  }, []);

  // Get the appropriate dashboard based on user role
  const getDashboardRoute = useCallback(() => {
    if (role === 'TUTOR') return '/tutor-dashboard';
    if (role === 'INSTITUTION_ADMIN') return '/institucion-dashboard';
    return '/home';
  }, [role]);

  // Check authentication before loading data
  useEffect(() => {

    
    // Debug token information
    const token = StorageAdapter.getItem('token');

    
    if (token) {
      try {
        // Check if token is expired
        const payload = JSON.parse(atob(token.split('.')[1]));
        const currentTime = Math.floor(Date.now() / 1000);
        const isExpired = payload.exp < currentTime;

        
        if (isExpired) {
          // console.error('❌ ModuleManagement: Token is EXPIRED! This is why we\'re being redirected to login');
          showAlertWithMessage('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.', 'error');
          setTimeout(() => {
            navigate('/login', { replace: true });
          }, 2000);
          return;
        }
      } catch (error) {
        // console.error('❌ ModuleManagement: Error parsing token:', error);
      }
    }
    
    if (!isInitialized) return; // Wait for auth initialization
    
    if (status !== 'SUCCESS') {
      // console.warn('❌ ModuleManagement: User not authenticated, redirecting to dashboard');
      navigate(getDashboardRoute(), { replace: true });
      return;
    }

    if (!token) {
      // console.warn('❌ ModuleManagement: No token found, redirecting to dashboard');
      navigate(getDashboardRoute(), { replace: true });
      return;
    }

    // Clear any existing alerts when starting fresh
    restartAlert();
    loadInitialData();
  }, [status, isInitialized, courseId, role]); // Removed function dependencies that cause infinite loops
  const loadInitialData = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true }));
    
    if (!courseId) {
      // console.warn('❌ ModuleManagement: No courseId provided, redirecting to courses');
      // Redirect back to appropriate courses page based on role
      if (role === 'TUTOR') {
        navigate('/courses', { replace: true });
      } else {
        navigate('/courses', { replace: true });
      }
      return;
    }

    try {
      
      // Create a placeholder course immediately so header can render
      const placeholderCourse: Course = {
        id: courseId,
        title: 'Cargando...',
        description: 'Cargando información del curso...',
        grade: '',
        subject: '',
        group: '',
        banner: '',
        status: 'DRAFT' as 'DRAFT' | 'PUBLISHED' | 'IN_REVIEW',
        createdAt: new Date().toISOString(),
        tutorName: ''
      };
      
      // Set placeholder course immediately for instant header
      setState(prev => ({ ...prev, course: placeholderCourse, loading: false }));
;
      
      // Simply check if token exists - let backend validate the format
      const token = StorageAdapter.getItem('token');

      
      if (!token) {
        // console.error('❌ No token found during data loading');
        showAlertWithMessage('Sesión no encontrada. Por favor, inicia sesión nuevamente.', 'error');
        setTimeout(() => navigate('/login', { replace: true }), 2000);
        return;
      }
      
      
      // First check if this is a draft course
      if (courseId.startsWith('draft-')) {
        const draftCourse = DraftCourseService.getDraft(courseId);
        
        if (draftCourse) {

          
          // Convert draft course to Course format for compatibility
          const courseForState: Course = {
            id: draftCourse.id,
            title: draftCourse.title,
            description: draftCourse.description,
            grade: String(draftCourse.grade), // Convert number to string
            subject: draftCourse.subject || '',
            group: draftCourse.group || '',
            banner: draftCourse.banner || '',
            status: 'DRAFT' as 'DRAFT' | 'PUBLISHED' | 'IN_REVIEW',
            createdAt: draftCourse.createdAt,
            tutorName: 'Draft' // Default value since it's required
          };
          
          // Replace placeholder with real course data
          setState(prev => ({ ...prev, course: courseForState }));

          
          // Load draft modules for this course

          
          // Set loading back to true just for modules
          setState(prev => ({ ...prev, loading: true }));
          await loadModulesForCourse(courseId);
          return;
        } else {
          // console.error('❌ Draft course not found with ID:', courseId);
          showAlertWithMessage('Curso borrador no encontrado', 'error');
          setTimeout(() => {
            navigate('/courses', { replace: true });
          }, 2000);
          return;
        }
      }
      
      // Add timestamp to track this specific request
      const requestId = Date.now();
      
      // Load courses data
      const coursesResponse = await getCourses();
      

      if (coursesResponse.success && coursesResponse.data) {
        // Convert courseId to string for comparison since URL params are always strings
        // but API might return numeric IDs
        const foundCourse = coursesResponse.data.find((c: Course) => String(c.id) === String(courseId));
        if (foundCourse) {
          
          // Replace placeholder with real course data
          setState(prev => ({ ...prev, course: foundCourse }));
          
          // Load modules for this course (but course is already set)
          
          // Set loading back to true just for modules
          setState(prev => ({ ...prev, loading: true }));
          await loadModulesForCourse(courseId);
        } else {
          // console.error('❌ Course not found with ID:', courseId);
          showAlertWithMessage('Curso no encontrado', 'error');
          // Redirect to appropriate courses page
          setTimeout(() => {
            if (role === 'TUTOR') {
              navigate('/courses', { replace: true });
            } else {
              navigate('/courses', { replace: true });
            }
          }, 2000);
          return;
        }
      } else {
        // console.error(`❌ [Request ${requestId}] Error loading courses:`, coursesResponse.error, 'Status:', coursesResponse.statusCode);
        
        // Handle specific error cases
        if (coursesResponse.statusCode === 500) {
          // console.error(`🔴 [Request ${requestId}] 500 Error - checking if this is a JWT/auth issue`);
          // console.error(`🔴 [Request ${requestId}] Backend is returning 500 for /api/courses`);
          
          // Check if the error message indicates JWT/token issues
          if (coursesResponse.error?.includes('Invalid token') || 
              coursesResponse.error?.includes('JWT') ||
              coursesResponse.error?.includes('token was expected to have 3 parts')) {
            // console.error(`🔴 [Request ${requestId}] This is a JWT token issue!`);
            showAlertWithMessage(
              'Token de sesión inválido. Por favor, inicia sesión nuevamente.', 
              'error'
            );
            setTimeout(() => navigate('/login', { replace: true }), 2000);
          } else {
            showAlertWithMessage(
              'Error del servidor: Hay un problema con la API de cursos. Por favor, verifica la configuración del backend.', 
              'error'
            );
          }
        } else if (coursesResponse.statusCode === 401 || coursesResponse.statusCode === 403) {
          // console.error(`🔴 [Request ${requestId}] Authentication/Authorization error`);
          showAlertWithMessage(
            'Sesión expirada o sin permisos. Redirigiendo al login...', 
            'error'
          );
          setTimeout(() => navigate('/login', { replace: true }), 2000);
        } else {
          showAlertWithMessage(
            `Error al cargar los cursos: ${coursesResponse.error || 'Error desconocido'}`, 
            'error'
          );
        }
        
        // Redirect to dashboard on error
        setTimeout(() => {
          navigate(getDashboardRoute(), { replace: true });
        }, 2000);
      }
    } catch (error: any) {
      // console.error('❌ Error loading initial data:', error);
      // console.error('❌ Full error object:', JSON.stringify(error, null, 2));
      
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
      } else if (error.message?.includes('Invalid token') || 
                 error.message?.includes('JWT') ||
                 error.message?.includes('token was expected to have 3 parts')) {
        // console.error('❌ JWT/Authentication error caught:', error.message);
        showAlertWithMessage(
          'Token de sesión inválido. Redirigiendo al login...', 
          'error'
        );
        setTimeout(() => navigate('/login', { replace: true }), 2000);
        return; // Don't redirect to dashboard, go to login instead
      } else {
        showAlertWithMessage(
          `Error inesperado: ${error.message || 'Error desconocido'}`, 
          'error'
        );
      }
      
      // On error, redirect to dashboard after showing message
      setTimeout(() => {
        navigate(getDashboardRoute(), { replace: true });
      }, 3000);
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  }, [courseId, role]); // Reduced dependencies to prevent infinite loops

  // Load modules for this course using direct course endpoint (more efficient)
  const loadModulesForCourse = useCallback(async (courseId: string) => {
    try {
      
      // Handle draft courses separately
      if (courseId.startsWith('draft-')) {
        
        // For draft courses, only load draft modules (no backend call)
        const draftModules = DraftModuleService.getDraftsByCourse(courseId);

        // Convert draft modules to the expected format
        const modules: Module[] = draftModules.map(draft => ({
          id: draft.id,
          courseId: draft.courseId,
          type: draft.type,
          title: draft.title,
          content: draft.content,
          order: draft.order,
          status: 'DRAFT' as 'DRAFT' | 'PUBLISHED' | 'IN_REVIEW',
          createdAt: draft.createdAt,
          estimatedTime: draft.estimatedTime,
        }));

        setState(prev => ({ 
          ...prev, 
          modules,
          loading: false 
        }));
        
        // Show a friendly message for draft courses
        if (draftModules.length === 0) {
          showAlertWithMessage(
            'Trabajando en un borrador de curso - Crea tu primer módulo para comenzar', 
            'message'
          );
        } else {
          showAlertWithMessage(
            `Trabajando en un borrador de curso con ${draftModules.length} módulo${draftModules.length > 1 ? 's' : ''}`, 
            'message'
          );
        }
        
        return;
      }
      
      // Handle published courses - call the API

      
      const startTime = performance.now();
      const response = await getModulesByCourse(courseId);
      const endTime = performance.now();
      
      
      if (response.success && response.data) {


        // Get draft modules for this course
        const draftModules = DraftModuleService.getDraftsByCourse(courseId);


        // Combine backend modules and draft modules
        const allModules: Module[] = [
          ...response.data,
          ...draftModules.map(draft => ({
            id: draft.id,
            courseId: draft.courseId,
            type: draft.type,
            title: draft.title,
            content: draft.content,
            order: draft.order,
            status: 'DRAFT' as 'DRAFT' | 'PUBLISHED' | 'IN_REVIEW',
            createdAt: draft.createdAt,
            estimatedTime: draft.estimatedTime,
          }))
        ];
        
        setState(prev => ({ ...prev, modules: allModules }));
        
        // Check if there's an error message even with success (SQL schema issue)
        if (response.error && response.error.includes('base de datos')) {
          showAlertWithMessage(response.error, 'alert');
        }
        
        // Clear any previous error states on successful load
        if (state.showAlert && !response.error) {
          restartAlert();
        }
      } else {
        // console.error('❌ Error loading modules:', response.error, 'Status:', response.statusCode);
        // console.error('🔍 [DEBUG] Full error response:', {
        //   success: response.success,
        //   statusCode: response.statusCode,
        //   error: response.error,
        //   data: response.data
        // });
        
        if (response.statusCode === 404) {
          // console.warn('� [DEBUG] 404 - No modules found for this course, setting empty array');
          setState(prev => ({ ...prev, modules: [] }));
        } else if (response.statusCode === 500) {
          // console.warn('� [DEBUG] 500 - Server error, setting empty array as fallback');
          setState(prev => ({ ...prev, modules: [] }));
          showAlertWithMessage(
            'Error del servidor: No se pudieron cargar los módulos. La base de datos puede estar temporalmente no disponible.', 
            'error'
          );
        } else {
          // console.warn('� [DEBUG] Other error, setting empty modules array as fallback');
          setState(prev => ({ ...prev, modules: [] }));
          // Show error message to user for other non-404 errors
          showAlertWithMessage(
            `Error al cargar los módulos: ${response.error || 'Error desconocido'}`, 
            'error'
          );
        }
      }
    } catch (error: any) {
      // console.error('❌ Exception loading modules:', error);
      // console.error('🔍 [DEBUG] Exception details:', {
      //   name: error.name,
      //   message: error.message,
      //   stack: error.stack,
      //   type: typeof error
      // });
      // console.warn('� [DEBUG] Setting empty modules array as fallback due to exception');
      
      setState(prev => ({ ...prev, modules: [] }));
      
      // Handle different types of exceptions
      if (error.name === 'NetworkError' || error.message?.includes('fetch')) {
        showAlertWithMessage(
          'Error de conexión: No se pudieron cargar los módulos. Verifica tu conexión a internet.', 
          'error'
        );
      } else {
        showAlertWithMessage(
          `Error inesperado al cargar los módulos: ${error.message || 'Error desconocido'}`, 
          'error'
        );
      }
    } finally {
    }
  }, [state.showAlert]); // Removed function dependencies

  // Refresh modules when user returns to the page (e.g., from page builder)
  useEffect(() => {
    const handleFocus = () => {
      if (courseId && !state.loading) {
        loadModulesForCourse(courseId);
      }
    };

    const handleVisibilityChange = () => {
      if (!document.hidden && courseId && !state.loading) {
        setTimeout(() => {
          loadModulesForCourse(courseId);
        }, 500); // Small delay to ensure page is fully visible
      }
    };

    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [courseId]); // Removed function dependencies

  // Navigation handlers
  const handleBackToCourses = useCallback(() => {

    
    // Navigate to appropriate courses page based on role
    if (role === 'TUTOR') {
      navigate('/courses');
    } else {
      navigate('/courses');
    }
  }, [state.course, role]); // Removed navigate dependency

  const handleCreateModule = useCallback(() => {
    if (!state.course) return;
    // Show the create module modal
    setState(prev => ({
      ...prev,
      showCreateModal: true
    }));
  }, [state.course]);

  const handleCreateModuleWithType = useCallback(async (type: 'ACADEMIC' | 'EVALUATIVE', title: string, description?: string) => {
    if (!state.course) {
      // console.error('❌ No course available for module creation');
      showAlertWithMessage('Error: No hay curso seleccionado', 'error');
      return;
    }

    
    try {
      // Create the module via API first
      const moduleData = {
        type,
        title,
        content: '', // Start with empty content, will be filled in page builder
        description: description || '',
        status: 'DRAFT' as 'DRAFT' | 'PUBLISHED' | 'IN_REVIEW'
      };

      const response = await createModule(state.course.id, moduleData);

      if (response.success) {
        showAlertWithMessage(`Módulo "${title}" creado exitosamente`, 'message');
        
        // Navigate to page builder with the new module
        // Use a special ID to indicate this is a newly created module
        const params = new URLSearchParams({
          courseId: state.course.id,
          action: 'edit-module',
          moduleType: type,
          title: title,
          newModule: 'true' // Flag to indicate this is a newly created module
        });
        
        // Add description if provided
        if (description) {
          params.set('description', description);
        }
        
        navigate(`/page-builder?${params.toString()}`);
      } else {
        // console.error('❌ Module creation failed:', response.error);
        showAlertWithMessage(`Error al crear el módulo: ${response.error}`, 'error');
      }
    } catch (error) {
      // console.error('❌ Exception during module creation:', error);
      showAlertWithMessage(
        `Error inesperado al crear el módulo: ${error instanceof Error ? error.message : 'Error desconocido'}`, 
        'error'
      );
    }
  }, [state.course]); // Removed function dependencies

  const closeCreateModal = useCallback(() => {
    setState(prev => ({
      ...prev,
      showCreateModal: false
    }));
  }, []);

  const handleEditModule = useCallback((moduleId: string) => {
    if (!state.course) return;
    // Navigate to page builder to edit specific module
    navigate(`/page-builder?courseId=${state.course.id}&moduleId=${moduleId}`);
  }, [state.course]); // Removed navigate dependency

  // Quick edit modal functions
  const handleQuickEditModule = useCallback((moduleId: string) => {
    const module = state.modules.find(m => m.id === moduleId);
    if (module) {
      setState(prev => ({
        ...prev,
        moduleToEdit: module,
        showEditModal: true
      }));
    }
  }, [state.modules]);

  const closeEditModal = useCallback(() => {
    setState(prev => ({
      ...prev,
      showEditModal: false,
      moduleToEdit: null
    }));
  }, []);

  const handleSaveModuleChanges = useCallback(async (moduleId: string, updates: { title: string; description: string; status: string }) => {
    if (!state.course) throw new Error('No course available');


    const response = await updateModule(state.course.id, moduleId, {
      type: state.moduleToEdit?.type || 'ACADEMIC',
      title: updates.title,
      description: updates.description,
      content: state.moduleToEdit?.content || '', // Keep existing content
      status: updates.status as 'DRAFT' | 'PUBLISHED' | 'IN_REVIEW'
    });

    if (response.success) {
      // Update the module in local state
      setState(prev => ({
        ...prev,
        modules: prev.modules.map(m => 
          m.id === moduleId 
            ? { ...m, title: updates.title, description: updates.description, status: updates.status as any }
            : m
        )
      }));
      showAlertWithMessage('Módulo actualizado exitosamente', 'message');
    } else {
      // console.error('❌ Error updating module:', response.error);
      throw new Error(response.error || 'Error al actualizar el módulo');
    }
  }, [state.course, state.moduleToEdit]); // Removed function dependency

  // Module management operations
  const handleDeleteModule = useCallback((moduleId: string) => {
    setState(prev => ({
      ...prev,
      moduleToDelete: moduleId,
      showConfirmation: true
    }));
  }, []);

  const confirmDeleteModule = useCallback(async () => {
    if (!state.course || !state.moduleToDelete) return;
    
    try {
      
      // Check if it's a draft module
      if (state.moduleToDelete.startsWith('draft-')) {
        const success = DraftModuleService.deleteDraft(state.moduleToDelete);
        
        if (success) {
          setState(prev => ({
            ...prev,
            modules: prev.modules.filter(m => m.id !== state.moduleToDelete),
            showConfirmation: false,
            moduleToDelete: null
          }));
          showAlertWithMessage('Borrador eliminado correctamente', 'message');
        } else {
          // console.error('❌ Error deleting draft module');
          showAlertWithMessage('Error al eliminar el borrador', 'error');
        }
      } else {
        // Delete from backend
        const response = await deleteModule(state.course.id, state.moduleToDelete);
        
        if (response.success) {
          setState(prev => ({
            ...prev,
            modules: prev.modules.filter(m => m.id !== state.moduleToDelete),
            showConfirmation: false,
            moduleToDelete: null
          }));
          showAlertWithMessage('Módulo eliminado correctamente', 'message');
        } else {
          // console.error('❌ Error deleting module:', response.error);
          showAlertWithMessage('Error al eliminar el módulo: ' + response.error, 'error');
        }
      }
    } catch (error) {
      // console.error('❌ Exception deleting module:', error);
      showAlertWithMessage('Error inesperado al eliminar el módulo', 'error');
    } finally {
      setState(prev => ({
        ...prev,
        showConfirmation: false,
        moduleToDelete: null
      }));
    }
  }, [state.course, state.moduleToDelete]); // Removed function dependency

  const cancelDeleteModule = useCallback(() => {
    setState(prev => ({
      ...prev,
      showConfirmation: false,
      moduleToDelete: null
    }));
  }, []);

  const handlePublishModule = useCallback(async (moduleId: string) => {
    if (!state.course) return;
    
    const module = state.modules.find(m => m.id === moduleId);
    if (!module) return;
    
    try {
      
      // Send the current module data along with the toggled status
      const newStatus = module.status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED';
      const response = await updateModule(state.course.id, moduleId, {
        type: module.type,
        title: module.title,
        content: module.content || '', // Ensure content is not undefined
        status: newStatus, // Toggle the status
      });
      
      if (response.success) {
        // Toggle the local state for status - prevents hard refresh
        setState(prev => ({
          ...prev,
          modules: prev.modules.map(m => 
            m.id === moduleId ? { ...m, status: newStatus } : m
          )
        }));
        showAlertWithMessage(
          module.status === 'PUBLISHED' ? 'Módulo despublicado' : 'Módulo publicado', 
          'message'
        );
      } else {
        // console.error('❌ Error updating module:', response.error);
        showAlertWithMessage('Error al actualizar el módulo: ' + response.error, 'error');
      }
    } catch (error) {
      // console.error('❌ Exception updating module:', error);
      showAlertWithMessage('Error inesperado al actualizar el módulo', 'error');
    }
  }, [state.course, state.modules]); // Removed function dependency

  // Force refresh function to clear any cached errors
  const forceRefresh = useCallback(async () => {
    
    // Clear all alert states immediately
    restartAlert();
    setState(prev => ({ 
      ...prev, 
      showAlert: false, 
      alertMessage: '',
      loading: true
    }));
    
    // DON'T clear caches during refresh - this might be removing tokens
    // clearAllCaches();
    
    // Simply check if token exists - let backend validate the format
    const token = StorageAdapter.getItem('token');
    
    if (!token) {
      // console.error('❌ No token found during force refresh');
      showAlertWithMessage('Sesión no encontrada. Por favor, inicia sesión nuevamente.', 'error');
      setTimeout(() => navigate('/login', { replace: true }), 2000);
      setState(prev => ({ ...prev, loading: false }));
      return;
    }
    
    // Simply call loadInitialData which already has all the proper error handling
    try {
      await loadInitialData();
      // Only show success message if no other alert was set during loading
      setTimeout(() => {
        setState(prev => {
          if (!prev.showAlert) {
            showAlertWithMessage('Datos actualizados correctamente', 'message');
          }
          return prev;
        });
      }, 100);
    } catch (error: any) {
      // console.error('❌ Error during force refresh:', error);
      
      // Handle specific authentication errors
      if (error.message?.includes('Invalid token') || error.message?.includes('JWT')) {
        showAlertWithMessage('Token de sesión inválido. Redirigiendo al login...', 'error');
        setTimeout(() => navigate('/login', { replace: true }), 2000);
      } else if (error.message?.includes('401') || error.message?.includes('403')) {
        showAlertWithMessage('Sesión expirada. Redirigiendo al login...', 'error');
        setTimeout(() => navigate('/login', { replace: true }), 2000);
      } else {
        showAlertWithMessage('Error durante la actualización: ' + error.message, 'error');
      }
    }
  }, [courseId]); // Removed function dependencies

  // Debug function to test backend connectivity
  const runDebugTests = useCallback(async () => {
    
    // First, inspect the current token
    const tokenInfo = inspectCurrentToken();
    
    const connectivityTest = await testBackendConnectivity();
    
    const coursesTest = await testCoursesEndpoint();
    
    // Test with real token
    const token = StorageAdapter.getItem('token');

    
    if (token) {
      try {
        const response = await fetch('http://localhost:8080/api/courses', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          }
        });
        
        const responseText = await response.text();
        
        if (tokenInfo && tokenInfo.isExpired) {
          showAlertWithMessage(
            `Debug: Token is EXPIRED! Expired ${Math.abs(tokenInfo.timeUntilExpirySeconds)} seconds ago`, 
            'error'
          );
        } else {
          showAlertWithMessage(
            `Debug: Status ${response.status} - ${response.status === 500 ? 'Backend error (500)' : 'Other error'}`, 
            response.status === 500 ? 'error' : 'alert'
          );
        }
      } catch (error: any) {
        // console.error('🔑 Real token test failed:', error);
        showAlertWithMessage(`Debug: Request failed - ${error.message}`, 'error');
      }
    } else {
      showAlertWithMessage('Debug: No authentication token found', 'error');
    }
    
    clearAllCaches();
  }, []); // Removed function dependency

  // Comprehensive verification function
  const runFullVerification = useCallback(async () => {
    showAlertWithMessage('Ejecutando verificación completa...', 'message');
    
    try {
      const results = await runCompleteVerification(courseId || '1');
      displayVerificationResults(results);
      
      const passedCount = results.filter(r => r.success).length;
      const totalCount = results.length;
      
      showAlertWithMessage(
        `Verificación completa: ${passedCount}/${totalCount} pruebas pasaron. Ver consola para detalles.`,
        passedCount === totalCount ? 'message' : 'alert'
      );
    } catch (error: any) {
      // console.error('❌ Verification suite failed:', error);
      showAlertWithMessage(`Error en verificación: ${error.message}`, 'error');
    }
  }, [courseId]); // Removed function dependency

  // Search functionality
  const setSearchTerm = useCallback((term: string) => {
    setState(prev => ({ ...prev, searchTerm: term }));
  }, []);

  const setTypeFilter = useCallback((type: string) => {
    setState(prev => ({ ...prev, typeFilter: type }));
  }, []);

  const setStatusFilter = useCallback((status: string) => {
    setState(prev => ({ ...prev, statusFilter: status }));
  }, []);

  // Filter modules based on search term, type, and status
  const filteredModules = state.modules.filter(module => {
    const searchLower = state.searchTerm.toLowerCase();
    const matchesSearch = (
      module.title.toLowerCase().includes(searchLower) ||
      (module.content && module.content.toLowerCase().includes(searchLower)) ||
      module.type.toLowerCase().includes(searchLower)
    );

    const matchesType = state.typeFilter === 'Todos los tipos' || 
                       module.type === state.typeFilter;

    const matchesStatus = state.statusFilter === 'Todos los estados' ||
                         (state.statusFilter === 'Publicado' && module.status === 'PUBLISHED') ||
                         (state.statusFilter === 'Borrador' && module.status === 'DRAFT');

    return matchesSearch && matchesType && matchesStatus;
  });

  // Draft functionality
  const saveDraft = useCallback(async (moduleData: {
    courseId: string;
    type: 'ACADEMIC' | 'EVALUATIVE';
    title: string;
    content: string;
    order?: number;
    estimatedTime?: number;
  }) => {
    try {
      const draft = DraftModuleService.saveDraft(moduleData);
      
      // Update the modules list to include the new draft
      setState(prev => ({
        ...prev,
        modules: [...prev.modules, {
          id: draft.id,
          courseId: draft.courseId,
          type: draft.type,
          title: draft.title,
          content: draft.content,
          order: draft.order,
          status: 'DRAFT' as 'DRAFT' | 'PUBLISHED' | 'IN_REVIEW',
          createdAt: draft.createdAt,
          estimatedTime: draft.estimatedTime,
        }]
      }));
      
      showAlertWithMessage('Borrador guardado correctamente', 'message');
      return draft;
    } catch (error) {
      // console.error('❌ Error saving draft:', error);
      showAlertWithMessage('Error al guardar el borrador', 'error');
      throw error;
    }
  }, []); // Removed function dependency

  return {
    // State
    ...state,
    courseId,
    isInitialized,
    role,
    filteredModules,
    
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
    runDebugTests,
    runFullVerification,
    saveDraft,
  };
};
