import React, { useCallback, useState, useEffect } from 'react';
import { Tooltip } from './Tooltip';

interface BorderSelectorProps {
  borderWidth: number;
  borderTopWidth?: number;
  borderRightWidth?: number;
  borderBottomWidth?: number;
  borderLeftWidth?: number;
  borderColor: string;
  borderTopColor?: string;
  borderRightColor?: string;
  borderBottomColor?: string;
  borderLeftColor?: string;
  borderStyle?: 'solid' | 'dashed' | 'dotted' | 'double' | 'none';
  borderTopStyle?: 'solid' | 'dashed' | 'dotted' | 'double' | 'none';
  borderRightStyle?: 'solid' | 'dashed' | 'dotted' | 'double' | 'none';
  borderBottomStyle?: 'solid' | 'dashed' | 'dotted' | 'double' | 'none';
  borderLeftStyle?: 'solid' | 'dashed' | 'dotted' | 'double' | 'none';
  onBorderWidthChange: (width: number) => void;
  onBorderTopWidthChange?: (width: number) => void;
  onBorderRightWidthChange?: (width: number) => void;
  onBorderBottomWidthChange?: (width: number) => void;
  onBorderLeftWidthChange?: (width: number) => void;
  onBorderColorChange: (color: string) => void;
  onBorderTopColorChange?: (color: string) => void;
  onBorderRightColorChange?: (color: string) => void;
  onBorderBottomColorChange?: (color: string) => void;
  onBorderLeftColorChange?: (color: string) => void;
  onBorderStyleChange?: (style: 'solid' | 'dashed' | 'dotted' | 'double' | 'none') => void;
  onBorderTopStyleChange?: (style: 'solid' | 'dashed' | 'dotted' | 'double' | 'none') => void;
  onBorderRightStyleChange?: (style: 'solid' | 'dashed' | 'dotted' | 'double' | 'none') => void;
  onBorderBottomStyleChange?: (style: 'solid' | 'dashed' | 'dotted' | 'double' | 'none') => void;
  onBorderLeftStyleChange?: (style: 'solid' | 'dashed' | 'dotted' | 'double' | 'none') => void;
}

// Memoized ColorPicker component to prevent re-renders that close the color picker
const ColorPicker = React.memo<{
  value: string;
  onChange: (value: string) => void;
  label?: string;
}>(({ value, onChange, label }) => {
  const [localValue, setLocalValue] = useState(value || '#000000');
  const [isPickerOpen, setIsPickerOpen] = useState(false);

  // Update local value when prop changes (but not when picker is open)
  useEffect(() => {
    if (!isPickerOpen) {
      setLocalValue(value || '#000000');
    }
  }, [value, isPickerOpen]);

  const handleColorChange = (newValue: string) => {
    setLocalValue(newValue);
  };

  const handleFocus = (e: React.FocusEvent) => {
    setIsPickerOpen(true);
  };

  const handleBlur = (e: React.FocusEvent) => {
    setIsPickerOpen(false);
    onChange(localValue);
  };

  return (
    <input
      type="color"
      value={localValue}
      onChange={(e) => handleColorChange(e.target.value)}
      onPointerDownCapture={(e) => {
        e.stopPropagation();
        document.body.setAttribute('data-disable-drag', 'true');
      }}
      onPointerUpCapture={(e) => {
        document.body.removeAttribute('data-disable-drag');
      }}
      onMouseDownCapture={(e) => e.stopPropagation()}
      onClick={(e) => e.stopPropagation()}
      onFocus={handleFocus}
      onBlur={handleBlur}
      className="w-full h-8 border border-gray-600 rounded cursor-pointer"
      title={label}
    />
  );
});

ColorPicker.displayName = 'ColorPicker';

// Memoized border section component to prevent re-renders
export const BorderSelector = React.memo<BorderSelectorProps>(({ 
  borderWidth, 
  borderTopWidth, 
  borderRightWidth, 
  borderBottomWidth, 
  borderLeftWidth,
  borderColor,
  borderTopColor,
  borderRightColor,
  borderBottomColor,
  borderLeftColor,
  borderStyle,
  borderTopStyle,
  borderRightStyle,
  borderBottomStyle,
  borderLeftStyle,
  onBorderWidthChange, 
  onBorderTopWidthChange,
  onBorderRightWidthChange,
  onBorderBottomWidthChange,
  onBorderLeftWidthChange,
  onBorderColorChange,
  onBorderTopColorChange,
  onBorderRightColorChange,
  onBorderBottomColorChange,
  onBorderLeftColorChange,
  onBorderStyleChange,
  onBorderTopStyleChange,
  onBorderRightStyleChange,
  onBorderBottomStyleChange,
  onBorderLeftStyleChange
}) => {
  const handleWidthChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onBorderWidthChange(parseInt(e.target.value));
  }, [onBorderWidthChange]);

  const handleStyleChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    onBorderStyleChange?.(e.target.value as 'solid' | 'dashed' | 'dotted' | 'double' | 'none');
  }, [onBorderStyleChange]);

  return (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-2">
        Borde
      </label>
      
      {/* Unified Border Controls */}
      <div className="mb-4">
        <label className="block text-xs text-gray-400 mb-1">Todos los lados</label>
        <div className="grid grid-cols-3 gap-2">
          <input
            type="number"
            min="0"
            max="10"
            placeholder="Ancho (px)"
            value={borderWidth}
            onChange={handleWidthChange}
            className="border border-gray-600 bg-gray-700 text-gray-200 rounded px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
          <ColorPicker
            value={borderColor}
            onChange={onBorderColorChange}
            label="Color de borde principal"
          />
          <select
            value={borderStyle || 'solid'}
            onChange={handleStyleChange}
            className="border border-gray-600 bg-gray-700 text-gray-200 rounded px-2 py-1 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 cursor-pointer"
            title={`Current border style: ${borderStyle || 'solid'}`}
          >
            <option value="solid">Sólido</option>
            <option value="dashed">Guiones</option>
            <option value="dotted">Puntos</option>
            <option value="double">Doble</option>
            <option value="none">Ninguno</option>
          </select>
        </div>
      </div>

      {/* Individual Border Controls */}
      <div className="space-y-3">
        {/* Top Border */}
        <div>
          <label className="block text-xs text-gray-400 mb-1">Superior</label>
          <div className="grid grid-cols-3 gap-2">
            <input
              type="number"
              min="0"
              max="10"
              placeholder="Ancho"
              value={borderTopWidth ?? borderWidth}
              onChange={(e) => onBorderTopWidthChange?.(parseInt(e.target.value))}
              className="border border-gray-600 bg-gray-700 text-gray-200 rounded px-2 py-1 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
            <ColorPicker
              value={borderTopColor ?? borderColor}
              onChange={(color) => onBorderTopColorChange?.(color)}
              label="Color de borde superior"
            />
            <select
              value={borderTopStyle !== undefined ? borderTopStyle : (borderStyle || 'solid')}
              onChange={(e) => onBorderTopStyleChange?.(e.target.value as 'solid' | 'dashed' | 'dotted' | 'double' | 'none')}
              className="border border-gray-600 bg-gray-700 text-gray-200 rounded px-1 py-1 text-xs focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            >
              <option value="solid">Sólido</option>
              <option value="dashed">Guiones</option>
              <option value="dotted">Puntos</option>
              <option value="double">Doble</option>
              <option value="none">Ninguno</option>
            </select>
          </div>
        </div>

        {/* Right Border */}
        <div>
          <label className="block text-xs text-gray-400 mb-1">Derecha</label>
          <div className="grid grid-cols-3 gap-2">
            <input
              type="number"
              min="0"
              max="10"
              placeholder="Ancho"
              value={borderRightWidth ?? borderWidth}
              onChange={(e) => onBorderRightWidthChange?.(parseInt(e.target.value))}
              className="border border-gray-600 bg-gray-700 text-gray-200 rounded px-2 py-1 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
            <ColorPicker
              value={borderRightColor ?? borderColor}
              onChange={(color) => onBorderRightColorChange?.(color)}
              label="Color de borde derecho"
            />
            <select
              value={borderRightStyle !== undefined ? borderRightStyle : (borderStyle || 'solid')}
              onChange={(e) => onBorderRightStyleChange?.(e.target.value as 'solid' | 'dashed' | 'dotted' | 'double' | 'none')}
              className="border border-gray-600 bg-gray-700 text-gray-200 rounded px-1 py-1 text-xs focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            >
              <option value="solid">Sólido</option>
              <option value="dashed">Guiones</option>
              <option value="dotted">Puntos</option>
              <option value="double">Doble</option>
              <option value="none">Ninguno</option>
            </select>
          </div>
        </div>

        {/* Bottom Border */}
        <div>
          <label className="block text-xs text-gray-400 mb-1">Inferior</label>
          <div className="grid grid-cols-3 gap-2">
            <input
              type="number"
              min="0"
              max="10"
              placeholder="Ancho"
              value={borderBottomWidth ?? borderWidth}
              onChange={(e) => onBorderBottomWidthChange?.(parseInt(e.target.value))}
              className="border border-gray-600 bg-gray-700 text-gray-200 rounded px-2 py-1 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
            <ColorPicker
              value={borderBottomColor ?? borderColor}
              onChange={(color) => onBorderBottomColorChange?.(color)}
              label="Color de borde inferior"
            />
            <select
              value={borderBottomStyle !== undefined ? borderBottomStyle : (borderStyle || 'solid')}
              onChange={(e) => onBorderBottomStyleChange?.(e.target.value as 'solid' | 'dashed' | 'dotted' | 'double' | 'none')}
              className="border border-gray-600 bg-gray-700 text-gray-200 rounded px-1 py-1 text-xs focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            >
              <option value="solid">Sólido</option>
              <option value="dashed">Guiones</option>
              <option value="dotted">Puntos</option>
              <option value="double">Doble</option>
              <option value="none">Ninguno</option>
            </select>
          </div>
        </div>

        {/* Left Border */}
        <div>
          <label className="block text-xs text-gray-400 mb-1">Izquierda</label>
          <div className="grid grid-cols-3 gap-2">
            <input
              type="number"
              min="0"
              max="10"
              placeholder="Ancho"
              value={borderLeftWidth ?? borderWidth}
              onChange={(e) => onBorderLeftWidthChange?.(parseInt(e.target.value))}
              className="border border-gray-600 bg-gray-700 text-gray-200 rounded px-2 py-1 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
            <ColorPicker
              value={borderLeftColor ?? borderColor}
              onChange={(color) => onBorderLeftColorChange?.(color)}
              label="Color de borde izquierdo"
            />
            <select
              value={borderLeftStyle !== undefined ? borderLeftStyle : (borderStyle || 'solid')}
              onChange={(e) => onBorderLeftStyleChange?.(e.target.value as 'solid' | 'dashed' | 'dotted' | 'double' | 'none')}
              className="border border-gray-600 bg-gray-700 text-gray-200 rounded px-1 py-1 text-xs focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            >
              <option value="solid">Sólido</option>
              <option value="dashed">Guiones</option>
              <option value="dotted">Puntos</option>
              <option value="double">Doble</option>
              <option value="none">Ninguno</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
});

BorderSelector.displayName = 'BorderSelector';

// Provide a custom comparison to ignore new function references
function areBorderSelectorPropsEqual(prev: BorderSelectorProps, next: BorderSelectorProps) {
  // Compare all scalar props; ignore function props which change identity on every render
  const keys: (keyof BorderSelectorProps)[] = [
    'borderWidth', 'borderTopWidth', 'borderRightWidth', 'borderBottomWidth', 'borderLeftWidth',
    'borderColor', 'borderTopColor', 'borderRightColor', 'borderBottomColor', 'borderLeftColor',
    'borderStyle', 'borderTopStyle', 'borderRightStyle', 'borderBottomStyle', 'borderLeftStyle'
  ];

  return keys.every((k) => prev[k] === next[k]);
}

// Re-export with custom comparison
export const MemoizedBorderSelector = React.memo(BorderSelector, areBorderSelectorPropsEqual);
