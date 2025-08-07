import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Book, Users, Calendar, Plus, Edit, Eye, Trash2 } from 'lucide-react';
import type { Course } from '../../actions/courses/get-courses';

interface CoursePage {
  id: string;
  title: string;
  createdAt: string;
  lastModified: string;
}

interface CourseDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  course: Course | null;
  onCreatePage?: (courseId: string) => void;
  onEditPage?: (courseId: string, pageId: string) => void;
  onEditCourse?: (course: Course) => void;
}

export const CourseDetailModal: React.FC<CourseDetailModalProps> = ({
  isOpen,
  onClose,
  course,
  onCreatePage,
  onEditPage,
  onEditCourse,
}) => {
  const [pages, setPages] = useState<CoursePage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen && course) {
      loadCoursePages();
    }
  }, [isOpen, course]);

  const loadCoursePages = async () => {
    setLoading(true);
    try {
      // Mock data - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 500));
      setPages([
        {
          id: 'module-1',
          title: 'Introducción a los Números',
          createdAt: '2024-01-15T10:00:00Z',
          lastModified: '2024-01-15T14:30:00Z',
        },
        {
          id: 'module-2',
          title: 'Operaciones Básicas',
          createdAt: '2024-01-16T09:00:00Z',
          lastModified: '2024-01-16T16:45:00Z',
        },
      ]);
    } catch (error) {
      // console.error('Error loading course pages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePage = () => {
    if (onCreatePage && course) {
      onCreatePage(course.id);
    }
  };

  if (!isOpen || !course) return null;

  const modalContent = (
    <div className="modal-overlay fixed inset-0 z-[9999] overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div 
          className="fixed inset-0 transition-opacity bg-black/40 backdrop-filter backdrop-blur-lg"
          onClick={onClose}
        />

        {/* Modal content */}
        <div className="inline-block w-full max-w-4xl p-0 my-8 overflow-hidden text-left align-middle transition-all transform bg-gray-800 shadow-xl rounded-lg border border-gray-700">
          {/* Header */}
          <div className="flex items-center justify-between p-6 bg-gray-700 border-b border-gray-600">
            <div className="flex items-center space-x-3">
              <Book className="h-6 w-6 text-blue-400" />
              <div>
                <h3 className="text-xl font-semibold text-white">
                  {course.title}
                </h3>
                <p className="text-sm text-gray-400">
                  Gestionar módulos y contenido
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Course Info */}
            <div className="mb-6 p-4 bg-gray-700 rounded-lg border border-gray-600">
              <h4 className="font-medium text-white mb-3">Información del Curso</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-blue-400" />
                  <span className="text-sm text-gray-300">Profesor: {course.tutorName}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-green-400" />
                  <span className="text-sm text-gray-300">Grado: {course.grade}°</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Book className="h-4 w-4 text-purple-400" />
                  <span className="text-sm text-gray-300">
                    {course.published ? 'Publicado' : 'Borrador'}
                  </span>
                </div>
              </div>
              {course.description && (
                <div>
                  <label className="text-sm font-medium text-gray-400">Descripción</label>
                  <p className="text-sm text-gray-300 mt-1">{course.description}</p>
                </div>
              )}
            </div>

            {/* Pages/Modules Header */}
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-medium text-white">Módulos del Curso ({pages.length})</h4>
              <button
                onClick={handleCreatePage}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                <Plus className="h-4 w-4" />
                <span>Nuevo Módulo</span>
              </button>
            </div>

            {/* Pages/Modules List */}
            <div className="space-y-3">
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : pages.length === 0 ? (
                <div className="text-center py-8 bg-gray-700 rounded-lg border border-gray-600">
                  <Book className="mx-auto h-12 w-12 text-gray-500 mb-3" />
                  <p className="text-gray-400 mb-2">No hay módulos creados</p>
                  <p className="text-sm text-gray-500">Crea tu primer módulo para comenzar</p>
                </div>
              ) : (
                pages.map((page, index) => (
                  <div
                    key={page.id}
                    className="flex items-center justify-between p-4 bg-gray-700 rounded-lg border border-gray-600 hover:bg-gray-600 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center justify-center w-8 h-8 bg-blue-600 text-white text-sm font-medium rounded-full">
                        {index + 1}
                      </div>
                      <div>
                        <h5 className="font-medium text-white">{page.title}</h5>
                        <p className="text-sm text-gray-400">
                          Actualizado {new Date(page.lastModified).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {onEditPage && (
                        <button
                          onClick={() => onEditPage(course.id, page.id)}
                          className="flex items-center space-x-1 px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
                        >
                          <Edit className="h-3 w-3" />
                          <span>Editar Contenido</span>
                        </button>
                      )}
                      <button
                        onClick={() => console.log('View page:', page.id)}
                        className="p-2 text-gray-400 hover:text-white transition-colors"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => console.log('Delete page:', page.id)}
                        className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Actions */}
            <div className="flex justify-end pt-6 border-t border-gray-600 mt-6">
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-300 bg-gray-600 border border-gray-500 rounded-md hover:bg-gray-500 transition-colors"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Use portal to render modal at document body level
  return createPortal(modalContent, document.body);
};
