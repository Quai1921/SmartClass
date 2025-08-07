import React from 'react';
import { Tooltip } from './Tooltip';
import { BackgroundColorSelector } from './BackgroundColorSelector';
import { BorderSelector } from './BorderSelector';
import type { Element } from '../../../types';

interface VisualStylingSectionProps {
  element: Element;
  onPropertyChange: (property: string, value: any) => void;
  handleBackgroundColorChange: (color: string) => void;
  handleBorderWidthChange: (width: number) => void;
  handleBorderColorChange: (color: string) => void;
}

export const VisualStylingSection: React.FC<VisualStylingSectionProps> = ({
  element,
  onPropertyChange,
  handleBackgroundColorChange,
  handleBorderWidthChange,
  handleBorderColorChange,
}) => {
  const { properties } = element;

  // Helper function to convert borderWidth to number
  const getBorderWidthAsNumber = (value: number | string | undefined): number => {
    if (typeof value === 'number') return value;
    if (typeof value === 'string') {
      const parsed = parseInt(value);
      return isNaN(parsed) ? 0 : parsed;
    }
    return 0;
  };

  // Helper function to convert border radius to number
  const getBorderRadiusAsNumber = (value: number | string | undefined): number => {
    if (typeof value === 'number') return value;
    if (typeof value === 'string') {
      const parsed = parseInt(value);
      return isNaN(parsed) ? 0 : parsed;
    }
    return 0;
  };

  // Handlers for individual border width changes
  const handleBorderTopWidthChange = (width: number) => {
    onPropertyChange('borderTopWidth', width);
  };

  const handleBorderRightWidthChange = (width: number) => {
    onPropertyChange('borderRightWidth', width);
  };

  const handleBorderBottomWidthChange = (width: number) => {
    onPropertyChange('borderBottomWidth', width);
  };

  const handleBorderLeftWidthChange = (width: number) => {
    onPropertyChange('borderLeftWidth', width);
  };

  // Handlers for individual border color changes
  const handleBorderTopColorChange = (color: string) => {
    onPropertyChange('borderTopColor', color);
  };

  const handleBorderRightColorChange = (color: string) => {
    onPropertyChange('borderRightColor', color);
  };

  const handleBorderBottomColorChange = (color: string) => {
    onPropertyChange('borderBottomColor', color);
  };

  const handleBorderLeftColorChange = (color: string) => {
    onPropertyChange('borderLeftColor', color);
  };

  // Handlers for border style changes
  const handleBorderStyleChange = (style: 'solid' | 'dashed' | 'dotted' | 'double' | 'none') => {
    onPropertyChange('borderStyle', style);
  };
  const handleBorderTopStyleChange = (style: 'solid' | 'dashed' | 'dotted' | 'double' | 'none') => {
    onPropertyChange('borderTopStyle', style);
  };
  const handleBorderRightStyleChange = (style: 'solid' | 'dashed' | 'dotted' | 'double' | 'none') => {
    onPropertyChange('borderRightStyle', style);
  };
  const handleBorderBottomStyleChange = (style: 'solid' | 'dashed' | 'dotted' | 'double' | 'none') => {
    onPropertyChange('borderBottomStyle', style);
  };
  const handleBorderLeftStyleChange = (style: 'solid' | 'dashed' | 'dotted' | 'double' | 'none') => {
    onPropertyChange('borderLeftStyle', style);
  };

  return (
    <div className="property-section">
      <h4 className="text-sm font-semibold text-gray-200 mb-4">Estilo Visual</h4>

      <div className="space-y-6">
        {/* Background Color */}
        <BackgroundColorSelector
          backgroundColor={properties.backgroundColor || ''}
          onBackgroundColorChange={handleBackgroundColorChange}
        />

        {/* Background Image Section */}
        <div>
          <h5 className="text-sm font-medium text-gray-300 mb-3">Imagen de fondo</h5>
          <div className="space-y-4">
            {/* Background Image URL */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <div className="flex flex-col space-y-2">
                  <Tooltip text="URL de la imagen de fondo. Puede ser una URL web (https://) o una ruta relativa a una imagen subida.">
                    <code className="text-[11px] font-bold bg-blue-100 text-blue-800 px-2 py-1 rounded border cursor-help w-fit">background-image</code>
                  </Tooltip>
                  <span className="text-gray-300">URL de imagen</span>
                </div>
              </label>
              <input
                type="url"
                value={properties.backgroundImage || ''}
                onChange={(e) => onPropertyChange('backgroundImage', e.target.value)}
                className="w-full border border-gray-600 bg-gray-700 text-gray-200 rounded px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                placeholder="https://ejemplo.com/imagen.jpg"
              />
            </div>

            {/* Background Image Controls */}
            {properties.backgroundImage && (
              <div className="space-y-4 p-4 bg-gray-800 rounded-lg border border-gray-600">
                {/* Background Size */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    <Tooltip text="Cómo debe ajustarse la imagen de fondo al contenedor.">
                      <span className="cursor-help">Tamaño de imagen</span>
                    </Tooltip>
                  </label>
                  <select
                    value={properties.backgroundSize || 'cover'}
                    onChange={(e) => onPropertyChange('backgroundSize', e.target.value)}
                    className="w-full border border-gray-600 bg-gray-700 text-gray-200 rounded px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="cover">Cubrir (cover)</option>
                    <option value="contain">Contener (contain)</option>
                    <option value="auto">Automático (auto)</option>
                  </select>
                </div>

                {/* Background Position */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    <Tooltip text="Posición de la imagen de fondo dentro del contenedor.">
                      <span className="cursor-help">Posición de imagen</span>
                    </Tooltip>
                  </label>
                  <select
                    value={properties.backgroundPosition || 'center'}
                    onChange={(e) => onPropertyChange('backgroundPosition', e.target.value)}
                    className="w-full border border-gray-600 bg-gray-700 text-gray-200 rounded px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="center">Centro</option>
                    <option value="top">Arriba</option>
                    <option value="bottom">Abajo</option>
                    <option value="left">Izquierda</option>
                    <option value="right">Derecha</option>
                    <option value="top left">Arriba izquierda</option>
                    <option value="top right">Arriba derecha</option>
                    <option value="bottom left">Abajo izquierda</option>
                    <option value="bottom right">Abajo derecha</option>
                  </select>
                </div>

                {/* Background Repeat */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    <Tooltip text="Si la imagen debe repetirse para llenar el contenedor.">
                      <span className="cursor-help">Repetición</span>
                    </Tooltip>
                  </label>
                  <select
                    value={properties.backgroundRepeat || 'no-repeat'}
                    onChange={(e) => onPropertyChange('backgroundRepeat', e.target.value)}
                    className="w-full border border-gray-600 bg-gray-700 text-gray-200 rounded px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="no-repeat">No repetir</option>
                    <option value="repeat">Repetir</option>
                    <option value="repeat-x">Repetir horizontalmente</option>
                    <option value="repeat-y">Repetir verticalmente</option>
                  </select>
                </div>

                {/* Remove Background Image */}
                <button
                  onClick={() => {
                    onPropertyChange('backgroundImage', '');
                    onPropertyChange('backgroundSize', undefined);
                    onPropertyChange('backgroundPosition', undefined);
                    onPropertyChange('backgroundRepeat', undefined);
                  }}
                  className="w-full bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded text-sm transition-colors"
                >
                  Quitar imagen de fondo
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Border Radius */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Tooltip text="Redondea las esquinas del contenedor. Valores más altos crean esquinas más redondeadas.">
              <code className="text-[11px] font-bold bg-blue-100 text-blue-800 px-2 py-1 rounded border cursor-help w-fit">border-radius</code>
            </Tooltip>
            <span className="text-sm font-medium text-gray-300">Radio del borde (px)</span>
          </div>
          
          {/* Unified Border Radius */}
          <div className="mb-3">
            <label className="block text-xs text-gray-400 mb-1">Todas las esquinas</label>
            <input
              type="number"
              min="0"
              max="50"
              value={properties.borderRadius || 0}
              onChange={(e) => onPropertyChange('borderRadius', parseInt(e.target.value))}
              className="w-full border border-gray-600 bg-gray-700 text-gray-200 rounded px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Individual Border Radius Controls */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs text-gray-400 mb-1">Superior Izq.</label>
              <input
                type="number"
                min="0"
                max="50"
                value={properties.borderTopLeftRadius ?? getBorderRadiusAsNumber(properties.borderRadius)}
                onChange={(e) => onPropertyChange('borderTopLeftRadius', parseInt(e.target.value))}
                className="w-full border border-gray-600 bg-gray-700 text-gray-200 rounded px-2 py-1 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Superior Der.</label>
              <input
                type="number"
                min="0"
                max="50"
                value={properties.borderTopRightRadius ?? getBorderRadiusAsNumber(properties.borderRadius)}
                onChange={(e) => onPropertyChange('borderTopRightRadius', parseInt(e.target.value))}
                className="w-full border border-gray-600 bg-gray-700 text-gray-200 rounded px-2 py-1 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Inferior Izq.</label>
              <input
                type="number"
                min="0"
                max="50"
                value={properties.borderBottomLeftRadius ?? getBorderRadiusAsNumber(properties.borderRadius)}
                onChange={(e) => onPropertyChange('borderBottomLeftRadius', parseInt(e.target.value))}
                className="w-full border border-gray-600 bg-gray-700 text-gray-200 rounded px-2 py-1 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Inferior Der.</label>
              <input
                type="number"
                min="0"
                max="50"
                value={properties.borderBottomRightRadius ?? getBorderRadiusAsNumber(properties.borderRadius)}
                onChange={(e) => onPropertyChange('borderBottomRightRadius', parseInt(e.target.value))}
                className="w-full border border-gray-600 bg-gray-700 text-gray-200 rounded px-2 py-1 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Border */}
        <BorderSelector
          borderWidth={getBorderWidthAsNumber(properties.borderWidth)}
          borderTopWidth={getBorderWidthAsNumber(properties.borderTopWidth)}
          borderRightWidth={getBorderWidthAsNumber(properties.borderRightWidth)}
          borderBottomWidth={getBorderWidthAsNumber(properties.borderBottomWidth)}
          borderLeftWidth={getBorderWidthAsNumber(properties.borderLeftWidth)}
          borderColor={properties.borderColor || '#e5e7eb'}
          borderTopColor={properties.borderTopColor}
          borderRightColor={properties.borderRightColor}
          borderBottomColor={properties.borderBottomColor}
          borderLeftColor={properties.borderLeftColor}
          borderStyle={properties.borderStyle}
          borderTopStyle={properties.borderTopStyle}
          borderRightStyle={properties.borderRightStyle}
          borderBottomStyle={properties.borderBottomStyle}
          borderLeftStyle={properties.borderLeftStyle}
          onBorderWidthChange={handleBorderWidthChange}
          onBorderTopWidthChange={handleBorderTopWidthChange}
          onBorderRightWidthChange={handleBorderRightWidthChange}
          onBorderBottomWidthChange={handleBorderBottomWidthChange}
          onBorderLeftWidthChange={handleBorderLeftWidthChange}
          onBorderColorChange={handleBorderColorChange}
          onBorderTopColorChange={handleBorderTopColorChange}
          onBorderRightColorChange={handleBorderRightColorChange}
          onBorderBottomColorChange={handleBorderBottomColorChange}
          onBorderLeftColorChange={handleBorderLeftColorChange}
          onBorderStyleChange={handleBorderStyleChange}
          onBorderTopStyleChange={handleBorderTopStyleChange}
          onBorderRightStyleChange={handleBorderRightStyleChange}
          onBorderBottomStyleChange={handleBorderBottomStyleChange}
          onBorderLeftStyleChange={handleBorderLeftStyleChange}
        />
      </div>
    </div>
  );
};
