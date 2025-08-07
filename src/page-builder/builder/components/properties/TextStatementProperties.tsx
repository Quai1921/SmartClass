import React from 'react';
import { TrueFalseButtonTabs } from './common/TrueFalseButtonTabs';
import type { Element } from '../../../types';

interface TextStatementPropertiesProps {
  element: Element;
  onPropertyChange: (property: string, value: any) => void;
  onElementUpdate?: (elementId: string, updates: any) => void;
}

export const TextStatementProperties: React.FC<TextStatementPropertiesProps> = ({
  element,
  onPropertyChange,
}) => {
  const properties: any = element.properties;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h4 className="text-lg font-semibold text-gray-200 mb-4">Configuración de Declaración</h4>
      </div>

      {/* Statement Text */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Declaración</label>
        <textarea
          value={properties.statement || ''}
          onChange={(e) => onPropertyChange('statement', e.target.value)}
          className="w-full border border-gray-600 bg-gray-700 text-gray-200 rounded px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
          placeholder="Escribe la declaración que el usuario debe evaluar..."
          rows={3}
        />
      </div>

      {/* Correct Answer */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-3">Respuesta Correcta</label>
        <div className="flex gap-4">
          <label className="flex items-center">
            <input
              type="radio"
              name="correctAnswer"
              checked={properties.correctAnswer === true}
              onChange={() => onPropertyChange('correctAnswer', true)}
              className="mr-2 text-blue-600 bg-gray-700 border-gray-600 focus:ring-blue-500"
            />
            <span className="text-gray-300">Verdadero</span>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="correctAnswer"
              checked={properties.correctAnswer === false}
              onChange={() => onPropertyChange('correctAnswer', false)}
              className="mr-2 text-blue-600 bg-gray-700 border-gray-600 focus:ring-blue-500"
            />
            <span className="text-gray-300">Falso</span>
          </label>
        </div>
      </div>

      {/* Feedback Message */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Mensaje de Retroalimentación</label>
        <textarea
          value={properties.feedbackMessage || ''}
          onChange={(e) => onPropertyChange('feedbackMessage', e.target.value)}
          className="w-full border border-gray-600 bg-gray-700 text-gray-200 rounded px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
          placeholder="Mensaje opcional mostrado después de responder..."
          rows={2}
        />
      </div>

      {/* Settings */}
      <div className="space-y-4">
        <h5 className="text-sm font-medium text-gray-300 border-b border-gray-600 pb-2">Configuración</h5>
        
        {/* Allow Retry */}
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="allowRetry"
            checked={properties.allowRetry !== false}
            onChange={(e) => onPropertyChange('allowRetry', e.target.checked)}
            className="h-4 w-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
          />
          <label htmlFor="allowRetry" className="text-sm font-medium text-gray-300">
            Permitir reintentos
          </label>
        </div>
      </div>

      {/* Button Styling */}
      <div className="space-y-4">
        <h5 className="text-sm font-medium text-gray-300 border-b border-gray-600 pb-2">Personalización de Botones</h5>
        <TrueFalseButtonTabs
          properties={properties}
          onPropertyChange={onPropertyChange}
        />
      </div>

      {/* Text Styling */}
      <div className="space-y-4">
        <h5 className="text-sm font-medium text-gray-300 border-b border-gray-600 pb-2">Estilo del Texto</h5>
        
        <div className="grid grid-cols-2 gap-4">
          {/* Font Size */}
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-2">Tamaño de Fuente</label>
            <input
              type="number"
              value={properties.fontSize || 16}
              onChange={(e) => onPropertyChange('fontSize', parseInt(e.target.value) || 16)}
              className="w-full border border-gray-600 bg-gray-700 text-gray-200 rounded px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
              min="8"
              max="72"
            />
          </div>

          {/* Font Weight */}
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-2">Peso de Fuente</label>
            <select
              value={properties.fontWeight || '400'}
              onChange={(e) => onPropertyChange('fontWeight', e.target.value)}
              className="w-full border border-gray-600 bg-gray-700 text-gray-200 rounded px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            >
              <option value="100">Thin (100)</option>
              <option value="200">Extra Light (200)</option>
              <option value="300">Light (300)</option>
              <option value="400">Normal (400)</option>
              <option value="500">Medium (500)</option>
              <option value="600">Semi Bold (600)</option>
              <option value="700">Bold (700)</option>
              <option value="800">Extra Bold (800)</option>
              <option value="900">Black (900)</option>
            </select>
          </div>
        </div>

        {/* Text Color */}
        <div>
          <label className="block text-xs font-medium text-gray-400 mb-2">Color del Texto</label>
          <div className="flex items-center space-x-2">
            <input
              type="color"
              value={properties.color || '#374151'}
              onChange={(e) => onPropertyChange('color', e.target.value)}
              className="w-8 h-8 border border-gray-600 rounded cursor-pointer"
              onPointerDown={(e) => e.stopPropagation()}
              onMouseDown={(e) => e.stopPropagation()}
              onClick={(e) => e.stopPropagation()}
            />
            <input
              type="text"
              value={properties.color || '#374151'}
              onChange={(e) => onPropertyChange('color', e.target.value)}
              className="flex-1 border border-gray-600 bg-gray-700 text-gray-200 rounded px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
              placeholder="#374151"
            />
          </div>
        </div>

        {/* Text Alignment */}
        <div>
          <label className="block text-xs font-medium text-gray-400 mb-2">Alineación</label>
          <select
            value={properties.textAlign || 'center'}
            onChange={(e) => onPropertyChange('textAlign', e.target.value)}
            className="w-full border border-gray-600 bg-gray-700 text-gray-200 rounded px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
          >
            <option value="left">Izquierda</option>
            <option value="center">Centro</option>
            <option value="right">Derecha</option>
            <option value="justify">Justificado</option>
          </select>
        </div>
      </div>

      {/* Background Color */}
      <div>
        <label className="block text-xs font-medium text-gray-400 mb-2">Color de Fondo</label>
        <div className="flex items-center space-x-2">
          <input
            type="color"
            value={properties.backgroundColor || '#f8fafc'}
            onChange={(e) => onPropertyChange('backgroundColor', e.target.value)}
            className="w-8 h-8 border border-gray-600 rounded cursor-pointer"
            onPointerDown={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
            onClick={(e) => e.stopPropagation()}
          />
          <input
            type="text"
            value={properties.backgroundColor || '#f8fafc'}
            onChange={(e) => onPropertyChange('backgroundColor', e.target.value)}
            className="flex-1 border border-gray-600 bg-gray-700 text-gray-200 rounded px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            placeholder="#f8fafc"
          />
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-blue-900/30 border border-blue-600/50 rounded-lg p-3">
        <p className="text-xs text-blue-300">
          💡 <strong>Tip:</strong> Los usuarios verán la declaración y podrán seleccionar Verdadero o Falso.
        </p>
      </div>
    </div>
  );
};
