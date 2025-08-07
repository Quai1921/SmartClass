import React, { useState, useEffect } from 'react';
import { Plus, Book, Users, Calendar, Edit, Trash2, Eye } from 'lucide-react';
import { CreateCourseModal } from './CreateCourseModal';
import { CourseDetailModal } from './CourseDetailModal';
import { getCourses, type Course } from '../../actions/courses/get-courses';
import { useToast } from '../context/ToastContext';

interface CourseManagerProps {
  onSelectCourse?: (course: Course) => void;
  selectedCourseId?: string;
  onCreatePage?: (courseId: string) => void;
  onEditPage?: (courseId: string, pageId: string) => void;
}

export const CourseManager: React.FC<CourseManagerProps> = ({
  onSelectCourse,
  selectedCourseId,
  onCreatePage,
  onEditPage,
}) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const toast = useToast();

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    setLoading(true);
    try {
      const response = await getCourses();
      if (response.success) {
        setCourses(response.data || []);
        if (response.data?.length === 0) {
          toast.showInfo('No tienes cursos creados aún. ¡Crea tu primer curso!');
        }
      } else {
        toast.showError('Error al cargar los cursos');
      }
    } catch (error) {
      // console.error('Error loading courses:', error);
      toast.showError('Error de conexión al cargar los cursos');
    } finally {
      setLoading(false);
    }
  };

  const handleCourseCreated = (newCourse: Course) => {
    setCourses(prev => [newCourse, ...prev]);
    toast.showSuccess(`Curso "${newCourse.title}" creado exitosamente`);
  };

  const handleCourseSelect = (course: Course) => {
    if (onSelectCourse) {
      onSelectCourse(course);
    }
  };

  const handleViewCourse = (course: Course) => {
    setSelectedCourse(course);
    setShowDetailModal(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-gray-800 text-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <div className="flex items-center space-x-2">
          <Book className="h-5 w-5 text-blue-400" />
          <h2 className="text-lg font-semibold text-white">Mis Cursos</h2>
          <span className="text-sm text-gray-400">({courses.length})</span>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Nuevo</span>
        </button>
      </div>

      {/* Course List */}
      <div className="flex-1 overflow-y-auto">
        {courses.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-8">
            <Book className="h-16 w-16 text-gray-600 mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">
              No tienes cursos creados
            </h3>
            <p className="text-gray-400 mb-4 text-sm">
              Crea tu primer curso para comenzar a diseñar contenido educativo
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span>Crear Curso</span>
            </button>
          </div>
        ) : (
          <div className="p-4 space-y-3">
            {courses.map((course) => (
              <div
                key={course.id}
                className={`border rounded-lg p-4 transition-all hover:shadow-md cursor-pointer ${
                  selectedCourseId === course.id
                    ? 'border-blue-500 bg-gray-700'
                    : 'border-gray-600 hover:border-gray-500 bg-gray-750'
                }`}
                onClick={() => handleCourseSelect(course)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-medium text-white truncate">
                      {course.title}
                    </h3>
                    <p className="text-sm text-gray-300 mt-1 line-clamp-2">
                      {course.description}
                    </p>
                    
                    <div className="flex items-center space-x-4 mt-3 text-sm text-gray-400">
                      <div className="flex items-center space-x-1">
                        <Users className="h-4 w-4" />
                        <span>{course.tutorName}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <span>Grado {course.grade}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(course.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center space-x-2">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            course.published
                              ? 'bg-green-900 text-green-300'
                              : 'bg-yellow-900 text-yellow-300'
                          }`}
                        >
                          {course.published ? 'Publicado' : 'Borrador'}
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewCourse(course);
                          }}
                          className="p-1.5 text-gray-400 hover:text-blue-400 transition-colors"
                          title="Ver detalles"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCourseSelect(course);
                          }}
                          className="p-1.5 text-gray-400 hover:text-blue-400 transition-colors"
                          title="Editar contenido"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={(e) => e.stopPropagation()}
                          className="p-1.5 text-gray-400 hover:text-red-400 transition-colors"
                          title="Eliminar curso"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      <CreateCourseModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCourseCreated={handleCourseCreated}
      />

      <CourseDetailModal
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        course={selectedCourse}
        onCreatePage={onCreatePage}
        onEditPage={onEditPage}
      />
    </div>
  );
};
