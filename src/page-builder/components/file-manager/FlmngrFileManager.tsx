import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { FlmngrHandler, defaultFlmngrConfig } from './FlmngrConfig';

interface FlmngrFileManagerProps {
  isOpen: boolean;
  onClose: () => void;
  onFileSelect?: (file: { url: string; name: string }) => void;
  isImageSelectionMode?: boolean;
}

export const FlmngrFileManager: React.FC<FlmngrFileManagerProps> = ({
  isOpen,
  onClose,
  onFileSelect,
  isImageSelectionMode = false,
}) => {
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [isFlmngrLoaded, setIsFlmngrLoaded] = useState(false);

  // Load Flmngr script dynamically
  useEffect(() => {
    if (!isOpen) return;

    const script = document.createElement('script');
    script.src = 'https://cdn.flmngr.com/flmngr.js';
    script.async = true;
    script.onload = () => {
      setIsFlmngrLoaded(true);
    };
    script.onerror = () => {
      // console.error('❌ Failed to load Flmngr script');
    };

    document.head.appendChild(script);

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, [isOpen]);

  const openFlmngr = () => {
    if (!(window as any).Flmngr) {
      // console.error('❌ Flmngr not loaded');
      return;
    }

    (window as any).Flmngr.open({
      apiKey: defaultFlmngrConfig.apiKey,
      urlFileManager: defaultFlmngrConfig.urlFileManager,
      urlFiles: defaultFlmngrConfig.urlFiles,
      
      // Appearance
      theme: defaultFlmngrConfig.theme,
      language: defaultFlmngrConfig.language,
      
      // File selection settings
      isMultiple: false,
      acceptExtensions: isImageSelectionMode ? 
        ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'] : 
        null,
      
      // Custom API handler - route all requests through our handler
      onRequestSign: async (req: any) => {
        try {
          const response = await FlmngrHandler.handleRequest(req);
          return response;
        } catch (error) {
          // console.error('❌ API error:', error);
          return {
            files: [],
            error: error instanceof Error ? error.message : 'Unknown error'
          };
        }
      },
      
      // Callbacks
      onFinish: (files: any[]) => {
        if (files && files.length > 0 && onFileSelect) {
          const file = files[0];
          onFileSelect({
            url: file.url || file.p, // Use URL or path
            name: file.name || file.p.split('/').pop() || 'Unknown'
          });
        }
        onClose();
      },
      
      onCancel: () => {
        onClose();
      },
      
      // Upload settings
      maxUploadFileSize: 10 * 1024 * 1024, // 10MB
      
      // UI customization
      height: 600,
      width: 900,
    });
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
      <div className="bg-gray-900 rounded-lg shadow-xl w-[95vw] h-[90vh] max-w-7xl flex flex-col">
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
          {!isFlmngrLoaded ? (
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-gray-400">Cargando administrador de archivos...</p>
            </div>
          ) : (
            <div className="text-center space-y-6">
              <div>
                <h3 className="text-lg font-medium text-white mb-2">
                  Administrador de Archivos SmartClass
                </h3>
                <p className="text-gray-400 mb-6">
                  Gestiona tus archivos e imágenes con nuestro administrador integrado
                </p>
              </div>

              <button
                onClick={openFlmngr}
                className="px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-lg"
              >
                Abrir Administrador de Archivos
              </button>
              
              {isImageSelectionMode && (
                <p className="text-sm text-blue-400">
                  Solo se mostrarán archivos de imagen
                </p>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-700 bg-gray-800">
          <p className="text-xs text-gray-400 text-center">
            Powered by Flmngr • Integrado con SmartClass API
          </p>
        </div>
      </div>
    </div>,
    document.body
  );
};
