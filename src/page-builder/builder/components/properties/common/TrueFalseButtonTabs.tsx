import React, { useState, useEffect } from 'react';

// Local memoized color picker to avoid re-renders closing the native picker
const ColorPicker = React.memo<{ value: string; onChange: (v: string) => void }>(
  ({ value, onChange }) => {
    const [localValue, setLocalValue] = useState(value || '#000000');
    const [open, setOpen] = useState(false);

    useEffect(() => {
      if (!open) {
        setLocalValue(value || '#000000');
      }
    }, [value, open]);

    const handleFocus = () => setOpen(true);
    const handleBlur = () => {
      setOpen(false);
      onChange(localValue);
    };

    return (
      <input
        type="color"
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        onPointerDownCapture={(e) => {
          e.stopPropagation();
          document.body.setAttribute('data-disable-drag', 'true');
        }}
        onPointerUpCapture={() => document.body.removeAttribute('data-disable-drag')}
        onMouseDownCapture={(e) => e.stopPropagation()}
        onClick={(e) => e.stopPropagation()}
        onFocus={handleFocus}
        onBlur={handleBlur}
        className="w-8 h-8 border border-gray-600 rounded cursor-pointer bg-gray-700"
      />
    );
  }
);
ColorPicker.displayName = 'ColorPicker';

import { BorderSelector } from '../BorderSelector';

interface ButtonConfig {
  text?: string;
  backgroundColor?: string;
  color?: string;
  borderRadius?: number | string;
  borderWidth?: number;
  borderColor?: string;
  borderStyle?: string;
  fontFamily?: string;
  fontSize?: string;
  fontWeight?: string;
  fontStyle?: string;
  textDecoration?: string;
  textTransform?: string;
  textAlign?: string;
  lineHeight?: string;
  letterSpacing?: string;
  padding?: string;
  // After-answer styling
  correctColor?: string;
  incorrectColor?: string;
  unselectedColor?: string;
  unselectedOpacity?: number;
  showIndicator?: boolean;
  keepOriginalStyling?: boolean;
  // Allow arbitrary extended props
  [key: string]: any;
}

interface TrueFalseButtonTabsProps {
  properties: any; // full widget properties (will read trueButton / falseButton)
  onPropertyChange: (key: string, value: any) => void;
}

export const TrueFalseButtonTabs: React.FC<TrueFalseButtonTabsProps> = ({ properties, onPropertyChange }) => {
  const [activeTab, setActiveTab] = useState<'true' | 'false'>('true');

  const getButton = (tab: 'true' | 'false'): ButtonConfig => properties[`${tab}Button`] || {};
  const updateButton = (tab: 'true' | 'false', updates: Partial<ButtonConfig>) => {
    const current = getButton(tab);
    onPropertyChange(`${tab}Button`, { ...current, ...updates });
  };

  const ColorField: React.FC<{ 
    label: string; 
    value: string; 
    onChange: (v: string) => void;
    showTransparent?: boolean;
    showOriginal?: boolean;
    originalAction?: () => void;
  }> = ({ label, value, onChange, showTransparent = false, showOriginal = false, originalAction }) => (
    <div className="space-y-1">
      <label className="block text-xs font-medium text-gray-400">{label}</label>
      <div className="flex items-center gap-2">
        <ColorPicker value={value} onChange={onChange} />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 min-w-0 border border-gray-600 bg-gray-800 text-gray-200 rounded px-2 py-1 text-xs focus:border-blue-500 focus:outline-none"
        />
        {showTransparent && (
          <button
            onClick={() => onChange('transparent')}
            className="px-2 py-1 text-xs bg-gray-600 hover:bg-gray-500 text-gray-300 rounded whitespace-nowrap"
            title="Hacer transparente"
          >
            Transparente
          </button>
        )}
        {showOriginal && originalAction && (
          <button
            onClick={originalAction}
            className="px-2 py-1 text-xs bg-gray-600 hover:bg-gray-500 text-gray-300 rounded whitespace-nowrap"
            title="Usar color original"
          >
            Original
          </button>
        )}
      </div>
    </div>
  );

  const renderControls = (tab: 'true' | 'false') => {
    const cfg = getButton(tab);
    const baseDefaultColor = tab === 'true' ? '#059669' : '#dc2626';

    return (
      <div className="space-y-6">
        {/* Basic Styling */}
        <div className="p-4 bg-gray-700 rounded border border-gray-600">
          <h6 className="text-sm font-medium text-gray-300 mb-4">Configuración Básica - Botón {tab === 'true' ? 'Verdadero' : 'Falso'}</h6>

          {/* Text */}
          <div className="mb-4">
            <label className="block text-xs font-medium text-gray-400 mb-2">Texto</label>
            <input
              type="text"
              value={cfg.text || (tab === 'true' ? 'Verdadero' : 'Falso')}
              onChange={(e) => updateButton(tab, { text: e.target.value })}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-sm text-white focus:border-blue-500 focus:outline-none"
            />
          </div>

          {/* Colors */}
          <div className="grid grid-cols-1 gap-4">
            <ColorField
              label="Color de Fondo"
              value={cfg.backgroundColor || baseDefaultColor}
              onChange={(val) => updateButton(tab, { backgroundColor: val })}
              showTransparent={true}
            />
            <ColorField
              label="Color de Texto"
              value={cfg.color || '#ffffff'}
              onChange={(val) => updateButton(tab, { color: val })}
            />
          </div>

          {/* Spacing */}
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-2">Padding</label>
              <input
                type="text"
                value={cfg.padding || '8px 16px'}
                onChange={(e) => updateButton(tab, { padding: e.target.value })}
                className="w-full px-2 py-1 bg-gray-800 border border-gray-600 rounded text-xs text-white focus:border-blue-500 focus:outline-none"
                placeholder="8px 16px"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-2">Radio Borde</label>
              <input
                type="text"
                value={cfg.borderRadius || '6px'}
                onChange={(e) => updateButton(tab, { borderRadius: e.target.value })}
                className="w-full px-2 py-1 bg-gray-800 border border-gray-600 rounded text-xs text-white focus:border-blue-500 focus:outline-none"
                placeholder="6px"
              />
            </div>
          </div>
        </div>

        {/* Border selector */}
        <div className="p-4 bg-gray-700 rounded border border-gray-600">
          <h6 className="text-sm font-medium text-gray-300 mb-4">Configuración de Bordes</h6>
          <BorderSelector
            borderWidth={cfg.borderWidth || 0}
            borderTopWidth={cfg.borderTopWidth}
            borderRightWidth={cfg.borderRightWidth}
            borderBottomWidth={cfg.borderBottomWidth}
            borderLeftWidth={cfg.borderLeftWidth}
            borderColor={cfg.borderColor || '#e2e8f0'}
            borderTopColor={cfg.borderTopColor}
            borderRightColor={cfg.borderRightColor}
            borderBottomColor={cfg.borderBottomColor}
            borderLeftColor={cfg.borderLeftColor}
            borderStyle={(cfg.borderStyle as any) || 'solid'}
            borderTopStyle={cfg.borderTopStyle}
            borderRightStyle={cfg.borderRightStyle}
            borderBottomStyle={cfg.borderBottomStyle}
            borderLeftStyle={cfg.borderLeftStyle}
            onBorderWidthChange={(w) => updateButton(tab, { borderWidth: w })}
            onBorderTopWidthChange={(w) => updateButton(tab, { borderTopWidth: w })}
            onBorderRightWidthChange={(w) => updateButton(tab, { borderRightWidth: w })}
            onBorderBottomWidthChange={(w) => updateButton(tab, { borderBottomWidth: w })}
            onBorderLeftWidthChange={(w) => updateButton(tab, { borderLeftWidth: w })}
            onBorderColorChange={(c) => updateButton(tab, { borderColor: c })}
            onBorderTopColorChange={(c) => updateButton(tab, { borderTopColor: c })}
            onBorderRightColorChange={(c) => updateButton(tab, { borderRightColor: c })}
            onBorderBottomColorChange={(c) => updateButton(tab, { borderBottomColor: c })}
            onBorderLeftColorChange={(c) => updateButton(tab, { borderLeftColor: c })}
            onBorderStyleChange={(s) => updateButton(tab, { borderStyle: s })}
            onBorderTopStyleChange={(s) => updateButton(tab, { borderTopStyle: s })}
            onBorderRightStyleChange={(s) => updateButton(tab, { borderRightStyle: s })}
            onBorderBottomStyleChange={(s) => updateButton(tab, { borderBottomStyle: s })}
            onBorderLeftStyleChange={(s) => updateButton(tab, { borderLeftStyle: s })}
          />
        </div>

        {/* Typography */}
        <div className="p-4 bg-gray-700 rounded border border-gray-600">
          <h6 className="text-sm font-medium text-gray-300 mb-4">Tipografía</h6>
          
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-2">Familia de Fuente</label>
              <select
                value={cfg.fontFamily || 'inherit'}
                onChange={(e) => updateButton(tab, { fontFamily: e.target.value })}
                className="w-full border border-gray-600 bg-gray-800 text-gray-200 rounded px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
              >
                <option value="inherit">Heredar</option>
                <option value="Arial, sans-serif">Arial</option>
                <option value="'Times New Roman', serif">Times New Roman</option>
                <option value="'Courier New', monospace">Courier New</option>
                <option value="'Helvetica Neue', sans-serif">Helvetica Neue</option>
                <option value="Georgia, serif">Georgia</option>
                <option value="Verdana, sans-serif">Verdana</option>
                <option value="'Trebuchet MS', sans-serif">Trebuchet MS</option>
                <option value="'Comic Sans MS', cursive">Comic Sans MS</option>
                <option value="Impact, sans-serif">Impact</option>
                <option value="'Lucida Console', monospace">Lucida Console</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-2">Tamaño de Fuente</label>
                <input
                  type="text"
                  value={cfg.fontSize || '14px'}
                  onChange={(e) => updateButton(tab, { fontSize: e.target.value })}
                  className="w-full border border-gray-600 bg-gray-800 text-gray-200 rounded px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                  placeholder="14px"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-2">Peso de Fuente</label>
                <select
                  value={cfg.fontWeight || '500'}
                  onChange={(e) => updateButton(tab, { fontWeight: e.target.value })}
                  className="w-full border border-gray-600 bg-gray-800 text-gray-200 rounded px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                >
                  <option value="300">Ligera</option>
                  <option value="400">Normal</option>
                  <option value="500">Media</option>
                  <option value="600">Semi-negrita</option>
                  <option value="700">Negrita</option>
                  <option value="800">Extra-negrita</option>
                  <option value="900">Ultra-negrita</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-2">Estilo de Fuente</label>
                <select
                  value={cfg.fontStyle || 'normal'}
                  onChange={(e) => updateButton(tab, { fontStyle: e.target.value })}
                  className="w-full border border-gray-600 bg-gray-800 text-gray-200 rounded px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                >
                  <option value="normal">Normal</option>
                  <option value="italic">Cursiva</option>
                  <option value="oblique">Oblicua</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-2">Decoración</label>
                <select
                  value={cfg.textDecoration || 'none'}
                  onChange={(e) => updateButton(tab, { textDecoration: e.target.value })}
                  className="w-full border border-gray-600 bg-gray-800 text-gray-200 rounded px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                >
                  <option value="none">Ninguna</option>
                  <option value="underline">Subrayado</option>
                  <option value="overline">Línea superior</option>
                  <option value="line-through">Tachado</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-2">Transformación</label>
                <select
                  value={cfg.textTransform || 'none'}
                  onChange={(e) => updateButton(tab, { textTransform: e.target.value })}
                  className="w-full border border-gray-600 bg-gray-800 text-gray-200 rounded px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                >
                  <option value="none">Normal</option>
                  <option value="uppercase">MAYÚSCULAS</option>
                  <option value="lowercase">minúsculas</option>
                  <option value="capitalize">Primera Letra</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-2">Alineación</label>
                <select
                  value={cfg.textAlign || 'center'}
                  onChange={(e) => updateButton(tab, { textAlign: e.target.value })}
                  className="w-full border border-gray-600 bg-gray-800 text-gray-200 rounded px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                >
                  <option value="left">Izquierda</option>
                  <option value="center">Centro</option>
                  <option value="right">Derecha</option>
                  <option value="justify">Justificado</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-2">Altura de Línea</label>
                <input
                  type="text"
                  value={cfg.lineHeight || '1.5'}
                  onChange={(e) => updateButton(tab, { lineHeight: e.target.value })}
                  className="w-full border border-gray-600 bg-gray-800 text-gray-200 rounded px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                  placeholder="1.5"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-2">Espaciado de Letras</label>
                <input
                  type="text"
                  value={cfg.letterSpacing || 'normal'}
                  onChange={(e) => updateButton(tab, { letterSpacing: e.target.value })}
                  className="w-full border border-gray-600 bg-gray-800 text-gray-200 rounded px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                  placeholder="normal"
                />
              </div>
            </div>
          </div>
        </div>

        {/* After-Answer Styling */}
        <div className="p-4 bg-gray-700 rounded border border-gray-600">
          <h6 className="text-sm font-medium text-gray-300 mb-4">Estilos Después de Responder</h6>
          <div className="text-xs text-gray-400 mb-4">
            Configura cómo se ve este botón después de que el usuario responde.
          </div>

          <div className="space-y-4">
            <ColorField
              label="Color Cuando Es Correcto"
              value={cfg.correctColor || '#059669'}
              onChange={(val) => updateButton(tab, { correctColor: val })}
              showOriginal={true}
              originalAction={() => updateButton(tab, { correctColor: 'original' })}
            />

            <ColorField
              label="Color Cuando Es Incorrecto"
              value={cfg.incorrectColor || '#dc2626'}
              onChange={(val) => updateButton(tab, { incorrectColor: val })}
              showOriginal={true}
              originalAction={() => updateButton(tab, { incorrectColor: 'original' })}
            />

            <ColorField
              label="Color Cuando No Fue Seleccionado"
              value={cfg.unselectedColor || '#6b7280'}
              onChange={(val) => updateButton(tab, { unselectedColor: val })}
              showOriginal={true}
              originalAction={() => updateButton(tab, { unselectedColor: 'original' })}
            />

            {/* Opacity Slider */}
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-2">Opacidad de No Seleccionados</label>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min="0.1"
                  max="1"
                  step="0.1"
                  value={cfg.unselectedOpacity || 1}
                  onChange={(e) => updateButton(tab, { unselectedOpacity: parseFloat(e.target.value) })}
                  className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                />
                <span className="text-xs text-gray-400 min-w-[40px]">
                  {Math.round((cfg.unselectedOpacity || 1) * 100)}%
                </span>
              </div>
            </div>

            {/* Visual Indicators */}
            <div className="space-y-3">
              <h6 className="text-xs font-medium text-gray-400 border-b border-gray-600 pb-1">Efectos Visuales</h6>
              
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id={`showIndicator-${tab}`}
                  checked={cfg.showIndicator !== false}
                  onChange={(e) => updateButton(tab, { showIndicator: e.target.checked })}
                  className="h-4 w-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
                />
                <label htmlFor={`showIndicator-${tab}`} className="text-xs font-medium text-gray-400">
                  Mostrar indicador visual (borde/sombra)
                </label>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id={`keepOriginalStyling-${tab}`}
                  checked={cfg.keepOriginalStyling === true}
                  onChange={(e) => updateButton(tab, { keepOriginalStyling: e.target.checked })}
                  className="h-4 w-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
                />
                <label htmlFor={`keepOriginalStyling-${tab}`} className="text-xs font-medium text-gray-400">
                  Mantener estilo original (solo indicadores sutiles)
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      <div className="flex gap-2 mb-4">
        <button
          className={`py-2 px-3 text-sm font-medium rounded ${
            activeTab === 'true' 
              ? 'bg-green-600 text-white' 
              : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
          }`}
          onClick={() => setActiveTab('true')}
        >
          Botón Verdadero
        </button>
        <button
          className={`py-2 px-3 text-sm font-medium rounded ${
            activeTab === 'false' 
              ? 'bg-red-600 text-white' 
              : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
          }`}
          onClick={() => setActiveTab('false')}
        >
          Botón Falso
        </button>
      </div>
      {renderControls(activeTab)}
    </div>
  );
}; 