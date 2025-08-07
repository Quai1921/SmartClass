import React, { useState, useEffect } from 'react';
import { Upload, X } from 'lucide-react';
import type { Element } from '../../../types';

interface ImageComparisonPropertiesProps {
  element: Element;
  onPropertyChange: (property: string, value: any) => void;
  onElementUpdate?: (elementId: string, updates: any) => void;
  openImageChoiceModal?: (containerId: string, context?: 'ADD_ELEMENT' | 'SET_BACKGROUND') => void;
}

export const ImageComparisonProperties: React.FC<ImageComparisonPropertiesProps> = ({
  element,
  onPropertyChange,
  onElementUpdate,
  openImageChoiceModal,
}) => {
  const properties = element.properties;
  const [imageModalOpen, setImageModalOpen] = useState<'true' | 'false' | null>(null);

  const handleImageSelect = (type: 'true' | 'false', src: string, alt?: string) => {
    if (type === 'true') {
      onPropertyChange('trueImageUrl', src);
      if (alt) onPropertyChange('trueImageAlt', alt);
    } else {
      onPropertyChange('falseImageUrl', src);
      if (alt) onPropertyChange('falseImageAlt', alt);
    }
    
    // Force a re-render by updating the element if onElementUpdate is available
    if (onElementUpdate) {
      const updates = type === 'true' 
        ? { trueImageUrl: src, trueImageAlt: alt || element.properties.trueImageAlt }
        : { falseImageUrl: src, falseImageAlt: alt || element.properties.falseImageAlt };
        
      onElementUpdate(element.id, {
        properties: {
          ...element.properties,
          ...updates
        }
      });
    }
    
    setImageModalOpen(null);
    
    // Clear the global callback after use
    (window as any).connectionImageCallback = null;
    (window as any).connectionImageElementId = null;
  };

  const handleOpenImageModal = (type: 'true' | 'false') => {
    // Set up global callback for image selection
    (window as any).connectionImageCallback = (src: string, alt?: string) => {
      handleImageSelect(type, src, alt);
    };
    (window as any).connectionImageElementId = element.id;
    
    if (openImageChoiceModal) {
      // Use the proper image choice modal with file manager integration
      openImageChoiceModal(element.id, 'ADD_ELEMENT');
    } else {
      // Fallback to simple modal
      setImageModalOpen(type);
    }
  };

  // Ensure callback persists for this component
  useEffect(() => {
    // Set up and maintain the callback reference
    if ((window as any).connectionImageElementId === element.id) {
      // Callback is already set in handleOpenImageModal
    }
    
    return () => {
      // Only clear if this is our callback
      if ((window as any).connectionImageElementId === element.id) {
        // Don't clear the callback during cleanup - let it persist until the modal closes
      }
    };
  }, [element.id]);

  const removeImage = (type: 'true' | 'false') => {
    if (type === 'true') {
      onPropertyChange('trueImageUrl', '');
      onPropertyChange('trueImageAlt', '');
    } else {
      onPropertyChange('falseImageUrl', '');
      onPropertyChange('falseImageAlt', '');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h4 className="text-lg font-semibold text-gray-200 mb-4">Configuración de Comparación de Imágenes</h4>
      </div>

      {/* True Image */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-3">Imagen Correcta (Opción A)</label>
        
        {properties.trueImageUrl ? (
          <div className="relative">
            <img
              src={properties.trueImageUrl}
              alt={properties.trueImageAlt || 'Imagen correcta'}
              className="w-full h-32 object-cover rounded border border-gray-600"
            />
            <button
              onClick={() => removeImage('true')}
              className="absolute top-2 right-2 p-1 bg-red-600 hover:bg-red-700 text-white rounded-full"
            >
              <X size={16} />
            </button>
          </div>
        ) : (
          <div className="w-full h-32 bg-gray-700 border-2 border-dashed border-gray-500 rounded flex items-center justify-center">
            <div className="text-center text-gray-400">
              <Upload size={24} className="mx-auto mb-2" />
              <div className="text-sm">Sin imagen correcta</div>
            </div>
          </div>
        )}
        
        <div className="mt-3 flex gap-2">
          <button
            onClick={() => handleOpenImageModal('true')}
            className="px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded text-sm"
          >
            {properties.trueImageUrl ? 'Cambiar imagen correcta' : 'Seleccionar imagen correcta'}
          </button>
          {properties.trueImageUrl && (
            <button
              onClick={() => removeImage('true')}
              className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded text-sm"
            >
              Quitar
            </button>
          )}
        </div>

        {/* True Image Alt Text */}
        <div className="mt-3">
          <input
            type="text"
            value={properties.trueImageAlt || ''}
            onChange={(e) => onPropertyChange('trueImageAlt', e.target.value)}
            className="w-full border border-gray-600 bg-gray-700 text-gray-200 rounded px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            placeholder="Descripción de la imagen correcta..."
          />
        </div>
      </div>

      {/* False Image */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-3">Imagen Incorrecta (Opción B)</label>
        
        {properties.falseImageUrl ? (
          <div className="relative">
            <img
              src={properties.falseImageUrl}
              alt={properties.falseImageAlt || 'Imagen incorrecta'}
              className="w-full h-32 object-cover rounded border border-gray-600"
            />
            <button
              onClick={() => removeImage('false')}
              className="absolute top-2 right-2 p-1 bg-red-600 hover:bg-red-700 text-white rounded-full"
            >
              <X size={16} />
            </button>
          </div>
        ) : (
          <div className="w-full h-32 bg-gray-700 border-2 border-dashed border-gray-500 rounded flex items-center justify-center">
            <div className="text-center text-gray-400">
              <Upload size={24} className="mx-auto mb-2" />
              <div className="text-sm">Sin imagen incorrecta</div>
            </div>
          </div>
        )}
        
        <div className="mt-3 flex gap-2">
          <button
            onClick={() => handleOpenImageModal('false')}
            className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded text-sm"
          >
            {properties.falseImageUrl ? 'Cambiar imagen incorrecta' : 'Seleccionar imagen incorrecta'}
          </button>
          {properties.falseImageUrl && (
            <button
              onClick={() => removeImage('false')}
              className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded text-sm"
            >
              Quitar
            </button>
          )}
        </div>

        {/* False Image Alt Text */}
        <div className="mt-3">
          <input
            type="text"
            value={properties.falseImageAlt || ''}
            onChange={(e) => onPropertyChange('falseImageAlt', e.target.value)}
            className="w-full border border-gray-600 bg-gray-700 text-gray-200 rounded px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            placeholder="Descripción de la imagen incorrecta..."
          />
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

      {/* Instructions */}
      <div className="bg-blue-900/30 border border-blue-600/50 rounded-lg p-3">
        <p className="text-xs text-blue-300">
          💡 <strong>Tip:</strong> Los usuarios verán ambas imágenes y deberán seleccionar la correcta (Opción A).
        </p>
      </div>

      {/* Image Modal */}
      {/* Fallback Image Modal (when openImageChoiceModal is not available) */}
      {imageModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-200 mb-4">
              Seleccionar Imagen {imageModalOpen === 'true' ? 'Correcta' : 'Incorrecta'}
            </h3>
            <p className="text-gray-400 mb-4">Aquí se integraría el selector de imágenes del sistema.</p>
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setImageModalOpen(null)}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleImageSelect(
                  imageModalOpen!, 
                  imageModalOpen === 'true' 
                    ? 'https://via.placeholder.com/300x200/22c55e/ffffff?text=Imagen+Correcta' 
                    : 'https://via.placeholder.com/300x200/ef4444/ffffff?text=Imagen+Incorrecta',
                  imageModalOpen === 'true' ? 'Imagen correcta de ejemplo' : 'Imagen incorrecta de ejemplo'
                )}
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
