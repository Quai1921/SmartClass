import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Upload, Folder, Image, File } from 'lucide-react';

interface SimpleFileManagerProps {
  isOpen: boolean;
  onClose: () => void;
  onFileSelect?: (fileUrl: string) => void;
  isImageSelectionMode?: boolean;
}

interface FileItem {
  id: string;
  name: string;
  url: string;
  type: 'image' | 'file';
  size: number;
  uploadedAt: string;
}

export const SimpleFileManager: React.FC<SimpleFileManagerProps> = ({
  isOpen,
  onClose,
  onFileSelect,
  isImageSelectionMode = false,
}) => {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);

  // Load files from your API
  const loadFiles = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Mock data for now - replace with your actual API call
      const mockFiles: FileItem[] = [
        {
          id: '1',
          name: 'sample-image.jpg',
          url: '/api/files/sample-image.jpg',
          type: 'image',
          size: 1024000,
          uploadedAt: new Date().toISOString(),
        },
        {
          id: '2', 
          name: 'document.pdf',
          url: '/api/files/document.pdf',
          type: 'file',
          size: 2048000,
          uploadedAt: new Date().toISOString(),
        }
      ];
      
      // Filter for images if in image selection mode
      const filteredFiles = isImageSelectionMode 
        ? mockFiles.filter(file => file.type === 'image')
        : mockFiles;
      
      setFiles(filteredFiles);
    } catch (err) {
      setError('Error loading files');
      // console.error('Error loading files:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Load files when component opens
  useEffect(() => {
    if (isOpen) {
      loadFiles();
    }
  }, [isOpen, isImageSelectionMode]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    setError(null);

    try {
      // Mock upload - replace with your actual API call
      const formData = new FormData();
      formData.append('file', file);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newFile: FileItem = {
        id: Date.now().toString(),
        name: file.name,
        url: URL.createObjectURL(file), // In real implementation, this would be the server URL
        type: file.type.startsWith('image/') ? 'image' : 'file',
        size: file.size,
        uploadedAt: new Date().toISOString(),
      };

      setFiles(prev => [newFile, ...prev]);
    } catch (err) {
      setError('Error uploading file');
      // console.error('Error uploading file:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileSelect = (file: FileItem) => {
    setSelectedFile(file);
    if (onFileSelect) {
      onFileSelect(file.url);
      onClose();
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
      <div className="bg-gray-900 rounded-lg shadow-xl w-[95vw] h-[90vh] max-w-6xl flex flex-col">
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

        {/* Toolbar */}
        <div className="p-4 border-b border-gray-700 bg-gray-800/50">
          <div className="flex items-center gap-4">
            {/* Upload Button */}
            <label className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer transition-colors duration-200">
              <Upload size={16} />
              <span className="font-medium">Subir archivo</span>
              <input
                type="file"
                accept={isImageSelectionMode ? "image/*" : "*"}
                onChange={handleFileUpload}
                className="hidden"
                disabled={isLoading}
              />
            </label>
            
            {isLoading && (
              <span className="text-sm text-blue-400 animate-pulse">Cargando...</span>
            )}
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="p-4 bg-red-900/50 border-l-4 border-red-500">
            <p className="text-red-300">{error}</p>
          </div>
        )}

        {/* File Grid */}
        <div className="flex-1 p-6 overflow-y-auto">
          {isLoading && files.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-gray-400">Cargando archivos...</div>
            </div>
          ) : files.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <Folder size={64} className="mb-4 opacity-50" />
              <p className="text-lg">No hay archivos</p>
              <p className="text-sm">Sube archivos para comenzar</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {files.map((file) => (
                <div
                  key={file.id}
                  onClick={() => handleFileSelect(file)}
                  className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 hover:scale-105 ${
                    selectedFile?.id === file.id
                      ? 'border-blue-500 bg-blue-900/20'
                      : 'border-gray-600 hover:border-gray-500 bg-gray-800'
                  }`}
                >
                  <div className="flex flex-col items-center">
                    {/* File Icon/Preview */}
                    <div className="w-16 h-16 mb-2 flex items-center justify-center">
                      {file.type === 'image' ? (
                        <img 
                          src={file.url} 
                          alt={file.name}
                          className="w-full h-full object-cover rounded"
                        />
                      ) : (
                        <File size={32} className="text-gray-400" />
                      )}
                    </div>
                    
                    {/* File Info */}
                    <div className="text-center">
                      <p className="text-sm font-medium text-white truncate w-full" title={file.name}>
                        {file.name}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {formatFileSize(file.size)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {selectedFile && (
          <div className="p-4 border-t border-gray-700 bg-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-300">
                  Archivo seleccionado: <span className="text-blue-400">{selectedFile.name}</span>
                </p>
                <p className="text-xs text-gray-500">
                  {formatFileSize(selectedFile.size)} • {selectedFile.type}
                </p>
              </div>
              <button
                onClick={() => handleFileSelect(selectedFile)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Seleccionar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
};
