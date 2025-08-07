import React, { useState, useEffect } from 'react';
import { Upload, X } from 'lucide-react';
import type { Element } from '../../../types';
import { TrueFalseButtonTabs } from './common/TrueFalseButtonTabs';

interface ImageChoicePropertiesProps {
  element: Element;
  onPropertyChange: (property: string, value: any) => void;
  onElementUpdate?: (elementId: string, updates: any) => void;
  openImageChoiceModal?: (containerId: string, context?: 'ADD_ELEMENT' | 'SET_BACKGROUND') => void;
}

export const ImageChoiceProperties: React.FC<ImageChoicePropertiesProps> = ({
  element,
  onPropertyChange,
  onElementUpdate,
  openImageChoiceModal,
}) => {
  const properties: any = element.properties;
  const [imageModalOpen, setImageModalOpen] = useState(false);

  const handleImageSelect = (src: string, alt?: string) => {
    // Update properties
    onPropertyChange('imageUrl', src);
    if (alt) {
      onPropertyChange('imageAlt', alt);
    }
    
    // Force a re-render by updating the element if onElementUpdate is available
    if (onElementUpdate) {
      onElementUpdate(element.id, {
        properties: {
          ...element.properties,
          imageUrl: src,
          imageAlt: alt || element.properties.imageAlt
        }
      });
    }
    
    setImageModalOpen(false);
    
    // Clear the global callback after use
    (window as any).connectionImageCallback = null;
    (window as any).connectionImageElementId = null;
  };

  const handleOpenImageModal = () => {
    // Set up global callback for image selection (like ConnectionImageNode)
    (window as any).connectionImageCallback = handleImageSelect;
    (window as any).connectionImageElementId = element.id;
    
    if (openImageChoiceModal) {
      // Use the proper image choice modal with file manager integration
      openImageChoiceModal(element.id, 'ADD_ELEMENT');
    } else {
      // Fallback to simple modal
      setImageModalOpen(true);
    }
  };

  const removeImage = () => {
    onPropertyChange('imageUrl', '');
    onPropertyChange('imageAlt', '');
  };

  // Ensure callback persists for this component
  useEffect(() => {
    // Set up and maintain the callback reference
    if ((window as any).connectionImageElementId === element.id) {
      (window as any).connectionImageCallback = handleImageSelect;
    }
    
    return () => {
      // Only clear if this is our callback
      if ((window as any).connectionImageElementId === element.id) {
        // Don't clear the callback during cleanup - let it persist until the modal closes
      }
    };
  }, [element.id, handleImageSelect]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h4 className="text-lg font-semibold text-gray-200 mb-4">Configuración de Imagen V/F</h4>
      </div>

      {/* Image Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-3">Imagen</label>
        
        {properties.imageUrl ? (
          <div className="relative">
            <img
              src={properties.imageUrl}
              alt={properties.imageAlt || 'Imagen seleccionada'}
              className="w-full h-32 object-cover rounded border border-gray-600"
            />
            <button
              onClick={removeImage}
              className="absolute top-2 right-2 p-1 bg-red-600 hover:bg-red-700 text-white rounded-full"
            >
              <X size={16} />
            </button>
          </div>
        ) : (
          <div className="w-full h-32 bg-gray-700 border-2 border-dashed border-gray-500 rounded flex items-center justify-center">
            <div className="text-center text-gray-400">
              <Upload size={24} className="mx-auto mb-2" />
              <div className="text-sm">Sin imagen seleccionada</div>
            </div>
          </div>
        )}
        
        <div className="mt-3 flex gap-2">
          <button
            onClick={handleOpenImageModal}
            className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm"
          >
            {properties.imageUrl ? 'Cambiar imagen' : 'Seleccionar imagen'}
          </button>
          {properties.imageUrl && (
            <button
              onClick={removeImage}
              className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded text-sm"
            >
              Quitar imagen
            </button>
          )}
        </div>
      </div>

      {/* Image Alt Text */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Texto Alternativo</label>
        <input
          type="text"
          value={properties.imageAlt || ''}
          onChange={(e) => onPropertyChange('imageAlt', e.target.value)}
          className="w-full border border-gray-600 bg-gray-700 text-gray-200 rounded px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
          placeholder="Descripción de la imagen para accesibilidad..."
        />
      </div>

      {/* Correct Answer */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-3">Respuesta Correcta</label>
        <div className="flex gap-4">
          <label className="flex items-center">
            <input
              type="radio"
              name="correctAnswer"
              checked={properties.correctAnswer === true}
              onChange={() => onPropertyChange('correctAnswer', true)}
              className="mr-2 text-blue-600 bg-gray-700 border-gray-600 focus:ring-blue-500"
            />
            <span className="text-gray-300">Verdadero</span>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="correctAnswer"
              checked={properties.correctAnswer === false}
              onChange={() => onPropertyChange('correctAnswer', false)}
              className="mr-2 text-blue-600 bg-gray-700 border-gray-600 focus:ring-blue-500"
            />
            <span className="text-gray-300">Falso</span>
          </label>
        </div>
      </div>

      {/* Feedback Message */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Mensaje de Retroalimentación</label>
        <textarea
          value={properties.feedbackMessage || ''}
          onChange={(e) => onPropertyChange('feedbackMessage', e.target.value)}
          className="w-full border border-gray-600 bg-gray-700 text-gray-200 rounded px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
          placeholder="Mensaje opcional mostrado después de responder..."
          rows={2}
        />
      </div>

      {/* Settings */}
      <div className="space-y-4">
        <h5 className="text-sm font-medium text-gray-300 border-b border-gray-600 pb-2">Configuración</h5>
        
        {/* Allow Retry */}
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="allowRetry"
            checked={properties.allowRetry !== false}
            onChange={(e) => onPropertyChange('allowRetry', e.target.checked)}
            className="h-4 w-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
          />
          <label htmlFor="allowRetry" className="text-sm font-medium text-gray-300">
            Permitir reintentos
          </label>
        </div>
      </div>

      {/* Background Color */}
      <div>
        <label className="block text-xs font-medium text-gray-400 mb-2">Color de Fondo</label>
        <div className="flex items-center space-x-2">
          <input
            type="color"
            value={properties.backgroundColor || '#f8fafc'}
            onChange={(e) => onPropertyChange('backgroundColor', e.target.value)}
            className="w-8 h-8 border border-gray-600 rounded cursor-pointer"
          />
          <input
            type="text"
            value={properties.backgroundColor || '#f8fafc'}
            onChange={(e) => onPropertyChange('backgroundColor', e.target.value)}
            className="flex-1 border border-gray-600 bg-gray-700 text-gray-200 rounded px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            placeholder="#f8fafc"
          />
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-blue-900/30 border border-blue-600/50 rounded-lg p-3">
        <p className="text-xs text-blue-300">
          💡 <strong>Tip:</strong> Los usuarios verán la imagen y podrán seleccionar si es Verdadero o Falso.
        </p>
      </div>

      {/* Button Styling */}
      <div className="space-y-4">
        <h5 className="text-sm font-medium text-gray-300 border-b border-gray-600 pb-2">Personalización de Botones</h5>
        <TrueFalseButtonTabs
          properties={properties}
          onPropertyChange={onPropertyChange}
        />
      </div>

      {/* Fallback Image Modal (when openImageChoiceModal is not available) */}
      {imageModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-200 mb-4">Seleccionar Imagen</h3>
            <p className="text-gray-400 mb-4">Aquí se integraría el selector de imágenes del sistema.</p>
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setImageModalOpen(false)}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleImageSelect('https://via.placeholder.com/300x200/6366f1/ffffff?text=Imagen+de+Ejemplo', 'Imagen de ejemplo')}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
              >
                Usar Imagen de Ejemplo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
