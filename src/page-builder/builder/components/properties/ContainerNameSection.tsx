import React from 'react';
import { Tooltip } from './Tooltip';
import type { Element } from '../../../types';

interface ContainerNameSectionProps {
  element: Element;
  updateElement: (id: string, updates: Partial<Element>) => void;
}

export const ContainerNameSection: React.FC<ContainerNameSectionProps> = ({
  element,
  updateElement,
}) => {
  return (
    <div className="property-section">
      <h4 className="text-sm font-semibold text-gray-200 mb-4">Información del Contenedor</h4>

      <div>
        {/* Element Name */}
        <label className="block text-sm font-medium text-gray-300 mb-2">
          <Tooltip text="Nombre identificativo para este contenedor. Te ayuda a organizar y encontrar elementos en diseños complejos.">
            <span className="cursor-help">Nombre del contenedor</span>
          </Tooltip>
        </label>
        <input
          type="text"
          value={element.name || ''}
          onChange={(e) => updateElement(element.id, { name: e.target.value })}
          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Contenedor sin nombre"
        />
      </div>
    </div>
  );
};
