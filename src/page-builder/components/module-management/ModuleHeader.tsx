import React from 'react';
import { ArrowLeft, Plus, RotateCcw } from 'lucide-react';
import type { Course } from '../../../actions/courses/get-courses';

interface ModuleHeaderProps {
  course: Course;
  onBackToCourses: () => void;
  onCreateModule: () => void;
  onForceRefresh: () => void;
  loading?: boolean;
}

export const ModuleHeader: React.FC<ModuleHeaderProps> = ({
  course,
  onBackToCourses,
  onCreateModule,
  onForceRefresh,
  loading = false,
}) => {
  return (
    <div className="bg-gray-800 border-b border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <button
              onClick={onBackToCourses}
              className="mr-4 p-2 text-gray-400 hover:text-white rounded-md hover:bg-gray-700 transition-colors"
              title="Volver a cursos"
            >
              <ArrowLeft size={20} />
            </button>
            
            <div>
              <h1 className="text-2xl font-bold text-white">{course.title}</h1>
              <p className="text-gray-400 text-sm">
                {course.description} • Grado {course.grade}
                {course.group && ` • Grupo ${course.group}`}
                {course.subject && ` • ${course.subject}`}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={onForceRefresh}
              disabled={loading}
              className="p-2 text-gray-400 hover:text-white disabled:text-gray-600 disabled:cursor-not-allowed rounded-md hover:bg-gray-700 disabled:hover:bg-transparent transition-colors"
              title="Actualizar módulos"
            >
              <RotateCcw size={20} className={`${loading ? 'animate-spin' : ''}`} />
            </button>
            
            <button
              onClick={onCreateModule}
              className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800"
            >
              <Plus size={20} className="mr-2" />
              Nuevo Módulo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
