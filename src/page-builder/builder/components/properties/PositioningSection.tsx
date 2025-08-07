import React from 'react';
import { Tooltip } from './Tooltip';
import type { Element } from '../../../types';

interface PositioningSectionProps {
  element: Element;
  onPropertyChange: (property: string, value: any) => void;
}

export const PositioningSection: React.FC<PositioningSectionProps> = ({
  element,
  onPropertyChange,
}) => {
  const { properties } = element;

  return (
    <div className="property-section">
      <h4 className="text-sm font-semibold text-gray-200 mb-4">Posicionamiento</h4>

      <div className="space-y-4">        {/* Position Type */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Tipo de posición
          </label>
          <div className="grid grid-cols-2 gap-2">
            {[
              { value: 'relative', label: 'Relativa', tooltip: 'Posición relativa a su ubicación normal' },
              { value: 'absolute', label: 'Absoluta', tooltip: 'Posición absoluta respecto al contenedor padre' },
            ].map((pos) => (
              <Tooltip key={pos.value} text={pos.tooltip}>
                <button
                  onClick={() => onPropertyChange('position', pos.value)}
                  className={`px-3 py-2 text-xs rounded border transition-all ${
                    (properties.position || 'relative') === pos.value
                      ? 'bg-purple-600 text-white border-purple-500'
                      : 'bg-gray-700 text-gray-300 border-gray-600 hover:bg-gray-600'
                  }`}
                >
                  {pos.label}
                </button>
              </Tooltip>
            ))}
          </div>
        </div>        {/* Position Values - only show for positioned elements */}
        {properties.position && (
          <div className="grid grid-cols-2 gap-3">
            {/* Top */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <Tooltip text="Distancia desde el borde superior del contenedor padre en píxeles.">
                  <span className="cursor-help">Superior (px)</span>
                </Tooltip>
              </label>
              <input
                type="number"
                value={properties.top || 0}
                onChange={(e) => onPropertyChange('top', parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="0"
              />
            </div>

            {/* Left */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <Tooltip text="Distancia desde el borde izquierdo del contenedor padre en píxeles.">
                  <span className="cursor-help">Izquierda (px)</span>
                </Tooltip>
              </label>
              <input
                type="number"
                value={properties.left || 0}
                onChange={(e) => onPropertyChange('left', parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="0"
              />
            </div>

            {/* Bottom */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <Tooltip text="Distancia desde el borde inferior del contenedor padre en píxeles.">
                  <span className="cursor-help">Abajo (px)</span>
                </Tooltip>
              </label>
              <input
                type="number"
                value={properties.bottom || 0}
                onChange={(e) => onPropertyChange('bottom', parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="0"
              />
            </div>

            {/* Right */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <Tooltip text="Distancia desde el borde derecho del contenedor padre en píxeles.">
                  <span className="cursor-help">Derecha (px)</span>
                </Tooltip>
              </label>
              <input
                type="number"
                value={properties.right || 0}
                onChange={(e) => onPropertyChange('right', parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="0"
              />
            </div>
          </div>
        )}

        {/* Z-Index */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            <div className="flex flex-col space-y-2">
              <Tooltip text="Controla la superposición de elementos. Valores más altos aparecen por encima de valores más bajos.">
                <code className="text-[11px] font-bold bg-purple-100 text-purple-800 px-2 py-1 rounded border cursor-help w-fit">z-index</code>
              </Tooltip>
              <span className="text-gray-300">Orden de apilamiento</span>
            </div>
          </label>
          <input
            type="number"
            value={properties.zIndex || 1}
            onChange={(e) => onPropertyChange('zIndex', parseInt(e.target.value) || 1)}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="1"
            min="0"
            max="9999"
          />
        </div>
      </div>
    </div>
  );
};
