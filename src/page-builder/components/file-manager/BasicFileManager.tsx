import React from 'react';
import { createPortal } from 'react-dom';
import { X, Upload, Folder } from 'lucide-react';

interface BasicFileManagerProps {
  isOpen: boolean;
  onClose: () => void;
  onFileSelect: (file: { url: string; name: string }) => void;
  isImageSelectionMode?: boolean;
}

export const BasicFileManager: React.FC<BasicFileManagerProps> = ({
  isOpen,
  onClose,
  onFileSelect,
  isImageSelectionMode = false,
}) => {
  if (!isOpen) return null;

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Create a temporary URL for the uploaded file
      const url = URL.createObjectURL(file);
      onFileSelect({
        url,
        name: file.name
      });
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
      <div className="bg-gray-900 rounded-lg shadow-xl w-[95vw] h-[90vh] max-w-4xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h2 className="text-xl font-semibold text-white">
            {isImageSelectionMode ? 'Seleccionar Imagen' : 'Administrador de Archivos'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors text-gray-400 hover:text-gray-200"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 p-6 flex flex-col items-center justify-center">
          <div className="text-center space-y-6">
            <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mx-auto">
              <Folder size={48} className="text-gray-400" />
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-white mb-2">
                File Manager Temporarily Disabled
              </h3>
              <p className="text-gray-400 mb-6">
                We're working on integrating a better file management solution. 
                For now, you can upload files directly.
              </p>
            </div>

            {/* Upload Button */}
            <label className="inline-flex items-center gap-3 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer transition-colors">
              <Upload size={20} />
              <span className="font-medium">Upload File</span>
              <input
                type="file"
                accept={isImageSelectionMode ? "image/*" : "*/*"}
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};
