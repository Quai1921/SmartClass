import React from 'react';
import { Home, ChevronRight } from 'lucide-react';
import type { Folder } from '../types';

interface BreadcrumbNavigationProps {
  currentPath: Folder[];
  onNavigateToFolder: (folderId: string | undefined) => void;
}

export const BreadcrumbNavigation: React.FC<BreadcrumbNavigationProps> = ({
  currentPath,
  onNavigateToFolder,
}) => {
  return (
    <div className="flex items-center gap-2 mb-6 text-sm">
      <button
        onClick={() => onNavigateToFolder(undefined)}
        className="flex items-center gap-1 px-3 py-1.5 rounded-lg hover:bg-gray-800 text-gray-400 hover:text-gray-200 transition-colors duration-200"
      >
        <Home size={16} />
        <span>Inicio</span>
      </button>
      
      {currentPath.map((folder) => (
        <React.Fragment key={folder.id}>
          <ChevronRight size={16} className="text-gray-600" />
          <button
            onClick={() => onNavigateToFolder(folder.id)}
            className="px-3 py-1.5 rounded-lg hover:bg-gray-800 text-gray-400 hover:text-gray-200 transition-colors duration-200"
          >
            {folder.name}
          </button>
        </React.Fragment>
      ))}
    </div>
  );
};
