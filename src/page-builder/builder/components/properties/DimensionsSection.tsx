import React from 'react';
import { Tooltip } from './Tooltip';
import { UnitSelector } from './UnitSelector';
import type { Element } from '../../../types';

interface DimensionsSectionProps {
  element: Element;
  onPropertyChange: (property: string, value: any) => void;
  isThisElementResizing: boolean;
  displayWidth: number;
  displayHeight: number;
  inputWidth: number;
  inputHeight: number;
  handleWidthUnitChange: (unit: string) => void;
  handleHeightUnitChange: (unit: string) => void;
}

export const DimensionsSection: React.FC<DimensionsSectionProps> = ({
  element,
  onPropertyChange,
  isThisElementResizing,
  displayWidth,
  displayHeight,
  inputWidth,
  inputHeight,
  handleWidthUnitChange,
  handleHeightUnitChange,
}) => {
  const { properties } = element;

  return (
    <div className="property-section">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-sm font-semibold text-gray-200">Dimensiones</h4>
        {isThisElementResizing && (
          <div className="flex items-center gap-2 text-xs text-blue-400 bg-blue-900/20 px-2 py-1 rounded animate-pulse">
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-ping"></div>
            <span>Redimensionando en tiempo real</span>
          </div>
        )}
      </div>
      
      <div className="space-y-6">
        {/* Width */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            <div className="flex flex-col space-y-2">
              <Tooltip text="Establece el ancho del contenedor. Puedes usar píxeles (px), porcentaje del viewport (vw) o porcentaje del contenedor padre (%). También puedes usar 'max-content' para que el ancho se adapte automáticamente al contenido más ancho.">
                <code className="text-[11px] font-bold bg-blue-100 text-blue-800 px-2 py-1 rounded border cursor-help w-fit">width</code>
              </Tooltip>
              <span className="text-gray-300">Ancho</span>
            </div>
          </label>
          <div className="flex gap-2">
            <input
              type="number"
              min="1"
              max="2000"
              value={isThisElementResizing ? displayWidth : inputWidth}
              onChange={(e) => onPropertyChange('width', parseInt(e.target.value))}
              className={`flex-1 border rounded px-3 py-2 text-sm focus:ring-1 ${
                properties.widthUnit === 'max-content' || properties.widthUnit === 'min-content' || properties.widthUnit === 'fit-content'
                  ? 'border-gray-500 bg-gray-600 text-gray-400 cursor-not-allowed'
                  : isThisElementResizing 
                    ? 'border-blue-400 bg-blue-900/20 text-blue-300 ring-2 ring-blue-500/30 animate-pulse' 
                    : 'border-gray-600 bg-gray-700 text-gray-200 focus:border-blue-500 focus:ring-blue-500'
              }`}
              disabled={properties.widthUnit === 'max-content' || properties.widthUnit === 'min-content' || properties.widthUnit === 'fit-content' || isThisElementResizing}
              placeholder={properties.widthUnit === 'max-content' || properties.widthUnit === 'min-content' || properties.widthUnit === 'fit-content' ? 'Auto' : ''}
              title={
                properties.widthUnit === 'max-content' || properties.widthUnit === 'min-content' || properties.widthUnit === 'fit-content' 
                  ? 'El ancho se calcula automáticamente con la unidad seleccionada'
                  : isThisElementResizing 
                    ? 'Mostrando dimensiones en tiempo real durante el redimensionamiento' 
                    : ''
              }
            />
            <UnitSelector
              value={properties.widthUnit || 'px'}
              onChange={handleWidthUnitChange}
              options={[
                { value: 'px', label: 'px', tooltip: 'Píxeles - tamaño fijo' },
                { value: 'vw', label: 'vw', tooltip: 'Viewport Width - porcentaje del ancho de la pantalla' },
                { value: 'dvw', label: 'dvw', tooltip: 'Dynamic Viewport Width - ancho de pantalla que se ajusta a la UI móvil' },
                { value: '%', label: '%', tooltip: 'Porcentaje del contenedor padre' },
                { value: 'max-content', label: 'max-content', tooltip: 'Ancho automático basado en el contenido más ancho' },
                { value: 'min-content', label: 'min-content', tooltip: 'Ancho automático basado en el contenido mínimo' },
                { value: 'fit-content', label: 'fit-content', tooltip: 'Ancho que se ajusta al contenido disponible' },
              ]}
              className="w-20"
            />
          </div>
        </div>

        {/* Min Width */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Ancho mínimo
          </label>
          <div className="flex gap-2">
            <input
              type="number"
              min="1"
              max="1000"
              value={properties.minWidth || 100}
              onChange={(e) => onPropertyChange('minWidth', parseInt(e.target.value))}
              className="flex-1 border border-gray-600 bg-gray-700 text-gray-200 rounded px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
            <UnitSelector
              value={properties.minWidthUnit || 'px'}
              onChange={(unit) => onPropertyChange('minWidthUnit', unit)}
              options={[
                { value: 'px', label: 'px', tooltip: 'Píxeles - tamaño fijo' },
                { value: 'vw', label: 'vw', tooltip: 'Viewport Width - porcentaje del ancho de la pantalla' },
                { value: 'dvw', label: 'dvw', tooltip: 'Dynamic Viewport Width - ancho de pantalla que se ajusta a la UI móvil' },
                { value: '%', label: '%', tooltip: 'Porcentaje del contenedor padre' },
                { value: 'max-content', label: 'max-content', tooltip: 'Ancho automático basado en el contenido más ancho' },
                { value: 'min-content', label: 'min-content', tooltip: 'Ancho automático basado en el contenido mínimo' },
                { value: 'fit-content', label: 'fit-content', tooltip: 'Ancho que se ajusta al contenido disponible' },
              ]}
              className="w-20"
            />
          </div>
        </div>

        {/* Min Height */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            <div className="flex flex-col space-y-2">
              <Tooltip text="Altura mínima que debe tener el contenedor. El contenedor puede crecer más alto que esto si el contenido lo requiere.">
                <code className="text-[11px] font-bold bg-blue-100 text-blue-800 px-2 py-1 rounded border cursor-help w-fit">min-height</code>
              </Tooltip>
              <span className="text-gray-300">Altura mínima</span>
            </div>
          </label>
          <div className="flex gap-2">
            <input
              type="number"
              min="50"
              value={properties.minHeight || 100}
              onChange={(e) => onPropertyChange('minHeight', parseInt(e.target.value))}
              className="flex-1 border border-gray-600 bg-gray-700 text-gray-200 rounded px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
            <UnitSelector
              value={properties.minHeightUnit || 'px'}
              onChange={(unit) => onPropertyChange('minHeightUnit', unit)}
              options={[
                { value: 'px', label: 'px', tooltip: 'Píxeles - tamaño fijo' },
                { value: 'vh', label: 'vh', tooltip: 'Viewport Height - porcentaje de la altura de la pantalla' },
                { value: 'dvh', label: 'dvh', tooltip: 'Dynamic Viewport Height - altura de pantalla que se ajusta a la UI móvil' },
                { value: 'vw', label: 'vw', tooltip: 'Viewport Width - porcentaje del ancho de la pantalla' },
                { value: 'dvw', label: 'dvw', tooltip: 'Dynamic Viewport Width - ancho de pantalla que se ajusta a la UI móvil' },
                { value: '%', label: '%', tooltip: 'Porcentaje del contenedor padre' },
                { value: 'max-content', label: 'max-content', tooltip: 'Altura automática basada en el contenido más alto' },
                { value: 'min-content', label: 'min-content', tooltip: 'Altura automática basada en el contenido mínimo' },
                { value: 'fit-content', label: 'fit-content', tooltip: 'Altura que se ajusta al contenido disponible' },
              ]}
              className="w-20"
            />
          </div>
        </div>

        {/* Fixed Height */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            <div className="flex flex-col space-y-2">
              <Tooltip text="Altura fija para el contenedor. Deja vacío para altura automática que se ajusta al contenido. También puedes usar 'max-content' para que la altura se adapte automáticamente al contenido más alto.">
                <code className="text-[11px] font-bold bg-blue-100 text-blue-800 px-2 py-1 rounded border cursor-help w-fit">height</code>
              </Tooltip>
              <span className="text-gray-300">Altura fija</span>
            </div>
          </label>
          <div className="flex gap-2">
            <input
              type="number"
              min="0"
              placeholder="Auto"
              value={isThisElementResizing ? displayHeight : (inputHeight || '')}
              onChange={(e) => onPropertyChange('height', e.target.value ? parseInt(e.target.value) : undefined)}
              className={`flex-1 border rounded px-3 py-2 text-sm focus:ring-1 ${
                properties.heightUnit === 'max-content' || properties.heightUnit === 'min-content' || properties.heightUnit === 'fit-content'
                  ? 'border-gray-500 bg-gray-600 text-gray-400 cursor-not-allowed'
                  : isThisElementResizing 
                    ? 'border-blue-400 bg-blue-900/20 text-blue-300 ring-2 ring-blue-500/30 animate-pulse' 
                    : 'border-gray-600 bg-gray-700 text-gray-200 focus:border-blue-500 focus:ring-blue-500'
              }`}
              disabled={properties.heightUnit === 'max-content' || properties.heightUnit === 'min-content' || properties.heightUnit === 'fit-content' || isThisElementResizing}
              title={
                properties.heightUnit === 'max-content' || properties.heightUnit === 'min-content' || properties.heightUnit === 'fit-content'
                  ? 'La altura se calcula automáticamente con la unidad seleccionada'
                  : isThisElementResizing 
                    ? 'Mostrando dimensiones en tiempo real durante el redimensionamiento' 
                    : ''
              }
            />
            <UnitSelector
              value={properties.heightUnit || 'px'}
              onChange={handleHeightUnitChange}
              options={[
                { value: 'px', label: 'px', tooltip: 'Píxeles - tamaño fijo' },
                { value: 'vh', label: 'vh', tooltip: 'Viewport Height - porcentaje de la altura de la pantalla' },
                { value: 'dvh', label: 'dvh', tooltip: 'Dynamic Viewport Height - altura de pantalla que se ajusta a la UI móvil' },
                { value: 'vw', label: 'vw', tooltip: 'Viewport Width - porcentaje del ancho de la pantalla' },
                { value: 'dvw', label: 'dvw', tooltip: 'Dynamic Viewport Width - ancho de pantalla que se ajusta a la UI móvil' },
                { value: '%', label: '%', tooltip: 'Porcentaje del contenedor padre' },
                { value: 'max-content', label: 'max-content', tooltip: 'Altura automática basada en el contenido más alto' },
                { value: 'min-content', label: 'min-content', tooltip: 'Altura automática basada en el contenido mínimo' },
                { value: 'fit-content', label: 'fit-content', tooltip: 'Altura que se ajusta al contenido disponible' },
              ]}
              className="w-20"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
