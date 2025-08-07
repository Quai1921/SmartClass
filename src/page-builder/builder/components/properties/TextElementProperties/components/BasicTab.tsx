import React from 'react';
import { Tooltip } from '../Tooltip';
import type { Element } from '../../../../types';

interface BasicTabProps {
  element: Element;
  onPropertyChange: (property: string, value: unknown) => void;
  onElementUpdate: (elementId: string, updates: Partial<Element>) => void;
}

export const BasicTab: React.FC<BasicTabProps> = ({
  element,
  onPropertyChange,
  onElementUpdate
}) => {
  const handlePropertyChange = (property: string, value: unknown) => {
    // Special handling for heading level changes
    if (property === 'level' && element.type === 'heading') {
      // Update both the level and the className to match the new level
      const newClassName = getHeadingClassName(value as number);
      onPropertyChange('level', value);
      onPropertyChange('className', newClassName);
    } else {
      onPropertyChange(property, value);
    }
  };

  // Helper function to get default classes for heading levels
  function getHeadingClassName(level: number): string {
    switch (level) {
      case 1: return 'text-3xl font-bold mb-4';
      case 2: return 'text-2xl font-semibold mb-3';
      case 3: return 'text-xl font-medium mb-3';
      case 4: return 'text-lg font-medium mb-2';
      case 5: return 'text-base font-medium mb-2';
      case 6: return 'text-sm font-medium mb-2';
      default: return 'text-2xl font-bold mb-4';
    }
  }

  return (
    <div className="space-y-4">
      <h4 className="text-sm font-semibold text-gray-200 mb-4">Propiedades del Texto</h4>
       
      {/* Element Name */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Nombre del Elemento</label>
        <input
          type="text"
          value={element.name || ''}
          onChange={(e) => onElementUpdate(element.id, { name: e.target.value })}
          placeholder="Nombre del elemento"
          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Heading Level (only for heading elements) */}
      {element.type === 'heading' && (
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            <div className="flex flex-col space-y-2">
              <Tooltip text="Selecciona el nivel del encabezado (h1-h6). Los niveles más bajos tienen mayor importancia semántica.">
                <code className="text-[11px] font-bold bg-blue-100 text-blue-800 px-2 py-1 rounded border cursor-help w-fit">headingLevel</code>
              </Tooltip>
              <span className="text-gray-300">Nivel del Encabezado</span>
            </div>
          </label>
          <select
            value={element.properties.level || 1}
            onChange={(e) => handlePropertyChange('level', parseInt(e.target.value))}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value={1}>H1 - Título Principal</option>
            <option value={2}>H2 - Título Secundario</option>
            <option value={3}>H3 - Subtítulo</option>
            <option value={4}>H4 - Encabezado</option>
            <option value={5}>H5 - Subencabezado</option>
            <option value={6}>H6 - Encabezado Menor</option>
          </select>
        </div>
      )}

      {/* Text Content */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          {element.type === 'quote' ? 'Contenido de la Cita' : 'Contenido del Texto'}
        </label>
        <textarea
          value={element.type === 'quote' ? (element.properties.content || '') : (element.properties.text || '')}
          onChange={(e) => handlePropertyChange(element.type === 'quote' ? 'content' : 'text', e.target.value)}
          placeholder={element.type === 'quote' ? "Escribe tu cita aquí..." : "Escribe tu texto aquí..."}
          rows={3}
          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y"
        />
      </div>
    </div>
  );
}; 