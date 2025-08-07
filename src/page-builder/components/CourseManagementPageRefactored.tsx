import React, { useState } from 'react';
import { BookOpen, Plus, ArrowLeft } from 'lucide-react';
import type { Course } from '../../actions/courses/get-courses';
import { CreateCourseModal } from './CreateCourseModal';
import { EditCourseModal } from './EditCourseModal';
import { ToastProvider } from '../context/ToastContext';
import { LoadingSpinner } from './LoadingSpinner';
import { DebugPanel } from './DebugPanel';
import Alert from '../../ui/components/Alert';
import { useCourseManagement } from './course-management/hooks/useCourseManagement';
import { CourseFilters } from './course-management/CourseFilters';
import { CourseGrid } from './course-management/CourseGrid';
import { ConfirmationModal } from './course-management/ConfirmationModal';
import '../styles/course-management.css';

export const CourseManagementPage: React.FC = () => {
  
  try {
    const {
      courses,
      userData,
      loading,
      selectedCourse,
      courseToDelete,
      navigate,
      handleCourseCreated,
      handleCourseUpdated,
      confirmDeleteCourse,
      setSelectedCourse,
      setCourseToDelete,
    } = useCourseManagement();



  // Local state for UI
  const [searchTerm, setSearchTerm] = useState('');
  const [gradeFilter, setGradeFilter] = useState('Todos los grados');
  const [subjectFilter, setSubjectFilter] = useState('Todas las materias');
  const [statusFilter, setStatusFilter] = useState('Todos los estados');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  
  // Alert state management
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState<'error' | 'message' | 'alert'>('message');
  
  // Confirmation modal state
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Alert helper functions
  const showAlertWithMessage = (message: string, type: 'error' | 'message' | 'alert' = 'message') => {
    setAlertMessage(message);
    setAlertType(type);
    setShowAlert(true);
  };

  const restartAlert = () => {
    setShowAlert(false);
  };

  const handleCourseCreationSuccess = (newCourse: Course) => {
    handleCourseCreated(newCourse);
    setShowCreateModal(false);
    showAlertWithMessage(`Curso "${newCourse.title}" creado exitosamente`, 'message');
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

  const handleCourseUpdateSuccess = (updatedCourse: Course) => {
    handleCourseUpdated(updatedCourse);
    setShowEditModal(false);
    showAlertWithMessage(`Curso "${updatedCourse.title}" actualizado exitosamente`, 'message');
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

  const handleConfirmDelete = async () => {
    const result = await confirmDeleteCourse();
    if (result) {
      if (result.success) {
        showAlertWithMessage(result.message, 'message');
      } else {
        showAlertWithMessage(result.message, 'error');
      }
    }
  };

  const handleCreateModule = (courseId: string) => {
    // Navigate to module management for this course
    navigate(`/modules?courseId=${courseId}`);
  };

  // Filter courses based on search and filters
  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Handle both string and numeric grades
    const courseGradeStr = String(course.grade);
    const matchesGrade = gradeFilter === 'Todos los grados' || 
                        gradeFilter === `Grado ${courseGradeStr}` ||
                        courseGradeStr === gradeFilter;
                        
    const matchesSubject = subjectFilter === 'Todas las materias' || 
                          (course.subject && subjectFilter === course.subject);
    const matchesStatus = statusFilter === 'Todos los estados' ||
                         (statusFilter === 'Publicado' && course.status === 'PUBLISHED') ||
                         (statusFilter === 'Borrador' && course.status === 'DRAFT');
    
    return matchesSearch && matchesGrade && matchesSubject && matchesStatus;
  });



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
          <CourseFilters
            searchTerm={searchTerm}
            gradeFilter={gradeFilter}
            subjectFilter={subjectFilter}
            statusFilter={statusFilter}
            viewMode={viewMode}
            userData={userData}
            onSearchChange={setSearchTerm}
            onGradeFilterChange={setGradeFilter}
            onSubjectFilterChange={setSubjectFilter}
            onStatusFilterChange={setStatusFilter}
            onViewModeChange={setViewMode}
          />

          {/* Course Grid */}
          <CourseGrid
            courses={courses}
            filteredCourses={filteredCourses}
            viewMode={viewMode}
            loading={loading}
            onView={handleCourseSelect}
            onEdit={handleEditCourse}
            onCreateModule={handleCreateModule}
            onDelete={handleDeleteCourse}
            onCreateCourse={() => setShowCreateModal(true)}
          />
        </div>

        {/* Modals */}
        {showCreateModal && (
          <CreateCourseModal
            isOpen={showCreateModal}
            onClose={() => setShowCreateModal(false)}
            onCourseCreated={handleCourseCreationSuccess}
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
            onCourseUpdated={handleCourseUpdateSuccess}
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
          onConfirm={handleConfirmDelete}
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
  } catch (error) {
    // console.error('❌ CourseManagementPage: Error rendering component:', error);
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Error Loading Course Management</h1>
          <p className="text-gray-300">Check console for details</p>
          <pre className="mt-4 text-red-400 text-sm max-w-lg">{String(error)}</pre>
        </div>
      </div>
    );
  }
};
