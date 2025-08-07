import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { Folder as FolderIcon, Trash2, CheckCircle, Circle } from 'lucide-react';
import type { Folder } from '../types';

interface DroppableFolderProps {
  folder: Folder;
  onNavigateToFolder: (folderId: string) => void;
  onDeleteFolder?: (folderId: string) => void;
  // Multi-select props
  isMultiSelectMode?: boolean;
  isSelected?: boolean;
  onToggleSelection?: (folderId: string, event?: React.MouseEvent) => void;
}

export const DroppableFolder: React.FC<DroppableFolderProps> = ({
  folder,
  onNavigateToFolder,
  onDeleteFolder,
  // Multi-select props
  isMultiSelectMode = false,
  isSelected = false,
  onToggleSelection,
}) => {
  const { isOver, setNodeRef } = useDroppable({
    id: folder.id,
  });

  // Handle folder click - different behavior based on mode
  const handleClick = (e: React.MouseEvent) => {

    
    if (isMultiSelectMode && onToggleSelection) {
      // Multi-select mode: toggle selection
      onToggleSelection(folder.id, e);
    } else {
      // Normal mode: navigate to folder
      onNavigateToFolder(folder.id);
    }
  };

  return (
    <div
      ref={setNodeRef}
      className={`relative group cursor-pointer border-2 rounded-xl overflow-hidden transition-all duration-200 ease-out will-change-transform hover:scale-[1.02] ${
        isSelected 
          ? 'border-purple-500 ring-2 ring-purple-400/30 bg-purple-500/10'
          : isOver 
          ? 'border-green-500 ring-2 ring-green-400/30 bg-green-500/10' 
          : 'border-gray-700 hover:border-yellow-500'
      } ${
        isMultiSelectMode ? 'hover:border-purple-500 hover:ring-2 hover:ring-purple-400/20' : ''
      }`}
      onClick={handleClick}
      title={
        isMultiSelectMode 
          ? 'Haz clic para seleccionar/deseleccionar'
          : undefined
      }
    >
      {/* Multi-select indicator */}
      {isMultiSelectMode && (
        <div className="absolute top-2 left-2 z-20">
          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
            isSelected 
              ? 'bg-purple-600 border-purple-600 text-white' 
              : 'bg-gray-800/80 border-gray-400'
          }`}>
            {isSelected ? <CheckCircle size={14} /> : <Circle size={14} />}
          </div>
        </div>
      )}

      {/* Folder Preview */}
      <div className="aspect-[4/3] bg-gray-800 flex items-center justify-center">
        <FolderIcon size={48} className={
          isSelected ? "text-purple-500" 
          : isOver ? "text-green-500" 
          : "text-yellow-500"
        } />
      </div>

      {/* Folder Name and Date */}
      <div className="p-4 bg-gray-800/90">
        <p className="text-sm text-gray-300 truncate font-medium mb-2" title={folder.name}>
          {folder.name}
        </p>
        <p className="text-xs text-gray-500" title={`Creada: ${folder.createdAt.toLocaleDateString()}`}>
          {folder.createdAt.toLocaleDateString()}
        </p>
      </div>

      {/* Delete Button */}
      {onDeleteFolder && (
        <button
          className="absolute top-3 right-3 p-2 bg-red-600 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-700"
          onClick={(e) => {
            e.stopPropagation();
            onDeleteFolder(folder.id);
          }}
        >
          <Trash2 size={14} />
        </button>
      )}
    </div>
  );
};
