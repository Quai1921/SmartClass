import React from 'react';
import { Tooltip } from './Tooltip';
import type { Element } from '../../../types';

interface SpacingSectionProps {
  element: Element;
  onPropertyChange: (property: string, value: any) => void;
}

export const SpacingSection: React.FC<SpacingSectionProps> = ({
  element,
  onPropertyChange,
}) => {
  const { properties } = element;

  return (
    <div className="property-section">
      <h4 className="text-sm font-semibold text-gray-200 mb-4">Espaciado</h4>

      {/* Padding Section */}
      <div className="mb-6">
        <div className="mb-3">
          <span className="text-sm font-medium text-gray-300">Relleno (px)</span>
        </div>
        
        {/* Unified Padding Input */}
        <div className="mb-3">
          <label className="block text-xs text-gray-400 mb-1">Todos los lados</label>
          <input
            type="number"
            min="0"
            value={properties.padding || 0}
            onChange={(e) => onPropertyChange('padding', parseInt(e.target.value))}
            className="w-full border border-gray-600 bg-gray-700 text-gray-200 rounded px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>

        {/* Individual Padding Controls */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-xs text-gray-400 mb-1">Superior</label>
            <input
              type="number"
              min="0"
              value={properties.paddingTop || properties.padding || 0}
              onChange={(e) => onPropertyChange('paddingTop', parseInt(e.target.value))}
              className="w-full border border-gray-600 bg-gray-700 text-gray-200 rounded px-2 py-1 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">Inferior</label>
            <input
              type="number"
              min="0"
              value={properties.paddingBottom || properties.padding || 0}
              onChange={(e) => onPropertyChange('paddingBottom', parseInt(e.target.value))}
              className="w-full border border-gray-600 bg-gray-700 text-gray-200 rounded px-2 py-1 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">Izquierda</label>
            <input
              type="number"
              min="0"
              value={properties.paddingLeft || properties.padding || 0}
              onChange={(e) => onPropertyChange('paddingLeft', parseInt(e.target.value))}
              className="w-full border border-gray-600 bg-gray-700 text-gray-200 rounded px-2 py-1 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">Derecha</label>
            <input
              type="number"
              min="0"
              value={properties.paddingRight || properties.padding || 0}
              onChange={(e) => onPropertyChange('paddingRight', parseInt(e.target.value))}
              className="w-full border border-gray-600 bg-gray-700 text-gray-200 rounded px-2 py-1 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Margin Section */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Tooltip text="Espaciado exterior alrededor del contenedor. Crea espacio entre este contenedor y otros elementos.">
            <code className="text-[11px] font-bold bg-blue-100 text-blue-800 px-2 py-1 rounded border cursor-help w-fit">margin</code>
          </Tooltip>
          <span className="text-sm font-medium text-gray-300">Margen (px)</span>
        </div>
        
        {/* Unified Margin Input */}
        <div className="mb-3">
          <label className="block text-xs text-gray-400 mb-1">Todos los lados</label>
          <input
            type="number"
            min="0"
            value={properties.margin || 0}
            onChange={(e) => onPropertyChange('margin', parseInt(e.target.value))}
            className="w-full border border-gray-600 bg-gray-700 text-gray-200 rounded px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>

        {/* Individual Margin Controls */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-xs text-gray-400 mb-1">Superior</label>
            <input
              type="number"
              min="0"
              value={properties.marginTop || properties.margin || 0}
              onChange={(e) => onPropertyChange('marginTop', parseInt(e.target.value))}
              className="w-full border border-gray-600 bg-gray-700 text-gray-200 rounded px-2 py-1 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">Inferior</label>
            <input
              type="number"
              min="0"
              value={properties.marginBottom || properties.margin || 0}
              onChange={(e) => onPropertyChange('marginBottom', parseInt(e.target.value))}
              className="w-full border border-gray-600 bg-gray-700 text-gray-200 rounded px-2 py-1 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">Izquierda</label>
            <input
              type="number"
              min="0"
              value={properties.marginLeft || properties.margin || 0}
              onChange={(e) => onPropertyChange('marginLeft', parseInt(e.target.value))}
              className="w-full border border-gray-600 bg-gray-700 text-gray-200 rounded px-2 py-1 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">Derecha</label>
            <input
              type="number"
              min="0"
              value={properties.marginRight || properties.margin || 0}
              onChange={(e) => onPropertyChange('marginRight', parseInt(e.target.value))}
              className="w-full border border-gray-600 bg-gray-700 text-gray-200 rounded px-2 py-1 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
