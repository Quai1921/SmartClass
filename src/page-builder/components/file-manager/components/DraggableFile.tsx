import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { File, Trash2, CheckCircle, Circle } from 'lucide-react';
import type { StoredFile } from '../types';

interface DraggableFileProps {
  file: StoredFile;
  selectedFile: StoredFile | null;
  onFileSelect: (file: StoredFile) => void;
  onFileDoubleClick?: (file: StoredFile) => void;
  onDeleteFile: (fileId: string) => void;
  isImageSelectionMode?: boolean; // New prop to enable single-click image selection
  // Multi-select props
  isMultiSelectMode?: boolean;
  isSelected?: boolean;
  onToggleSelection?: (fileId: string, event?: React.MouseEvent) => void;
}

export const DraggableFile: React.FC<DraggableFileProps> = ({
  file,
  selectedFile,
  onFileSelect,
  onFileDoubleClick,
  onDeleteFile,
  isImageSelectionMode = false,
  // Multi-select props
  isMultiSelectMode = false,
  isSelected = false,
  onToggleSelection,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    isDragging,
  } = useDraggable({
    id: file.id,
  });

  // In image selection mode or multi-select mode, we want to prioritize clicking over dragging
  const dragProps = (isImageSelectionMode || isMultiSelectMode) ? {} : listeners;

  // Handle click - different behavior based on mode
  const handleClick = (e: React.MouseEvent) => {
    if (isMultiSelectMode && onToggleSelection) {
      // Multi-select mode: toggle selection
      onToggleSelection(file.id, e);
    } else if (isImageSelectionMode && file.type.startsWith('image/')) {
      // In image selection mode, clicking an image should immediately select it
      e.preventDefault();
      e.stopPropagation();
      
      // For image selection mode, we want to immediately select the file
      onFileSelect(file);
      
      // For backward compatibility, also call the double click handler
      // This ensures both the widget and container background flows work
      if (onFileDoubleClick) {
        onFileDoubleClick(file);
      }
    } else {
      // Normal mode: just set as selected file
      onFileSelect(file);
    }
  };

  // Handle delete with proper event stopping
  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Also stop drag events
    e.nativeEvent.stopImmediatePropagation();
    onDeleteFile(file.id);
  };

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      className={`relative group cursor-pointer border-2 rounded-xl overflow-hidden transition-all duration-200 ease-out will-change-transform hover:scale-[1.02] ${
        isSelected 
          ? 'border-purple-500 ring-2 ring-purple-400/30 bg-purple-500/10'
          : selectedFile?.id === file.id
          ? 'border-blue-500 ring-2 ring-blue-400/30'
          : 'border-gray-700 hover:border-gray-600'
      } ${isDragging ? 'opacity-50' : ''} ${
        isImageSelectionMode && file.type.startsWith('image/') 
          ? 'hover:border-green-500 hover:ring-2 hover:ring-green-400/20' 
          : ''
      } ${
        isMultiSelectMode ? 'hover:border-purple-500 hover:ring-2 hover:ring-purple-400/20' : ''
      }`}
      onClick={handleClick}
      onDoubleClick={() => !isMultiSelectMode && onFileDoubleClick?.(file)}
      title={
        isMultiSelectMode 
          ? 'Haz clic para seleccionar/deseleccionar'
          : isImageSelectionMode && file.type.startsWith('image/') 
          ? 'Haz clic para seleccionar esta imagen' 
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

      {/* Drag Handle Area - Apply drag listeners to the main content area, not the entire container */}
      <div 
        {...dragProps}
        className="w-full h-full"
      >
        {/* File Preview */}
        <div className="aspect-[4/3] bg-gray-800 flex items-center justify-center relative">
          {file.type.startsWith('image/') && file.url ? (
            <>
              <img
                src={file.url}
                alt={file.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Hide the image and show the fallback icon
                  e.currentTarget.style.display = 'none';
                  const fallbackIcon = e.currentTarget.parentElement?.querySelector('.fallback-icon');
                  if (fallbackIcon) {
                    (fallbackIcon as HTMLElement).style.display = 'block';
                  }
                }}
              />
              {/* Fallback icon (hidden by default) */}
              <File size={48} className="text-gray-500 fallback-icon" style={{ display: 'none' }} />
              {/* Selection Mode Indicator */}
              {isImageSelectionMode && (
                <div className="absolute inset-0 bg-green-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                  <div className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                    Clic para seleccionar
                  </div>
                </div>
              )}
            </>
          ) : (
            <File size={48} className="text-gray-500" />
          )}
        </div>

        {/* File Name and Date */}
        <div className="p-4 bg-gray-800/90">
          <p className="text-sm text-gray-300 truncate font-medium mb-2" title={file.name}>
            {file.name}
          </p>
          <p className="text-xs text-gray-500" title={`Subido: ${file.uploadedAt.toLocaleDateString()}`}>
            {file.uploadedAt.toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Delete Button - Outside of drag handle area */}
      <button
        className="absolute top-3 right-3 p-2 bg-red-600 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-700 z-10"
        onClick={handleDelete}
        onMouseDown={(e) => {
          // Prevent drag start when clicking delete button
          e.stopPropagation();
        }}
        onTouchStart={(e) => {
          // Prevent drag start on touch devices
          e.stopPropagation();
        }}
        title="Eliminar archivo"
      >
        <Trash2 size={14} />
      </button>
    </div>
  );
};
