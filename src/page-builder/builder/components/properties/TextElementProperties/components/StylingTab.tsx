import React from 'react';
import { Tooltip } from '../Tooltip';
import type { Element } from '../../../../types';

interface StylingTabProps {
  element: Element;
  onPropertyChange: (property: string, value: unknown) => void;
}

export const StylingTab: React.FC<StylingTabProps> = ({
  element,
  onPropertyChange
}) => {
  return (
    <div className="space-y-4">
      <h4 className="text-sm font-semibold text-gray-200 mb-4">Estilo y Tipografía</h4>
      
      <div className="grid grid-cols-2 gap-6 mb-8">
        {/* Left Column: Size, Weight, Style */}
        <div className="space-y-6">
          <h5 className="text-sm font-medium text-gray-400 uppercase tracking-wide border-b border-gray-600 pb-2 mb-4">
            Tipografía
          </h5>

          {/* Font Size */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">
              <div className="flex flex-col space-y-2">
                <Tooltip text="Tamaño de la fuente en píxeles.">
                  <code className="text-[11px] font-bold bg-blue-100 text-blue-800 px-2 py-1 rounded border cursor-help w-fit whitespace-nowrap">font-size</code>
                </Tooltip>
                <span className="text-sm text-gray-300">Tamaño</span>
              </div>
            </label>
            <div className="flex gap-2 items-center">
              <input
                type="number"
                min="8"
                max="200"
                value={(() => {
                  const fontSize = element.properties.fontSize;
                  if (typeof fontSize === 'string') {
                    return parseInt(fontSize) || 16;
                  }
                  return fontSize || 16;
                })()}
                onChange={(e) => {
                  const value = e.target.value ? parseInt(e.target.value) : undefined;
                  onPropertyChange('fontSize', value);
                }}
                className="flex-1 min-w-0 border border-gray-600 bg-gray-700 text-gray-200 rounded px-2 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                placeholder="16"
              />
              <span className="text-xs text-gray-400 whitespace-nowrap">px</span>
            </div>
          </div>

          {/* Font Weight */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">
              <div className="flex flex-col space-y-2">
                <Tooltip text="Grosor de la fuente.">
                  <code className="text-[11px] font-bold bg-blue-100 text-blue-800 px-2 py-1 rounded border cursor-help w-fit">font-weight</code>
                </Tooltip>
                <span className="text-sm text-gray-300">Peso</span>
              </div>
            </label>
            <select
              value={element.properties.fontWeight || '400'}
              onChange={(e) => onPropertyChange('fontWeight', e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="100">100 - Thin</option>
              <option value="200">200 - Extra Light</option>
              <option value="300">300 - Light</option>
              <option value="400">400 - Normal</option>
              <option value="500">500 - Medium</option>
              <option value="600">600 - Semi Bold</option>
              <option value="700">700 - Bold</option>
              <option value="800">800 - Extra Bold</option>
              <option value="900">900 - Black</option>
            </select>
          </div>

          {/* Font Family */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">
              <div className="flex flex-col space-y-2">
                <Tooltip text="Familia de fuentes.">
                  <code className="text-[11px] font-bold bg-blue-100 text-blue-800 px-2 py-1 rounded border cursor-help w-fit">font-family</code>
                </Tooltip>
                <span className="text-sm text-gray-300">Fuente</span>
              </div>
            </label>
            <select
              value={element.properties.fontFamily || 'inherit'}
              onChange={(e) => onPropertyChange('fontFamily', e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="inherit">Heredar</option>
              <option value="Arial, sans-serif">Arial</option>
              <option value="Helvetica, sans-serif">Helvetica</option>
              <option value="Georgia, serif">Georgia</option>
              <option value="Times New Roman, serif">Times New Roman</option>
              <option value="Courier New, monospace">Courier New</option>
              <option value="Verdana, sans-serif">Verdana</option>
              <option value="Trebuchet MS, sans-serif">Trebuchet MS</option>
              <option value="Impact, sans-serif">Impact</option>
              <option value="Comic Sans MS, cursive">Comic Sans MS</option>
            </select>
          </div>

          {/* Font Style */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">
              <div className="flex flex-col space-y-2">
                <Tooltip text="Estilo de la fuente.">
                  <code className="text-[11px] font-bold bg-blue-100 text-blue-800 px-2 py-1 rounded border cursor-help w-fit">font-style</code>
                </Tooltip>
                <span className="text-sm text-gray-300">Estilo</span>
              </div>
            </label>
            <select
              value={element.properties.fontStyle || 'normal'}
              onChange={(e) => onPropertyChange('fontStyle', e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="normal">Normal</option>
              <option value="italic">Cursiva</option>
              <option value="oblique">Oblique</option>
            </select>
          </div>
        </div>

        {/* Right Column: Color, Alignment, Spacing */}
        <div className="space-y-6">
          <h5 className="text-sm font-medium text-gray-400 uppercase tracking-wide border-b border-gray-600 pb-2 mb-4">
            Apariencia
          </h5>

          {/* Text Color */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">
              <div className="flex flex-col space-y-2">
                <Tooltip text="Color del texto.">
                  <code className="text-[11px] font-bold bg-blue-100 text-blue-800 px-2 py-1 rounded border cursor-help w-fit">color</code>
                </Tooltip>
                <span className="text-sm text-gray-300">Color</span>
              </div>
            </label>
            <div className="flex gap-2">
              <input
                type="color"
                value={element.properties.color || '#ffffff'}
                onChange={(e) => onPropertyChange('color', e.target.value)}
                className="w-12 h-10 border border-gray-600 rounded cursor-pointer"
              />
              <input
                type="text"
                value={element.properties.color || '#ffffff'}
                onChange={(e) => onPropertyChange('color', e.target.value)}
                placeholder="#ffffff"
                className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Text Alignment */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">
              <div className="flex flex-col space-y-2">
                <Tooltip text="Alineación del texto.">
                  <code className="text-[11px] font-bold bg-blue-100 text-blue-800 px-2 py-1 rounded border cursor-help w-fit">text-align</code>
                </Tooltip>
                <span className="text-sm text-gray-300">Alineación</span>
              </div>
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => onPropertyChange('textAlign', 'left')}
                className={`px-3 py-2 text-sm border rounded-md transition-colors ${
                  element.properties.textAlign === 'left'
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-gray-700 text-gray-300 border-gray-600 hover:bg-gray-600'
                }`}
              >
                Izquierda
              </button>
              <button
                onClick={() => onPropertyChange('textAlign', 'center')}
                className={`px-3 py-2 text-sm border rounded-md transition-colors ${
                  element.properties.textAlign === 'center'
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-gray-700 text-gray-300 border-gray-600 hover:bg-gray-600'
                }`}
              >
                Centro
              </button>
              <button
                onClick={() => onPropertyChange('textAlign', 'right')}
                className={`px-3 py-2 text-sm border rounded-md transition-colors ${
                  element.properties.textAlign === 'right'
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-gray-700 text-gray-300 border-gray-600 hover:bg-gray-600'
                }`}
              >
                Derecha
              </button>
            </div>
          </div>

          {/* Line Height */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">
              <div className="flex flex-col space-y-2">
                <Tooltip text="Altura de línea (espaciado vertical).">
                  <code className="text-[11px] font-bold bg-blue-100 text-blue-800 px-2 py-1 rounded border cursor-help w-fit">line-height</code>
                </Tooltip>
                <span className="text-sm text-gray-300">Altura de Línea</span>
              </div>
            </label>
            <input
              type="number"
              min="0.5"
              max="3"
              step="0.1"
              value={element.properties.lineHeight || 1.5}
              onChange={(e) => onPropertyChange('lineHeight', parseFloat(e.target.value))}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Letter Spacing */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">
              <div className="flex flex-col space-y-2">
                <Tooltip text="Espaciado entre letras.">
                  <code className="text-[11px] font-bold bg-blue-100 text-blue-800 px-2 py-1 rounded border cursor-help w-fit">letter-spacing</code>
                </Tooltip>
                <span className="text-sm text-gray-300">Espaciado de Letras</span>
              </div>
            </label>
            <div className="flex gap-2 items-center">
              <input
                type="number"
                min="-5"
                max="10"
                step="0.5"
                value={element.properties.letterSpacing || 0}
                onChange={(e) => onPropertyChange('letterSpacing', parseFloat(e.target.value))}
                className="flex-1 min-w-0 border border-gray-600 bg-gray-700 text-gray-200 rounded px-2 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
              <span className="text-xs text-gray-400 whitespace-nowrap">px</span>
            </div>
          </div>
        </div>
      </div>

      {/* Advanced Styling Section */}
      <div className="border-t border-gray-600 pt-6">
        <h5 className="text-sm font-medium text-gray-400 uppercase tracking-wide border-b border-gray-600 pb-2 mb-4">
          Estilos Avanzados
        </h5>
        
        <div className="grid grid-cols-2 gap-6">
          {/* Text Transform */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">
              <div className="flex flex-col space-y-2">
                <Tooltip text="Transformación del texto.">
                  <code className="text-[11px] font-bold bg-blue-100 text-blue-800 px-2 py-1 rounded border cursor-help w-fit">text-transform</code>
                </Tooltip>
                <span className="text-sm text-gray-300">Transformación</span>
              </div>
            </label>
            <select
              value={element.properties.textTransform || 'none'}
              onChange={(e) => onPropertyChange('textTransform', e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="none">Ninguna</option>
              <option value="uppercase">Mayúsculas</option>
              <option value="lowercase">Minúsculas</option>
              <option value="capitalize">Capitalizar</option>
            </select>
          </div>

          {/* Text Decoration */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">
              <div className="flex flex-col space-y-2">
                <Tooltip text="Decoración del texto.">
                  <code className="text-[11px] font-bold bg-blue-100 text-blue-800 px-2 py-1 rounded border cursor-help w-fit">text-decoration</code>
                </Tooltip>
                <span className="text-sm text-gray-300">Decoración</span>
              </div>
            </label>
            <select
              value={element.properties.textDecoration || 'none'}
              onChange={(e) => onPropertyChange('textDecoration', e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="none">Ninguna</option>
              <option value="underline">Subrayado</option>
              <option value="overline">Sobrelínea</option>
              <option value="line-through">Tachado</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}; 