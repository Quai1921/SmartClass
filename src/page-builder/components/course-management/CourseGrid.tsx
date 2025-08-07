import React from 'react';
import { BookOpen, Plus } from 'lucide-react';
import type { Course } from '../../../actions/courses/get-courses';
import { CourseCard } from './CourseCard';
import { LoadingSpinner } from '../LoadingSpinner';

interface CourseGridProps {
  courses: Course[];
  filteredCourses: Course[];
  viewMode: 'grid' | 'list';
  loading: boolean;
  onView: (course: Course) => void;
  onEdit: (course: Course) => void;
  onCreateModule: (courseId: string) => void;
  onDelete: (course: Course) => void;
  onCreateCourse: () => void;
}

export const CourseGrid: React.FC<CourseGridProps> = ({
  courses,
  filteredCourses,
  viewMode,
  loading,
  onView,
  onEdit,
  onCreateModule,
  onDelete,
  onCreateCourse,
}) => {

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <LoadingSpinner size="lg" color="blue" />
        <span className="ml-3 text-gray-400 mt-4">Cargando cursos y configuración...</span>
      </div>
    );
  }

  if (filteredCourses.length === 0) {
    return (
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
            onClick={onCreateCourse}
            className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
          >
            <Plus size={20} className="mr-2" />
            Crear primer curso
          </button>
        )}
      </div>
    );
  }

  return (
    <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
      {filteredCourses.map((course) => {
        return (
          <CourseCard
            key={course.id}
            course={course}
            viewMode={viewMode}
            onView={onView}
            onEdit={onEdit}
            onCreateModule={onCreateModule}
            onDelete={onDelete}
          />
        );
      })}
    </div>
  );
};
