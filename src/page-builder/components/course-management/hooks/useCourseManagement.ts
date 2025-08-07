import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router';
import { getCourses, type Course } from '../../../../actions/courses/get-courses';
import { deleteCourse } from '../../../../actions/courses/delete-course';
import { getUserData } from '../../../../actions/user/get-user-data';
import type { User } from '../../../../domain/entities/user';
import { useAuthStore } from '../../../../ui/store/auth/useAuthStore';
import { StorageAdapter } from '../../../../config/adapters/storage-adapter';
import { useInstitutionStatusFix } from '../../../../ui/utils/institutionStatusUtils';
import { useNotificationStore } from '../../../../ui/store/notification/useNotificationStore';
import { PageBuilderStorageService } from '../../../services/storageService';
import { DraftCourseService } from '../../../services/draftCourseService';

interface CourseManagementState {
  courses: Course[];
  userData: User | null;
  loading: boolean;
  selectedCourse: Course | null;
  courseToDelete: Course | null;
  showAlert: boolean;
  alertMessage: string;
  alertType: 'error' | 'message' | 'alert';
}

export const useCourseManagement = () => {
  
  const navigate = useNavigate();
  const { status, isInitialized, role } = useAuthStore();
  const { performStatusCheck } = useInstitutionStatusFix();
  const { addNotification } = useNotificationStore();



  const [state, setState] = useState<CourseManagementState>({
    courses: [],
    userData: null,
    loading: true,
    selectedCourse: null,
    courseToDelete: null,
    showAlert: false,
    alertMessage: '',
    alertType: 'message',
  });

  // Get the appropriate dashboard based on user role
  const getDashboardRoute = useCallback(() => {
    if (role === 'TUTOR') return '/tutor-dashboard';
    if (role === 'INSTITUTION_ADMIN') return '/institucion-dashboard';
    return '/home';
  }, [role]);

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

  // Monitor courses state changes
  useEffect(() => {

  }, [state.courses]);

  const loadInitialData = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true }));
    
    try {
      // Check authentication first
      const token = StorageAdapter.getItem('token');
      if (!token) {
        showAlertWithMessage('Sesión no encontrada. Por favor, inicia sesión nuevamente.', 'error');
        setTimeout(() => navigate('/login', { replace: true }), 2000);
        return;
      }

      // Check if token is expired
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const currentTime = Math.floor(Date.now() / 1000);
        const isExpired = payload.exp < currentTime;
        
        if (isExpired) {
          showAlertWithMessage('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.', 'error');
          setTimeout(() => navigate('/login', { replace: true }), 2000);
          return;
        }
      } catch (tokenError) {
        showAlertWithMessage('Error de autenticación. Por favor, inicia sesión nuevamente.', 'error');
        setTimeout(() => navigate('/login', { replace: true }), 2000);
        return;
      }

      // Load user data first
      const userDataResponse = await getUserData();

      if (userDataResponse) {
        setState(prev => ({ ...prev, userData: userDataResponse }));
      }

      // Load courses with better error handling
      const coursesResponse = await getCourses();

      if (coursesResponse.success) {
        const serverCourses = coursesResponse.data || [];
        
        // Load draft courses with error isolation
        let convertedDrafts: Course[] = [];
        try {
          const draftCourses = DraftCourseService.getAllDrafts();
          
          if (draftCourses.length > 0) {
            convertedDrafts = draftCourses.map(draft => {
              try {
                return DraftCourseService.convertDraftToCourse(draft);
              } catch (conversionError) {
                // console.error('❌ Error converting draft course:', draft.id, conversionError);
                return null;
              }
            }).filter((course): course is Course => course !== null);
          }
        } catch (draftError) {
          // console.error('❌ Error loading draft courses (continuing with server courses):', draftError);
          // Don't fail the entire load for draft errors
          convertedDrafts = [];
        }
        
        const allCourses = [...serverCourses, ...convertedDrafts];
        
        setState(prev => ({ ...prev, courses: allCourses }));
        
        // Clean up orphaned projects
        try {
          const validCourseIds = serverCourses.map(course => course.id);
          PageBuilderStorageService.cleanupOrphanedProjects(validCourseIds);
        } catch (cleanupError) {
          // console.warn('⚠️ Could not cleanup orphaned projects:', cleanupError);
        }
        
        // Perform institution status check for institution users
        if (role === 'INSTITUTION_ADMIN') {
          try {
            const statusResult = await performStatusCheck();
            if (statusResult.hasAssignedCourses && statusResult.backendStatus === 'PENDING') {
              // console.error('🚨 BACKEND ISSUE DETECTED: Institution has courses but backend status is PENDING');
              
              addNotification({
                message: 'Se detectó un problema de estado en el sistema. Los cursos están disponibles pero la institución aparece como pendiente.',
                type: 'alert',
                position: 'right-top',
                duration: 10000,
              });
            }
          } catch (statusError) {
            // console.error('❌ Status check failed:', statusError);
          }
        }
        
      } else {
        // Handle different error types
        if (coursesResponse.statusCode === 500) {
          // console.error('🔴 Server Error (500)');
          showAlertWithMessage(
            'Error del servidor. Por favor, intenta nuevamente en unos momentos.',
            'error'
          );
        } else if (coursesResponse.statusCode === 401 || coursesResponse.statusCode === 403) {
          // console.error('🔴 Authentication Error');
          showAlertWithMessage('Sesión expirada. Redirigiendo al login...', 'error');
          setTimeout(() => navigate('/login', { replace: true }), 2000);
        } else {
          // console.error('❌ Failed to load courses:', coursesResponse.error);
          showAlertWithMessage(
            `Error al cargar los cursos: ${coursesResponse.error || 'Error desconocido'}`,
            'error'
          );
        }
      }
    } catch (error) {
      // console.error('❌ Error loading initial data:', error);
      
      // Handle network errors
      if (error instanceof Error) {
        if (error.message.includes('fetch') || error.message.includes('NetworkError')) {
          showAlertWithMessage(
            'Error de conexión. Verifica tu conexión a internet.',
            'error'
          );
        } else if (error.message.includes('Authentication required')) {
          showAlertWithMessage('Sesión expirada. Redirigiendo al login...', 'error');
          setTimeout(() => navigate('/login', { replace: true }), 2000);
        } else {
          showAlertWithMessage(
            `Error inesperado: ${error.message}`,
            'error'
          );
        }
      } else {
        showAlertWithMessage('Error inesperado al cargar los datos', 'error');
      }
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  }, [navigate, role]); // Reduced dependencies to prevent infinite loops

  // Check authentication and load data
  useEffect(() => {
    
    if (!isInitialized) {
      return; // Wait for auth initialization
    }
    
    if (status !== 'SUCCESS') {
      showAlertWithMessage('Por favor, inicia sesión para continuar.', 'error');
      setTimeout(() => {
        navigate('/login', { replace: true });
      }, 2000);
      return;
    }

    // Clear any existing alerts when starting fresh
    restartAlert();
    
    // Load data
    loadInitialData();
  }, [status, isInitialized, role]); // Removed function dependencies that cause infinite loops

  // Remove the separate data loading effect to avoid cycles
  // useEffect(() => {
  //   if (status === 'SUCCESS' && isInitialized) {
  //     const token = StorageAdapter.getItem('token');
  //     if (token) {
  //       try {
  //         const payload = JSON.parse(atob(token.split('.')[1]));
  //         const currentTime = Math.floor(Date.now() / 1000);
  //         const isExpired = payload.exp < currentTime;
          
  //         if (!isExpired) {
  //           loadInitialData();
  //         }
  //       } catch (error) {
  //         console.error('🔍 CourseManagement: Error parsing token for data loading:', error);
  //       }
  //     }
  //   }
  // }, [status, isInitialized, loadInitialData]);


  const handleCourseCreated = (newCourse: Course) => {

    
    // If the course has a temporary ID, reload the data to get the real course
    if (String(newCourse.id).startsWith('created-')) {
      // Reload data to get the actual course from the server
      loadInitialData();
    } else {
      // Normal case with real course data
      setState(prev => ({ ...prev, courses: [newCourse, ...prev.courses] }));
    }
  };

  const handleCourseUpdated = (updatedCourse: Course) => {
    
    // Update the course in the local state
    setState(prev => ({
      ...prev,
      courses: prev.courses.map(course => 
        course.id === updatedCourse.id ? updatedCourse : course
      ),
      selectedCourse: null,
    }));
    
    // Don't reload data here to avoid infinite loops
    // The state update above is sufficient
  };

  const confirmDeleteCourse = async () => {
    if (!state.courseToDelete) return;

    try {
      
      // Check if this is a draft course (stored locally)
      if (String(state.courseToDelete.id).startsWith('draft-')) {
        const success = DraftCourseService.deleteDraft(state.courseToDelete.id);
        
        if (success) {
          // Remove course from local state
          setState(prev => ({
            ...prev,
            courses: prev.courses.filter(c => c.id !== prev.courseToDelete!.id),
            courseToDelete: null,
          }));
          
          return { success: true, message: `Borrador "${state.courseToDelete.title}" eliminado exitosamente` };
        } else {
          // console.error('❌ Failed to delete draft course');
          return { success: false, message: 'Error al eliminar el borrador' };
        }
      } else {
        // Handle server-side course deletion
        const result = await deleteCourse(state.courseToDelete.id);
        
        if (result.success) {
          // Remove course from local state
          setState(prev => ({
            ...prev,
            courses: prev.courses.filter(c => c.id !== prev.courseToDelete!.id),
            courseToDelete: null,
          }));
          
          // Also remove any associated saved projects/pages from local storage
          try {
            PageBuilderStorageService.deleteProject(state.courseToDelete.id);
          } catch (storageError) {
            // console.warn('⚠️ Could not remove saved project from local storage:', storageError);
            // Don't fail the course deletion if storage cleanup fails
          }
          return { success: true, message: `Curso "${state.courseToDelete.title}" eliminado exitosamente` };
        } else {
          // console.error('❌ Failed to delete course:', result.error);
          return { success: false, message: `Error al eliminar el curso: ${result.error}` };
        }
      }
    } catch (error) {
      // console.error('❌ Error deleting course:', error);
      return { success: false, message: 'Error inesperado al eliminar el curso' };
    } finally {
      setState(prev => ({ ...prev, courseToDelete: null }));
    }
  };

  return {
    ...state,
    navigate,
    getDashboardRoute,
    loadInitialData,
    handleCourseCreated,
    handleCourseUpdated,
    confirmDeleteCourse,
    showAlertWithMessage,
    restartAlert,
    setSelectedCourse: (course: Course | null) => setState(prev => ({ ...prev, selectedCourse: course })),
    setCourseToDelete: (course: Course | null) => setState(prev => ({ ...prev, courseToDelete: course })),
  };
};
