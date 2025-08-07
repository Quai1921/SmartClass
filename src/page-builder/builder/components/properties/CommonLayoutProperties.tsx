import React from 'react';
import type { Element } from '../../../types';
import { useLayoutProperties } from '../../hooks/useLayoutProperties';

export interface CommonLayoutPropertiesProps {
  element: Element;
  onPropertyChange: (property: string, value: any) => void;
}

/**
 * Common layout properties component
 * Handles shared layout properties like dimensions, spacing, borders
 */
export const CommonLayoutProperties: React.FC<CommonLayoutPropertiesProps> = ({
  element,
  onPropertyChange,
}) => {
  const {
    layoutProperties,
    updateWidth,
    updateHeight,
    updatePadding,
    updateMargin,
    updateBorderRadius,
    updateBorderWidth,
    updateBorderColor,
    updateBackgroundColor,
  } = useLayoutProperties(element, onPropertyChange);

  return (
    <div className="property-section">
      <h4 className="text-base font-semibold text-gray-200 mb-6">Diseño y Espaciado</h4>
      
      {/* Dimensions Section */}
      <div className="mb-6">
        <h5 className="text-sm font-medium text-gray-400 uppercase tracking-wide border-b border-gray-600 pb-2 mb-4">
          Dimensiones
        </h5>
        
        <div className="grid grid-cols-2 gap-4">
          {/* Width */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Ancho
            </label>
            <div className="flex">
              <input
                type="number"
                value={
                  !layoutProperties.width || layoutProperties.width === 'auto' ? '' :
                  parseFloat(layoutProperties.width.toString()) || ''
                }
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === '' || value === '0') {
                    updateWidth('auto');
                  } else {
                    const currentWidth = layoutProperties.width?.toString() || '';
                    const unit = currentWidth.includes('%') ? '%' : 'px';
                    updateWidth(`${value}${unit}`);
                  }
                }}
                placeholder="Auto"
                className="flex-1 min-w-0 border border-gray-600 bg-gray-700 text-gray-200 rounded-l-md px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                min="0"
              />
              <select
                value={
                  !layoutProperties.width || layoutProperties.width === 'auto' ? 'auto' :
                  layoutProperties.width.toString().includes('%') ? '%' : 'px'
                }
                onChange={(e) => {
                  if (e.target.value === 'auto') {
                    updateWidth('auto');
                  } else {
                    const currentValue = layoutProperties.width ? 
                      parseFloat(layoutProperties.width.toString()) || 100 : 100;
                    updateWidth(`${currentValue}${e.target.value}`);
                  }
                }}
                className="w-16 border border-l-0 border-gray-600 bg-gray-700 text-gray-200 rounded-r-md px-2 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
              >
                <option value="auto">Auto</option>
                <option value="px">px</option>
                <option value="%">%</option>
              </select>
            </div>
          </div>

          {/* Height */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Alto
            </label>
            <div className="flex">
              <input
                type="number"
                value={
                  !layoutProperties.height || layoutProperties.height === 'auto' ? '' :
                  parseFloat(layoutProperties.height.toString()) || ''
                }
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === '' || value === '0') {
                    updateHeight('auto');
                  } else {
                    const currentHeight = layoutProperties.height?.toString() || '';
                    const unit = currentHeight.includes('%') ? '%' : 'px';
                    updateHeight(`${value}${unit}`);
                  }
                }}
                placeholder="Auto"
                className="flex-1 min-w-0 border border-gray-600 bg-gray-700 text-gray-200 rounded-l-md px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                min="0"
              />
              <select
                value={
                  !layoutProperties.height || layoutProperties.height === 'auto' ? 'auto' :
                  layoutProperties.height.toString().includes('%') ? '%' : 'px'
                }
                onChange={(e) => {
                  if (e.target.value === 'auto') {
                    updateHeight('auto');
                  } else {
                    const currentValue = layoutProperties.height ? 
                      parseFloat(layoutProperties.height.toString()) || 100 : 100;
                    updateHeight(`${currentValue}${e.target.value}`);
                  }
                }}
                className="w-16 border border-l-0 border-gray-600 bg-gray-700 text-gray-200 rounded-r-md px-2 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
              >
                <option value="auto">Auto</option>
                <option value="px">px</option>
                <option value="%">%</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Spacing Section */}
      <div className="mb-6">
        <h5 className="text-sm font-medium text-gray-400 uppercase tracking-wide border-b border-gray-600 pb-2 mb-4">
          Espaciado
        </h5>
        
        <div className="grid grid-cols-2 gap-4">
          {/* Padding */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Espaciado Interno (Padding)
            </label>
            <select
              value={layoutProperties.padding}
              onChange={(e) => updatePadding(e.target.value)}
              className="w-full border border-gray-600 bg-gray-700 text-gray-200 rounded px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            >
              <option value="0px">Sin espaciado</option>
              <option value="4px">Muy pequeño (4px)</option>
              <option value="8px">Pequeño (8px)</option>
              <option value="16px">Mediano (16px)</option>
              <option value="24px">Grande (24px)</option>
              <option value="32px">Muy grande (32px)</option>
            </select>
          </div>

          {/* Margin */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Espaciado Externo (Margin)
            </label>
            <select
              value={layoutProperties.margin}
              onChange={(e) => updateMargin(e.target.value)}
              className="w-full border border-gray-600 bg-gray-700 text-gray-200 rounded px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            >
              <option value="0px">Sin espaciado</option>
              <option value="4px">Muy pequeño (4px)</option>
              <option value="8px">Pequeño (8px)</option>
              <option value="16px">Mediano (16px)</option>
              <option value="24px">Grande (24px)</option>
              <option value="32px">Muy grande (32px)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Borders and Appearance Section */}
      <div className="mb-6">
        <h5 className="text-sm font-medium text-gray-400 uppercase tracking-wide border-b border-gray-600 pb-2 mb-4">
          Bordes y Apariencia
        </h5>
        
        <div className="space-y-4">
          {/* Background Color */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Color de Fondo
            </label>
            <div className="flex space-x-2">
              <input
                type="color"
                value={layoutProperties.backgroundColor === 'transparent' ? '#ffffff' : layoutProperties.backgroundColor}
                onChange={(e) => updateBackgroundColor(e.target.value)}
                className="w-12 h-10 border border-gray-600 bg-gray-700 rounded cursor-pointer"
              />
              <button
                onClick={() => updateBackgroundColor('transparent')}
                className={`px-3 py-2 text-sm rounded border transition-colors ${
                  layoutProperties.backgroundColor === 'transparent'
                    ? 'bg-blue-600 border-blue-500 text-white'
                    : 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600'
                }`}
              >
                Transparente
              </button>
            </div>
          </div>

          {/* Border Radius */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Redondez de Bordes
            </label>
            <select
              value={layoutProperties.borderRadius}
              onChange={(e) => updateBorderRadius(e.target.value)}
              className="w-full border border-gray-600 bg-gray-700 text-gray-200 rounded px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            >
              <option value="0px">Sin redondez</option>
              <option value="4px">Ligera (4px)</option>
              <option value="8px">Mediana (8px)</option>
              <option value="16px">Alta (16px)</option>
              <option value="24px">Muy alta (24px)</option>
              <option value="50%">Completa</option>
            </select>
          </div>

          {/* Border Width and Color */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Grosor del Borde
              </label>
              <select
                value={layoutProperties.borderWidth}
                onChange={(e) => updateBorderWidth(e.target.value)}
                className="w-full border border-gray-600 bg-gray-700 text-gray-200 rounded px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              >
                <option value="0px">Sin borde</option>
                <option value="1px">Fino (1px)</option>
                <option value="2px">Mediano (2px)</option>
                <option value="4px">Grueso (4px)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Color del Borde
              </label>
              <input
                type="color"
                value={layoutProperties.borderColor}
                onChange={(e) => updateBorderColor(e.target.value)}
                className="w-full h-10 border border-gray-600 bg-gray-700 rounded cursor-pointer"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
