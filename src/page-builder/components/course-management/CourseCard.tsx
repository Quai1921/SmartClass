import React from 'react';
import { BookOpen, Eye, Edit3, Plus, Trash2 } from 'lucide-react';
import type { Course } from '../../../actions/courses/get-courses';
import { generateCourseGradient } from './utils/courseUtils';

interface CourseCardProps {
  course: Course;
  viewMode: 'grid' | 'list';
  onView: (course: Course) => void;
  onEdit: (course: Course) => void;
  onCreateModule: (courseId: string) => void;
  onDelete: (course: Course) => void;
}

export const CourseCard: React.FC<CourseCardProps> = ({ 
  course, 
  viewMode, 
  onView, 
  onEdit, 
  onCreateModule,
  onDelete
}) => {
  const isDraft = String(course.id).startsWith('draft-');
  
  if (viewMode === 'list') {
    return (
      <div className={`border rounded-lg p-4 hover:border-gray-600 transition-colors ${
        isDraft ? 'bg-gray-800 border-yellow-600/50' : 'bg-gray-800 border-gray-700'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center flex-1 min-w-0">
            <div 
              className="w-12 h-12 rounded-lg flex items-center justify-center mr-4 flex-shrink-0"
              style={generateCourseGradient(course.id)}
            >
              <BookOpen className="w-6 h-6 text-white opacity-80" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold text-white truncate">{course.title}</h3>
                {isDraft && (
                  <span className="px-2 py-1 text-xs bg-yellow-900 text-yellow-300 rounded-full">
                    Borrador Local
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-400 truncate">{course.description}</p>
              <div className="flex items-center mt-1 text-xs text-gray-500">
                <span className="mr-4">Grado {course.grade}</span>
                <span className="mr-4">Creado {new Date(course.createdAt).toLocaleDateString()}</span>
                <span className={`px-2 py-1 rounded-full ${
                  course.status === 'PUBLISHED' 
                    ? 'bg-green-900 text-green-300' 
                    : course.status === 'IN_REVIEW'
                    ? 'bg-blue-900 text-blue-300'
                    : 'bg-yellow-900 text-yellow-300'
                }`}>
                  {course.status === 'PUBLISHED' ? 'Publicado' : course.status === 'IN_REVIEW' ? 'En Revisión' : 'Borrador'}
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
    <div className={`border rounded-lg overflow-hidden hover:border-gray-600 transition-colors group ${
      isDraft ? 'bg-gray-800 border-yellow-600/50' : 'bg-gray-800 border-gray-700'
    }`}>
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
        {/* <div className="absolute inset-0 bg-red-600 bg-opacity-0 group-hover:bg-opacity-20 transition-opacity" /> */}
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
          <span className={`px-2 py-1 rounded-full ${
            course.status === 'PUBLISHED' 
              ? 'bg-green-900 text-green-300' 
              : course.status === 'IN_REVIEW'
              ? 'bg-blue-900 text-blue-300'
              : 'bg-yellow-900 text-yellow-300'
          }`}>
            {course.status === 'PUBLISHED' ? 'Publicado' : course.status === 'IN_REVIEW' ? 'En Revisión' : 'Borrador'}
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
