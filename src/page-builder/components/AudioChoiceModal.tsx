import React, { useState } from 'react';
import { X, AudioWaveform, FolderOpen, Palette } from 'lucide-react';
import { WorkingFileManager } from './file-manager/WorkingFileManager';

interface AudioChoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onChoice: (useAsBackground: boolean, audioUrl?: string) => void;
  fileManagerAudioUrl?: string | null;
  onFileManagerSelect?: (audioUrl: string) => void;
  context?: 'ADD_ELEMENT' | 'SET_BACKGROUND';
}

export const AudioChoiceModal: React.FC<AudioChoiceModalProps> = ({ 
  isOpen, 
  onClose, 
  onChoice,
  fileManagerAudioUrl,
  onFileManagerSelect,
  context = 'ADD_ELEMENT',
}) => {
  const [selectedAudioUrl, setSelectedAudioUrl] = useState<string | null>(null);
  const [showAudioUseChoice, setShowAudioUseChoice] = useState(false);
  const [isFileManagerOpen, setIsFileManagerOpen] = useState(false);

  const handleFileManagerSelect = (file: { url: string; name: string }) => {
    setSelectedAudioUrl(file.url);
    setIsFileManagerOpen(false);
    setShowAudioUseChoice(true);
    // Also notify parent component
    onFileManagerSelect?.(file.url);
  };

  const handleAudioUseChoice = (useAsBackground: boolean) => {
    if (selectedAudioUrl) {
      // Pass both the choice and the audio URL to the parent
      onChoice(useAsBackground, selectedAudioUrl);
    } else {
      onChoice(useAsBackground);
    }
    setShowAudioUseChoice(false);
    setSelectedAudioUrl(null);
    onClose();
  };

  // If we have a file manager audio URL from parent, show the choice modal
  const shouldShowAudioChoice = showAudioUseChoice || (fileManagerAudioUrl && isOpen);
  const audioToShow = selectedAudioUrl || fileManagerAudioUrl;
  if (!isOpen && !shouldShowAudioChoice) return null;

  return (
    <>
      {/* Main Choice Modal */}
      {isOpen && !isFileManagerOpen && !showAudioUseChoice && (
        <div className="fixed inset-0 bg-black/40 backdrop-filter backdrop-blur-lg flex items-center justify-center z-[10000]">
          <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4 border border-gray-700 shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">Agregar Audio</h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Description */}
            <p className="text-gray-300 mb-6 text-center">
              Elige cómo quieres agregar un audio:
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
                    Elegir un audio guardado en el gestor de archivos
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
                    Subir nuevo audio para usar como fondo del contenedor
                  </p>
                </div>
              </button>

              {/* Direct Element option */}
              <button
                onClick={() => onChoice(false)} // This should trigger upload modal
                className="w-full p-4 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex items-center space-x-3"
              >
                <div className="p-2 bg-green-700 rounded-lg">
                  <AudioWaveform size={24} />
                </div>
                <div className="flex-1 text-left">
                  <h3 className="font-medium">Subir como elemento</h3>
                  <p className="text-sm text-green-100">
                    Subir nuevo audio como elemento independiente
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

      {/* Audio Use Choice Modal */}
      {shouldShowAudioChoice && audioToShow && (
        <div className="fixed inset-0 bg-black/40 backdrop-filter backdrop-blur-lg flex items-center justify-center z-[10001]">
          <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4 border border-gray-700 shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">¿Cómo usar este audio?</h2>
              <button
                onClick={() => {
                  setShowAudioUseChoice(false);
                  setSelectedAudioUrl(null);
                  onClose();
                }}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Audio Preview */}
            <div className="mb-6">
              <audio
                src={audioToShow}
                className="w-full"
                controls
              />
            </div>

            {/* Choice buttons for audio usage */}
            <div className="space-y-3">
              <button
                onClick={() => handleAudioUseChoice(true)}
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
                onClick={() => handleAudioUseChoice(false)}
                className="w-full p-4 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex items-center space-x-3"
              >
                <div className="p-2 bg-green-700 rounded-lg">
                  <AudioWaveform size={24} />
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
                setShowAudioUseChoice(false);
                setSelectedAudioUrl(null);
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
