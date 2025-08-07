import React, { useState } from 'react';
import type { Element } from '../../../types';
import { BorderConfiguration } from './common/BorderConfiguration';

interface FillInBlanksPropertiesProps {
  element: Element;
  onPropertyChange: (property: string, value: any) => void;
  onElementUpdate?: (elementId: string, updates: any) => void;
}

export const FillInBlanksProperties: React.FC<FillInBlanksPropertiesProps> = ({
  element,
  onPropertyChange,
}) => {
  const properties = element.properties as any;
  const [activeTab, setActiveTab] = useState<'content' | 'styling' | 'behavior'>('content');

  const tabs = [
    { id: 'content', label: 'Contenido' },
    { id: 'styling', label: 'Diseño' },
    { id: 'behavior', label: 'Comportamiento' }
  ];

  // Toggle Switch Component
  const ToggleSwitch = ({ 
    checked, 
    onChange, 
    label, 
    description 
  }: { 
    checked: boolean; 
    onChange: (checked: boolean) => void; 
    label: string; 
    description?: string; 
  }) => (
    <div className="flex items-center justify-between">
      <div className="flex-1">
        <label className="text-sm font-medium text-gray-300">{label}</label>
        {description && <p className="text-xs text-gray-500 mt-1">{description}</p>}
      </div>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
          checked ? 'bg-blue-600' : 'bg-gray-600'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            checked ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );

  // Color Picker Component - moved outside conditional rendering
  const ColorPicker = React.memo(({ 
    label, 
    value, 
    onChange, 
    showOpacity = false 
  }: { 
    label: string; 
    value: string; 
    onChange: (value: string) => void; 
    showOpacity?: boolean; 
  }) => {
    const [localValue, setLocalValue] = useState(value || '#000000');
    const [isPickerOpen, setIsPickerOpen] = useState(false);

    // Update local value when prop changes (but not when picker is open)
    React.useEffect(() => {
      if (!isPickerOpen) {
        setLocalValue(value || '#000000');
      }
    }, [value, isPickerOpen]);

    const handleColorChange = (newValue: string) => {
      setLocalValue(newValue);
      // Don't call onChange immediately - wait for picker to close
    };

    const handleFocus = (e: React.FocusEvent) => {
      setIsPickerOpen(true);
    };

    const handleBlur = (e: React.FocusEvent) => {
      setIsPickerOpen(false);
      // Now update the parent with the final value
      onChange(localValue);
    };

    return (
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">{label}</label>
        <div className="flex items-center gap-2">
          <input
            key={`color-${label}`}
            type="color"
            value={localValue}
            onChange={(e) => handleColorChange(e.target.value)}
            className="w-8 h-8 rounded border border-gray-600 cursor-pointer"
            onPointerDownCapture={(e) => {

              e.stopPropagation();
              document.body.setAttribute('data-disable-drag', 'true');
            }}
            onPointerUpCapture={(e) => {

              document.body.removeAttribute('data-disable-drag');
            }}
            onMouseDownCapture={(e) => {

              e.stopPropagation();
            }}
            onClick={(e) => {

              e.stopPropagation();
            }}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onInput={(e) => {
            }}
          />
          <input
            type="text"
            value={localValue}
            onChange={(e) => handleColorChange(e.target.value)}
            placeholder="#000000"
            className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        {showOpacity && (
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={properties.opacity || 1}
            onChange={(e) => onPropertyChange('opacity', parseFloat(e.target.value))}
            className="w-full mt-2"
          />
        )}
      </div>
    );
  });

  return (
    <div className="space-y-6 w-full max-w-none">
      {/* Header */}
      <div>
        <h4 className="text-lg font-semibold text-gray-200 mb-4">Configuración Completar Huecos</h4>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-600">
        <nav className="flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Content Tab */}
      <div className={`space-y-6 ${activeTab === 'content' ? '' : 'hidden'}`}>
          {/* Question Text */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Texto de la pregunta</label>
            <textarea
              value={properties.questionText || ''}
              onChange={(e) => onPropertyChange('questionText', e.target.value)}
              placeholder="Ej: I like [red] [apples]!"
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
            />
            <p className="text-xs text-gray-500 mt-1">Usa [palabra] para marcar donde va la palabra a completar. La palabra dentro de los corchetes será la respuesta esperada.</p>
          </div>

          {/* Placeholder Settings */}
          <div className="space-y-4">
            <h5 className="text-sm font-medium text-gray-300 border-b border-gray-600 pb-2">Configuración del Marcador de Posición</h5>
            
            <ToggleSwitch
              checked={properties.showPlaceholder !== false}
              onChange={(checked) => onPropertyChange('showPlaceholder', checked)}
              label="Mostrar texto de ayuda"
              description="Muestra texto de ayuda en el campo de entrada"
            />

            {properties.showPlaceholder !== false && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Texto del marcador de posición</label>
                <input
                  type="text"
                  value={properties.placeholder || ''}
                  onChange={(e) => onPropertyChange('placeholder', e.target.value)}
                  placeholder="Ej: Escribe aquí..."
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}
          </div>

          {/* Feedback Messages */}
          <div className="space-y-4">
            <h5 className="text-sm font-medium text-gray-300 border-b border-gray-600 pb-2">Mensajes de Retroalimentación</h5>
            
            <ToggleSwitch
              checked={properties.showMessages !== false}
              onChange={(checked) => onPropertyChange('showMessages', checked)}
              label="Mostrar mensajes de éxito/error"
              description="Muestra mensajes cuando la respuesta es correcta o incorrecta"
            />

            {properties.showMessages !== false && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Mensaje de éxito</label>
                  <input
                    type="text"
                    value={properties.successMessage || ''}
                    onChange={(e) => onPropertyChange('successMessage', e.target.value)}
                    placeholder="✓ ¡Correcto!"
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Mensaje de error</label>
                  <input
                    type="text"
                    value={properties.errorMessage || ''}
                    onChange={(e) => onPropertyChange('errorMessage', e.target.value)}
                    placeholder="✗ Intenta de nuevo"
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </>
            )}
          </div>

          {/* Hint and Explanation */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Pista (opcional)</label>
              <textarea
                value={properties.hint || ''}
                onChange={(e) => onPropertyChange('hint', e.target.value)}
                placeholder="Pista opcional para ayudar al usuario..."
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={2}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Explicación (opcional)</label>
              <textarea
                value={properties.explanation || ''}
                onChange={(e) => onPropertyChange('explanation', e.target.value)}
                placeholder="Explicación que se muestra después de responder..."
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
              />
            </div>
          </div>
        </div>

      {/* Styling Tab */}
      <div className={`space-y-6 ${activeTab === 'styling' ? '' : 'hidden'}`}>
          {/* Text Styling */}
          <div className="space-y-4">
            <h5 className="text-sm font-medium text-gray-300 border-b border-gray-600 pb-2">Estilo del Texto</h5>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Familia de fuente</label>
              <select
                value={properties.fontFamily || 'font-sans'}
                onChange={(e) => onPropertyChange('fontFamily', e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="font-sans">Sans Serif (Predeterminada)</option>
                <option value="font-serif">Serif</option>
                <option value="font-mono">Monospace</option>
                <option value="grilledcheese">Grilled Cheese</option>
                <option value="'Arial', sans-serif">Arial</option>
                <option value="'Helvetica', sans-serif">Helvetica</option>
                <option value="'Times New Roman', serif">Times New Roman</option>
                <option value="'Georgia', serif">Georgia</option>
                <option value="'Verdana', sans-serif">Verdana</option>
                <option value="'Trebuchet MS', sans-serif">Trebuchet MS</option>
                <option value="'Comic Sans MS', cursive">Comic Sans MS</option>
                <option value="'Impact', sans-serif">Impact</option>
                <option value="'Courier New', monospace">Courier New</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Tamaño de fuente</label>
                <select
                  value={properties.fontSize || 'text-base'}
                  onChange={(e) => onPropertyChange('fontSize', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="text-xs">Muy pequeño</option>
                  <option value="text-sm">Pequeño</option>
                  <option value="text-base">Normal</option>
                  <option value="text-lg">Grande</option>
                  <option value="text-xl">Muy grande</option>
                  <option value="text-2xl">Extra grande</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Peso de fuente</label>
                <select
                  value={properties.fontWeight || 'font-normal'}
                  onChange={(e) => onPropertyChange('fontWeight', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="font-light">Ligero</option>
                  <option value="font-normal">Normal</option>
                  <option value="font-medium">Medio</option>
                  <option value="font-semibold">Semi-negrita</option>
                  <option value="font-bold">Negrita</option>
                </select>
              </div>
            </div>

            <ColorPicker
              label="Color del texto"
              value={properties.textColor || '#374151'}
              onChange={(value) => onPropertyChange('textColor', value)}
            />

            <ColorPicker
              label="Color texto correcto"
              value={properties.correctTextColor || '#166534'}
              onChange={(value) => onPropertyChange('correctTextColor', value)}
            />

            <ColorPicker
              label="Color texto incorrecto"
              value={properties.incorrectTextColor || '#991b1b'}
              onChange={(value) => onPropertyChange('incorrectTextColor', value)}
            />
          </div>

          {/* Input Field Styling */}
          <div className="space-y-4">
            <h5 className="text-sm font-medium text-gray-300 border-b border-gray-600 pb-2">Estilo del Campo de Entrada</h5>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Ancho mínimo (px)</label>
                <input
                  type="number"
                  value={properties.inputWidth || 120}
                  onChange={(e) => onPropertyChange('inputWidth', parseInt(e.target.value) || 120)}
                  min={60}
                  max={300}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">Se ajusta automáticamente al contenido</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Altura (px)</label>
                <input
                  type="number"
                  value={properties.inputHeight || 36}
                  onChange={(e) => onPropertyChange('inputHeight', parseInt(e.target.value) || 36)}
                  min={24}
                  max={60}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <ColorPicker
              label="Color de fondo del input"
              value={properties.inputBackgroundColor || '#ffffff'}
              onChange={(value) => onPropertyChange('inputBackgroundColor', value)}
            />

            <ToggleSwitch
              checked={properties.inputTransparent || false}
              onChange={(checked) => onPropertyChange('inputTransparent', checked)}
              label="Campo de entrada transparente"
              description="Hace el fondo del campo de entrada completamente transparente"
            />

            <BorderConfiguration
              title="Configuración de Bordes"
              borders={properties.inputBorders || {
                all: { width: 1, color: '#d1d5db', style: 'solid' },
                top: { width: 0, color: '#000000', style: 'solid' },
                right: { width: 0, color: '#000000', style: 'solid' },
                bottom: { width: 0, color: '#000000', style: 'solid' },
                left: { width: 0, color: '#000000', style: 'solid' }
              }}
              onChange={(borders) => onPropertyChange('inputBorders', borders)}
            />

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Radio del borde</label>
              <input
                type="range"
                min="0"
                max="20"
                value={properties.inputBorderRadius || 6}
                onChange={(e) => onPropertyChange('inputBorderRadius', parseInt(e.target.value))}
                className="w-full"
              />
              <div className="text-xs text-gray-500 mt-1">{properties.inputBorderRadius || 6}px</div>
            </div>
          </div>

          {/* Widget Background */}
          <div className="space-y-4">
            <h5 className="text-sm font-medium text-gray-300 border-b border-gray-600 pb-2">Fondo del Widget</h5>
            
            <ToggleSwitch
              checked={properties.hasBackground !== false}
              onChange={(checked) => onPropertyChange('hasBackground', checked)}
              label="Mostrar fondo"
              description="Añade un fondo al widget"
            />

            <ToggleSwitch
              checked={properties.completelyTransparent || false}
              onChange={(checked) => onPropertyChange('completelyTransparent', checked)}
              label="Elemento completamente transparente"
              description="Hace todo el widget completamente invisible (solo para efectos especiales)"
            />

            {properties.hasBackground !== false && !properties.completelyTransparent && (
              <>
                <ColorPicker
                  label="Color de fondo"
                  value={properties.backgroundColor || '#ffffff'}
                  onChange={(value) => onPropertyChange('backgroundColor', value)}
                  showOpacity={true}
                />

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Opacidad</label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={properties.backgroundOpacity || 1}
                    onChange={(e) => onPropertyChange('backgroundOpacity', parseFloat(e.target.value))}
                    className="w-full"
                  />
                  <div className="text-xs text-gray-500 mt-1">{Math.round((properties.backgroundOpacity || 1) * 100)}%</div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Radio del borde</label>
                  <input
                    type="range"
                    min="0"
                    max="20"
                    value={properties.borderRadius || 8}
                    onChange={(e) => onPropertyChange('borderRadius', parseInt(e.target.value))}
                    className="w-full"
                  />
                  <div className="text-xs text-gray-500 mt-1">{properties.borderRadius || 8}px</div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Padding interno</label>
                  <input
                    type="range"
                    min="0"
                    max="32"
                    value={properties.padding || 16}
                    onChange={(e) => onPropertyChange('padding', parseInt(e.target.value))}
                    className="w-full"
                  />
                  <div className="text-xs text-gray-500 mt-1">{properties.padding || 16}px</div>
                </div>
              </>
            )}
          </div>
        </div>

      {/* Behavior Tab */}
      <div className={`space-y-6 ${activeTab === 'behavior' ? '' : 'hidden'}`}>
          {/* Validation Options */}
          <div className="space-y-4">
            <h5 className="text-sm font-medium text-gray-300 border-b border-gray-600 pb-2">Opciones de Validación</h5>
            
            <ToggleSwitch
              checked={properties.caseSensitive || false}
              onChange={(checked) => onPropertyChange('caseSensitive', checked)}
              label="Sensible a mayúsculas"
              description="La respuesta debe coincidir exactamente en mayúsculas y minúsculas"
            />

            <ToggleSwitch
              checked={properties.trimWhitespace !== false}
              onChange={(checked) => onPropertyChange('trimWhitespace', checked)}
              label="Ignorar espacios"
              description="Ignora espacios al principio y final de la respuesta"
            />

            <ToggleSwitch
              checked={properties.accentSensitive || false}
              onChange={(checked) => onPropertyChange('accentSensitive', checked)}
              label="Sensible a acentos"
              description="La respuesta debe coincidir exactamente en acentos"
            />
          </div>

          {/* Display Options */}
          <div className="space-y-4">
            <h5 className="text-sm font-medium text-gray-300 border-b border-gray-600 pb-2">Opciones de Visualización</h5>
            
            <ToggleSwitch
              checked={properties.showScore !== false}
              onChange={(checked) => onPropertyChange('showScore', checked)}
              label="Mostrar puntuación"
              description="Muestra la puntuación actual del ejercicio"
            />

            <ToggleSwitch
              checked={properties.showFeedback !== false}
              onChange={(checked) => onPropertyChange('showFeedback', checked)}
              label="Mostrar retroalimentación visual"
              description="Muestra colores de fondo y bordes para indicar correcto/incorrecto"
            />

            <ToggleSwitch
              checked={properties.instantFeedback !== false}
              onChange={(checked) => onPropertyChange('instantFeedback', checked)}
              label="Retroalimentación instantánea"
              description="Valida la respuesta mientras el usuario escribe"
            />
          </div>

          {/* Advanced Options */}
          <div className="space-y-4">
            <h5 className="text-sm font-medium text-gray-300 border-b border-gray-600 pb-2">Opciones Avanzadas</h5>
            
            <ToggleSwitch
              checked={properties.allowRetry !== false}
              onChange={(checked) => onPropertyChange('allowRetry', checked)}
              label="Permitir reintentos"
              description="Permite al usuario intentar múltiples veces"
            />

            <ToggleSwitch
              checked={properties.resetOnIncorrect || false}
              onChange={(checked) => onPropertyChange('resetOnIncorrect', checked)}
              label="Limpiar en error"
              description="Limpia el campo cuando la respuesta es incorrecta"
            />

            {properties.allowRetry !== false && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Máximo de intentos</label>
                <input
                  type="number"
                  value={properties.maxAttempts || 3}
                  onChange={(e) => onPropertyChange('maxAttempts', parseInt(e.target.value) || 0)}
                  min={0}
                  max={10}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">0 = Intentos infinitos</p>
              </div>
            )}
          </div>
        </div>

      {/* Preview */}
      <div className="bg-gray-750 p-4 rounded-lg border border-gray-600">
        <h5 className="text-sm font-medium text-gray-300 mb-3">Vista Previa de Configuración</h5>
        <div className="bg-gray-800 p-3 rounded border space-y-2">
          <p className="text-sm text-gray-300">
            <strong>Pregunta:</strong> {properties.questionText || 'I like [red] [apples]!'}
          </p>
          {properties.showPlaceholder !== false && (
            <p className="text-sm text-gray-300">
              <strong>Placeholder:</strong> {properties.placeholder || 'Escribe aquí...'}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
