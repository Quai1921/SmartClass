import React, { useState } from 'react';
import { FileManager } from '../FileManager';
import type { StoredFile } from '../types';

/**
 * Example usage of the server-based file manager
 * Shows how to integrate with the page builder
 */
export const FileManagerExample: React.FC = () => {
  const [isFileManagerOpen, setIsFileManagerOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<StoredFile[]>([]);

  const handleFileSelect = (file: StoredFile) => {
    
    // Add to selected files
    setSelectedFiles(prev => [...prev, file]);
    
    // Close file manager
    setIsFileManagerOpen(false);
    
    // Here you would typically:
    // 1. For images: Set as background or create image element
    // 2. For other files: Handle according to file type
    
    if (file.type.startsWith('image/')) {
      // Example: Use as page builder background
      // updatePageBackground(file.url);
    }
  };

  const handleRemoveFile = (fileId: string) => {
    setSelectedFiles(prev => prev.filter(f => f.id !== fileId));
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">File Manager Example</h1>
        
        {/* File Manager Trigger */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">File Manager Integration</h2>
          <button
            onClick={() => setIsFileManagerOpen(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            📁 Open File Manager
          </button>
          
          <div className="mt-4 text-sm text-gray-600">
            <p><strong>Features:</strong></p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>✅ Server-based storage (fully server-driven)</li>
              <li>✅ File upload with drag-and-drop support</li>
              <li>✅ Folder creation and navigation</li>
              <li>✅ File moving between folders</li>
              <li>✅ Search and filtering</li>
              <li>✅ Development mode with API testing</li>
            </ul>
          </div>
        </div>

        {/* Selected Files Display */}
        {selectedFiles.length > 0 && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Selected Files</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {selectedFiles.map((file) => (
                <div key={file.id} className="border rounded-lg p-4 relative">
                  <button
                    onClick={() => handleRemoveFile(file.id)}
                    className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full text-xs hover:bg-red-600"
                  >
                    ×
                  </button>
                  
                  {file.type.startsWith('image/') ? (
                    <img
                      src={file.url}
                      alt={file.name}
                      className="w-full h-32 object-cover rounded mb-2"
                    />
                  ) : (
                    <div className="w-full h-32 bg-gray-100 rounded mb-2 flex items-center justify-center">
                      <span className="text-gray-500 text-sm">📄</span>
                    </div>
                  )}
                  
                  <h3 className="font-medium text-sm truncate">{file.name}</h3>
                  <p className="text-xs text-gray-500 mt-1">
                    {file.type} • {Math.round(file.size / 1024)}KB
                  </p>
                  <p className="text-xs text-gray-400">
                    {file.uploadedAt.toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* File Manager Modal */}
        <FileManager
          isOpen={isFileManagerOpen}
          onClose={() => setIsFileManagerOpen(false)}
          onFileSelect={handleFileSelect}
          isImageSelectionMode={true}
        />
      </div>
    </div>
  );
};

export default FileManagerExample;
