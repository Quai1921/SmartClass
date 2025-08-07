import React from 'react';
import { Tooltip } from './Tooltip';
import type { Element } from '../../../types';

interface BackgroundImageSectionProps {
  element: Element;
  onPropertyChange: (property: string, value: any) => void;
}

export const BackgroundImageSection: React.FC<BackgroundImageSectionProps> = ({
  element,
  onPropertyChange,
}) => {
  const { properties } = element;

  return (
    <div className="property-section">
      <h4 className="text-sm font-semibold text-gray-200 mb-4">Imagen de fondo</h4>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          <div className="flex flex-col space-y-2">
            <Tooltip text="Establece una imagen de fondo para el contenedor. Puedes usar URLs de imágenes online o subir archivos locales.">
              <code className="text-[11px] font-bold bg-blue-100 text-blue-800 px-2 py-1 rounded border cursor-help w-fit">background-image</code>
            </Tooltip>
            <span className="text-gray-300">Imagen de fondo</span>
          </div>
        </label>
        
        <div className="space-y-3">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="URL de la imagen"
              value={properties.backgroundImage?.replace('url(', '').replace(')', '') || ''}
              onChange={(e) => {
                const url = e.target.value;
                onPropertyChange('backgroundImage', url ? `url(${url})` : '');
              }}
              className="flex-1 border border-gray-600 bg-gray-700 text-gray-200 rounded px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
            <button
              onClick={() => {
                const fileInput = document.createElement('input');
                fileInput.type = 'file';
                fileInput.accept = 'image/*';
                fileInput.style.display = 'none';

                fileInput.onchange = (e) => {
                  const file = (e.target as HTMLInputElement).files?.[0];
                  if (file) {
                    const imageUrl = URL.createObjectURL(file);
                    onPropertyChange('backgroundImage', `url(${imageUrl})`);
                  }
                  document.body.removeChild(fileInput);
                };

                fileInput.oncancel = () => {
                  document.body.removeChild(fileInput);
                };

                document.body.appendChild(fileInput);
                fileInput.click();
              }}
              className="px-3 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors whitespace-nowrap"
            >
              Subir
            </button>
          </div>

          {/* Background Image Controls */}
          {properties.backgroundImage && (
            <div className="space-y-3 p-3 bg-gray-700/50 rounded border border-gray-600">
              {/* Background Size */}
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-2">Tamaño</label>
                <select
                  value={properties.backgroundSize || 'cover'}
                  onChange={(e) => onPropertyChange('backgroundSize', e.target.value)}
                  className="w-full border border-gray-600 bg-gray-700 text-gray-200 rounded px-2 py-1 text-xs focus:border-blue-500"
                >
                  <option value="cover">Cubrir (cover)</option>
                  <option value="contain">Contener (contain)</option>
                  <option value="auto">Auto</option>
                </select>
              </div>

              {/* Background Position */}
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-2">Posición</label>
                <select
                  value={properties.backgroundPosition || 'center'}
                  onChange={(e) => onPropertyChange('backgroundPosition', e.target.value)}
                  className="w-full border border-gray-600 bg-gray-700 text-gray-200 rounded px-2 py-1 text-xs focus:border-blue-500"
                >
                  <option value="center">Centro</option>
                  <option value="top">Arriba</option>
                  <option value="bottom">Abajo</option>
                  <option value="left">Izquierda</option>
                  <option value="right">Derecha</option>
                  <option value="top left">Arriba Izquierda</option>
                  <option value="top right">Arriba Derecha</option>
                  <option value="bottom left">Abajo Izquierda</option>
                  <option value="bottom right">Abajo Derecha</option>
                </select>
              </div>

              {/* Background Repeat */}
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-2">Repetición</label>
                <select
                  value={properties.backgroundRepeat || 'no-repeat'}
                  onChange={(e) => onPropertyChange('backgroundRepeat', e.target.value)}
                  className="w-full border border-gray-600 bg-gray-700 text-gray-200 rounded px-2 py-1 text-xs focus:border-blue-500"
                >
                  <option value="no-repeat">No repetir</option>
                  <option value="repeat">Repetir</option>
                  <option value="repeat-x">Repetir horizontalmente</option>
                  <option value="repeat-y">Repetir verticalmente</option>
                </select>
              </div>

              {/* Border Radius for Container with Background Image */}
              <div>
                <Tooltip text="Controla qué tan redondeados están los bordes del contenedor. 0px = bordes rectos, valores más altos = más redondeado">
                  <label className="block text-xs font-medium text-gray-400 mb-2">
                    Redondez: {element.properties.borderRadius || 0}px
                  </label>
                </Tooltip>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500 w-8">0px</span>
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
                    className="flex-1 h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer border-radius-slider"
                    style={{
                      background: `linear-gradient(to right, #4f46e5 0%, #4f46e5 ${(parseInt(String(element.properties.borderRadius || 0).replace('px', '')) || 0) * 2}%, #374151 ${(parseInt(String(element.properties.borderRadius || 0).replace('px', '')) || 0) * 2}%, #374151 100%)`
                    }}
                  />
                  <span className="text-xs text-gray-500 w-10">50px</span>
                </div>
              </div>

              {/* Remove Background Image */}
              <button
                onClick={() => {
                  onPropertyChange('backgroundImage', undefined);
                  onPropertyChange('backgroundSize', undefined);
                  onPropertyChange('backgroundPosition', undefined);
                  onPropertyChange('backgroundRepeat', undefined);
                  onPropertyChange('backgroundAttachment', undefined);
                }}
                className="w-full px-2 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700 transition-colors"
              >
                Quitar imagen de fondo
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
