import React from 'react';
import { BookOpen, FileText } from 'lucide-react';

interface ModuleHeaderProps {
  courseInfo: any;
  currentModuleInfo: any;
}

export const ModuleHeader: React.FC<ModuleHeaderProps> = ({
  courseInfo,
  currentModuleInfo
}) => {
  return (
    <div className="p-4 border-b border-gray-700">
      <div className="flex items-center space-x-2 mb-2">
        <BookOpen className="w-5 h-5 text-blue-400" />
        <h3 className="font-medium text-white truncate">{courseInfo.title}</h3>
        {courseInfo.isDraft && (
          <span className="px-2 py-1 text-xs bg-orange-500 text-white rounded">
            BORRADOR
          </span>
        )}
      </div>
      
      {/* Current Module Info */}
      {currentModuleInfo && (
        <div className="flex items-center space-x-2 text-sm text-gray-300">
          <FileText className="w-4 h-4" />
          <span>Módulo actual: {currentModuleInfo.title}</span>
        </div>
      )}
    </div>
  );
};
