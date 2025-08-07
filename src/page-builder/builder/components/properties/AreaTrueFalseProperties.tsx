import React, { useState, useEffect } from 'react';
import type { Element } from '../../../types';

interface AreaTrueFalsePropertiesProps {
  element: Element;
  onPropertyChange: (property: string, value: any) => void;
  onElementUpdate: (elementId: string, updates: any) => void;
}

export const AreaTrueFalseProperties: React.FC<AreaTrueFalsePropertiesProps> = ({
  element,
  onPropertyChange,
  onElementUpdate
}) => {
  const { properties } = element;
  const [activeTab, setActiveTab] = useState<'basic' | 'styling' | 'result'>('basic');
  
  // Local state for shake toggle  
  const [shakeEnabled, setShakeEnabled] = useState<boolean>(
    (properties as any).shakeOnWrong === true
  );

  // Sync local state with element properties - simplified
  useEffect(() => {
    const currentShakeValue = (properties as any).shakeOnWrong === true;
    setShakeEnabled(currentShakeValue);
  }, [element.id, (properties as any).shakeOnWrong]);

  // Cast properties for custom properties
  const customProps = properties as any;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h4 className="text-lg font-semibold text-gray-200 mb-4">Área Verdadero/Falso</h4>
        
        {/* Tab Navigation */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setActiveTab('basic')}
            className={`px-3 py-2 rounded text-sm ${
              activeTab === 'basic'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
            }`}
          >
            Básico
          </button>
          <button
            onClick={() => setActiveTab('styling')}
            className={`px-3 py-2 rounded text-sm ${
              activeTab === 'styling'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
            }`}
          >
            Estilos
          </button>
          <button
            onClick={() => setActiveTab('result')}
            className={`px-3 py-2 rounded text-sm ${
              activeTab === 'result'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
            }`}
          >
            Resultado
          </button>
        </div>
      </div>

      {/* Basic Tab */}
      {activeTab === 'basic' && (
        <div className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Título del Elemento</label>
            <input
              type="text"
              value={properties.title || ''}
              onChange={(e) => onPropertyChange('title', e.target.value)}
              className="w-full border border-gray-600 bg-gray-800 text-gray-200 rounded px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
              placeholder="Área Verdadero/Falso"
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

          {/* Click Behavior */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">Comportamiento al Hacer Clic</label>
            <div className="flex gap-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="clickAnswersTrue"
                  checked={customProps.clickAnswersTrue !== false}
                  onChange={() => onPropertyChange('clickAnswersTrue', true)}
                  className="mr-2 text-blue-600 bg-gray-700 border-gray-600 focus:ring-blue-500"
                />
                <span className="text-gray-300">Clic = Verdadero</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="clickAnswersTrue"
                  checked={customProps.clickAnswersTrue === false}
                  onChange={() => onPropertyChange('clickAnswersTrue', false)}
                  className="mr-2 text-blue-600 bg-gray-700 border-gray-600 focus:ring-blue-500"
                />
                <span className="text-gray-300">Clic = Falso</span>
              </label>
            </div>
          </div>

          {/* Show Instruction Text Option */}
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-300">
              Mostrar texto de instrucción
            </label>
            <button
              type="button"
              onClick={() => onPropertyChange('showInstructionText', !(customProps.showInstructionText !== false))}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 ${
                customProps.showInstructionText !== false ? 'bg-blue-600' : 'bg-gray-600'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  customProps.showInstructionText !== false ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Clickable Area Text */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Texto del Área Clickeable</label>
            <input
              type="text"
              value={customProps.clickableAreaText !== undefined ? customProps.clickableAreaText : 'Haz clic para responder'}
              onChange={(e) => onPropertyChange('clickableAreaText', e.target.value)}
              className="w-full border border-gray-600 bg-gray-800 text-gray-200 rounded px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
              placeholder="Haz clic para responder"
              disabled={customProps.showInstructionText === false}
            />
          </div>

          {/* Area Description */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Descripción del Área</label>
            <textarea
              value={customProps.areaDescription || ''}
              onChange={(e) => onPropertyChange('areaDescription', e.target.value)}
              className="w-full border border-gray-600 bg-gray-800 text-gray-200 rounded px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
              placeholder="Descripción opcional del área"
              rows={3}
            />
          </div>

          {/* Feedback Message */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Mensaje de Retroalimentación</label>
            <textarea
              value={properties.feedbackMessage || ''}
              onChange={(e) => onPropertyChange('feedbackMessage', e.target.value)}
              className="w-full border border-gray-600 bg-gray-800 text-gray-200 rounded px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
              placeholder="Mensaje opcional después de responder"
              rows={3}
            />
          </div>

          {/* Settings */}
          <div className="space-y-4">
            <h5 className="text-sm font-medium text-gray-300 border-b border-gray-600 pb-2">Configuración</h5>
            
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-300">
                Mostrar resultado después de responder
              </label>
              <button
                type="button"
                onClick={() => onPropertyChange('showResult', !(properties.showResult !== false))}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 ${
                  properties.showResult !== false ? 'bg-blue-600' : 'bg-gray-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    properties.showResult !== false ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-300">
                Permitir reintentos
              </label>
              <button
                type="button"
                onClick={() => onPropertyChange('allowRetry', !(properties.allowRetry !== false))}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 ${
                  properties.allowRetry !== false ? 'bg-blue-600' : 'bg-gray-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    properties.allowRetry !== false ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-300">
                Animación de error (temblor)
              </label>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  
                  const newShakeValue = !shakeEnabled;
                  
                  // Update local state immediately
                  setShakeEnabled(newShakeValue);
                  
                  // Update element properties
                  
                  // Try both methods to ensure it works
                  onPropertyChange('shakeOnWrong', newShakeValue);
                  onPropertyChange('allowRetry', !newShakeValue);
                  
                  // Also try direct element update as backup
                  onElementUpdate(element.id, {
                    properties: {
                      ...element.properties,
                      shakeOnWrong: newShakeValue,
                      allowRetry: !newShakeValue
                    }
                  });
                  
                  // Let's also try direct element update to be sure
                  setTimeout(() => {
                  }, 100);
                  
                }}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 ${
                  shakeEnabled ? 'bg-blue-600' : 'bg-gray-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    shakeEnabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
            
            {shakeEnabled && (
              <div className="ml-4 p-3 bg-blue-900/20 border border-blue-500/30 rounded-lg">
                <p className="text-xs text-blue-300">
                  💡 La animación de error incluye reinicio automático. El botón de reintento se deshabilitó automáticamente.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Styling Tab */}
      {activeTab === 'styling' && (
        <div className="space-y-6">
          {/* Area Dimensions */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Ancho</label>
              <input
                type="text"
                value={properties.width || '300px'}
                onChange={(e) => onPropertyChange('width', e.target.value)}
                className="w-full border border-gray-600 bg-gray-800 text-gray-200 rounded px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                placeholder="300px"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Altura</label>
              <input
                type="text"
                value={properties.height || '200px'}
                onChange={(e) => onPropertyChange('height', e.target.value)}
                className="w-full border border-gray-600 bg-gray-800 text-gray-200 rounded px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                placeholder="200px"
              />
            </div>
          </div>

          {/* Area Background */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Color de Fondo</label>
            <div className="flex items-center gap-2">
              <div className="relative">
                <input
                  type="color"
                  value={properties.backgroundColor || '#f3f4f6'}
                  onChange={(e) => onPropertyChange('backgroundColor', e.target.value)}
                  className="w-10 h-8 border border-gray-600 rounded cursor-pointer bg-gray-700"
                  style={{ minWidth: '40px' }}
                />
              </div>
              <input
                type="text"
                value={properties.backgroundColor || '#f3f4f6'}
                onChange={(e) => onPropertyChange('backgroundColor', e.target.value)}
                className="flex-1 min-w-0 border border-gray-600 bg-gray-800 text-gray-200 rounded px-2 py-1 text-sm focus:border-blue-500 focus:outline-none"
                placeholder="#f3f4f6"
              />
            </div>
          </div>

          {/* Transparency Option */}
          <div className="flex items-center justify-between">
            <label className="text-xs text-gray-400">
              Área Transparente
            </label>
            <button
              type="button"
              onClick={() => {
                const transparent = properties.backgroundColor === 'transparent';
                onPropertyChange('backgroundColor', transparent ? '' : 'transparent');
              }}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 ${
                properties.backgroundColor === 'transparent' ? 'bg-blue-600' : 'bg-gray-600'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  properties.backgroundColor === 'transparent' ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Hover Background */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Color de Fondo al Pasar Mouse</label>
            <div className="flex items-center gap-2">
              <div className="relative">
                <input
                  type="color"
                  value={customProps.hoverBackgroundColor || '#e5e7eb'}
                  onChange={(e) => onPropertyChange('hoverBackgroundColor', e.target.value)}
                  className="w-10 h-8 border border-gray-600 rounded cursor-pointer bg-gray-700"
                  style={{ minWidth: '40px' }}
                />
              </div>
              <input
                type="text"
                value={customProps.hoverBackgroundColor || '#e5e7eb'}
                onChange={(e) => onPropertyChange('hoverBackgroundColor', e.target.value)}
                className="flex-1 min-w-0 border border-gray-600 bg-gray-800 text-gray-200 rounded px-2 py-1 text-sm focus:border-blue-500 focus:outline-none"
                placeholder="#e5e7eb"
              />
            </div>
          </div>

          {/* Comprehensive Border Controls */}
          <div className="space-y-4">
            <h6 className="text-sm font-medium text-gray-300 border-b border-gray-600 pb-2">Personalización de Bordes</h6>
            
            {/* Border Toggle */}
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-300">
                Mostrar borde
              </label>
              <button
                type="button"
                onClick={() => onPropertyChange('showBorder', !(customProps.showBorder !== false))}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 ${
                  customProps.showBorder !== false ? 'bg-blue-600' : 'bg-gray-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    customProps.showBorder !== false ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Border Width */}
            <div>
              <label className="flex justify-between text-sm font-medium text-gray-300 mb-2">
                <span>Grosor del Borde</span>
                <span>{customProps.borderWidth || 2}px</span>
              </label>
              <input
                type="range"
                min="0"
                max="10"
                step="1"
                value={customProps.borderWidth || 2}
                onChange={(e) => onPropertyChange('borderWidth', parseInt(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                disabled={customProps.showBorder === false}
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>0px</span>
                <span>10px</span>
              </div>
            </div>

            {/* Border Style */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Estilo del Borde</label>
              <select
                value={customProps.borderStyle || 'dashed'}
                onChange={(e) => onPropertyChange('borderStyle', e.target.value)}
                className="w-full border border-gray-600 bg-gray-800 text-gray-200 rounded px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                disabled={customProps.showBorder === false}
              >
                <option value="solid">Sólido</option>
                <option value="dashed">Discontinuo</option>
                <option value="dotted">Punteado</option>
                <option value="double">Doble</option>
                <option value="groove">Acanalado</option>
                <option value="ridge">Relieve</option>
                <option value="inset">Inset</option>
                <option value="outset">Outset</option>
              </select>
            </div>

            {/* Border Color */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Color del Borde</label>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <input
                    type="color"
                    value={customProps.borderColor || '#d1d5db'}
                    onChange={(e) => onPropertyChange('borderColor', e.target.value)}
                    className="w-10 h-8 border border-gray-600 rounded cursor-pointer bg-gray-700"
                    style={{ minWidth: '40px' }}
                    disabled={customProps.showBorder === false}
                  />
                </div>
                <input
                  type="text"
                  value={customProps.borderColor || '#d1d5db'}
                  onChange={(e) => onPropertyChange('borderColor', e.target.value)}
                  className="flex-1 min-w-0 border border-gray-600 bg-gray-800 text-gray-200 rounded px-2 py-1 text-sm focus:border-blue-500 focus:outline-none"
                  placeholder="#d1d5db"
                  disabled={customProps.showBorder === false}
                />
              </div>
            </div>

            {/* Border Radius */}
            <div>
              <label className="flex justify-between text-sm font-medium text-gray-300 mb-2">
                <span>Radio del Borde</span>
                <span>{customProps.borderRadius || 8}px</span>
              </label>
              <input
                type="range"
                min="0"
                max="50"
                step="1"
                value={customProps.borderRadius || 8}
                onChange={(e) => onPropertyChange('borderRadius', parseInt(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>0px</span>
                <span>50px</span>
              </div>
            </div>

            {/* Hover Border Color */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Color del Borde al Pasar Mouse</label>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <input
                    type="color"
                    value={customProps.hoverBorderColor || '#9ca3af'}
                    onChange={(e) => onPropertyChange('hoverBorderColor', e.target.value)}
                    className="w-10 h-8 border border-gray-600 rounded cursor-pointer bg-gray-700"
                    style={{ minWidth: '40px' }}
                    disabled={customProps.showBorder === false}
                  />
                </div>
                <input
                  type="text"
                  value={customProps.hoverBorderColor || '#9ca3af'}
                  onChange={(e) => onPropertyChange('hoverBorderColor', e.target.value)}
                  className="flex-1 min-w-0 border border-gray-600 bg-gray-800 text-gray-200 rounded px-2 py-1 text-sm focus:border-blue-500 focus:outline-none"
                  placeholder="#9ca3af"
                  disabled={customProps.showBorder === false}
                />
              </div>
            </div>

            {/* Result Border Colors */}
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Color de Borde para Resultado Correcto</label>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <input
                      type="color"
                      value={customProps.correctBorderColor || '#10b981'}
                      onChange={(e) => onPropertyChange('correctBorderColor', e.target.value)}
                      className="w-10 h-8 border border-gray-600 rounded cursor-pointer bg-gray-700"
                      style={{ minWidth: '40px' }}
                    />
                  </div>
                  <input
                    type="text"
                    value={customProps.correctBorderColor || '#10b981'}
                    onChange={(e) => onPropertyChange('correctBorderColor', e.target.value)}
                    className="flex-1 min-w-0 border border-gray-600 bg-gray-800 text-gray-200 rounded px-2 py-1 text-sm focus:border-blue-500 focus:outline-none"
                    placeholder="#10b981"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Color de Borde para Resultado Incorrecto</label>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <input
                      type="color"
                      value={customProps.incorrectBorderColor || '#ef4444'}
                      onChange={(e) => onPropertyChange('incorrectBorderColor', e.target.value)}
                      className="w-10 h-8 border border-gray-600 rounded cursor-pointer bg-gray-700"
                      style={{ minWidth: '40px' }}
                    />
                  </div>
                  <input
                    type="text"
                    value={customProps.incorrectBorderColor || '#ef4444'}
                    onChange={(e) => onPropertyChange('incorrectBorderColor', e.target.value)}
                    className="flex-1 min-w-0 border border-gray-600 bg-gray-800 text-gray-200 rounded px-2 py-1 text-sm focus:border-blue-500 focus:outline-none"
                    placeholder="#ef4444"
                  />
                </div>
              </div>
            </div>

            {/* Result Border Width */}
            <div>
              <label className="flex justify-between text-sm font-medium text-gray-300 mb-2">
                <span>Grosor del Borde en Resultado</span>
                <span>{customProps.resultBorderWidth || 3}px</span>
              </label>
              <input
                type="range"
                min="1"
                max="10"
                step="1"
                value={customProps.resultBorderWidth || 3}
                onChange={(e) => onPropertyChange('resultBorderWidth', parseInt(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>1px</span>
                <span>10px</span>
              </div>
            </div>
          </div>

          {/* Text Colors */}
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Color del Texto de Instrucción</label>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <input
                    type="color"
                    value={customProps.instructionTextColor || '#6b7280'}
                    onChange={(e) => onPropertyChange('instructionTextColor', e.target.value)}
                    className="w-10 h-8 border border-gray-600 rounded cursor-pointer bg-gray-700"
                    style={{ minWidth: '40px' }}
                  />
                </div>
                <input
                  type="text"
                  value={customProps.instructionTextColor || '#6b7280'}
                  onChange={(e) => onPropertyChange('instructionTextColor', e.target.value)}
                  className="flex-1 min-w-0 border border-gray-600 bg-gray-800 text-gray-200 rounded px-2 py-1 text-sm focus:border-blue-500 focus:outline-none"
                  placeholder="#6b7280"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Result Tab */}
      {activeTab === 'result' && (
        <div className="space-y-6">
          {/* Result Messages */}
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Mensaje de Respuesta Correcta</label>
              <input
                type="text"
                value={customProps.correctText || '¡Correcto!'}
                onChange={(e) => onPropertyChange('correctText', e.target.value)}
                className="w-full border border-gray-600 bg-gray-800 text-gray-200 rounded px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                placeholder="¡Correcto!"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Mensaje de Respuesta Incorrecta</label>
              <input
                type="text"
                value={customProps.incorrectText || 'Incorrecto'}
                onChange={(e) => onPropertyChange('incorrectText', e.target.value)}
                className="w-full border border-gray-600 bg-gray-800 text-gray-200 rounded px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                placeholder="Incorrecto"
              />
            </div>
          </div>

          {/* Result Colors */}
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Color para Respuesta Correcta</label>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <input
                    type="color"
                    value={customProps.correctColor || '#10b981'}
                    onChange={(e) => onPropertyChange('correctColor', e.target.value)}
                    className="w-10 h-8 border border-gray-600 rounded cursor-pointer bg-gray-700"
                    style={{ minWidth: '40px' }}
                  />
                </div>
                <input
                  type="text"
                  value={customProps.correctColor || '#10b981'}
                  onChange={(e) => onPropertyChange('correctColor', e.target.value)}
                  className="flex-1 min-w-0 border border-gray-600 bg-gray-800 text-gray-200 rounded px-2 py-1 text-sm focus:border-blue-500 focus:outline-none"
                  placeholder="#10b981"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Color para Respuesta Incorrecta</label>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <input
                    type="color"
                    value={customProps.incorrectColor || '#ef4444'}
                    onChange={(e) => onPropertyChange('incorrectColor', e.target.value)}
                    className="w-10 h-8 border border-gray-600 rounded cursor-pointer bg-gray-700"
                    style={{ minWidth: '40px' }}
                  />
                </div>
                <input
                  type="text"
                  value={customProps.incorrectColor || '#ef4444'}
                  onChange={(e) => onPropertyChange('incorrectColor', e.target.value)}
                  className="flex-1 min-w-0 border border-gray-600 bg-gray-800 text-gray-200 rounded px-2 py-1 text-sm focus:border-blue-500 focus:outline-none"
                  placeholder="#ef4444"
                />
              </div>
            </div>
          </div>

          {/* Result Icon Background Colors */}
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Fondo del Icono Correcto</label>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <input
                      type="color"
                      value={customProps.correctBackgroundColor || '#dcfce7'}
                      onChange={(e) => onPropertyChange('correctBackgroundColor', e.target.value)}
                      className="w-10 h-8 border border-gray-600 rounded cursor-pointer bg-gray-700"
                      style={{ minWidth: '40px' }}
                      disabled={customProps.correctBackgroundTransparent === true}
                    />
                  </div>
                  <input
                    type="text"
                    value={customProps.correctBackgroundColor || '#dcfce7'}
                    onChange={(e) => onPropertyChange('correctBackgroundColor', e.target.value)}
                    className="flex-1 min-w-0 border border-gray-600 bg-gray-800 text-gray-200 rounded px-2 py-1 text-sm focus:border-blue-500 focus:outline-none"
                    placeholder="#dcfce7"
                    disabled={customProps.correctBackgroundTransparent === true}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <label className="text-xs text-gray-400">
                    Fondo del icono transparente
                  </label>
                  <button
                    type="button"
                    onClick={() => onPropertyChange('correctBackgroundTransparent', !(customProps.correctBackgroundTransparent === true))}
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 focus:ring-offset-gray-800 ${
                      customProps.correctBackgroundTransparent === true ? 'bg-blue-600' : 'bg-gray-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                        customProps.correctBackgroundTransparent === true ? 'translate-x-5' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Fondo del Icono Incorrecto</label>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <input
                      type="color"
                      value={customProps.incorrectBackgroundColor || '#fee2e2'}
                      onChange={(e) => onPropertyChange('incorrectBackgroundColor', e.target.value)}
                      className="w-10 h-8 border border-gray-600 rounded cursor-pointer bg-gray-700"
                      style={{ minWidth: '40px' }}
                      disabled={customProps.incorrectBackgroundTransparent === true}
                    />
                  </div>
                  <input
                    type="text"
                    value={customProps.incorrectBackgroundColor || '#fee2e2'}
                    onChange={(e) => onPropertyChange('incorrectBackgroundColor', e.target.value)}
                    className="flex-1 min-w-0 border border-gray-600 bg-gray-800 text-gray-200 rounded px-2 py-1 text-sm focus:border-blue-500 focus:outline-none"
                    placeholder="#fee2e2"
                    disabled={customProps.incorrectBackgroundTransparent === true}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <label className="text-xs text-gray-400">
                    Fondo del icono transparente
                  </label>
                  <button
                    type="button"
                    onClick={() => onPropertyChange('incorrectBackgroundTransparent', !(customProps.incorrectBackgroundTransparent === true))}
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 focus:ring-offset-gray-800 ${
                      customProps.incorrectBackgroundTransparent === true ? 'bg-blue-600' : 'bg-gray-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                        customProps.incorrectBackgroundTransparent === true ? 'translate-x-5' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Card Background Colors for Results */}
          <div className="space-y-4">
            <h6 className="text-sm font-medium text-gray-300 border-b border-gray-600 pb-2">Fondo de la Tarjeta en Resultados</h6>
            
            {/* Correct Card Background */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Fondo de Tarjeta para Resultado Correcto</label>
              <div className="space-y-3">
                {/* Color Selection */}
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <input
                      type="color"
                      value={customProps.correctCardBackgroundColor || '#10b981'}
                      onChange={(e) => onPropertyChange('correctCardBackgroundColor', e.target.value)}
                      className="w-10 h-8 border border-gray-600 rounded cursor-pointer bg-gray-700"
                      style={{ minWidth: '40px' }}
                      disabled={customProps.correctCardBackgroundTransparent === true}
                    />
                  </div>
                  <input
                    type="text"
                    value={customProps.correctCardBackgroundColor || '#10b981'}
                    onChange={(e) => onPropertyChange('correctCardBackgroundColor', e.target.value)}
                    className="flex-1 min-w-0 border border-gray-600 bg-gray-800 text-gray-200 rounded px-2 py-1 text-sm focus:border-blue-500 focus:outline-none"
                    placeholder="#10b981"
                    disabled={customProps.correctCardBackgroundTransparent === true}
                  />
                </div>
                
                {/* Transparency Controls */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1">
                      Opacidad: {Math.round((customProps.correctCardBackgroundOpacity || 0.1) * 100)}%
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.01"
                      value={customProps.correctCardBackgroundOpacity || 0.1}
                      onChange={(e) => onPropertyChange('correctCardBackgroundOpacity', parseFloat(e.target.value))}
                      className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                      disabled={customProps.correctCardBackgroundTransparent === true}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-xs text-gray-400">
                      Sin fondo de tarjeta
                    </label>
                    <button
                      type="button"
                      onClick={() => onPropertyChange('correctCardBackgroundTransparent', !(customProps.correctCardBackgroundTransparent === true))}
                      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 focus:ring-offset-gray-800 ${
                        customProps.correctCardBackgroundTransparent === true ? 'bg-blue-600' : 'bg-gray-600'
                      }`}
                    >
                      <span
                        className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                          customProps.correctCardBackgroundTransparent === true ? 'translate-x-5' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Incorrect Card Background */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Fondo de Tarjeta para Resultado Incorrecto</label>
              <div className="space-y-3">
                {/* Color Selection */}
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <input
                      type="color"
                      value={customProps.incorrectCardBackgroundColor || '#ef4444'}
                      onChange={(e) => onPropertyChange('incorrectCardBackgroundColor', e.target.value)}
                      className="w-10 h-8 border border-gray-600 rounded cursor-pointer bg-gray-700"
                      style={{ minWidth: '40px' }}
                      disabled={customProps.incorrectCardBackgroundTransparent === true}
                    />
                  </div>
                  <input
                    type="text"
                    value={customProps.incorrectCardBackgroundColor || '#ef4444'}
                    onChange={(e) => onPropertyChange('incorrectCardBackgroundColor', e.target.value)}
                    className="flex-1 min-w-0 border border-gray-600 bg-gray-800 text-gray-200 rounded px-2 py-1 text-sm focus:border-blue-500 focus:outline-none"
                    placeholder="#ef4444"
                    disabled={customProps.incorrectCardBackgroundTransparent === true}
                  />
                </div>
                
                {/* Transparency Controls */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1">
                      Opacidad: {Math.round((customProps.incorrectCardBackgroundOpacity || 0.1) * 100)}%
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.01"
                      value={customProps.incorrectCardBackgroundOpacity || 0.1}
                      onChange={(e) => onPropertyChange('incorrectCardBackgroundOpacity', parseFloat(e.target.value))}
                      className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                      disabled={customProps.incorrectCardBackgroundTransparent === true}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-xs text-gray-400">
                      Sin fondo de tarjeta
                    </label>
                    <button
                      type="button"
                      onClick={() => onPropertyChange('incorrectCardBackgroundTransparent', !(customProps.incorrectCardBackgroundTransparent === true))}
                      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 focus:ring-offset-gray-800 ${
                        customProps.incorrectCardBackgroundTransparent === true ? 'bg-blue-600' : 'bg-gray-600'
                      }`}
                    >
                      <span
                        className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                          customProps.incorrectCardBackgroundTransparent === true ? 'translate-x-5' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Result Icons Customization */}
          <div className="space-y-4">
            <h6 className="text-sm font-medium text-gray-300 border-b border-gray-600 pb-2">Personalización de Iconos</h6>
            
            {/* Correct Icon */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Icono de Resultado Correcto</label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1">Tamaño</label>
                  <input
                    type="number"
                    min="16"
                    max="64"
                    value={customProps.correctIconSize || 32}
                    onChange={(e) => onPropertyChange('correctIconSize', parseInt(e.target.value))}
                    className="w-full border border-gray-600 bg-gray-800 text-gray-200 rounded px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1">Color</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={customProps.correctIconColor || '#10b981'}
                      onChange={(e) => onPropertyChange('correctIconColor', e.target.value)}
                      className="w-8 h-8 border border-gray-600 rounded cursor-pointer bg-gray-700"
                    />
                    <input
                      type="text"
                      value={customProps.correctIconColor || '#10b981'}
                      onChange={(e) => onPropertyChange('correctIconColor', e.target.value)}
                      className="flex-1 border border-gray-600 bg-gray-800 text-gray-200 rounded px-2 py-1 text-xs focus:border-blue-500 focus:outline-none"
                      placeholder="#10b981"
                    />
                  </div>
                </div>
              </div>
              
              <div className="mt-2">
                <label className="block text-xs font-medium text-gray-400 mb-1">Tipo de Icono</label>
                <select
                  value={customProps.correctIconType || 'check'}
                  onChange={(e) => onPropertyChange('correctIconType', e.target.value)}
                  className="w-full border border-gray-600 bg-gray-800 text-gray-200 rounded px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                >
                  <option value="check">✓ Check</option>
                  <option value="check-circle">✓ Check Circle</option>
                  <option value="thumbs-up">👍 Thumbs Up</option>
                  <option value="star">⭐ Star</option>
                  <option value="heart">❤️ Heart</option>
                  <option value="smile">😊 Smile</option>
                  <option value="trophy">🏆 Trophy</option>
                  <option value="none">Sin Icono</option>
                </select>
              </div>
            </div>

            {/* Incorrect Icon */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Icono de Resultado Incorrecto</label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1">Tamaño</label>
                  <input
                    type="number"
                    min="16"
                    max="64"
                    value={customProps.incorrectIconSize || 32}
                    onChange={(e) => onPropertyChange('incorrectIconSize', parseInt(e.target.value))}
                    className="w-full border border-gray-600 bg-gray-800 text-gray-200 rounded px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1">Color</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={customProps.incorrectIconColor || '#ef4444'}
                      onChange={(e) => onPropertyChange('incorrectIconColor', e.target.value)}
                      className="w-8 h-8 border border-gray-600 rounded cursor-pointer bg-gray-700"
                    />
                    <input
                      type="text"
                      value={customProps.incorrectIconColor || '#ef4444'}
                      onChange={(e) => onPropertyChange('incorrectIconColor', e.target.value)}
                      className="flex-1 border border-gray-600 bg-gray-800 text-gray-200 rounded px-2 py-1 text-xs focus:border-blue-500 focus:outline-none"
                      placeholder="#ef4444"
                    />
                  </div>
                </div>
              </div>
              
              <div className="mt-2">
                <label className="block text-xs font-medium text-gray-400 mb-1">Tipo de Icono</label>
                <select
                  value={customProps.incorrectIconType || 'x'}
                  onChange={(e) => onPropertyChange('incorrectIconType', e.target.value)}
                  className="w-full border border-gray-600 bg-gray-800 text-gray-200 rounded px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                >
                  <option value="x">✗ X</option>
                  <option value="x-circle">✗ X Circle</option>
                  <option value="thumbs-down">👎 Thumbs Down</option>
                  <option value="frown">😞 Frown</option>
                  <option value="alert-triangle">⚠️ Alert Triangle</option>
                  <option value="minus">➖ Minus</option>
                  <option value="ban">🚫 Ban</option>
                  <option value="none">Sin Icono</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
