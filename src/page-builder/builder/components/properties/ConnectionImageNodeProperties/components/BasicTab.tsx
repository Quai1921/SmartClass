import React from 'react';

interface BasicTabProps {
  properties: any;
  onPropertyChange: (property: string, value: any) => void;
  handleOpenImageModal: () => void;
}

export const BasicTab: React.FC<BasicTabProps> = ({ 
  properties, 
  onPropertyChange, 
  handleOpenImageModal 
}) => {
  return (
    <div className="space-y-6">
      {/* Content Type Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Tipo de Contenido</label>
        <select
          value={properties.contentType || 'image'}
          onChange={(e) => onPropertyChange('contentType', e.target.value)}
          className="w-full border border-gray-600 bg-gray-700 text-gray-200 rounded px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
        >
          <option value="image">Imagen</option>
          <option value="text">Texto + Icono</option>
        </select>
      </div>

      {/* Image Configuration */}
      {(properties.contentType !== 'text') && (
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Imagen del Nodo</label>
          <div className="space-y-3">
            {(properties.imageUrl || properties.imageSrc) && (
              <div className="relative">
                <img
                  src={properties.imageUrl || properties.imageSrc}
                  alt={properties.imageAlt || 'Preview'}
                  className="w-full h-32 object-cover rounded border border-gray-600"
                />
              </div>
            )}
            <button
              onClick={handleOpenImageModal}
              className="w-full px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm transition-colors"
            >
              {(properties.imageUrl || properties.imageSrc) ? 'Cambiar Imagen' : 'Seleccionar Imagen'}
            </button>
            
            <input
              type="text"
              value={properties.imageSrc || properties.imageUrl || ''}
              onChange={(e) => {
                onPropertyChange('imageSrc', e.target.value);
                onPropertyChange('imageUrl', e.target.value);
              }}
              className="w-full border border-gray-600 bg-gray-700 text-gray-200 rounded px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
              placeholder="O ingresa URL manualmente..."
            />
          </div>

          <div className="mt-3">
            <label className="block text-sm font-medium text-gray-300 mb-2">Texto Alternativo</label>
            <input
              type="text"
              value={properties.imageAlt || ''}
              onChange={(e) => onPropertyChange('imageAlt', e.target.value)}
              className="w-full border border-gray-600 bg-gray-700 text-gray-200 rounded px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
              placeholder="Descripción de la imagen..."
            />
          </div>
        </div>
      )}

      {/* Text Content */}
      {(properties.contentType === 'text') && (
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Texto del Nodo</label>
          <input
            type="text"
            value={properties.text || ''}
            onChange={(e) => onPropertyChange('text', e.target.value)}
            className="w-full border border-gray-600 bg-gray-700 text-gray-200 rounded px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            placeholder="Drop here!"
          />
          
          <div className="flex items-center justify-between mt-3">
            <span className="text-gray-300 text-sm">Mostrar texto</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={properties.showText !== false}
                onChange={e => onPropertyChange('showText', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between mt-3">
            <span className="text-gray-300 text-sm">Mostrar icono</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={properties.showIcon !== false}
                onChange={e => onPropertyChange('showIcon', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      )}
    </div>
  );
}; 