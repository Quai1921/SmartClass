import React from 'react';
import { File } from 'lucide-react';
import type { StoredFile } from '../types';

interface FileDragOverlayProps {
  file: StoredFile;
}

export const FileDragOverlay: React.FC<FileDragOverlayProps> = ({ file }) => {
  return (
    <div className="relative cursor-grabbing border-2 rounded-xl overflow-hidden border-blue-500 ring-2 ring-blue-400/50 shadow-2xl bg-gray-900 rotate-3 scale-105 will-change-transform">
      {/* File Preview */}
      <div className="aspect-[4/3] bg-gray-800 flex items-center justify-center">
        {file.type.startsWith('image/') ? (
          <img
            src={file.url}
            alt={file.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <File size={48} className="text-gray-500" />
        )}
      </div>

      {/* File Name and Date */}
      <div className="p-4 bg-gray-800">
        <p className="text-sm text-gray-300 truncate font-medium mb-2" title={file.name}>
          {file.name}
        </p>
        <p className="text-xs text-gray-500">
          {file.uploadedAt.toLocaleDateString()}
        </p>
      </div>
    </div>
  );
};
