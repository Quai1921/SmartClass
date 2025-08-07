import React from 'react';
import type { Element } from '../../../types';

interface StandaloneImageElementPropertiesProps {
  element: Element;
  onPropertyChange: (property: string, value: any) => void;
  onElementUpdate: (elementId: string, updates: Partial<Element>) => void;
  openImageChoiceModal?: (containerId: string, context?: 'ADD_ELEMENT' | 'SET_BACKGROUND') => void;
}

export const StandaloneImageElementProperties: React.FC<StandaloneImageElementPropertiesProps> = ({
  element,
  onPropertyChange,
  onElementUpdate,
  openImageChoiceModal,
}) => {
  const properties = element.properties || {};

  const handlePropertyChange = (property: string, value: any) => {
    onPropertyChange(property, value);
  };

  const handleImageChange = () => {
    if (openImageChoiceModal) {
      openImageChoiceModal(element.id, 'SET_BACKGROUND');
    }
  };

  return (
    <div className="bg-gray-800 text-white p-4 space-y-6">
      <h3 className="text-lg font-medium text-white mb-4">
        Elemento Imagen Independiente
      </h3>

      {/* Element Type */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Tipo de Contenido
        </label>
        <select
          value={properties.standaloneElementType || 'image'}
          onChange={(e) => handlePropertyChange('standaloneElementType', e.target.value)}
          className="w-full px-3 py-2 text-sm bg-gray-700 border border-gray-600 rounded text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        >
          <option value="image">Imagen</option>
          <option value="text">Texto</option>
          <option value="mixed">Mixto</option>
        </select>
      </div>

      {/* Image Section - only show for image or mixed types */}
      {(properties.standaloneElementType === 'image' || properties.standaloneElementType === 'mixed' || !properties.standaloneElementType) && (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Imagen del Elemento
            </label>
            <div className="bg-gray-700 border border-gray-600 rounded p-4 mb-3">
              <img 
                src={(() => {
                  // Extract URL from CSS url() wrapper if present, prioritize backgroundImage
                  const imageUrl = properties.backgroundImage || properties.standaloneImageUrl;
                  if (!imageUrl) return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjEyMCIgdmlld0JveD0iMCAwIDEyMCAxMjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjAiIGhlaWdodD0iMTIwIiByeD0iOCIgZmlsbD0iIzRmNDZlNSIvPgo8dGV4dCB4PSI2MCIgeT0iNjciIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIzNiIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiPvCfk6Y8L3RleHQ+Cjwvc3ZnPgo=';
                  
                  // Remove url("...") wrapper if present
                  const match = imageUrl.match(/url\(['"]?(.*?)['"]?\)/);
                  return match ? match[1] : imageUrl;
                })()} 
                alt={properties.standaloneImageAlt || 'Element image'}
                className="w-full h-32 object-contain bg-gray-600 rounded"
                style={{ backgroundColor: properties.standaloneBackgroundTransparent ? 'transparent' : '#4b5563' }}
              />
            </div>
            <button
              onClick={handleImageChange}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded text-sm font-medium transition-colors"
            >
              Cambiar Imagen
            </button>
          </div>

          {/* Image URL */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              URL de la Imagen
            </label>
            <input
              type="text"
              value={(() => {
                // Show the actual URL, prioritize backgroundImage and extract from CSS wrapper
                const imageUrl = properties.backgroundImage || properties.standaloneImageUrl;
                if (!imageUrl) return '';
                
                // Remove url("...") wrapper if present
                const match = imageUrl.match(/url\(['"]?(.*?)['"]?\)/);
                return match ? match[1] : imageUrl;
              })()}
              onChange={(e) => {
                const newUrl = e.target.value;
                // Update both properties for compatibility
                handlePropertyChange('backgroundImage', newUrl ? `url("${newUrl}")` : '');
                handlePropertyChange('standaloneImageUrl', newUrl);
              }}
              className="w-full px-3 py-2 text-sm bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              placeholder="URL de la imagen o data:image/svg+xml..."
            />
          </div>

          {/* Alt Text */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Texto Alternativo
            </label>
            <input
              type="text"
              value={properties.standaloneImageAlt || ''}
              onChange={(e) => handlePropertyChange('standaloneImageAlt', e.target.value)}
              className="w-full px-3 py-2 text-sm bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              placeholder="Descripción de la imagen"
            />
          </div>

          {/* Image Fit */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Ajuste de Imagen
            </label>
            <select
              value={properties.standaloneImageFit || 'contain'}
              onChange={(e) => {
                handlePropertyChange('standaloneImageFit', e.target.value);
                // Also update backgroundSize for compatibility
                handlePropertyChange('backgroundSize', e.target.value);
              }}
              className="w-full px-3 py-2 text-sm bg-gray-700 border border-gray-600 rounded text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            >
              <option value="contain">Contener (mantener proporción)</option>
              <option value="cover">Cubrir (llenar área)</option>
              <option value="fill">Rellenar (estirar)</option>
              <option value="none">Tamaño original</option>
            </select>
          </div>

          {/* Transparent Background */}
          <div>
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={properties.standaloneBackgroundTransparent !== false}
                onChange={(e) => {
                  handlePropertyChange('standaloneBackgroundTransparent', e.target.checked);
                  // Also update backgroundColor for compatibility
                  handlePropertyChange('backgroundColor', e.target.checked ? 'transparent' : '#ffffff');
                }}
                className="w-4 h-4 text-blue-600 border-gray-600 bg-gray-700 rounded focus:ring-blue-500 focus:ring-2"
              />
              <span className="text-sm text-gray-300">Fondo transparente</span>
            </label>
            <p className="text-xs text-gray-500 mt-1">
              Permite que imágenes PNG con transparencia se vean correctamente
            </p>
          </div>
        </>
      )}

      {/* Text Section - only show for text or mixed types */}
      {(properties.standaloneElementType === 'text' || properties.standaloneElementType === 'mixed') && (
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Texto del Elemento
          </label>
          <input
            type="text"
            value={properties.text || ''}
            onChange={(e) => handlePropertyChange('text', e.target.value)}
            className="w-full px-3 py-2 text-sm bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            placeholder="Texto del elemento"
          />
        </div>
      )}

      {/* Ownership Information (read-only) */}
      {(properties.ownedBy || properties.dragDropOwner) && (
        <div className="bg-gray-700 p-3 rounded">
          <h4 className="text-sm font-medium text-gray-300 mb-2">Información de Propiedad</h4>
          <p className="text-xs text-gray-400">
            Este elemento pertenece a un widget drag-drop
          </p>
          {properties.ownedBy && (
            <p className="text-xs text-gray-500">
              Owner ID: {properties.ownedBy}
            </p>
          )}
          {properties.originalPosition && (
            <p className="text-xs text-gray-500">
              Posición original: ({properties.originalPosition.x}, {properties.originalPosition.y})
            </p>
          )}
        </div>
      )}
    </div>
  );
};
