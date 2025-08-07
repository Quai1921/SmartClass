import React from 'react';
import { ArrowLeft, BookOpen } from 'lucide-react';
import type { ModuleContext } from '../hooks';

interface NavigationSectionProps {
  moduleContext: ModuleContext;
  currentPage: any;
  onBackNavigation: () => void;
}

/**
 * Navigation section component - handles back button and module indicators
 */
export const NavigationSection: React.FC<NavigationSectionProps> = ({
  moduleContext,
  currentPage,
  onBackNavigation
}) => {
  return (
    <>
      {/* Back to Modules/Courses Button */}
      <button
        onClick={onBackNavigation}
        className="p-1.5 sm:p-2 rounded text-gray-300 hover:bg-gray-700 hover:text-gray-200"
        title="Volver a Módulos o Cursos"
      >
        <ArrowLeft size={16} className="sm:hidden" />
        <ArrowLeft size={18} className="hidden sm:block" />
      </button>

      {/* Course/Page Info (when editing pages) */}
      {currentPage && (
        <div className="flex items-center space-x-2 px-2 py-1 bg-blue-600 rounded text-white text-xs">
          <BookOpen size={14} />
          <span className="hidden sm:inline">{currentPage.title}</span>
          <span className="sm:hidden">Página</span>
        </div>
      )}

      {/* New Module Indicator (when creating from URL params) */}
      {!currentPage && moduleContext.title && moduleContext.action === 'new-module' && (
        <div className="flex items-center space-x-2 px-2 py-1 bg-green-600 rounded text-white text-xs">
          <BookOpen size={14} />
          <span className="hidden sm:inline">Nuevo Módulo: {moduleContext.title}</span>
          <span className="sm:hidden">Nuevo</span>
        </div>
      )}
    </>
  );
};
