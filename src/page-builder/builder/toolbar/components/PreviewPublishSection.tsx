import React from 'react';
import { Eye } from 'lucide-react';
import type { ModuleContext } from '../hooks';

interface PreviewPublishSectionProps {
  moduleContext: ModuleContext;
  onPreview: () => void;
  onPublish: () => void;
}

/**
 * Preview and publish section component
 */
export const PreviewPublishSection: React.FC<PreviewPublishSectionProps> = ({
  moduleContext,
  onPreview,
  onPublish
}) => {
  return (
    <>
      {/* Module Type Display (from URL params) */}
      {moduleContext.moduleType && (
        <div className="hidden sm:flex items-center space-x-2">
          <span className="text-sm text-gray-400">Tipo de Módulo:</span>
          <span className="text-sm text-gray-200 px-2 py-1 bg-gray-700 rounded border border-gray-600">
            {moduleContext.moduleType === 'ACADEMIC' ? 'Académico' : 'Evaluativo'}
          </span>
        </div>
      )}
      
      {/* Preview/Publish - hidden on small screens */}
      <div className="hidden md:flex items-center space-x-2">
        <button 
          className="flex items-center space-x-1 px-3 py-1 text-sm border border-gray-600 text-gray-300 rounded hover:bg-gray-700 hover:text-gray-200" 
          onClick={onPreview}
          title="Vista Previa"
        >
          <Eye size={16} />
          <span>Vista Previa</span>
        </button>
        <button 
          className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700" 
          onClick={onPublish}
        >
          Publicar
        </button>
      </div>
    </>
  );
};
