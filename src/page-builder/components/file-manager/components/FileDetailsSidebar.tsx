import React from 'react';
import { File } from 'lucide-react';
import type { StoredFile } from '../types';
import { formatFileSize } from '../utils/storage';

interface FileDetailsSidebarProps {
  selectedFile: StoredFile;
  onFileSelect?: (file: StoredFile) => void;
  onDeleteFile: (fileId: string) => void;
}

export const FileDetailsSidebar: React.FC<FileDetailsSidebarProps> = ({
  selectedFile,
  onFileSelect,
  onDeleteFile,
}) => {
  return (
    <div className="w-80 bg-gray-800 border-l border-gray-700 p-6 overflow-y-auto">
      <h3 className="font-semibold text-gray-100 mb-6 text-lg">Detalles del archivo</h3>
      
      {/* Preview */}
      <div className="mb-6">
        {selectedFile.type.startsWith('image/') ? (
          <img
            src={selectedFile.url}
            alt={selectedFile.name}
            className="w-full rounded-xl border border-gray-700 shadow-lg"
          />
        ) : (
          <div className="w-full h-32 bg-gray-700 rounded-xl flex items-center justify-center border border-gray-600">
            <File size={32} className="text-gray-400" />
          </div>
        )}
      </div>

      {/* File Info */}
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium text-gray-400 uppercase tracking-wide">Nombre</label>
          <p className="text-sm text-gray-200 mt-1 bg-gray-700/50 p-3 rounded-lg">{selectedFile.name}</p>
        </div>
        
        <div>
          <label className="text-sm font-medium text-gray-400 uppercase tracking-wide">Tamaño</label>
          <p className="text-sm text-gray-200 mt-1 bg-gray-700/50 p-3 rounded-lg">{formatFileSize(selectedFile.size)}</p>
        </div>
        
        <div>
          <label className="text-sm font-medium text-gray-400 uppercase tracking-wide">Tipo</label>
          <p className="text-sm text-gray-200 mt-1 bg-gray-700/50 p-3 rounded-lg">{selectedFile.type}</p>
        </div>
        
        <div>
          <label className="text-sm font-medium text-gray-400 uppercase tracking-wide">Subido</label>
          <p className="text-sm text-gray-200 mt-1 bg-gray-700/50 p-3 rounded-lg">
            {selectedFile.uploadedAt.toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-8 space-y-3">
        {onFileSelect && (
          <button
            onClick={() => onFileSelect(selectedFile)}
            className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
          >
            Seleccionar
          </button>
        )}
        
        <button
          onClick={() => onDeleteFile(selectedFile.id)}
          className="w-full px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 font-medium"
        >
          Eliminar
        </button>
      </div>
    </div>
  );
};
