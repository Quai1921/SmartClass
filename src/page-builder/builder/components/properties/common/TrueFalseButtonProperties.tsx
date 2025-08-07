import React from 'react';

interface ButtonProps {
  text?: string;
  backgroundColor?: string;
  color?: string;
  borderRadius?: number;
  borderWidth?: number;
  borderColor?: string;
  fontSize?: number;
  fontWeight?: string;
}

interface TrueFalseButtonPropertiesProps {
  label: string; // "Botón Verdadero" or "Botón Falso"
  buttonProps: ButtonProps;
  onChange: (updates: Partial<ButtonProps>) => void;
}

export const TrueFalseButtonProperties: React.FC<TrueFalseButtonPropertiesProps> = ({
  label,
  buttonProps,
  onChange,
}) => {
  const ColorInput: React.FC<{ value: string; onChange: (v: string) => void }> = ({ value, onChange }) => (
    <div className="flex items-center gap-2">
      <input
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-8 h-8 rounded border border-gray-600 cursor-pointer"
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1 px-2 py-1 bg-gray-700 border border-gray-600 rounded text-xs text-white placeholder-gray-400 focus:outline-none"
      />
    </div>
  );

  return (
    <div className="space-y-3 bg-gray-750 p-4 rounded-lg border border-gray-600">
      <h6 className="text-sm font-medium text-gray-300">{label}</h6>

      {/* Text */}
      <div>
        <label className="block text-xs font-medium text-gray-400 mb-1">Texto</label>
        <input
          type="text"
          value={buttonProps.text || ''}
          onChange={(e) => onChange({ text: e.target.value })}
          className="w-full px-2 py-1 bg-gray-700 border border-gray-600 rounded text-sm text-white placeholder-gray-400 focus:outline-none"
        />
      </div>

      {/* Background Color */}
      <div>
        <label className="block text-xs font-medium text-gray-400 mb-1">Color de Fondo</label>
        <ColorInput
          value={buttonProps.backgroundColor || '#3b82f6'}
          onChange={(value) => onChange({ backgroundColor: value })}
        />
      </div>

      {/* Text Color */}
      <div>
        <label className="block text-xs font-medium text-gray-400 mb-1">Color del Texto</label>
        <ColorInput
          value={buttonProps.color || '#ffffff'}
          onChange={(value) => onChange({ color: value })}
        />
      </div>

      {/* Border Radius */}
      <div>
        <label className="block text-xs font-medium text-gray-400 mb-1">Radio del Borde</label>
        <input
          type="number"
          value={buttonProps.borderRadius ?? 6}
          onChange={(e) => onChange({ borderRadius: parseInt(e.target.value) || 0 })}
          className="w-full px-2 py-1 bg-gray-700 border border-gray-600 rounded text-sm text-white focus:outline-none"
          min={0}
          max={50}
        />
      </div>

      {/* Border Width / Color */}
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="block text-xs font-medium text-gray-400 mb-1">Grosor Borde</label>
          <input
            type="number"
            value={buttonProps.borderWidth ?? 0}
            onChange={(e) => onChange({ borderWidth: parseInt(e.target.value) || 0 })}
            className="w-full px-2 py-1 bg-gray-700 border border-gray-600 rounded text-sm text-white focus:outline-none"
            min={0}
            max={10}
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-400 mb-1">Color Borde</label>
          <ColorInput
            value={buttonProps.borderColor || '#e2e8f0'}
            onChange={(value) => onChange({ borderColor: value })}
          />
        </div>
      </div>

      {/* Typography */}
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="block text-xs font-medium text-gray-400 mb-1">Tamaño Fuente</label>
          <input
            type="number"
            value={buttonProps.fontSize ?? 16}
            onChange={(e) => onChange({ fontSize: parseInt(e.target.value) || 16 })}
            className="w-full px-2 py-1 bg-gray-700 border border-gray-600 rounded text-sm text-white focus:outline-none"
            min={8}
            max={48}
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-400 mb-1">Peso Fuente</label>
          <select
            value={buttonProps.fontWeight || '500'}
            onChange={(e) => onChange({ fontWeight: e.target.value })}
            className="w-full px-2 py-1 bg-gray-700 border border-gray-600 rounded text-sm text-white focus:outline-none"
          >
            {['400','500','600','700','800','900'].map(w => (
              <option key={w} value={w}>{w}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}; 