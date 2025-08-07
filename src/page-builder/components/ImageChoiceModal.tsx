import React, { useState } from 'react';
import { X, Image as ImageIcon, Palette, FolderOpen } from 'lucide-react';
// // import { FileManager } from './file-manager';
// import { BasicFileManager } from './file-manager/BasicFileManager'; // TEMPORARILY DISABLED
// import { FlmngrFileManager } from './file-manager/FlmngrFileManager'; // TEMPORARILY DISABLED
import { WorkingFileManager } from './file-manager/WorkingFileManager';
import type { StoredFile } from './file-manager/types';

interface ImageChoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onChoice: (useAsBackground: boolean, imageUrl?: string) => void;
  fileManagerImageUrl?: string | null;
  onFileManagerSelect?: (imageUrl: string) => void;
  context?: 'ADD_ELEMENT' | 'SET_BACKGROUND'; // Add this prop
}

export const ImageChoiceModal: React.FC<ImageChoiceModalProps> = ({ 
  isOpen, 
  onClose, 
  onChoice,
  fileManagerImageUrl,
  onFileManagerSelect,
  context = 'ADD_ELEMENT', // Set default context
}) => {
  const [isFileManagerOpen, setIsFileManagerOpen] = useState(false);
  const [selectedImageUrl, setSelectedImageUrl] = useState<string | null>(null);
  const [showImageUseChoice, setShowImageUseChoice] = useState(false);

  const handleFileManagerSelect = (file: StoredFile) => {
    setSelectedImageUrl(file.url);
    setIsFileManagerOpen(false);
    setShowImageUseChoice(true);
    // Also notify parent component
    onFileManagerSelect?.(file.url);
  };

  const handleImageUseChoice = (useAsBackground: boolean) => {
    if (selectedImageUrl) {
      // Pass both the choice and the image URL to the parent
      onChoice(useAsBackground, selectedImageUrl);
    } else {
      onChoice(useAsBackground);
    }
    setShowImageUseChoice(false);
    setSelectedImageUrl(null);
    onClose();
  };

  // If we have a file manager image URL from parent, show the choice modal
  const shouldShowImageChoice = showImageUseChoice || (fileManagerImageUrl && isOpen);
  const imageToShow = selectedImageUrl || fileManagerImageUrl;
  if (!isOpen && !shouldShowImageChoice) return null;

  return (
    <>
      {/* Main Choice Modal */}
      {isOpen && !isFileManagerOpen && !showImageUseChoice && (
        <div className="fixed inset-0 bg-black/40 backdrop-filter backdrop-blur-lg flex items-center justify-center z-[10000]">
          <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4 border border-gray-700 shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">Agregar Imagen</h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Description */}
            <p className="text-gray-300 mb-6 text-center">
              Elige cómo quieres agregar una imagen:
            </p>

            {/* Choice buttons */}
            <div className="space-y-3">
              {/* File Manager option */}
              <button
                onClick={() => {
                  setIsFileManagerOpen(true);
                  // Don't close the main modal here, let the file manager handle it
                }}
                className="w-full p-4 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors flex items-center space-x-3"
              >
                <div className="p-2 bg-purple-700 rounded-lg">
                  <FolderOpen size={24} />
                </div>
                <div className="flex-1 text-left">
                  <h3 className="font-medium">Seleccionar de archivos</h3>
                  <p className="text-sm text-purple-100">
                    Elegir una imagen guardada en el gestor de archivos
                  </p>
                </div>
              </button>

              {/* Direct Background option */}
              <button
                onClick={() => onChoice(true)}
                className="w-full p-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center space-x-3"
              >
                <div className="p-2 bg-blue-700 rounded-lg">
                  <Palette size={24} />
                </div>
                <div className="flex-1 text-left">
                  <h3 className="font-medium">Subir como fondo</h3>
                  <p className="text-sm text-blue-100">
                    Subir nueva imagen para usar como fondo del contenedor
                  </p>
                </div>
              </button>

              {/* Direct Element option */}
              <button
                onClick={() => onChoice(false)}
                className="w-full p-4 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex items-center space-x-3"
              >
                <div className="p-2 bg-green-700 rounded-lg">
                  <ImageIcon size={24} />
                </div>
                <div className="flex-1 text-left">
                  <h3 className="font-medium">Subir como elemento</h3>
                  <p className="text-sm text-green-100">
                    Subir nueva imagen como elemento independiente
                  </p>
                </div>
              </button>
            </div>

            {/* Cancel button */}
            <button
              onClick={onClose}
              className="w-full mt-4 p-3 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg transition-colors"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Image Use Choice Modal (after file selection) */}
      {shouldShowImageChoice && imageToShow && (
        <div className="fixed inset-0 bg-black/40 backdrop-filter backdrop-blur-lg flex items-center justify-center z-[10001]">
          <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4 border border-gray-700 shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">¿Cómo usar esta imagen?</h2>
              <button
                onClick={() => {
                  setShowImageUseChoice(false);
                  setSelectedImageUrl(null);
                }}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Selected Image Preview */}
            <div className="mb-6">
              <img 
                src={imageToShow} 
                alt="Selected image" 
                className="w-full h-32 object-cover rounded-lg border border-gray-600"
              />
            </div>

            {/* Description */}
            <p className="text-gray-300 mb-6 text-center">
              Elige cómo quieres usar esta imagen:
            </p>

            {/* Choice buttons */}
            <div className="space-y-3">
              {/* Background option */}
              <button
                onClick={() => handleImageUseChoice(true)}
                className="w-full p-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center space-x-3"
              >
                <div className="p-2 bg-blue-700 rounded-lg">
                  <Palette size={24} />
                </div>
                <div className="flex-1 text-left">
                  <h3 className="font-medium">Fondo del contenedor</h3>
                  <p className="text-sm text-blue-100">
                    Usar como imagen de fondo que cubre todo el contenedor
                  </p>
                </div>
              </button>

              {/* Element option */}
              <button
                onClick={() => handleImageUseChoice(false)}
                className="w-full p-4 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex items-center space-x-3"
              >
                <div className="p-2 bg-green-700 rounded-lg">
                  <ImageIcon size={24} />
                </div>
                <div className="flex-1 text-left">
                  <h3 className="font-medium">Elemento independiente</h3>
                  <p className="text-sm text-green-100">
                    Crear un elemento de imagen que puedes mover y redimensionar
                  </p>
                </div>
              </button>
            </div>

            {/* Cancel button */}
            <button
              onClick={() => {
                if (fileManagerImageUrl) {
                  // If we're showing choice for file manager image, just close
                  onClose();
                } else {
                  // If we're showing choice for local selection, reset local state
                  setShowImageUseChoice(false);
                  setSelectedImageUrl(null);
                }
              }}
              className="w-full mt-4 p-3 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg transition-colors"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Working File Manager with Tree Structure */}
      <WorkingFileManager
        isOpen={isFileManagerOpen}
        onClose={() => {
          setIsFileManagerOpen(false);
          // Don't close the main modal, just show it again
        }}
        onFileSelect={(file) => {
          setIsFileManagerOpen(false);
          setSelectedImageUrl(file.url);
          setShowImageUseChoice(true);
        }}
        isImageSelectionMode={true}
      />
    </>
  );
};
