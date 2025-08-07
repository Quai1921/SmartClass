import React, { useState, useRef } from 'react';
import { Upload, Image, Link, X } from 'lucide-react';
import type { Element } from '../types';

interface ImageWidgetProps {
  element: Element;
  isSelected?: boolean;
  onUpdate?: (updates: Partial<Element['properties']>) => void;
}

interface ImageUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImageSelect: (src: string, alt?: string) => void;
}

export const ImageUploadModal: React.FC<ImageUploadModalProps> = ({ isOpen, onClose, onImageSelect }) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'url'>('upload');
  const [urlInput, setUrlInput] = useState('');
  const [altInput, setAltInput] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileSelect = async (file: File) => {
    if (file && file.type.startsWith('image/')) {
      setIsLoading(true);
      try {
        const imageUrl = URL.createObjectURL(file);
        onImageSelect(imageUrl, altInput || file.name);
        onClose();
      } catch (error) {
        // console.error('Error processing image:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleUrlSubmit = () => {
    if (urlInput.trim()) {
      onImageSelect(urlInput.trim(), altInput.trim() || undefined);
      onClose();
    }
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text && (text.startsWith('http') || text.startsWith('data:'))) {
        setUrlInput(text);
      }
    } catch (err) {
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-filter backdrop-blur-lg flex items-center justify-center z-[99999]">
      <div className="relative bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4 border border-gray-600">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-200">Seleccionar Imagen</h3>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="text-gray-400 hover:text-gray-200 transition-colors disabled:opacity-50"
          >
            <X size={20} />
          </button>
        </div>

        {isLoading && (
          <div className="absolute inset-0 bg-gray-800/90 rounded-lg flex items-center justify-center z-10">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
              <p className="text-gray-200 text-sm">Procesando imagen...</p>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex mb-4 bg-gray-700 rounded-lg p-1">
          <button
            onClick={() => setActiveTab('upload')}
            className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'upload'
                ? 'bg-blue-600 text-white'
                : 'text-gray-300 hover:text-white'
            }`}
          >
            <Upload size={16} className="inline mr-2" />
            Subir Archivo
          </button>
          <button
            onClick={() => setActiveTab('url')}
            className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'url'
                ? 'bg-blue-600 text-white'
                : 'text-gray-300 hover:text-white'
            }`}
          >
            <Link size={16} className="inline mr-2" />
            URL/Pegar
          </button>
        </div>

        {/* Upload Tab */}
        {activeTab === 'upload' && (
          <div className="space-y-4">
            <div
              onDrop={handleDrop}
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragOver(true);
              }}
              onDragLeave={() => setIsDragOver(false)}
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                isDragOver
                  ? 'border-blue-400 bg-blue-50/10'
                  : 'border-gray-600 hover:border-gray-500'
              }`}
            >
              <Image size={48} className="mx-auto mb-4 text-gray-400" />
              <p className="text-sm text-gray-300 mb-2">
                Arrastra una imagen aquí o
              </p>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                Seleccionar Archivo
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileInput}
                className="hidden"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Texto alternativo (opcional)
              </label>
              <input
                type="text"
                placeholder="Descripción de la imagen"
                value={altInput}
                onChange={(e) => setAltInput(e.target.value)}
                className="w-full border border-gray-600 bg-gray-700 text-gray-200 rounded px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>
        )}

        {/* URL Tab */}
        {activeTab === 'url' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                URL de la imagen
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  placeholder="https://ejemplo.com/imagen.jpg"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  className="flex-1 border border-gray-600 bg-gray-700 text-gray-200 rounded px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
                <button
                  onClick={handlePaste}
                  className="px-3 py-2 bg-gray-600 text-gray-200 rounded hover:bg-gray-500 transition-colors text-sm"
                >
                  Pegar
                </button>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Texto alternativo (opcional)
              </label>
              <input
                type="text"
                placeholder="Descripción de la imagen"
                value={altInput}
                onChange={(e) => setAltInput(e.target.value)}
                className="w-full border border-gray-600 bg-gray-700 text-gray-200 rounded px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>

            {urlInput && (
              <div className="p-3 bg-gray-700/50 rounded border border-gray-600">
                <p className="text-xs text-gray-400 mb-2">Vista previa:</p>
                <img
                  src={urlInput}
                  alt="Vista previa"
                  className="max-w-full h-20 object-cover rounded"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              </div>
            )}

            <button
              onClick={handleUrlSubmit}
              disabled={!urlInput.trim()}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Usar esta imagen
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export const ImageWidget: React.FC<ImageWidgetProps> = ({ element, isSelected, onUpdate }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const { properties } = element;
  const hasImage = properties.src && properties.src !== 'https://via.placeholder.com/300x200?text=Imagen';

  const handleImageSelect = (src: string, alt?: string) => {
    onUpdate?.({
      src,
      alt: alt || 'Imagen'
    });
  };

  const handleRemoveImage = () => {
    onUpdate?.({
      src: '',
      alt: ''
    });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    const imageFile = files.find(file => file.type.startsWith('image/'));
    
    if (imageFile) {
      const imageUrl = URL.createObjectURL(imageFile);
      handleImageSelect(imageUrl, imageFile.name);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  if (!hasImage) {
    return (
      <>
        <div
          onClick={() => setIsModalOpen(true)}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`
            relative w-full min-h-[150px] border-2 border-dashed rounded-lg 
            flex flex-col items-center justify-center cursor-pointer transition-all
            hover:border-blue-400 hover:bg-blue-50/10 group
            ${isDragOver 
              ? 'border-blue-500 bg-blue-50/20 border-solid scale-[1.02]' 
              : 'border-gray-300'
            }
            ${isSelected ? 'border-blue-500 bg-blue-50/20' : ''}
            ${properties.className || ''}
          `}
          style={properties.style}
        >
          {/* Drag overlay for placeholder */}
          {isDragOver && (
            <div className="absolute inset-0 bg-blue-500/20 border-2 border-blue-500 border-solid rounded-lg flex items-center justify-center z-10">
              <div className="text-center text-blue-700">
                <Upload size={48} className="mx-auto mb-2" />
                <p className="font-medium text-lg">Suelta la imagen aquí</p>
                <p className="text-sm opacity-75">Se agregará automáticamente</p>
              </div>
            </div>
          )}
          
          <div className="text-center p-6">
            <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center transition-all ${
              isDragOver 
                ? 'bg-blue-200 scale-110' 
                : 'bg-gray-100 group-hover:bg-blue-100'
            }`}>
              <div className="relative">
                <Image size={32} className={`transition-colors ${
                  isDragOver 
                    ? 'text-blue-600' 
                    : 'text-gray-400 group-hover:text-blue-500'
                }`} />
                <div className={`absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center transition-all ${
                  isDragOver 
                    ? 'bg-blue-600 scale-110' 
                    : 'bg-gray-300 group-hover:bg-blue-500'
                }`}>
                  <span className={`text-xs font-bold transition-colors ${
                    isDragOver 
                      ? 'text-white' 
                      : 'text-white group-hover:text-white'
                  }`}>+</span>
                </div>
              </div>
            </div>
            <h3 className={`text-lg font-medium mb-2 transition-colors ${
              isDragOver 
                ? 'text-blue-700' 
                : 'text-gray-600 group-hover:text-blue-600'
            }`}>
              {isDragOver ? 'Suelta tu imagen' : 'Agregar Imagen'}
            </h3>
            <p className={`text-sm mb-4 transition-colors ${
              isDragOver 
                ? 'text-blue-600' 
                : 'text-gray-500'
            }`}>
              {isDragOver 
                ? 'La imagen se agregará cuando la sueltes' 
                : 'Haz clic, arrastra o pega una imagen'
              }
            </p>
            {!isDragOver && (
              <div className="flex flex-wrap justify-center gap-2 text-xs text-gray-400">
                <span className="bg-gray-100 px-2 py-1 rounded group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">📁 Subir archivo</span>
                <span className="bg-gray-100 px-2 py-1 rounded group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">🔗 Pegar URL</span>
                <span className="bg-gray-100 px-2 py-1 rounded group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">⬇ Arrastrar</span>
              </div>
            )}
          </div>
        </div>

        <ImageUploadModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onImageSelect={handleImageSelect}
        />
      </>
    );
  }

  return (
    <div 
      className={`relative group ${properties.className || ''}`} 
      style={properties.style}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      <img
        src={properties.src}
        alt={properties.alt || 'Imagen'}
        className={`max-w-full h-auto block transition-all ${
          isDragOver ? 'opacity-50 scale-[0.98]' : ''
        }`}
      />
      
      {/* Drag overlay */}
      {isDragOver && (
        <div className="absolute inset-0 bg-blue-500/20 border-2 border-blue-500 border-dashed rounded flex items-center justify-center">
          <div className="text-center text-blue-700">
            <Image size={48} className="mx-auto mb-2" />
            <p className="font-medium">Suelta para reemplazar</p>
          </div>
        </div>
      )}
      
      {/* Edit overlay */}
      {isSelected && !isDragOver && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="flex gap-2">
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-3 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors"
            >
              Cambiar
            </button>
            <button
              onClick={handleRemoveImage}
              className="px-3 py-2 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition-colors"
            >
              Quitar
            </button>
          </div>
        </div>
      )}

      <ImageUploadModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onImageSelect={handleImageSelect}
      />
    </div>
  );
};
