import React from 'react';
import { Image as ImageIcon } from 'lucide-react';

interface EmptyStateProps {
  currentFolderId: string | undefined;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ currentFolderId }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-gray-400">
      <div className="p-6 rounded-full bg-gray-800/50 mb-6">
        <ImageIcon size={64} className="text-gray-500" />
      </div>
      <p className="text-lg font-medium text-gray-300 mb-2">
        {currentFolderId ? 'Esta carpeta está vacía' : 'No hay archivos guardados'}
      </p>
      <p className="text-sm text-gray-500">
        {currentFolderId ? 'Sube archivos o crea carpetas aquí' : 'Sube tu primer archivo para comenzar'}
      </p>
    </div>
  );
};
