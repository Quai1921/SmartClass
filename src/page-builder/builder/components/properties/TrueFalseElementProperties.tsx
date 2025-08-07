import React from 'react';
import type { Element } from '../../../types';

interface TrueFalseElementPropertiesProps {
  element: Element;
  onPropertyChange: (property: string, value: any) => void;
  onElementUpdate?: (elementId: string, updates: any) => void;
}

export const TrueFalseElementProperties: React.FC<TrueFalseElementPropertiesProps> = ({
  element,
  onPropertyChange,
}) => {
  const properties = element.properties;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h4 className="text-lg font-semibold text-gray-200 mb-4">Configuración Verdadero/Falso</h4>
      </div>

      {/* Current State Display */}
      <div className="bg-gray-750 p-4 rounded-lg border border-gray-600">
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-medium text-gray-300">Estado Actual</label>
          <span 
            className={`px-3 py-1 rounded-full text-sm font-medium text-white ${
              properties.trueFalseState ? 'bg-green-600' : 'bg-red-600'
            }`}
          >
            {properties.trueFalseState ? (properties.trueLabel || 'TRUE') : (properties.falseLabel || 'FALSE')}
          </span>
        </div>
        <button
          onClick={() => onPropertyChange('trueFalseState', !properties.trueFalseState)}
          className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors duration-200"
        >
          Cambiar Estado
        </button>
      </div>

      {/* Labels Configuration */}
      <div className="space-y-4">
        <h5 className="text-sm font-medium text-gray-300 border-b border-gray-600 pb-2">Etiquetas</h5>
        
        {/* True Label */}
        <div>
          <label className="block text-xs font-medium text-gray-400 mb-2">Etiqueta para Verdadero</label>
          <input
            type="text"
            value={properties.trueLabel || 'TRUE'}
            onChange={(e) => onPropertyChange('trueLabel', e.target.value)}
            className="w-full border border-gray-600 bg-gray-700 text-gray-200 rounded px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            placeholder="TRUE"
          />
        </div>

        {/* False Label */}
        <div>
          <label className="block text-xs font-medium text-gray-400 mb-2">Etiqueta para Falso</label>
          <input
            type="text"
            value={properties.falseLabel || 'FALSE'}
            onChange={(e) => onPropertyChange('falseLabel', e.target.value)}
            className="w-full border border-gray-600 bg-gray-700 text-gray-200 rounded px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            placeholder="FALSE"
          />
        </div>
      </div>

      {/* Colors Configuration */}
      <div className="space-y-4">
        <h5 className="text-sm font-medium text-gray-300 border-b border-gray-600 pb-2">Colores</h5>
        
        <div className="grid grid-cols-2 gap-4">
          {/* True Color */}
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-2">Color Verdadero</label>
            <div className="flex items-center space-x-2">
              <input
                type="color"
                value={properties.trueColor || '#22c55e'}
                onChange={(e) => onPropertyChange('trueColor', e.target.value)}
                className="w-8 h-8 border border-gray-600 rounded cursor-pointer"
              />
              <input
                type="text"
                value={properties.trueColor || '#22c55e'}
                onChange={(e) => onPropertyChange('trueColor', e.target.value)}
                className="flex-1 border border-gray-600 bg-gray-700 text-gray-200 rounded px-2 py-1 text-xs focus:border-blue-500 focus:outline-none"
                placeholder="#22c55e"
              />
            </div>
          </div>

          {/* False Color */}
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-2">Color Falso</label>
            <div className="flex items-center space-x-2">
              <input
                type="color"
                value={properties.falseColor || '#ef4444'}
                onChange={(e) => onPropertyChange('falseColor', e.target.value)}
                className="w-8 h-8 border border-gray-600 rounded cursor-pointer"
              />
              <input
                type="text"
                value={properties.falseColor || '#ef4444'}
                onChange={(e) => onPropertyChange('falseColor', e.target.value)}
                className="flex-1 border border-gray-600 bg-gray-700 text-gray-200 rounded px-2 py-1 text-xs focus:border-blue-500 focus:outline-none"
                placeholder="#ef4444"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Text Styling */}
      <div className="space-y-4">
        <h5 className="text-sm font-medium text-gray-300 border-b border-gray-600 pb-2">Estilo del Texto</h5>
        
        <div className="grid grid-cols-2 gap-4">
          {/* Font Size */}
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-2">Tamaño de Fuente</label>
            <input
              type="number"
              value={properties.fontSize || 16}
              onChange={(e) => onPropertyChange('fontSize', parseInt(e.target.value) || 16)}
              className="w-full border border-gray-600 bg-gray-700 text-gray-200 rounded px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
              min="8"
              max="72"
            />
          </div>

          {/* Font Weight */}
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-2">Peso de Fuente</label>
            <select
              value={properties.fontWeight || '600'}
              onChange={(e) => onPropertyChange('fontWeight', e.target.value)}
              className="w-full border border-gray-600 bg-gray-700 text-gray-200 rounded px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            >
              <option value="100">Thin (100)</option>
              <option value="200">Extra Light (200)</option>
              <option value="300">Light (300)</option>
              <option value="400">Normal (400)</option>
              <option value="500">Medium (500)</option>
              <option value="600">Semi Bold (600)</option>
              <option value="700">Bold (700)</option>
              <option value="800">Extra Bold (800)</option>
              <option value="900">Black (900)</option>
            </select>
          </div>
        </div>

        {/* Text Color */}
        <div>
          <label className="block text-xs font-medium text-gray-400 mb-2">Color del Texto</label>
          <div className="flex items-center space-x-2">
            <input
              type="color"
              value={properties.color || '#ffffff'}
              onChange={(e) => onPropertyChange('color', e.target.value)}
              className="w-8 h-8 border border-gray-600 rounded cursor-pointer"
            />
            <input
              type="text"
              value={properties.color || '#ffffff'}
              onChange={(e) => onPropertyChange('color', e.target.value)}
              className="flex-1 border border-gray-600 bg-gray-700 text-gray-200 rounded px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
              placeholder="#ffffff"
            />
          </div>
        </div>
      </div>

      {/* Border Radius */}
      <div>
        <label className="block text-xs font-medium text-gray-400 mb-2">Border Radius</label>
        <input
          type="number"
          value={properties.borderRadius || 8}
          onChange={(e) => onPropertyChange('borderRadius', parseInt(e.target.value) || 0)}
          className="w-full border border-gray-600 bg-gray-700 text-gray-200 rounded px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
          min="0"
          max="50"
        />
      </div>

      {/* Instructions */}
      <div className="bg-blue-900/30 border border-blue-600/50 rounded-lg p-3">
        <p className="text-xs text-blue-300">
          💡 <strong>Tip:</strong> Haz clic en el widget en el canvas para alternar entre los estados Verdadero y Falso.
        </p>
      </div>
    </div>
  );
};
