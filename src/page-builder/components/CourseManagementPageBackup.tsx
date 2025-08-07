import React, { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { 
  Plus, 
  Search, 
  BookOpen, 
  Edit3, 
  Eye,
  ChevronDown,
  Grid,
  List,
  ArrowLeft,
  Trash2
} from 'lucide-react';
import { getCourses, type Course } from '../../actions/courses/get-courses';
import { deleteCourse } from '../../actions/courses/delete-course';
import { getUserData } from '../../actions/user/get-user-data';
import type { User } from '../../domain/entities/user';
import { CreateCourseModal } from './CreateCourseModal';
import { EditCourseModal } from './EditCourseModal';
import { ToastProvider } from '../context/ToastContext';
import { LoadingSpinner } from './LoadingSpinner';
import { useAuthStore } from '../../ui/store/auth/useAuthStore';
import { StorageAdapter } from '../../config/adapters/storage-adapter';
import { DebugPanel } from './DebugPanel';
import { useInstitutionStatusFix } from '../../ui/utils/institutionStatusUtils';
import { useNotificationStore } from '../../ui/store/notification/useNotificationStore';
import Alert from '../../ui/components/Alert';
import { PageBuilderStorageService } from '../services/storageService';
import '../styles/course-management.css';

// Utility function to generate unique gradient based on course ID
const generateCourseGradient = (courseId: string): { background: string } => {
  // Create a simple hash from the course ID
  let hash = 0;
  for (let i = 0; i < courseId.length; i++) {
    const char = courseId.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  
  // Define gradient color combinations with actual color values
  const gradients = [
    'linear-gradient(to bottom right, #2563eb, #9333ea)', // blue to purple
    'linear-gradient(to bottom right, #059669, #0d9488)', // green to teal
    'linear-gradient(to bottom right, #a855f7, #ec4899)', // purple to pink
    'linear-gradient(to bottom right, #eab308, #ea580c)', // yellow to orange
    'linear-gradient(to bottom right, #ef4444, #ec4899)', // red to pink
    'linear-gradient(to bottom right, #6366f1, #2563eb)', // indigo to blue
    'linear-gradient(to bottom right, #14b8a6, #059669)', // teal to green
    'linear-gradient(to bottom right, #f97316, #ef4444)', // orange to red
    'linear-gradient(to bottom right, #06b6d4, #2563eb)', // cyan to blue
    'linear-gradient(to bottom right, #10b981, #06b6d4)', // emerald to cyan
    'linear-gradient(to bottom right, #8b5cf6, #a855f7)', // violet to purple
    'linear-gradient(to bottom right, #f59e0b, #eab308)', // amber to yellow
    'linear-gradient(to bottom right, #f43f5e, #ef4444)', // rose to red
    'linear-gradient(to bottom right, #0ea5e9, #6366f1)', // sky to indigo
    'linear-gradient(to bottom right, #84cc16, #059669)', // lime to green
  ];
  
  // Use hash to select a gradient
  const index = Math.abs(hash) % gradients.length;
  return { background: gradients[index] };
};

// Confirmation Modal Component
interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isDestructive?: boolean;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  isDestructive = false,
}) => {
  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  const modalContent = (
    <div className="fixed inset-0 flex items-center justify-center p-4 z-50">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 modal-backdrop-blur"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative bg-gray-800 rounded-lg shadow-xl w-full max-w-md z-10">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h2 className="text-lg font-semibold text-white">{title}</h2>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-gray-300 whitespace-pre-line">{message}</p>
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-3 p-6 border-t border-gray-700">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className={`px-6 py-2 font-medium rounded-lg transition-colors ${
              isDestructive
                ? 'bg-red-600 hover:bg-red-700 text-white'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export const CourseManagementPage: React.FC = () => {
  const { status, isInitialized, role } = useAuthStore();
  const { performStatusCheck } = useInstitutionStatusFix();
  const { addNotification } = useNotificationStore();
  const [courses, setCourses] = useState<Course[]>([]);
  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [gradeFilter, setGradeFilter] = useState('Todos los grados');
  const [subjectFilter, setSubjectFilter] = useState('Todas las materias');
  const [groupFilter, setGroupFilter] = useState('Todos los grupos');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  
  // Alert state management
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState<'error' | 'message' | 'alert'>('message');
  
  // Confirmation modal state
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState<Course | null>(null);

  // Simple navigation function
  const navigate = (path: string) => {
    window.location.href = path;
  };

  // Alert helper functions
  const showAlertWithMessage = (message: string, type: 'error' | 'message' | 'alert' = 'message') => {
    setAlertMessage(message);
    setAlertType(type);
    setShowAlert(true);
  };

  const restartAlert = () => {
    setShowAlert(false);
  };

  // Check authentication before loading data
  useEffect(() => {
    if (!isInitialized) return; // Wait for auth initialization
    
    if (status !== 'SUCCESS') {
      // console.warn('CourseManagement: User not authenticated, staying on page (AuthProvider will handle redirect)');
      return;
    }

    const token = StorageAdapter.getItem('token');
    if (!token) {
      // console.warn('CourseManagement: No token found, staying on page (AuthProvider will handle redirect)');
      return;
    }

    loadInitialData();
  }, [status, isInitialized]);

  const loadInitialData = useCallback(async () => {
    setLoading(true);
    try {
      
      // Load user data first
      const userDataResponse = await getUserData();

      if (userDataResponse) {
        setUserData(userDataResponse);
      }

      // Load courses - first try the standard endpoint
      let coursesResponse = await getCourses();
      

      // If we're an institution user and got no courses, this might indicate the issue
      if (role === 'INSTITUTION_ADMIN' && coursesResponse.success && (!coursesResponse.data || coursesResponse.data.length === 0)) {
        // console.warn('⚠️ Institution user got empty courses from /courses endpoint');
        // console.warn('⚠️ This might be the root cause of the issue!');
        // console.warn('⚠️ The /courses endpoint should return institution-assigned courses for institution users');
        
        // Log additional debugging info
        if (userDataResponse?.institutionName) {
        }
      }


      if (coursesResponse.success) {
        const newCourses = coursesResponse.data || [];

        
        // Check for status changes if we have previous courses
        // Note: We'll use a ref or separate effect for this if needed
        // to avoid dependency on courses state in useCallback
        
        setCourses(newCourses);
        
        // Clean up orphaned projects in local storage
        try {
          const validCourseIds = newCourses.map(course => course.id);
          const orphanedCount = PageBuilderStorageService.cleanupOrphanedProjects(validCourseIds);
          if (orphanedCount > 0) {
          }
        } catch (cleanupError) {
          // console.warn('⚠️ Could not cleanup orphaned projects:', cleanupError);
        }
        
        // Log the final state change
        if (newCourses.length === 0 && role === 'INSTITUTION_ADMIN') {
          // console.error('🚨 CRITICAL: Institution user has zero courses! This will make institution appear as PENDING/INACTIVE');
        }
        
        // Perform institution status check for institution users
        if (role === 'INSTITUTION_ADMIN') {
          performStatusCheck().then(statusResult => {
            if (statusResult.hasAssignedCourses && statusResult.backendStatus === 'PENDING') {
              // console.error('🚨 BACKEND ISSUE DETECTED: Institution has courses but backend status is PENDING');
              // console.error('🚨 This needs to be fixed in the backend!');
              
              // Show user notification
              addNotification({
                message: 'Se detectó un problema de estado en el sistema. Los cursos están disponibles pero la institución aparece como pendiente.',
                type: 'alert',
                position: 'right-top',
                duration: 10000,
              });
            }
          }).catch(error => {
            // console.error('❌ Status check failed:', error);
          });
        }
      } else {
        // console.error('❌ Failed to load courses:', coursesResponse.error);
      }
    } catch (error) {
      // console.error('❌ Error loading initial data:', error);
      // If it's an authentication error, redirect to login
      if (error instanceof Error && error.message.includes('Authentication required')) {
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  }, [role, addNotification, performStatusCheck]);

  const handleCourseCreated = (newCourse: Course) => {

    
    // If the course has a temporary ID, reload the data to get the real course
    if (String(newCourse.id).startsWith('created-')) {
      setShowCreateModal(false);
      showAlertWithMessage(`Curso "${newCourse.title}" creado exitosamente`, 'message');
      // Reload data to get the actual course from the server
      loadInitialData();
    } else {
      // Normal case with real course data
      setCourses(prev => [newCourse, ...prev]);
      setShowCreateModal(false);
      showAlertWithMessage(`Curso "${newCourse.title}" creado exitosamente`, 'message');
    }
  };

  const handleCourseCreationError = (error: string) => {
    // console.error('❌ Course creation failed:', error);
    setShowCreateModal(false);
    showAlertWithMessage(`Error al crear el curso: ${error}`, 'error');
  };

  const handleCourseSelect = (course: Course) => {

    // Navigate to module management for this course
    navigate(`/modules?courseId=${course.id}`);
  };

  const handleEditCourse = (course: Course) => {
    setSelectedCourse(course);
    setShowEditModal(true);
  };

  const handleCourseUpdated = (updatedCourse: Course) => {
    
    // Update the course in the local state
    setCourses(prevCourses => 
      prevCourses.map(course => 
        course.id === updatedCourse.id ? updatedCourse : course
      )
    );
    
    setShowEditModal(false);
    setSelectedCourse(null);
    showAlertWithMessage(`Curso "${updatedCourse.title}" actualizado exitosamente`, 'message');
    
    // Reload data to ensure consistency
    loadInitialData();
  };

  const handleCourseUpdateError = (error: string) => {
    // console.error('❌ Course update failed:', error);
    setShowEditModal(false);
    setSelectedCourse(null);
    showAlertWithMessage(`Error al actualizar el curso: ${error}`, 'error');
  };

  const handleDeleteCourse = async (course: Course) => {
    setCourseToDelete(course);
    setShowConfirmModal(true);
  };

  const confirmDeleteCourse = async () => {
    if (!courseToDelete) return;

    try {
      const result = await deleteCourse(courseToDelete.id);
      
      if (result.success) {
        // Remove course from local state
        setCourses(prev => prev.filter(c => c.id !== courseToDelete.id));
        
        // Also remove any associated saved projects/pages from local storage
        try {
          PageBuilderStorageService.deleteProject(courseToDelete.id);
        } catch (storageError) {
          // console.warn('⚠️ Could not remove saved project from local storage:', storageError);
          // Don't fail the course deletion if storage cleanup fails
        }
        
        showAlertWithMessage(`Curso "${courseToDelete.title}" eliminado exitosamente`, 'message');
      } else {
        showAlertWithMessage(`Error al eliminar el curso: ${result.error}`, 'error');
        // console.error('❌ Failed to delete course:', result.error);
      }
    } catch (error) {
      // console.error('❌ Error deleting course:', error);
      showAlertWithMessage('Error inesperado al eliminar el curso', 'error');
    } finally {
      setCourseToDelete(null);
    }
  };

  const handleCreateModule = (courseId: string) => {
    // Navigate to module management for this course
    navigate(`/modules?courseId=${courseId}`);
  };

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGrade = gradeFilter === 'Todos los grados' || 
                        gradeFilter === `Grado ${course.grade}` ||
                        course.grade === gradeFilter;
    const matchesSubject = subjectFilter === 'Todas las materias'; // TODO: Add subject field to course
    const matchesGroup = groupFilter === 'Todos los grupos' || (course.group && course.group === groupFilter);
    
    return matchesSearch && matchesGrade && matchesSubject && matchesGroup;
  });

  // Get filter options - hardcoded grades from 1 to 11
  const getGrades = () => {
    const hardcodedGrades = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
    return ['Todos los grados', ...hardcodedGrades.map(grade => `Grado ${grade}`)];
  };

  const getSubjects = () => {
    const subjects = userData?.subjects || [];
    return ['Todas las materias', ...subjects];
  };

  const getGroups = () => {
    const groups = userData?.groups || [];
    return ['Todos los grupos', ...groups];
  };

  // Show loading spinner while auth is initializing
  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  // Show loading spinner while data is loading
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <ToastProvider>
      <div className="min-h-screen bg-gray-900 text-white -m-6">
        {/* Header */}
        <div className="bg-gray-800 border-b border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center">
                <button
                  onClick={() => navigate('/home')}
                  className="mr-4 p-2 text-gray-400 hover:text-white rounded-md hover:bg-gray-700 transition-colors"
                  title="Volver al inicio"
                >
                  <ArrowLeft size={20} />
                </button>
                <BookOpen className="w-8 h-8 text-blue-500 mr-3" />
                <h1 className="text-2xl font-bold text-white">Constructor de Cursos</h1>
              </div>
              
              <button
                onClick={() => setShowCreateModal(true)}
                className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800"
              >
                <Plus size={20} className="mr-2" />
                Crear Curso
              </button>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar cursos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Grade Filter */}
            <div className="relative">
              <select
                value={gradeFilter}
                onChange={(e) => setGradeFilter(e.target.value)}
                className="appearance-none bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 pr-8 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {getGrades().map((grade: string) => (
                  <option key={grade} value={grade} className="bg-gray-800">
                    {grade}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
            </div>

            {/* Subject Filter */}
            <div className="relative">
              <select
                value={subjectFilter}
                onChange={(e) => setSubjectFilter(e.target.value)}
                className="appearance-none bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 pr-8 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {getSubjects().map((subject: string) => (
                  <option key={subject} value={subject} className="bg-gray-800">
                    {subject}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
            </div>

            {/* Groups Filter */}
            <div className="relative">
              <select
                value={groupFilter}
                onChange={(e) => setGroupFilter(e.target.value)}
                className="appearance-none bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 pr-8 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {getGroups().map((group: string) => (
                  <option key={group} value={group} className="bg-gray-800">
                    {group}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
            </div>

            {/* View Mode Toggle */}
            <div className="flex rounded-lg border border-gray-700 overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-400 hover:text-white'} transition-colors`}
                title="Vista de cuadrícula"
              >
                <Grid size={18} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-400 hover:text-white'} transition-colors`}
                title="Vista de lista"
              >
                <List size={18} />
              </button>
            </div>
          </div>

          {/* Content */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <LoadingSpinner size="lg" color="blue" />
              <span className="ml-3 text-gray-400 mt-4">Cargando cursos y configuración...</span>
            </div>
          ) : filteredCourses.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-400 mb-2">
                {courses.length === 0 ? 'No hay cursos creados' : 'No se encontraron cursos'}
              </h3>
              <p className="text-gray-500 mb-6">
                {courses.length === 0 
                  ? 'Comienza creando tu primer curso' 
                  : 'Intenta modificar los filtros de búsqueda'}
              </p>
              {courses.length === 0 && (
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                >
                  <Plus size={20} className="mr-2" />
                  Crear primer curso
                </button>
              )}
            </div>
          ) : (
            <div className={viewMode === 'grid' ? 'flex flex-wrap gap-4' : 'space-y-4'}>
              {filteredCourses.map((course) => (
                <CourseCard
                  key={course.id}
                  course={course}
                  viewMode={viewMode}
                  onView={handleCourseSelect}
                  onEdit={handleEditCourse}
                  onCreateModule={handleCreateModule}
                  onDelete={handleDeleteCourse}
                />
              ))}
            </div>
          )}
        </div>

        {/* Modals */}
        {showCreateModal && (
          <CreateCourseModal
            isOpen={showCreateModal}
            onClose={() => setShowCreateModal(false)}
            onCourseCreated={handleCourseCreated}
            onError={handleCourseCreationError}
            userData={userData}
          />
        )}
        
        {showEditModal && selectedCourse && (
          <EditCourseModal
            isOpen={showEditModal}
            onClose={() => {
              setShowEditModal(false);
              setSelectedCourse(null);
            }}
            onCourseUpdated={handleCourseUpdated}
            onError={handleCourseUpdateError}
            userData={userData}
            course={selectedCourse}
          />
        )}
        
        {/* Confirmation Modal */}
        <ConfirmationModal
          isOpen={showConfirmModal}
          onClose={() => {
            setShowConfirmModal(false);
            setCourseToDelete(null);
          }}
          onConfirm={confirmDeleteCourse}
          title="Eliminar Curso"
          message={courseToDelete 
            ? `¿Estás seguro de que quieres eliminar el curso "${courseToDelete.title}"?\n\nEsta acción no se puede deshacer y eliminará:\n• El curso y toda su información\n• Todos los módulos asociados\n• Todo el progreso de los estudiantes`
            : ''
          }
          confirmText="Eliminar"
          cancelText="Cancelar"
          isDestructive={true}
        />
      </div>
      
      {/* Debug Panel for tracking course status changes */}
      <DebugPanel courses={courses} />
      
      {/* Alert for user feedback */}
      {showAlert && (
        <Alert
          message={alertMessage}
          type={alertType}
          position="top"
          restartAlert={restartAlert}
          duration={4000}
        />
      )}
    </ToastProvider>
  );
};

interface CourseCardProps {
  course: Course;
  viewMode: 'grid' | 'list';
  onView: (course: Course) => void;
  onEdit: (course: Course) => void;
  onCreateModule: (courseId: string) => void;
  onDelete: (course: Course) => void;
}

const CourseCard: React.FC<CourseCardProps> = ({ 
  course, 
  viewMode, 
  onView, 
  onEdit, 
  onCreateModule,
  onDelete
}) => {
  if (viewMode === 'list') {
    return (
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 hover:border-gray-600 transition-colors">
        <div className="flex items-center justify-between">
          <div className="flex items-center flex-1 min-w-0">
            <div 
              className="w-12 h-12 rounded-lg flex items-center justify-center mr-4 flex-shrink-0"
              style={generateCourseGradient(course.id)}
            >
              <BookOpen className="w-6 h-6 text-white opacity-80" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-white truncate">{course.title}</h3>
              <p className="text-sm text-gray-400 truncate">{course.description}</p>
              <div className="flex items-center mt-1 text-xs text-gray-500">
                <span className="mr-4">Grado {course.grade}</span>
                <span className="mr-4">Creado {new Date(course.createdAt).toLocaleDateString()}</span>
                <span className={`px-2 py-1 rounded-full ${course.published ? 'bg-green-900 text-green-300' : 'bg-yellow-900 text-yellow-300'}`}>
                  {course.published ? 'Publicado' : 'Borrador'}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2 ml-4">
            <button
              onClick={() => onView(course)}
              className="p-2 text-gray-400 hover:text-blue-400 hover:bg-gray-700 rounded-lg transition-colors"
              title="Ver detalles"
            >
              <Eye size={16} />
            </button>
            <button
              onClick={() => onEdit(course)}
              className="p-2 text-gray-400 hover:text-green-400 hover:bg-gray-700 rounded-lg transition-colors"
              title="Editar curso"
            >
              <Edit3 size={16} />
            </button>
            <button
              onClick={() => onCreateModule(course.id)}
              className="p-2 text-gray-400 hover:text-yellow-400 hover:bg-gray-700 rounded-lg transition-colors"
              title="Crear módulo"
            >
              <Plus size={16} />
            </button>
            <button
              onClick={() => onDelete(course)}
              className="p-2 text-gray-400 hover:text-red-400 hover:bg-gray-700 rounded-lg transition-colors"
              title="Eliminar curso"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden hover:border-gray-600 transition-colors group w-full sm:w-[calc(50%-0.5rem)] lg:w-[calc(33.333%-0.67rem)] 2xl:w-[calc(25%-0.75rem)] flex-shrink-0">
      {/* Course Banner */}
      <div 
        className="h-32 relative"
        style={course.banner ? {} : generateCourseGradient(course.id)}
      >
        {course.banner ? (
          <img 
            src={course.banner} 
            alt={course.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <BookOpen className="w-12 h-12 text-white opacity-80" />
          </div>
        )}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity" />
      </div>

      {/* Course Content */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2">{course.title}</h3>
        <p className="text-sm text-gray-400 mb-3 line-clamp-2">{course.description}</p>
        
        <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
          <div className="flex items-center space-x-2">
            <span>Grado {course.grade}</span>
            {course.group && <span>• Grupo {course.group}</span>}
            {course.subject && <span>• {course.subject}</span>}
          </div>
          <span className={`px-2 py-1 rounded-full ${course.published ? 'bg-green-900 text-green-300' : 'bg-yellow-900 text-yellow-300'}`}>
            {course.published ? 'Publicado' : 'Borrador'}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="text-xs text-gray-500">
            Creado {new Date(course.createdAt).toLocaleDateString()}
          </div>
          <div className="flex space-x-1">
            <button
              onClick={() => onView(course)}
              className="p-1.5 text-gray-400 hover:text-blue-400 hover:bg-gray-700 rounded-md transition-colors"
              title="Ver detalles"
            >
              <Eye size={14} />
            </button>
            <button
              onClick={() => onEdit(course)}
              className="p-1.5 text-gray-400 hover:text-green-400 hover:bg-gray-700 rounded-md transition-colors"
              title="Editar curso"
            >
              <Edit3 size={14} />
            </button>
            <button
              onClick={() => onCreateModule(course.id)}
              className="p-1.5 text-gray-400 hover:text-yellow-400 hover:bg-gray-700 rounded-md transition-colors"
              title="Crear módulo"
            >
              <Plus size={14} />
            </button>
            <button
              onClick={() => onDelete(course)}
              className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-gray-700 rounded-md transition-colors"
              title="Eliminar curso"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
