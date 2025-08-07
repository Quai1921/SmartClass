import React from 'react';

interface StylingTabProps {
  properties: any;
  onPropertyChange: (property: string, value: any) => void;
}

export const StylingTab: React.FC<StylingTabProps> = ({ properties, onPropertyChange }) => {
  return (
    <div className="space-y-6">
      {/* Dimensions */}
      <div className="space-y-4">
        <h5 className="text-md font-medium text-gray-300">Dimensiones</h5>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Ancho</label>
            <input
              type="number"
              value={properties.width || ''}
              onChange={(e) => onPropertyChange('width', e.target.value ? parseInt(e.target.value) : undefined)}
              className="w-full border border-gray-600 bg-gray-700 text-gray-200 rounded px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
              placeholder="120"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Altura</label>
            <input
              type="number"
              value={properties.height || ''}
              onChange={(e) => onPropertyChange('height', e.target.value ? parseInt(e.target.value) : undefined)}
              className="w-full border border-gray-600 bg-gray-700 text-gray-200 rounded px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
              placeholder="120"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Ancho Mín</label>
            <input
              type="number"
              value={properties.minWidth || ''}
              onChange={(e) => onPropertyChange('minWidth', e.target.value ? parseInt(e.target.value) : undefined)}
              className="w-full border border-gray-600 bg-gray-700 text-gray-200 rounded px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
              placeholder="60"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Altura Mín</label>
            <input
              type="number"
              value={properties.minHeight || ''}
              onChange={(e) => onPropertyChange('minHeight', e.target.value ? parseInt(e.target.value) : undefined)}
              className="w-full border border-gray-600 bg-gray-700 text-gray-200 rounded px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
              placeholder="60"
            />
          </div>
        </div>
      </div>
      {/* Image Properties */}
      {(properties.contentType !== 'text' || properties.imageSrc) && (
        <div className="space-y-4">
          <h5 className="text-md font-medium text-gray-300">Propiedades de Imagen</h5>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Ancho Img</label>
              <input
                type="number"
                value={properties.imageWidth || ''}
                onChange={(e) => onPropertyChange('imageWidth', e.target.value ? parseInt(e.target.value) : undefined)}
                className="w-full border border-gray-600 bg-gray-700 text-gray-200 rounded px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                placeholder="Auto"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Altura Img</label>
              <input
                type="number"
                value={properties.imageHeight || ''}
                onChange={(e) => onPropertyChange('imageHeight', e.target.value ? parseInt(e.target.value) : undefined)}
                className="w-full border border-gray-600 bg-gray-700 text-gray-200 rounded px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                placeholder="Auto"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Ajuste de Imagen</label>
            <select
              value={properties.imageObjectFit || 'cover'}
              onChange={(e) => onPropertyChange('imageObjectFit', e.target.value)}
              className="w-full border border-gray-600 bg-gray-700 text-gray-200 rounded px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            >
              <option value="cover">Cubrir</option>
              <option value="contain">Contener</option>
              <option value="fill">Llenar</option>
              <option value="scale-down">Escalar Abajo</option>
              <option value="none">Ninguno</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Radio de Borde Img</label>
            <input
              type="number"
              value={properties.imageBorderRadius || 8}
              onChange={(e) => onPropertyChange('imageBorderRadius', parseInt(e.target.value))}
              className="w-full border border-gray-600 bg-gray-700 text-gray-200 rounded px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
              min="0"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Opacidad de Imagen: {Math.round((properties.imageOpacity ?? 1) * 100)}%
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={properties.imageOpacity ?? 1}
              onChange={(e) => onPropertyChange('imageOpacity', parseFloat(e.target.value))}
              className="w-full"
            />
          </div>
        </div>
      )}
      {/* Spacing */}
      <div className="space-y-4">
        <h5 className="text-md font-medium text-gray-300">Espaciado</h5>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Padding</label>
            <input
              type="number"
              value={properties.padding || 16}
              onChange={(e) => onPropertyChange('padding', parseInt(e.target.value))}
              className="w-full border border-gray-600 bg-gray-700 text-gray-200 rounded px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
              min="0"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Margin</label>
            <input
              type="number"
              value={properties.margin || 0}
              onChange={(e) => onPropertyChange('margin', parseInt(e.target.value))}
              className="w-full border border-gray-600 bg-gray-700 text-gray-200 rounded px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
              min="0"
            />
          </div>
        </div>
      </div>
      {/* Border */}
      <div className="space-y-4">
        <h5 className="text-md font-medium text-gray-300">Bordes</h5>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Ancho</label>
            <input
              type="number"
              value={properties.borderWidth || 3}
              onChange={(e) => onPropertyChange('borderWidth', parseInt(e.target.value))}
              className="w-full border border-gray-600 bg-gray-700 text-gray-200 rounded px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
              min="0"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Estilo</label>
            <select
              value={properties.borderStyle || 'dashed'}
              onChange={(e) => onPropertyChange('borderStyle', e.target.value)}
              className="w-full border border-gray-600 bg-gray-700 text-gray-200 rounded px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            >
              <option value="solid">Sólido</option>
              <option value="dashed">Discontinuo</option>
              <option value="dotted">Punteado</option>
              <option value="double">Doble</option>
              <option value="none">Ninguno</option>
            </select>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Color del Borde</label>
          <div className="flex gap-2">
            <input
              type="color"
              value={properties.borderColor || '#94a3b8'}
              onChange={(e) => onPropertyChange('borderColor', e.target.value)}
              className="w-12 h-8 border border-gray-600 rounded cursor-pointer"
            />
            <input
              type="text"
              value={properties.borderColor || '#94a3b8'}
              onChange={(e) => onPropertyChange('borderColor', e.target.value)}
              className="flex-1 border border-gray-600 bg-gray-700 text-gray-200 rounded px-3 py-1 text-sm focus:border-blue-500 focus:outline-none"
              placeholder="#94a3b8"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Radio del Borde</label>
          <input
            type="number"
            value={properties.borderRadius || 12}
            onChange={(e) => onPropertyChange('borderRadius', parseInt(e.target.value))}
            className="w-full border border-gray-600 bg-gray-700 text-gray-200 rounded px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            min="0"
          />
        </div>
      </div>
      {/* Background */}
      <div className="space-y-4">
        <h5 className="text-md font-medium text-gray-300">Fondo</h5>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Color de Fondo</label>
          <div className="flex gap-2">
            <input
              type="color"
              value={properties.backgroundColor || '#f8fafc'}
              onChange={(e) => onPropertyChange('backgroundColor', e.target.value)}
              className="w-12 h-8 border border-gray-600 rounded cursor-pointer"
            />
            <input
              type="text"
              value={properties.backgroundColor || '#f8fafc'}
              onChange={(e) => onPropertyChange('backgroundColor', e.target.value)}
              className="flex-1 border border-gray-600 bg-gray-700 text-gray-200 rounded px-3 py-1 text-sm focus:border-blue-500 focus:outline-none"
              placeholder="#f8fafc"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Opacidad del Contenedor: {Math.round((properties.opacity ?? 1) * 100)}%
          </label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={properties.opacity ?? 1}
            onChange={(e) => onPropertyChange('opacity', parseFloat(e.target.value))}
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
}; 