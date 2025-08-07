import React, { useState, useEffect } from 'react';
import { X, BookOpen, Plus, Eye, Edit3, Trash2, Calendar, Users, FileText } from 'lucide-react';
import { getCourseWithPages, type CourseWithPages, type CoursePage } from '../../actions/courses/get-course-with-pages';
import type { Course } from '../../actions/courses/get-courses';

interface CourseDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  course: Course;
}

export const CourseDetailModal: React.FC<CourseDetailModalProps> = ({
  isOpen,
  onClose,
  course,
}) => {
  const [courseDetails, setCourseDetails] = useState<CourseWithPages | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && course.id) {
      loadCourseDetails();
    }
  }, [isOpen, course.id]);

  const loadCourseDetails = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await getCourseWithPages(course.id);
      if (response.success && response.data) {
        setCourseDetails(response.data);
      } else {
        setError(response.error || 'Error al cargar los detalles del curso');
      }
    } catch (err) {
      setError('Error inesperado al cargar los detalles');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleCreatePage = () => {
    // Navigate to page builder with course context
    const pageBuilderUrl = `/page-builder?courseId=${course.id}`;
    window.open(pageBuilderUrl, '_blank');
  };

  const handleEditPage = (page: CoursePage) => {
    // Navigate to page builder with page context
    const pageBuilderUrl = `/page-builder?courseId=${course.id}&pageId=${page.id}`;
    window.open(pageBuilderUrl, '_blank');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div 
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
          onClick={onClose}
        />

        {/* Modal content */}
        <div className="inline-block w-full max-w-4xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-lg">
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {course.title}
              </h3>
              <p className="text-gray-600 mb-3">{course.description}</p>
              
              <div className="flex items-center space-x-6 text-sm text-gray-500">
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-1" />
                  <span>{course.tutorName}</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>Grado {course.grade}</span>
                </div>
                <div className="flex items-center">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    course.status === 'PUBLISHED' 
                      ? 'bg-green-100 text-green-800' 
                      : course.status === 'IN_REVIEW' 
                      ? 'bg-blue-100 text-blue-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {course.status === 'PUBLISHED' ? 'Publicado' : course.status === 'IN_REVIEW' ? 'En Revisión' : 'Borrador'}
                  </span>
                </div>
              </div>
            </div>
            
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Course Pages Section */}
          <div className="border-t border-gray-200 pt-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-medium text-gray-900 flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Páginas del Curso
              </h4>
              <button
                onClick={handleCreatePage}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Plus className="h-4 w-4 mr-1" />
                Nueva Página
              </button>
            </div>

            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Cargando páginas...</p>
              </div>
            ) : error ? (
              <div className="bg-red-50 border border-red-200 rounded-md p-4">
                <p className="text-red-800 text-sm">{error}</p>
                <button
                  onClick={loadCourseDetails}
                  className="mt-2 text-sm bg-red-100 text-red-800 rounded-md px-3 py-1 hover:bg-red-200 transition-colors"
                >
                  Reintentar
                </button>
              </div>
            ) : courseDetails?.pages && courseDetails.pages.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {courseDetails.pages.map((page) => (
                  <div
                    key={page.id}
                    className="bg-gray-50 rounded-lg border border-gray-200 p-4 hover:shadow-sm transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <h5 className="font-medium text-gray-900 line-clamp-2">
                        {page.title}
                      </h5>
                      <div className="flex items-center space-x-1 ml-2">
                        <button
                          onClick={() => handleEditPage(page)}
                          className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                          title="Editar página"
                        >
                          <Edit3 className="h-4 w-4" />
                        </button>
                        <button
                          className="p-1 text-gray-400 hover:text-green-600 transition-colors"
                          title="Vista previa"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                          title="Eliminar página"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="text-xs text-gray-500 space-y-1">
                      <div>Creada: {formatDate(page.createdAt)}</div>
                      <div>Actualizada: {formatDate(page.updatedAt)}</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <BookOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h5 className="text-sm font-medium text-gray-900 mb-2">
                  No hay páginas creadas
                </h5>
                <p className="text-sm text-gray-500 mb-4">
                  Comienza creando la primera página de tu curso.
                </p>
                <button
                  onClick={handleCreatePage}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Crear Primera Página
                </button>
              </div>
            )}
          </div>

          {/* Course Stats */}
          {courseDetails && (
            <div className="border-t border-gray-200 pt-6 mt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {courseDetails.pages?.length || 0}
                  </div>
                  <div className="text-sm text-blue-800">Páginas</div>
                </div>
                
                <div className="bg-green-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {courseDetails.type}
                  </div>
                  <div className="text-sm text-green-800">Tipo</div>
                </div>
                
                <div className="bg-purple-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {formatDate(courseDetails.createdAt).split(',')[0]}
                  </div>
                  <div className="text-sm text-purple-800">Fecha de Creación</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
