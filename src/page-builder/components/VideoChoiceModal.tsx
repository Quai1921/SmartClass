import React, { useState } from 'react';
import { X, Video as VideoIcon, FolderOpen, Palette } from 'lucide-react';
import { WorkingFileManager } from './file-manager/WorkingFileManager';

interface VideoChoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onChoice: (useAsBackground: boolean, videoUrl?: string) => void;
  fileManagerVideoUrl?: string | null;
  onFileManagerSelect?: (videoUrl: string) => void;
  context?: 'ADD_ELEMENT' | 'SET_BACKGROUND';
}

export const VideoChoiceModal: React.FC<VideoChoiceModalProps> = ({ 
  isOpen, 
  onClose, 
  onChoice,
  fileManagerVideoUrl,
  onFileManagerSelect,
  context = 'ADD_ELEMENT',
}) => {
  const [selectedVideoUrl, setSelectedVideoUrl] = useState<string | null>(null);
  const [showVideoUseChoice, setShowVideoUseChoice] = useState(false);
  const [isFileManagerOpen, setIsFileManagerOpen] = useState(false);

  const handleFileManagerSelect = (file: { url: string; name: string }) => {
    setSelectedVideoUrl(file.url);
    setIsFileManagerOpen(false);
    setShowVideoUseChoice(true);
    // Also notify parent component
    onFileManagerSelect?.(file.url);
  };

  const handleVideoUseChoice = (useAsBackground: boolean) => {
    if (selectedVideoUrl) {
      // Pass both the choice and the video URL to the parent
      onChoice(useAsBackground, selectedVideoUrl);
    } else {
      onChoice(useAsBackground);
    }
    setShowVideoUseChoice(false);
    setSelectedVideoUrl(null);
    onClose();
  };

  // If we have a file manager video URL from parent, show the choice modal
  const shouldShowVideoChoice = showVideoUseChoice || (fileManagerVideoUrl && isOpen);
  const videoToShow = selectedVideoUrl || fileManagerVideoUrl;
  if (!isOpen && !shouldShowVideoChoice) return null;

  return (
    <>
      {/* Main Choice Modal */}
      {isOpen && !isFileManagerOpen && !showVideoUseChoice && (
        <div className="fixed inset-0 bg-black/40 backdrop-filter backdrop-blur-lg flex items-center justify-center z-[10000]">
          <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4 border border-gray-700 shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">Agregar Video</h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Description */}
            <p className="text-gray-300 mb-6 text-center">
              Elige cómo quieres agregar un video:
            </p>

            {/* Choice buttons */}
            <div className="space-y-3">
              {/* File Manager option */}
              <button
                onClick={() => {
                  setIsFileManagerOpen(true);
                }}
                className="w-full p-4 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors flex items-center space-x-3"
              >
                <div className="p-2 bg-purple-700 rounded-lg">
                  <FolderOpen size={24} />
                </div>
                <div className="flex-1 text-left">
                  <h3 className="font-medium">Seleccionar de archivos</h3>
                  <p className="text-sm text-purple-100">
                    Elegir un video guardado en el gestor de archivos
                  </p>
                </div>
              </button>

              {/* Direct Background option */}
              <button
                onClick={() => onChoice(true)} // This should trigger upload modal
                className="w-full p-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center space-x-3"
              >
                <div className="p-2 bg-blue-700 rounded-lg">
                  <Palette size={24} />
                </div>
                <div className="flex-1 text-left">
                  <h3 className="font-medium">Subir como fondo</h3>
                  <p className="text-sm text-blue-100">
                    Subir nuevo video para usar como fondo del contenedor
                  </p>
                </div>
              </button>

              {/* Direct Element option */}
              <button
                onClick={() => onChoice(false)} // This should trigger upload modal
                className="w-full p-4 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex items-center space-x-3"
              >
                <div className="p-2 bg-green-700 rounded-lg">
                  <VideoIcon size={24} />
                </div>
                <div className="flex-1 text-left">
                  <h3 className="font-medium">Subir como elemento</h3>
                  <p className="text-sm text-green-100">
                    Subir nuevo video como elemento independiente
                  </p>
                </div>
              </button>
            </div>

            {/* Cancel button */}
            <button
              onClick={onClose}
              className="w-full mt-6 p-3 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg transition-colors"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Video Use Choice Modal */}
      {shouldShowVideoChoice && videoToShow && (
        <div className="fixed inset-0 bg-black/40 backdrop-filter backdrop-blur-lg flex items-center justify-center z-[10001]">
          <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4 border border-gray-700 shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">¿Cómo usar este video?</h2>
              <button
                onClick={() => {
                  setShowVideoUseChoice(false);
                  setSelectedVideoUrl(null);
                  onClose();
                }}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Video Preview */}
            <div className="mb-6">
              <video
                src={videoToShow}
                className="w-full h-32 object-cover rounded-lg"
                controls={false}
              />
            </div>

            {/* Choice buttons for video usage */}
            <div className="space-y-3">
              <button
                onClick={() => handleVideoUseChoice(true)}
                className="w-full p-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center space-x-3"
              >
                <div className="p-2 bg-blue-700 rounded-lg">
                  <Palette size={24} />
                </div>
                <div className="flex-1 text-left">
                  <h3 className="font-medium">Usar como fondo</h3>
                  <p className="text-sm text-blue-100">
                    Aplicar como fondo del contenedor
                  </p>
                </div>
              </button>

              <button
                onClick={() => handleVideoUseChoice(false)}
                className="w-full p-4 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex items-center space-x-3"
              >
                <div className="p-2 bg-green-700 rounded-lg">
                  <VideoIcon size={24} />
                </div>
                <div className="flex-1 text-left">
                  <h3 className="font-medium">Usar como elemento</h3>
                  <p className="text-sm text-green-100">
                    Agregar como elemento independiente
                  </p>
                </div>
              </button>
            </div>

            {/* Cancel button */}
            <button
              onClick={() => {
                setShowVideoUseChoice(false);
                setSelectedVideoUrl(null);
                onClose();
              }}
              className="w-full mt-6 p-3 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg transition-colors"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* File Manager */}
      {isFileManagerOpen && (
        <WorkingFileManager
          isOpen={isFileManagerOpen}
          onClose={() => setIsFileManagerOpen(false)}
          onFileSelect={handleFileManagerSelect}
          isImageSelectionMode={false}
        />
      )}
    </>
  );
};
