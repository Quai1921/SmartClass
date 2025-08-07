import React from 'react';
import { ArrowLeft, BookOpen } from 'lucide-react';
import { useCourseBuilder } from '../hooks/useCourseBuilder';

interface CourseInfoProps {
  course: any;
  onBackNavigation: () => void;
  onCourseTypeChange: (type: 'Academico' | 'Evaluativo') => void;
}

export const CourseInfo: React.FC<CourseInfoProps> = ({
  course,
  onBackNavigation,
  onCourseTypeChange
}) => {
  const { currentPage } = useCourseBuilder();
  return (
    <div className="flex items-center space-x-2 sm:space-x-4 min-w-0">
      {/* Back to Modules/Courses Button */}
      <button
        onClick={onBackNavigation}
        className="flex items-center space-x-1 px-2 py-1 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors"
        title="Volver"
      >
        <ArrowLeft size={16} />
        <span className="hidden md:inline text-sm">
          {/* back text */}
        </span>
      </button>
      
      <h1 className="text-sm sm:text-lg font-semibold text-gray-200 truncate">
        <span className="hidden sm:inline">{course?.title || 'Page Builder'}</span>
        <span className="sm:hidden">{course?.title?.substring(0, 20) || 'Builder'}</span>
      </h1>
      
      {/* Course Page Indicator */}
      {currentPage && (
        <div className="flex items-center space-x-2 px-2 py-1 bg-blue-600 rounded text-white text-xs">
          <BookOpen size={14} />
          <span className="hidden sm:inline">Página del Curso</span>
          <span className="sm:hidden">Página</span>
        </div>
      )}
      
      <div className="hidden sm:block h-6 border-l border-gray-600" />
      
      <div className="hidden sm:flex items-center space-x-2">
        <span className="text-sm text-gray-400">Tipo:</span>
        <select
          value={course?.type || 'Academico'}
          onChange={(e) => onCourseTypeChange(e.target.value as 'Academico' | 'Evaluativo')}
          className="bg-gray-700 text-gray-200 text-sm px-2 py-1 rounded border border-gray-600 focus:outline-none focus:border-blue-500"
        >
          <option value="Academico">Académico</option>
          <option value="Evaluativo">Evaluativo</option>
        </select>
      </div>
    </div>
  );
};
