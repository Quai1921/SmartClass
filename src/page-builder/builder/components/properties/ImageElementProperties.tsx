import React from 'react';
import type { Element } from '../../../types';
import { Tooltip } from './Tooltip';

export interface ImageElementPropertiesProps {
  element: Element;
  onPropertyChange: (property: string, value: any) => void;
  onElementUpdate: (elementId: string, updates: Partial<Element>) => void;
}

/**
 * Image element properties component
 * Handles image-specific properties like src, alt, and display options
 * Layout properties (dimensions, spacing) are handled by CommonLayoutProperties
 */
export const ImageElementProperties: React.FC<ImageElementPropertiesProps> = ({
  element,
  onPropertyChange,
  onElementUpdate
}) => {
  const imageSrc = element.properties.src || '';
  const imageAlt = element.properties.alt || '';
  const objectFit = element.properties.objectFit || 'cover';

  return (
    <>
      {/* Element Name and Source Section */}
      <div className="property-section">
        <h4 className="text-base font-semibold text-gray-200 mb-6">Configuración de Imagen</h4>
        
        {/* Element Name */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Nombre del Elemento
          </label>
          <input
            type="text"
            value={element.name || ''}
            onChange={(e) => onElementUpdate(element.id, { name: e.target.value })}
            className="w-full border border-gray-600 bg-gray-700 text-gray-200 rounded px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            placeholder="Imagen sin nombre"
          />
        </div>

        {/* Image Source */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            URL de la Imagen
          </label>
          <input
            type="url"
            value={imageSrc}
            onChange={(e) => onPropertyChange('src', e.target.value)}
            className="w-full border border-gray-600 bg-gray-700 text-gray-200 rounded px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            placeholder="https://ejemplo.com/imagen.jpg"
          />
        </div>

        {/* Alt Text */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Texto Alternativo (Alt)
          </label>
          <input
            type="text"
            value={imageAlt}
            onChange={(e) => onPropertyChange('alt', e.target.value)}
            className="w-full border border-gray-600 bg-gray-700 text-gray-200 rounded px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            placeholder="Descripción de la imagen..."
          />
        </div>

        {/* Image Preview */}
        {imageSrc && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Vista Previa
            </label>
            <div className="bg-gray-800 border border-gray-600 rounded p-4">
              <img
                src={imageSrc}
                alt={imageAlt}
                className="max-w-full max-h-32 mx-auto rounded"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Image-specific Display Section */}
      <div className="property-section">
        <h4 className="text-base font-semibold text-gray-200 mb-6">Visualización de Imagen</h4>
        
        {/* Object Fit */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Ajuste de Imagen
          </label>
          <select
            value={objectFit}
            onChange={(e) => onPropertyChange('objectFit', e.target.value)}
            className="w-full border border-gray-600 bg-gray-700 text-gray-200 rounded px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          >
            <option value="cover">Cubrir (Cover)</option>
            <option value="contain">Contener (Contain)</option>
            <option value="fill">Rellenar (Fill)</option>
            <option value="scale-down">Escalar Abajo</option>
            <option value="none">Ninguno</option>
          </select>
        </div>

        {/* Border Radius Slider */}
        <div className="mt-4">
          <Tooltip text="Controla qué tan redondeados están los bordes de la imagen. 0px = bordes rectos, valores más altos = más redondeado">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Redondez de Bordes: {element.properties.borderRadius || 0}px
            </label>
          </Tooltip>
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-400 w-8">0px</span>
            <input
              type="range"
              min="0"
              max="50"
              step="1"
              value={parseInt(String(element.properties.borderRadius || 0).replace('px', '')) || 0}
              onChange={(e) => {
                const value = parseInt(e.target.value);
                onPropertyChange('borderRadius', `${value}px`);
              }}
              className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer border-radius-slider"
              style={{
                background: `linear-gradient(to right, #4f46e5 0%, #4f46e5 ${(parseInt(String(element.properties.borderRadius || 0).replace('px', '')) || 0) * 2}%, #374151 ${(parseInt(String(element.properties.borderRadius || 0).replace('px', '')) || 0) * 2}%, #374151 100%)`
              }}
            />
            <span className="text-xs text-gray-400 w-10">50px</span>
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>Recto</span>
            <span>Redondeado</span>
          </div>
        </div>
      </div>

      {/* Accessibility and SEO Section */}
      <div className="property-section">
        <h4 className="text-base font-semibold text-gray-200 mb-6">Accesibilidad y SEO</h4>
        
        {/* Loading Strategy */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Estrategia de Carga
          </label>
          <select
            value={element.properties.loading || 'lazy'}
            onChange={(e) => onPropertyChange('loading', e.target.value)}
            className="w-full border border-gray-600 bg-gray-700 text-gray-200 rounded px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          >
            <option value="lazy">Carga Diferida (Lazy)</option>
            <option value="eager">Carga Inmediata (Eager)</option>
          </select>
        </div>

        {/* Title Attribute */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Título (Tooltip)
          </label>
          <input
            type="text"
            value={element.properties.title || ''}
            onChange={(e) => onPropertyChange('title', e.target.value)}
            className="w-full border border-gray-600 bg-gray-700 text-gray-200 rounded px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            placeholder="Texto que aparece al pasar el mouse..."
          />
        </div>
      </div>
    </>
  );
};
