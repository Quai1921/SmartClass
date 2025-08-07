import React from 'react';
import { Tooltip } from './Tooltip';
import type { Element } from '../../../types';

// Tooltip for select options
const OptionTooltip: React.FC<{ value: string; tooltip: string; children: React.ReactNode }> = ({ value, tooltip, children }) => (
  <option value={value} title={tooltip}>
    {children}
  </option>
);

interface LayoutSectionProps {
  element: Element;
  onPropertyChange: (property: string, value: any) => void;
}

export const LayoutSection: React.FC<LayoutSectionProps> = ({
  element,
  onPropertyChange,
}) => {
  const { properties } = element;

  return (
    <div className="property-section">
      <h4 className="text-sm font-semibold text-gray-200 mb-4">Layout & Flexbox</h4>

      <div className="space-y-6">
        {/* Layout Type */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-3">
            Dirección del layout
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { value: 'column', label: 'column', icon: '|', tooltip: 'Apila elementos uno encima del otro (verticalmente)' },
              { value: 'row', label: 'row', icon: '—', tooltip: 'Coloca elementos uno al lado del otro (horizontalmente)' },
              { value: 'grid', label: 'grid', icon: '⚏', tooltip: 'Crea una cuadrícula con filas y columnas' },
            ].map((layout) => (
              <Tooltip key={layout.value} text={layout.tooltip}>
                <button
                  onClick={() => onPropertyChange('layout', layout.value)}
                  className={`relative p-3 border-2 rounded-lg text-center transition-all cursor-help aspect-square w-full flex flex-col items-center justify-center ${properties.layout === layout.value
                      ? 'border-blue-400 bg-blue-900 text-blue-300 shadow-md'
                      : 'border-gray-500 bg-gray-700 text-gray-300 hover:border-gray-400 hover:bg-gray-600'
                    }`}
                >
                  <div className="text-xl mb-1 font-bold">{layout.icon}</div>
                  <div className="text-xs font-mono font-semibold">{layout.label}</div>
                </button>
              </Tooltip>
            ))}
          </div>
        </div>

        {/* Grid Columns (if grid layout) */}
        {properties.layout === 'grid' && (
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              <div className="flex flex-col space-y-2">
                <Tooltip text="Define cuántas columnas debe tener el diseño de cuadrícula. Cada elemento hijo se organizará en este patrón de cuadrícula.">
                  <code className="text-[11px] font-bold bg-blue-100 text-blue-800 px-2 py-1 rounded border cursor-help w-fit">grid-template-columns</code>
                </Tooltip>
                <span className="text-gray-300">Columnas</span>
              </div>
            </label>
            <input
              type="number"
              min="1"
              max="12"
              value={properties.gridColumns || 2}
              onChange={(e) => onPropertyChange('gridColumns', parseInt(e.target.value))}
              className="w-full border border-gray-600 bg-gray-700 text-gray-200 rounded px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>
        )}

        {/* Justify Content */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            <div className="flex flex-col space-y-2">
              <Tooltip text="Controla la alineación horizontal de los elementos hijos. 'flex-start' = izquierda, 'center' = centro, 'flex-end' = derecha, 'space-between' = espaciado uniforme entre elementos.">
                <code className="text-[11px] font-bold bg-blue-100 text-blue-800 px-2 py-1 rounded border cursor-help w-fit">justify-content</code>
              </Tooltip>
              <span className="text-gray-300">Alineación horizontal</span>
            </div>
          </label>
          <select
            value={properties.justifyContent || 'flex-start'}
            onChange={(e) => onPropertyChange('justifyContent', e.target.value)}
            className="w-full border border-gray-600 bg-gray-700 text-gray-200 rounded px-3 py-2 text-sm font-mono focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          >
            <OptionTooltip value="flex-start" tooltip="Alinea elementos al inicio (izquierda en español)">
              flex-start
            </OptionTooltip>
            <OptionTooltip value="center" tooltip="Centra elementos horizontalmente">
              center
            </OptionTooltip>
            <OptionTooltip value="flex-end" tooltip="Alinea elementos al final (derecha en español)">
              flex-end
            </OptionTooltip>
            <OptionTooltip value="space-between" tooltip="Distribuye elementos con espacios iguales entre ellos">
              space-between
            </OptionTooltip>
            <OptionTooltip value="space-around" tooltip="Distribuye elementos con espacios iguales alrededor de cada uno">
              space-around
            </OptionTooltip>
            <OptionTooltip value="space-evenly" tooltip="Distribuye elementos con espacios perfectamente iguales">
              space-evenly
            </OptionTooltip>
          </select>
        </div>

        {/* Align Items */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            <div className="flex flex-col space-y-2">
              <Tooltip text="Controla la alineación vertical de los elementos hijos. 'flex-start' = arriba, 'center' = centro, 'flex-end' = abajo, 'stretch' = estira a toda la altura.">
                <code className="text-[11px] font-bold bg-blue-100 text-blue-800 px-2 py-1 rounded border cursor-help w-fit">align-items</code>
              </Tooltip>
              <span className="text-gray-300">Alineación vertical</span>
            </div>
          </label>
          <select
            value={properties.alignItems || 'flex-start'}
            onChange={(e) => onPropertyChange('alignItems', e.target.value)}
            className="w-full border border-gray-600 bg-gray-700 text-gray-200 rounded px-3 py-2 text-sm font-mono focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          >
            <OptionTooltip value="flex-start" tooltip="Alinea elementos al inicio (arriba)">
              flex-start
            </OptionTooltip>
            <OptionTooltip value="center" tooltip="Centra elementos verticalmente">
              center
            </OptionTooltip>
            <OptionTooltip value="flex-end" tooltip="Alinea elementos al final (abajo)">
              flex-end
            </OptionTooltip>
            <OptionTooltip value="stretch" tooltip="Estira elementos para ocupar toda la altura del contenedor">
              stretch
            </OptionTooltip>
            <OptionTooltip value="baseline" tooltip="Alinea elementos por su línea base de texto">
              baseline
            </OptionTooltip>
          </select>
        </div>

        {/* Gap */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            <div className="flex flex-col space-y-2">
              <Tooltip text="Establece el espaciado entre elementos hijos. Valores más altos crean más espacio entre elementos sin afectar el padding.">
                <code className="text-[11px] font-bold bg-blue-100 text-blue-800 px-2 py-1 rounded border cursor-help w-fit">gap</code>
              </Tooltip>
              <span className="text-gray-300">Espaciado entre elementos (px)</span>
            </div>
          </label>
          <input
            type="number"
            min="0"
            max="100"
            value={properties.gap || 0}
            onChange={(e) => onPropertyChange('gap', parseInt(e.target.value))}
            className="w-full border border-gray-600 bg-gray-700 text-gray-200 rounded px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>

        {/* Dimensions Section */}
        <div className="space-y-4 pt-4 border-t border-gray-600">
          <h5 className="text-sm font-medium text-gray-300">Dimensiones</h5>
          
          <div className="grid grid-cols-2 gap-3">
            {/* Padding */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <div className="flex flex-col space-y-2">
                  <Tooltip text="Espaciado interior dentro del contenedor. Crea espacio entre el borde del contenedor y su contenido.">
                    <code className="text-[11px] font-bold bg-blue-100 text-blue-800 px-2 py-1 rounded border cursor-help w-fit">padding</code>
                  </Tooltip>
                  <span className="text-gray-300">Relleno (px)</span>
                </div>
              </label>
              <input
                type="number"
                min="0"
                value={properties.padding || 0}
                onChange={(e) => onPropertyChange('padding', parseInt(e.target.value))}
                className="w-full border border-gray-600 bg-gray-700 text-gray-200 rounded px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>

            {/* Margin */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <div className="flex flex-col space-y-2">
                  <Tooltip text="Espaciado exterior alrededor del contenedor. Crea espacio entre este contenedor y otros elementos.">
                    <code className="text-[11px] font-bold bg-blue-100 text-blue-800 px-2 py-1 rounded border cursor-help w-fit">margin</code>
                  </Tooltip>
                  <span className="text-gray-300">Margen (px)</span>
                </div>
              </label>
              <input
                type="number"
                min="0"
                value={properties.margin || 0}
                onChange={(e) => onPropertyChange('margin', parseInt(e.target.value))}
                className="w-full border border-gray-600 bg-gray-700 text-gray-200 rounded px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Width */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              <div className="flex flex-col space-y-2">
                <Tooltip text="Establece el ancho del contenedor en píxeles. Valores más grandes hacen el contenedor más ancho.">
                  <code className="text-[11px] font-bold bg-blue-100 text-blue-800 px-2 py-1 rounded border cursor-help w-fit">width</code>
                </Tooltip>
                <span className="text-gray-300">Ancho (px)</span>
              </div>
            </label>
            <input
              type="number"
              min="100"
              max="2000"
              value={properties.width || 400}
              onChange={(e) => onPropertyChange('width', parseInt(e.target.value))}
              className="w-full border border-gray-600 bg-gray-700 text-gray-200 rounded px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Min Height */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              <div className="flex flex-col space-y-2">
                <Tooltip text="Altura mínima que debe tener el contenedor. El contenedor puede crecer más alto que esto si el contenido lo requiere.">
                  <code className="text-[11px] font-bold bg-blue-100 text-blue-800 px-2 py-1 rounded border cursor-help w-fit">min-height</code>
                </Tooltip>
                <span className="text-gray-300">Altura mínima (px)</span>
              </div>
            </label>
            <input
              type="number"
              min="50"
              value={properties.minHeight || 100}
              onChange={(e) => onPropertyChange('minHeight', parseInt(e.target.value))}
              className="w-full border border-gray-600 bg-gray-700 text-gray-200 rounded px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Fixed Height */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              <div className="flex flex-col space-y-2">
                <Tooltip text="Altura fija para el contenedor. Deja vacío para altura automática que se ajusta al contenido.">
                  <code className="text-[11px] font-bold bg-blue-100 text-blue-800 px-2 py-1 rounded border cursor-help w-fit">height</code>
                </Tooltip>
                <span className="text-gray-300">Altura fija (px)</span>
              </div>
            </label>
            <input
              type="number"
              min="0"
              placeholder="Auto"
              value={properties.height || ''}
              onChange={(e) => onPropertyChange('height', e.target.value ? parseInt(e.target.value) : undefined)}
              className="w-full border border-gray-600 bg-gray-700 text-gray-200 rounded px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
