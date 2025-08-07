import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { 
  Plus, 
  Search, 
  BookOpen, 
  Edit3, 
  Eye,
  ArrowLeft,
  Calendar,
  Clock,
  Trash2
} from 'lucide-react';
import { getCourses, type Course } from '../../actions/courses/get-courses';
import { getModules, updateModule, deleteModule, type Module } from '../../actions/modules/modules';
import { ToastProvider } from '../context/ToastContext';
import { LoadingSpinner } from './LoadingSpinner';
import { useAuthStore } from '../../ui/store/auth/useAuthStore';
import { StorageAdapter } from '../../config/adapters/storage-adapter';
import Alert from '../../ui/components/Alert';
import { ConfirmationModal } from './ConfirmationModal';
import { testBackendConnectivity, testCoursesEndpoint, clearAllCaches } from '../../utils/debug-backend';
import { runCompleteVerification, displayVerificationResults } from '../../utils/verification-suite';
import inspectCurrentToken from '../../utils/inspect-token';
import '../styles/course-management.css';

export const ModuleManagementPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { status, isInitialized, role } = useAuthStore();
  const [course, setCourse] = useState<Course | null>(null);
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Alert state management
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState<'error' | 'message' | 'alert'>('message');

  // Confirmation modal state
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [moduleToDelete, setModuleToDelete] = useState<string | null>(null);

  // Get courseId from URL parameters
  const courseId = searchParams.get('courseId');

  // Alert helper functions
  const showAlertWithMessage = (message: string, type: 'error' | 'message' | 'alert' = 'message') => {
    setAlertMessage(message);
    setAlertType(type);
    setShowAlert(true);
  };

  const restartAlert = () => {
    setShowAlert(false);
    setAlertMessage('');
  };

  // Get the appropriate dashboard based on user role
  const getDashboardRoute = () => {
    if (role === 'TUTOR') return '/tutor-dashboard';
    if (role === 'INSTITUTION_ADMIN') return '/institucion-dashboard';
    return '/home';
  };

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
  }, [status, isInitialized, courseId, navigate, role]);

  const loadInitialData = async () => {
    setLoading(true);
    
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
      
      // Add timestamp to track this specific request
      const requestId = Date.now();
      
      // Load courses data
      const coursesResponse = await getCourses();
      


      if (coursesResponse.success && coursesResponse.data) {

        // Convert courseId to string for comparison since URL params are always strings
        // but API might return numeric IDs
        const foundCourse = coursesResponse.data.find((c: Course) => String(c.id) === String(courseId));
        if (foundCourse) {

          setCourse(foundCourse);
          // Load modules for this course

          loadModulesForCourse(courseId);
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
          // console.error(`🔴 [Request ${requestId}] 500 Error - this is likely where the database error is coming from`);
          // console.error(`🔴 [Request ${requestId}] Backend is returning 500 for /api/courses - this is a backend issue, not a database issue`);
          showAlertWithMessage(
            'Error del servidor: Hay un problema con la API de cursos. Por favor, verifica la configuración del backend.', 
            'error'
          );
        } else if (coursesResponse.statusCode === 401 || coursesResponse.statusCode === 403) {
          showAlertWithMessage(
            'No tienes permisos para acceder a los cursos.', 
            'error'
          );
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
      setLoading(false);
    }
  };

  // Load modules for this course using real API
  const loadModulesForCourse = async (courseId: string) => {
    try {
      const response = await getModules(courseId);
      
      if (response.success && response.data) {

        setModules(response.data);
        // Clear any previous error states on successful load
        if (showAlert) {
          restartAlert();
        }
      } else {
        // console.error('❌ Error loading modules:', response.error, 'Status:', response.statusCode);
        
        if (response.statusCode === 404) {
          // console.warn('📄 No modules found for this course (404), setting empty array');
          setModules([]);
        } else if (response.statusCode === 500) {
          // console.warn('📄 Server error (500), setting empty array as fallback');
          setModules([]);
          showAlertWithMessage(
            'Error del servidor: No se pudieron cargar los módulos. La base de datos puede estar temporalmente no disponible.', 
            'error'
          );
        } else {
          // console.warn('📄 Setting empty modules array as fallback');
          setModules([]);
          // Show error message to user for other non-404 errors
          showAlertWithMessage(
            `Error al cargar los módulos: ${response.error || 'Error desconocido'}`, 
            'error'
          );
        }
      }
    } catch (error: any) {
      // console.error('❌ Exception loading modules:', error);
      // console.warn('📄 Setting empty modules array as fallback');
      setModules([]);
      
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
    }
  };

  // Force refresh function to clear any cached errors
  const forceRefresh = async () => {
    
    // Clear all alert states immediately
    restartAlert();
    setShowAlert(false);
    setAlertMessage('');
    
    // Clear caches
    clearAllCaches();
    
    // Reset loading state
    setLoading(true);
    
    // Reload course and modules data fresh
    if (courseId) {
      try {
        // First reload course data
        const coursesResponse = await getCourses();
        if (coursesResponse.success && coursesResponse.data) {
          const foundCourse = coursesResponse.data.find((c: Course) => String(c.id) === String(courseId));
          if (foundCourse) {
            setCourse(foundCourse);
            // Then reload modules
            await loadModulesForCourse(courseId);
            showAlertWithMessage('Datos actualizados correctamente', 'message');
          } else {
            showAlertWithMessage('Curso no encontrado después de actualizar', 'error');
          }
        } else {
          showAlertWithMessage('Error al actualizar los cursos', 'error');
        }
      } catch (error: any) {
        // console.error('❌ Error during force refresh:', error);
        showAlertWithMessage('Error durante la actualización: ' + error.message, 'error');
      } finally {
        setLoading(false);
      }
    }
  };

  // Debug function to test backend connectivity
  const runDebugTests = async () => {
    
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
  };

  // Comprehensive verification function
  const runFullVerification = async () => {
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
  };

  const handleBackToCourses = () => {

    
    // Navigate to appropriate courses page based on role
    if (role === 'TUTOR') {
      navigate('/courses');
    } else {
      navigate('/courses');
    }
  };

  const handleCreateModule = () => {
    if (!course) return;
    // Navigate to page builder to create new module
    navigate(`/page-builder?courseId=${course.id}&action=new-module`);
  };

  const handleEditModule = (moduleId: string) => {
    if (!course) return;
    // Navigate to page builder to edit specific module
    navigate(`/page-builder?courseId=${course.id}&moduleId=${moduleId}`);
  };

  const handleDeleteModule = (moduleId: string) => {
    setModuleToDelete(moduleId);
    setShowConfirmation(true);
  };

  const confirmDeleteModule = async () => {
    if (!course || !moduleToDelete) return;
    
    try {

      const response = await deleteModule(course.id, moduleToDelete);
      
      if (response.success) {

        setModules(prev => prev.filter(m => m.id !== moduleToDelete));
        showAlertWithMessage('Módulo eliminado correctamente', 'message');
      } else {
        // console.error('❌ Error deleting module:', response.error);
        showAlertWithMessage('Error al eliminar el módulo: ' + response.error, 'error');
      }
    } catch (error) {
      // console.error('❌ Exception deleting module:', error);
      showAlertWithMessage('Error inesperado al eliminar el módulo', 'error');
    } finally {
      setShowConfirmation(false);
      setModuleToDelete(null);
    }
  };

  const cancelDeleteModule = () => {
    setShowConfirmation(false);
    setModuleToDelete(null);
  };

  const handlePublishModule = async (moduleId: string) => {
    if (!course) return;
    
    const module = modules.find(m => m.id === moduleId);
    if (!module) return;
    
    try {

      
      // Send the current module data along with the toggled published status
      const response = await updateModule(course.id, moduleId, {
        type: module.type,
        title: module.title,
        description: module.description,
        content: module.content || '', // Ensure content is not undefined
        published: !module.published, // Toggle the published status
      });
      
      if (response.success) {

        // Toggle the local state for published status
        setModules(prev => prev.map(m => 
          m.id === moduleId ? { ...m, published: !m.published } : m
        ));
        showAlertWithMessage(
          module.published ? 'Módulo despublicado' : 'Módulo publicado', 
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
  };

  const filteredModules = modules.filter(module => {
    const searchLower = searchTerm.toLowerCase();
    return (
      module.title.toLowerCase().includes(searchLower) ||
      (module.content && module.content.toLowerCase().includes(searchLower)) ||
      module.type.toLowerCase().includes(searchLower)
    );
  });

  // Show loading spinner while auth is initializing
  if (!isInitialized) {

    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner />
          <p className="text-white mt-4">Inicializando autenticación...</p>
        </div>
      </div>
    );
  }

  if (loading) {

    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner />
          <p className="text-white mt-4">Cargando módulos...</p>
        </div>
      </div>
    );
  }

  if (!course) {

    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-center">
          <h2 className="text-2xl font-bold mb-4">Curso no encontrado</h2>
          <button 
            onClick={handleBackToCourses}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            Volver a Cursos
          </button>
        </div>
      </div>
    );
  }



  return (
    <ToastProvider>
      <div className="min-h-screen bg-gray-900">
        {/* Header */}
        <div className="bg-gray-800 border-b border-gray-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleBackToCourses}
                className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
              >
                <ArrowLeft size={20} />
                <span>Volver a cursos</span>
              </button>
              
              <div className="border-l border-gray-600 pl-4">
                <h1 className="text-2xl font-bold text-white">{course.title}</h1>
                <p className="text-gray-400 text-sm">
                  {course.description} • Grado {course.grade}
                  {course.group && ` • Grupo ${course.group}`}
                  {course.subject && ` • ${course.subject}`}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={handleCreateModule}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
              >
                <Plus size={20} />
                <span>Nuevo Módulo</span>
              </button>
              
              <button
                onClick={forceRefresh}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
                title="Actualizar módulos"
              >
                <svg 
                  className="w-4 h-4" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" 
                  />
                </svg>
                <span>Actualizar</span>
              </button>
              
              <button
                onClick={runDebugTests}
                className="bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-2 rounded-lg flex items-center space-x-1 transition-colors text-sm"
                title="Ejecutar diagnósticos de conectividad"
              >
                <svg 
                  className="w-4 h-4" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" 
                  />
                </svg>
                <span>Debug</span>
              </button>
              
              <button
                onClick={runFullVerification}
                className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg flex items-center space-x-1 transition-colors text-sm"
                title="Ejecutar verificación completa del sistema"
              >
                <svg 
                  className="w-4 h-4" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" 
                  />
                </svg>
                <span>Verificar</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-6">
          {/* Search and Filters */}
          <div className="mb-6">
            <div className="relative max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Buscar módulos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Modules Grid */}
          {filteredModules.length === 0 ? (
            <div className="text-center py-20">
              <BookOpen size={64} className="mx-auto text-gray-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-300 mb-2">Sin módulos</h3>
              <p className="text-gray-500 mb-6">
                {searchTerm ? 'No se encontraron módulos que coincidan con tu búsqueda' : 'Comienza agregando el primer módulo a tu curso'}
              </p>
              {!searchTerm && (
                <button
                  onClick={handleCreateModule}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg inline-flex items-center space-x-2 transition-colors"
                >
                  <Plus size={20} />
                  <span>Crear Primer Módulo</span>
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredModules.map((module) => (
                <div
                  key={module.id}
                  className="bg-gray-800 border border-gray-700 rounded-lg p-6 hover:border-gray-600 transition-colors"
                >
                  {/* Module Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white text-sm font-bold">
                        {module.order || '?'}
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        module.published 
                          ? 'bg-green-900 text-green-300' 
                          : 'bg-yellow-900 text-yellow-300'
                      }`}>
                        {module.published ? 'Publicado' : 'Borrador'}
                      </span>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      module.type === 'ACADEMIC' 
                        ? 'bg-blue-900 text-blue-300' 
                        : 'bg-purple-900 text-purple-300'
                    }`}>
                      {module.type === 'ACADEMIC' ? 'Académico' : 'Evaluativo'}
                    </span>
                  </div>

                  {/* Module Content */}
                  <h3 className="text-lg font-semibold text-white mb-2 line-clamp-1">
                    {module.title}
                  </h3>
                  <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                    {module.description && module.description.length > 0
                      ? (module.description.length > 100 
                          ? `${module.description.substring(0, 100)}...` 
                          : module.description)
                      : (module.content && module.content.length > 100 
                          ? `${module.content.substring(0, 100)}...` 
                          : module.content || 'Sin descripción')
                    }
                  </p>

                  {/* Module Meta */}
                  <div className="flex items-center space-x-4 text-xs text-gray-500 mb-4">
                    <div className="flex items-center space-x-1">
                      <Clock size={12} />
                      <span>{module.estimatedTime || 30} min</span>
                    </div>
                    {module.createdAt && (
                      <div className="flex items-center space-x-1">
                        <Calendar size={12} />
                        <span>{new Date(module.createdAt).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>

                  {/* Module Actions */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleEditModule(module.id)}
                        className="p-2 text-gray-400 hover:text-blue-400 hover:bg-gray-700 rounded transition-colors"
                        title="Editar módulo"
                      >
                        <Edit3 size={16} />
                      </button>
                      <button
                        onClick={() => handlePublishModule(module.id)}
                        className="p-2 text-gray-400 hover:text-green-400 hover:bg-gray-700 rounded transition-colors"
                        title={module.published ? 'Despublicar' : 'Publicar'}
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteModule(module.id)}
                        className="p-2 text-gray-400 hover:text-red-400 hover:bg-gray-700 rounded transition-colors"
                        title="Eliminar módulo"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                    
                    <button
                      onClick={() => handleEditModule(module.id)}
                      className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
                    >
                      Abrir
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Alert Component */}
        {showAlert && (
          <Alert
            message={alertMessage}
            type={alertType}
            position="top"
            restartAlert={restartAlert}
          />
        )}

        {/* Confirmation Modal */}
        <ConfirmationModal
          isOpen={showConfirmation}
          onClose={cancelDeleteModule}
          onConfirm={confirmDeleteModule}
          title="Eliminar Módulo"
          message="¿Estás seguro de que deseas eliminar este módulo? Esta acción no se puede deshacer."
          confirmText="Eliminar"
          cancelText="Cancelar"
          type="danger"
        />
      </div>
    </ToastProvider>
  );
};
