import React from 'react';
import type { Element } from '../../../types';
import { Tooltip } from './Tooltip';

interface FlexboxControlsProps {
  element: Element;
  onPropertyChange: (property: string, value: any) => void;
}

export const FlexboxControls: React.FC<FlexboxControlsProps> = ({
  element,
  onPropertyChange,
}) => {
  const { properties } = element;

  return (
    <div className="property-section bg-gray-800 rounded-lg p-4">
      <h4 className="text-sm font-semibold text-gray-200 mb-4">Disposición</h4>
      
      <div className="space-y-6">
        {/* Layout Type Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-3">
            Diseño del contenedor
          </label>
          <div className="grid grid-cols-2 gap-3">
            <Tooltip text="Usa flexbox para organizar elementos en filas y columnas flexibles">
              <div className="w-full">
                <button
                  onClick={() => {
                    onPropertyChange('layout', 'column');
                    // Set default flexDirection if not set
                    if (!properties.flexDirection) {
                      onPropertyChange('flexDirection', 'column');
                    }
                  }}
                  className={`w-full p-3 border-2 rounded-lg text-center transition-all ${
                    (properties.layout === 'column' || properties.layout === 'row' || !properties.layout)
                      ? 'border-blue-500 bg-blue-600 text-white'
                      : 'border-gray-600 bg-gray-700 text-gray-300 hover:border-gray-500'
                  }`}
                >
                  <div className="text-sm font-medium">Flexbox</div>
                </button>
              </div>
            </Tooltip>
            <Tooltip text="Usa CSS Grid para crear layouts complejos con filas y columnas precisas">
              <div className="w-full">
                <button
                  onClick={() => onPropertyChange('layout', 'grid')}
                  className={`w-full p-3 border-2 rounded-lg text-center transition-all ${
                    properties.layout === 'grid'
                      ? 'border-blue-500 bg-blue-600 text-white'
                      : 'border-gray-600 bg-gray-700 text-gray-300 hover:border-gray-500'
                  }`}
                >
                  <div className="text-sm font-medium">Grid</div>
                </button>
              </div>
            </Tooltip>
          </div>
        </div>

        {/* Flex Direction - Visual Controls */}
        {(properties.layout !== 'grid') && (
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">
              Dirección
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { 
                  value: 'row', 
                  icon: '→', 
                  tooltip: 'Horizontal (izquierda a derecha)',
                  visual: <div className="flex space-x-1"><div className="w-2 h-2 bg-blue-400 rounded"></div><div className="w-2 h-2 bg-blue-400 rounded"></div><div className="w-2 h-2 bg-blue-400 rounded"></div></div>
                },
                { 
                  value: 'column', 
                  icon: '↓', 
                  tooltip: 'Vertical (arriba a abajo)',
                  visual: <div className="flex flex-col space-y-1"><div className="w-2 h-2 bg-blue-400 rounded"></div><div className="w-2 h-2 bg-blue-400 rounded"></div><div className="w-2 h-2 bg-blue-400 rounded"></div></div>
                },
                { 
                  value: 'row-reverse', 
                  icon: '←', 
                  tooltip: 'Horizontal inverso (derecha a izquierda)',
                  visual: <div className="flex space-x-1 flex-row-reverse"><div className="w-2 h-2 bg-blue-400 rounded"></div><div className="w-2 h-2 bg-blue-400 rounded"></div><div className="w-2 h-2 bg-blue-400 rounded"></div></div>
                },
                { 
                  value: 'column-reverse', 
                  icon: '↑', 
                  tooltip: 'Vertical inverso (abajo a arriba)',
                  visual: <div className="flex flex-col-reverse space-y-1 space-y-reverse"><div className="w-2 h-2 bg-blue-400 rounded"></div><div className="w-2 h-2 bg-blue-400 rounded"></div><div className="w-2 h-2 bg-blue-400 rounded"></div></div>
                },
              ].map((direction) => (
                <Tooltip key={direction.value} text={direction.tooltip}>
                  <div className="w-full">
                    <button
                      onClick={() => onPropertyChange('flexDirection', direction.value)}
                      className={`w-full p-3 border rounded-lg text-center transition-all hover:scale-105 ${
                        (properties.flexDirection || 'row') === direction.value
                          ? 'border-blue-500 bg-blue-600 text-white'
                          : 'border-gray-600 bg-gray-700 text-gray-300 hover:border-gray-500'
                      }`}
                    >
                      <div className="flex flex-col items-center space-y-2">
                        <div className="text-lg">{direction.icon}</div>
                        <div className="flex justify-center items-center h-4">
                          {direction.visual}
                        </div>
                      </div>
                    </button>
                  </div>
                </Tooltip>
              ))}
            </div>
          </div>
        )}

        {/* Justify Content - Visual Controls */}
        {(properties.layout !== 'grid') && (
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">
              Contenido justificado
            </label>
            <div className="grid grid-cols-3 gap-2 mb-4">
              {[
                { 
                  value: 'flex-start', 
                  label: 'Inicio',
                  tooltip: 'Alinea elementos al inicio del contenedor principal',
                  visual: <div className="flex justify-start w-full"><div className="flex space-x-1"><div className="w-2 h-2 bg-blue-400 rounded"></div><div className="w-2 h-2 bg-blue-400 rounded"></div></div></div>
                },
                { 
                  value: 'center', 
                  label: 'Centro',
                  tooltip: 'Centra elementos en el eje principal del contenedor',
                  visual: <div className="flex justify-center w-full"><div className="flex space-x-1"><div className="w-2 h-2 bg-blue-400 rounded"></div><div className="w-2 h-2 bg-blue-400 rounded"></div></div></div>
                },
                { 
                  value: 'flex-end', 
                  label: 'Final',
                  tooltip: 'Alinea elementos al final del contenedor principal',
                  visual: <div className="flex justify-end w-full"><div className="flex space-x-1"><div className="w-2 h-2 bg-blue-400 rounded"></div><div className="w-2 h-2 bg-blue-400 rounded"></div></div></div>
                },
                { 
                  value: 'space-between', 
                  label: 'Separado',
                  tooltip: 'Distribuye elementos con espacio igual entre ellos',
                  visual: <div className="flex justify-between w-full"><div className="w-2 h-2 bg-blue-400 rounded"></div><div className="w-2 h-2 bg-blue-400 rounded"></div></div>
                },
                { 
                  value: 'space-around', 
                  label: 'Alrededor',
                  tooltip: 'Distribuye elementos con espacio igual alrededor de cada uno',
                  visual: <div className="flex justify-around w-full"><div className="w-2 h-2 bg-blue-400 rounded"></div><div className="w-2 h-2 bg-blue-400 rounded"></div></div>
                },
                { 
                  value: 'space-evenly', 
                  label: 'Uniforme',
                  tooltip: 'Distribuye elementos con espacio uniforme entre ellos y los bordes',
                  visual: <div className="flex justify-evenly w-full"><div className="w-2 h-2 bg-blue-400 rounded"></div><div className="w-2 h-2 bg-blue-400 rounded"></div></div>
                },
              ].map((justify) => (
                <Tooltip key={justify.value} text={justify.tooltip}>
                  <div className="w-full">
                    <button
                      onClick={() => onPropertyChange('justifyContent', justify.value)}
                      className={`w-full p-3 border rounded-lg text-center transition-all hover:scale-105 ${
                        (properties.justifyContent || 'flex-start') === justify.value
                          ? 'border-blue-500 bg-blue-600 text-white'
                          : 'border-gray-600 bg-gray-700 text-gray-300 hover:border-gray-500'
                      }`}
                    >
                      <div className="flex flex-col items-center space-y-2">
                        <div className="text-xs font-medium">{justify.label}</div>
                        <div className="flex justify-center items-center h-4 w-full px-2">
                          {justify.visual}
                        </div>
                      </div>
                    </button>
                  </div>
                </Tooltip>
              ))}
            </div>
          </div>
        )}

        {/* Align Items - Visual Controls */}
        {(properties.layout !== 'grid') && (
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">
              Alinear elementos
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { 
                  value: 'flex-start', 
                  label: 'Inicio',
                  tooltip: 'Alinea elementos al inicio del eje transversal',
                  visual: <div className="flex items-start h-6 w-full"><div className="flex space-x-1"><div className="w-2 h-2 bg-green-400 rounded"></div><div className="w-2 h-3 bg-green-400 rounded"></div></div></div>
                },
                { 
                  value: 'center', 
                  label: 'Centro',
                  tooltip: 'Centra elementos en el eje transversal',
                  visual: <div className="flex items-center h-6 w-full"><div className="flex space-x-1"><div className="w-2 h-2 bg-green-400 rounded"></div><div className="w-2 h-3 bg-green-400 rounded"></div></div></div>
                },
                { 
                  value: 'flex-end', 
                  label: 'Final',
                  tooltip: 'Alinea elementos al final del eje transversal',
                  visual: <div className="flex items-end h-6 w-full"><div className="flex space-x-1"><div className="w-2 h-2 bg-green-400 rounded"></div><div className="w-2 h-3 bg-green-400 rounded"></div></div></div>
                },
                { 
                  value: 'stretch', 
                  label: 'Estirar',
                  tooltip: 'Estira elementos para llenar todo el eje transversal',
                  visual: <div className="flex items-stretch h-6 w-full"><div className="flex space-x-1"><div className="w-2 bg-green-400 rounded"></div><div className="w-2 bg-green-400 rounded"></div></div></div>
                },
                { 
                  value: 'baseline', 
                  label: 'Línea base',
                  tooltip: 'Alinea elementos según su línea base de texto',
                  visual: <div className="flex items-baseline h-6 w-full"><div className="flex space-x-1 items-baseline"><div className="w-2 h-2 bg-green-400 rounded"></div><div className="w-2 h-4 bg-green-400 rounded"></div></div></div>
                },
              ].map((align) => (
                <Tooltip key={align.value} text={align.tooltip}>
                  <div className="w-full">
                    <button
                      onClick={() => onPropertyChange('alignItems', align.value)}
                      className={`w-full p-3 border rounded-lg text-center transition-all hover:scale-105 ${
                        (properties.alignItems || 'stretch') === align.value
                          ? 'border-green-500 bg-green-600 text-white'
                          : 'border-gray-600 bg-gray-700 text-gray-300 hover:border-gray-500'
                      }`}
                    >
                      <div className="flex flex-col items-center space-y-2">
                        <div className="text-xs font-medium">{align.label}</div>
                        <div className="flex justify-center items-center w-full px-2">
                          {align.visual}
                        </div>
                      </div>
                    </button>
                  </div>
                </Tooltip>
              ))}
            </div>
          </div>
        )}

        {/* Gap Control */}
        {(properties.layout !== 'grid') && (
          <div>
            <Tooltip text="Controla el espacio entre elementos flexibles (0-64px)">
              <label className="block text-sm font-medium text-gray-300 mb-3">
                Hueco: {properties.gap || 0}px
              </label>
            </Tooltip>
            <div className="flex items-center w-full">
              <span className="text-xs text-gray-400 w-8 mr-3">0px</span>
              <input
                type="range"
                min="0"
                max="64"
                step="4"
                value={properties.gap || 0}
                onChange={(e) => onPropertyChange('gap', parseInt(e.target.value))}
                className="flex-1 slider"
                style={{
                  background: `linear-gradient(to right, #4f46e5 0%, #4f46e5 ${((properties.gap || 0) / 64) * 100}%, #374151 ${((properties.gap || 0) / 64) * 100}%, #374151 100%)`
                }}
              />
              <span className="text-xs text-gray-400 w-10 ml-3">64px</span>
            </div>
          </div>
        )}

        {/* Grid Controls */}
        {properties.layout === 'grid' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Columnas
                </label>
                <Tooltip text="Número de columnas en el grid (1-12)">
                  <div className="w-full">
                    <input
                      type="number"
                      min="1"
                      max="12"
                      value={properties.gridColumns || 2}
                      onChange={(e) => onPropertyChange('gridColumns', parseInt(e.target.value))}
                      className="w-full border border-gray-600 bg-gray-700 text-gray-200 rounded px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </Tooltip>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Filas
                </label>
                <Tooltip text="Número de filas en el grid (1-12)">
                  <div className="w-full">
                    <input
                      type="number"
                      min="1"
                      max="12"
                      value={properties.gridRows || 2}
                      onChange={(e) => onPropertyChange('gridRows', parseInt(e.target.value))}
                      className="w-full border border-gray-600 bg-gray-700 text-gray-200 rounded px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </Tooltip>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
