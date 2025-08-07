import React, { useState } from 'react';
import type { Element } from '../../../types';

interface SingleChoicePropertiesProps {
  element: Element;
  onPropertyChange: (property: string, value: any) => void;
  onElementUpdate?: (elementId: string, updates: any) => void;
}

export const SingleChoiceProperties: React.FC<SingleChoicePropertiesProps> = ({
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

  // Color Picker Component
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
      </div>
    );
  });

  // Handle option changes
  const handleOptionChange = (index: number, field: string, value: any) => {
    const options = [...(properties.options || [])];
    if (field === 'isCorrect' && value) {
      // Ensure only one option is correct
      options.forEach((opt, i) => opt.isCorrect = i === index);
    } else {
      options[index] = { ...options[index], [field]: value };
    }
    onPropertyChange('options', options);
  };

  const addOption = () => {
    const options = [...(properties.options || [])];
    options.push({ text: `Opción ${options.length + 1}`, isCorrect: false });
    onPropertyChange('options', options);
  };

  const removeOption = (index: number) => {
    const options = [...(properties.options || [])];
    if (options.length > 2) { // Keep at least 2 options
      options.splice(index, 1);
      onPropertyChange('options', options);
    }
  };

  return (
    <div className="space-y-6 w-full max-w-none">
      {/* Header */}
      <div>
        <h4 className="text-lg font-semibold text-gray-200 mb-4">Configuración Selección Única</h4>
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
          {/* Show Question Toggle */}
          <ToggleSwitch
            checked={properties.showQuestion !== false}
            onChange={(checked) => onPropertyChange('showQuestion', checked)}
            label="Mostrar pregunta"
            description="Muestra un texto de pregunta encima de las opciones"
          />

          {/* Question Text */}
          {properties.showQuestion !== false && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Pregunta</label>
              <input
                type="text"
                value={properties.question || ''}
                onChange={(e) => onPropertyChange('question', e.target.value)}
                placeholder="¿Cuál es la respuesta correcta?"
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}

          {/* Options */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h5 className="text-sm font-medium text-gray-300">Opciones de respuesta</h5>
              <button
                onClick={addOption}
                className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
              >
                + Agregar opción
              </button>
            </div>
            
            {(properties.options || []).map((option: any, index: number) => (
              <div key={index} className="bg-gray-750 p-4 rounded-lg border border-gray-600">
                <div className="flex items-center gap-3 mb-3">
                  <input
                    type="radio"
                    checked={option.isCorrect}
                    onChange={() => handleOptionChange(index, 'isCorrect', true)}
                    className="w-4 h-4 text-blue-600"
                  />
                  <label className="text-sm font-medium text-gray-300">
                    Respuesta correcta
                  </label>
                  {(properties.options || []).length > 2 && (
                    <button
                      onClick={() => removeOption(index)}
                      className="ml-auto px-2 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700"
                    >
                      Eliminar
                    </button>
                  )}
                </div>
                <input
                  type="text"
                  value={option.text || ''}
                  onChange={(e) => handleOptionChange(index, 'text', e.target.value)}
                  placeholder={`Texto de la opción ${index + 1}`}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            ))}
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

          {/* Option Styling */}
          <div className="space-y-4">
            <h5 className="text-sm font-medium text-gray-300 border-b border-gray-600 pb-2">Estilo de las Opciones</h5>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Estilo de las opciones</label>
              <select
                value={properties.optionStyle || 'radio'}
                onChange={(e) => onPropertyChange('optionStyle', e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="radio">Radio buttons tradicionales</option>
                <option value="button">Botones estilo</option>
                <option value="card">Tarjetas</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Espaciado entre opciones</label>
              <input
                type="range"
                min="4"
                max="24"
                value={properties.optionSpacing || 8}
                onChange={(e) => onPropertyChange('optionSpacing', parseInt(e.target.value))}
                className="w-full"
              />
              <div className="text-xs text-gray-500 mt-1">{properties.optionSpacing || 8}px</div>
            </div>

            {/* Button Style Customization */}
            <div className={`space-y-4 bg-gray-750 p-4 rounded-lg border border-gray-600 ${properties.optionStyle === 'button' ? '' : 'hidden'}`}>
              <h6 className="text-sm font-medium text-gray-300 border-b border-gray-600 pb-2">Personalización de Botones</h6>
              
              {/* Button State Tabs */}
              <div className="border-b border-gray-600">
                <nav className="flex space-x-1 overflow-x-auto">
                  {['normal', 'hover', 'selected', 'validation', 'typography', 'animations'].map((state) => (
                    <button
                      key={state}
                      onClick={() => onPropertyChange('buttonActiveTab', state)}
                      className={`py-2 px-2 border-b-2 font-medium text-xs whitespace-nowrap flex-shrink-0 ${
                        (properties.buttonActiveTab || 'normal') === state
                          ? 'border-blue-500 text-blue-400'
                          : 'border-transparent text-gray-500 hover:text-gray-300'
                      }`}
                    >
                      {state === 'normal' && 'Normal'}
                      {state === 'hover' && 'Hover'}
                      {state === 'selected' && 'Selección'}
                      {state === 'validation' && 'Validación'}
                      {state === 'typography' && 'Texto'}
                      {state === 'animations' && 'Anim.'}
                    </button>
                  ))}
                </nav>
              </div>

              {/* Normal State Tab */}
              <div className={`space-y-3 ${(properties.buttonActiveTab || 'normal') === 'normal' ? '' : 'hidden'}`}>
                <ColorPicker
                  label="Color de fondo"
                  value={properties.buttonBackgroundColor || '#ffffff'}
                  onChange={(value) => onPropertyChange('buttonBackgroundColor', value)}
                />

                <ColorPicker
                  label="Color del texto"
                  value={properties.buttonTextColor || '#374151'}
                  onChange={(value) => onPropertyChange('buttonTextColor', value)}
                />

                <ColorPicker
                  label="Color del borde"
                  value={properties.buttonBorderColor || '#d1d5db'}
                  onChange={(value) => onPropertyChange('buttonBorderColor', value)}
                />

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Ancho del borde</label>
                  <input
                    type="range"
                    min="0"
                    max="4"
                    value={properties.buttonBorderWidth || 2}
                    onChange={(e) => onPropertyChange('buttonBorderWidth', parseInt(e.target.value))}
                    className="w-full"
                  />
                  <div className="text-xs text-gray-500 mt-1">{properties.buttonBorderWidth || 2}px</div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Radio del borde</label>
                  <input
                    type="range"
                    min="0"
                    max="20"
                    value={properties.buttonBorderRadius || 6}
                    onChange={(e) => onPropertyChange('buttonBorderRadius', parseInt(e.target.value))}
                    className="w-full"
                  />
                  <div className="text-xs text-gray-500 mt-1">{properties.buttonBorderRadius || 6}px</div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Padding horizontal</label>
                    <input
                      type="range"
                      min="8"
                      max="32"
                      value={properties.buttonPaddingX || 16}
                      onChange={(e) => onPropertyChange('buttonPaddingX', parseInt(e.target.value))}
                      className="w-full"
                    />
                    <div className="text-xs text-gray-500 mt-1">{properties.buttonPaddingX || 16}px</div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Padding vertical</label>
                    <input
                      type="range"
                      min="6"
                      max="24"
                      value={properties.buttonPaddingY || 12}
                      onChange={(e) => onPropertyChange('buttonPaddingY', parseInt(e.target.value))}
                      className="w-full"
                    />
                    <div className="text-xs text-gray-500 mt-1">{properties.buttonPaddingY || 12}px</div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Sombra del botón</label>
                  <select
                    value={properties.buttonShadow || 'sm'}
                    onChange={(e) => onPropertyChange('buttonShadow', e.target.value)}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="none">Sin sombra</option>
                    <option value="sm">Sombra pequeña</option>
                    <option value="md">Sombra mediana</option>
                    <option value="lg">Sombra grande</option>
                    <option value="xl">Sombra extra grande</option>
                    <option value="custom">Personalizada</option>
                  </select>
                </div>

                {properties.buttonShadow === 'custom' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Sombra personalizada (CSS)</label>
                    <input
                      type="text"
                      value={properties.buttonCustomShadow || ''}
                      onChange={(e) => onPropertyChange('buttonCustomShadow', e.target.value)}
                      placeholder="0 4px 6px rgba(0, 0, 0, 0.1)"
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                )}
              </div>

              {/* Hover State Tab */}
              <div className={`space-y-3 ${properties.buttonActiveTab === 'hover' ? '' : 'hidden'}`}>
                <ToggleSwitch
                  checked={properties.buttonHoverEnabled !== false}
                  onChange={(checked) => onPropertyChange('buttonHoverEnabled', checked)}
                  label="Activar efectos hover"
                  description="Cambia la apariencia al pasar el mouse"
                />

                {properties.buttonHoverEnabled !== false && (
                  <>
                    <ColorPicker
                      label="Color de fondo (hover)"
                      value={properties.buttonHoverBackgroundColor || '#f3f4f6'}
                      onChange={(value) => onPropertyChange('buttonHoverBackgroundColor', value)}
                    />

                    <ColorPicker
                      label="Color del texto (hover)"
                      value={properties.buttonHoverTextColor || '#1f2937'}
                      onChange={(value) => onPropertyChange('buttonHoverTextColor', value)}
                    />

                    <ColorPicker
                      label="Color del borde (hover)"
                      value={properties.buttonHoverBorderColor || '#9ca3af'}
                      onChange={(value) => onPropertyChange('buttonHoverBorderColor', value)}
                    />

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Transformación (hover)</label>
                      <select
                        value={properties.buttonHoverTransform || 'none'}
                        onChange={(e) => onPropertyChange('buttonHoverTransform', e.target.value)}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="none">Sin transformación</option>
                        <option value="scale-105">Escalar 5%</option>
                        <option value="scale-110">Escalar 10%</option>
                        <option value="translateY-1">Elevar 1px</option>
                        <option value="translateY-2">Elevar 2px</option>
                      </select>
                    </div>
                  </>
                )}
              </div>

              {/* Selected State Tab */}
              <div className={`space-y-3 ${properties.buttonActiveTab === 'selected' ? '' : 'hidden'}`}>
                <ColorPicker
                  label="Color de fondo (seleccionado)"
                  value={properties.buttonSelectedBackgroundColor || '#eff6ff'}
                  onChange={(value) => onPropertyChange('buttonSelectedBackgroundColor', value)}
                />

                <ColorPicker
                  label="Color del texto (seleccionado)"
                  value={properties.buttonSelectedTextColor || '#1d4ed8'}
                  onChange={(value) => onPropertyChange('buttonSelectedTextColor', value)}
                />

                <ColorPicker
                  label="Color del borde (seleccionado)"
                  value={properties.buttonSelectedBorderColor || '#3b82f6'}
                  onChange={(value) => onPropertyChange('buttonSelectedBorderColor', value)}
                />

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Ancho del borde (seleccionado)</label>
                  <input
                    type="range"
                    min="1"
                    max="6"
                    value={properties.buttonSelectedBorderWidth || 2}
                    onChange={(e) => onPropertyChange('buttonSelectedBorderWidth', parseInt(e.target.value))}
                    className="w-full"
                  />
                  <div className="text-xs text-gray-500 mt-1">{properties.buttonSelectedBorderWidth || 2}px</div>
                </div>
              </div>

              {/* Validation State Tab */}
              <div className={`space-y-4 ${properties.buttonActiveTab === 'validation' ? '' : 'hidden'}`}>
                <div className="space-y-3">
                  <div className="text-xs font-medium text-green-400 uppercase tracking-wide">Respuesta Correcta</div>
                  
                  <ColorPicker
                    label="Color de fondo (correcto)"
                    value={properties.buttonCorrectBackgroundColor || '#ecfdf5'}
                    onChange={(value) => onPropertyChange('buttonCorrectBackgroundColor', value)}
                  />

                  <ColorPicker
                    label="Color del texto (correcto)"
                    value={properties.buttonCorrectTextColor || '#065f46'}
                    onChange={(value) => onPropertyChange('buttonCorrectTextColor', value)}
                  />

                  <ColorPicker
                    label="Color del borde (correcto)"
                    value={properties.buttonCorrectBorderColor || '#10b981'}
                    onChange={(value) => onPropertyChange('buttonCorrectBorderColor', value)}
                  />

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Ancho del borde (correcto)</label>
                    <input
                      type="range"
                      min="1"
                      max="6"
                      value={properties.buttonCorrectBorderWidth || 2}
                      onChange={(e) => onPropertyChange('buttonCorrectBorderWidth', parseInt(e.target.value))}
                      className="w-full"
                    />
                    <div className="text-xs text-gray-500 mt-1">{properties.buttonCorrectBorderWidth || 2}px</div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="text-xs font-medium text-red-400 uppercase tracking-wide">Respuesta Incorrecta</div>
                  
                  <ColorPicker
                    label="Color de fondo (incorrecto)"
                    value={properties.buttonIncorrectBackgroundColor || '#fef2f2'}
                    onChange={(value) => onPropertyChange('buttonIncorrectBackgroundColor', value)}
                  />

                  <ColorPicker
                    label="Color del texto (incorrecto)"
                    value={properties.buttonIncorrectTextColor || '#991b1b'}
                    onChange={(value) => onPropertyChange('buttonIncorrectTextColor', value)}
                  />

                  <ColorPicker
                    label="Color del borde (incorrecto)"
                    value={properties.buttonIncorrectBorderColor || '#ef4444'}
                    onChange={(value) => onPropertyChange('buttonIncorrectBorderColor', value)}
                  />

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Ancho del borde (incorrecto)</label>
                    <input
                      type="range"
                      min="1"
                      max="6"
                      value={properties.buttonIncorrectBorderWidth || 2}
                      onChange={(e) => onPropertyChange('buttonIncorrectBorderWidth', parseInt(e.target.value))}
                      className="w-full"
                    />
                    <div className="text-xs text-gray-500 mt-1">{properties.buttonIncorrectBorderWidth || 2}px</div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="text-xs font-medium text-gray-400 uppercase tracking-wide">Opciones Avanzadas</div>
                  
                  <ToggleSwitch
                    checked={properties.buttonUseCustomValidationColors !== false}
                    onChange={(checked) => onPropertyChange('buttonUseCustomValidationColors', checked)}
                    label="Usar colores personalizados"
                    description="Aplica los colores personalizados en lugar de los predeterminados"
                  />

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Opacidad opciones no seleccionadas</label>
                    <input
                      type="range"
                      min="0.3"
                      max="1"
                      step="0.1"
                      value={properties.buttonValidationOpacity || 0.7}
                      onChange={(e) => onPropertyChange('buttonValidationOpacity', parseFloat(e.target.value))}
                      className="w-full"
                    />
                    <div className="text-xs text-gray-500 mt-1">{Math.round((properties.buttonValidationOpacity || 0.7) * 100)}%</div>
                  </div>
                </div>
              </div>

              {/* Typography Tab */}
              <div className={`space-y-3 ${properties.buttonActiveTab === 'typography' ? '' : 'hidden'}`}>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Familia de fuente del botón</label>
                  <select
                    value={properties.buttonFontFamily || 'inherit'}
                    onChange={(e) => onPropertyChange('buttonFontFamily', e.target.value)}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="inherit">Heredar del widget</option>
                    <option value="font-sans">Sans Serif</option>
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

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Tamaño de fuente del botón</label>
                  <select
                    value={properties.buttonFontSize || 'inherit'}
                    onChange={(e) => onPropertyChange('buttonFontSize', e.target.value)}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="inherit">Heredar del widget</option>
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
                    value={properties.buttonFontWeight || 'font-medium'}
                    onChange={(e) => onPropertyChange('buttonFontWeight', e.target.value)}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="font-light">Ligero</option>
                    <option value="font-normal">Normal</option>
                    <option value="font-medium">Medio</option>
                    <option value="font-semibold">Semi-negrita</option>
                    <option value="font-bold">Negrita</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Alineación del texto</label>
                  <select
                    value={properties.buttonTextAlign || 'center'}
                    onChange={(e) => onPropertyChange('buttonTextAlign', e.target.value)}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="left">Izquierda</option>
                    <option value="center">Centro</option>
                    <option value="right">Derecha</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Transformación del texto</label>
                  <select
                    value={properties.buttonTextTransform || 'none'}
                    onChange={(e) => onPropertyChange('buttonTextTransform', e.target.value)}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="none">Normal</option>
                    <option value="uppercase">MAYÚSCULAS</option>
                    <option value="lowercase">minúsculas</option>
                    <option value="capitalize">Primera Letra Mayúscula</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Espaciado entre letras</label>
                  <input
                    type="range"
                    min="-1"
                    max="3"
                    step="0.25"
                    value={properties.buttonLetterSpacing || 0}
                    onChange={(e) => onPropertyChange('buttonLetterSpacing', parseFloat(e.target.value))}
                    className="w-full"
                  />
                  <div className="text-xs text-gray-500 mt-1">{properties.buttonLetterSpacing || 0}px</div>
                </div>
              </div>

              {/* Animations Tab */}
              <div className={`space-y-3 ${properties.buttonActiveTab === 'animations' ? '' : 'hidden'}`}>
                <ToggleSwitch
                  checked={properties.buttonAnimationsEnabled !== false}
                  onChange={(checked) => onPropertyChange('buttonAnimationsEnabled', checked)}
                  label="Activar animaciones"
                  description="Transiciones suaves entre estados"
                />

                {properties.buttonAnimationsEnabled !== false && (
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Duración de transición</label>
                    <select
                      value={properties.buttonTransitionDuration || '200ms'}
                      onChange={(e) => onPropertyChange('buttonTransitionDuration', e.target.value)}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="100ms">Muy rápida (100ms)</option>
                      <option value="200ms">Rápida (200ms)</option>
                      <option value="300ms">Normal (300ms)</option>
                      <option value="500ms">Lenta (500ms)</option>
                      <option value="700ms">Muy lenta (700ms)</option>
                    </select>
                  </div>
                )}
              </div>
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
              description="Valida la respuesta inmediatamente al seleccionar"
            />

            <ToggleSwitch
              checked={properties.showValidationOnAll !== false}
              onChange={(checked) => onPropertyChange('showValidationOnAll', checked)}
              label="Mostrar validación en todas las opciones"
              description="Aplica colores de validación a todas las opciones o solo a la seleccionada"
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

            {properties.allowRetry !== false && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Máximo de intentos</label>
                <input
                  type="number"
                  value={properties.maxAttempts || 0}
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
    </div>
  );
};
