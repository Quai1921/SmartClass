import React, { useState } from 'react';

interface BorderConfig {
  width: number;
  color: string;
  style: 'solid' | 'dashed' | 'dotted' | 'none';
}

interface BorderConfigurationProps {
  title?: string;
  borders: {
    all?: BorderConfig;
    top?: BorderConfig;
    right?: BorderConfig;
    bottom?: BorderConfig;
    left?: BorderConfig;
  };
  onChange: (borders: {
    all?: BorderConfig;
    top?: BorderConfig;
    right?: BorderConfig;
    bottom?: BorderConfig;
    left?: BorderConfig;
  }) => void;
}

// Color Picker Component - matching TrueFalseButtonProperties style
const ColorPicker = React.memo(({ 
  value, 
  onChange 
}: { 
  value: string; 
  onChange: (value: string) => void; 
}) => {
  const [localValue, setLocalValue] = useState(value || '#000000');
  const [isPickerOpen, setIsPickerOpen] = useState(false);

  React.useEffect(() => {
    if (!isPickerOpen) {
      setLocalValue(value || '#000000');
    }
  }, [value, isPickerOpen]);

  const handleColorChange = (newValue: string) => {
    setLocalValue(newValue);
  };

  const handleFocus = () => {
    setIsPickerOpen(true);
  };

  const handleBlur = () => {
    setIsPickerOpen(false);
    onChange(localValue);
  };

  return (
    <div className="flex items-center gap-2">
      <input
        type="color"
        value={localValue}
        onChange={(e) => handleColorChange(e.target.value)}
        onFocus={handleFocus}
        onBlur={handleBlur}
        className="w-8 h-8 rounded border border-gray-600 cursor-pointer"
      />
      <input
        type="text"
        value={localValue}
        onChange={(e) => handleColorChange(e.target.value)}
        onFocus={handleFocus}
        onBlur={handleBlur}
        className="flex-1 px-2 py-1 bg-gray-700 border border-gray-600 rounded text-xs text-white placeholder-gray-400 focus:outline-none"
        placeholder="#000000"
      />
    </div>
  );
});

// Border Style Dropdown Component - matching TrueFalseButtonProperties style
const BorderStyleDropdown = ({ 
  value, 
  onChange 
}: { 
  value: 'solid' | 'dashed' | 'dotted' | 'none'; 
  onChange: (value: 'solid' | 'dashed' | 'dotted' | 'none') => void; 
}) => {
  const styles = [
    { value: 'solid', label: 'Sólido' },
    { value: 'dashed', label: 'Punteado' },
    { value: 'dotted', label: 'Puntos' },
    { value: 'none', label: 'Ninguno' }
  ] as const;

  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as 'solid' | 'dashed' | 'dotted' | 'none')}
      className="w-full px-2 py-1 bg-gray-700 border border-gray-600 rounded text-sm text-white focus:outline-none"
    >
      {styles.map((style) => (
        <option key={style.value} value={style.value}>
          {style.label}
        </option>
      ))}
    </select>
  );
};

export const BorderConfiguration: React.FC<BorderConfigurationProps> = ({
  title = "Configuración de Bordes",
  borders,
  onChange
}) => {
  const handleBorderChange = (side: 'all' | 'top' | 'right' | 'bottom' | 'left', config: BorderConfig) => {
    onChange({
      ...borders,
      [side]: config
    });
  };

  const createBorderConfig = (side: 'all' | 'top' | 'right' | 'bottom' | 'left', updates: Partial<BorderConfig>): BorderConfig => {
    const current = borders[side];
    return {
      width: current?.width || 0,
      color: current?.color || '#000000',
      style: current?.style || 'solid',
      ...updates
    };
  };

  return (
    <div className="space-y-4">
      <h5 className="text-sm font-medium text-gray-300 border-b border-gray-600 pb-2">{title}</h5>
      
      {/* All sides section with column headers */}
      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Todos los lados</label>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">Grosor</label>
              <input
                type="number"
                value={borders.all?.width || 0}
                onChange={(e) => handleBorderChange('all', createBorderConfig('all', { width: parseInt(e.target.value) || 0 }))}
                min="0"
                max="20"
                className="w-full px-2 py-1 bg-gray-700 border border-gray-600 rounded text-sm text-white focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">Color</label>
              <ColorPicker
                value={borders.all?.color || '#000000'}
                onChange={(value) => handleBorderChange('all', createBorderConfig('all', { color: value }))}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">Estilo</label>
              <BorderStyleDropdown
                value={borders.all?.style || 'solid'}
                onChange={(value) => handleBorderChange('all', createBorderConfig('all', { style: value }))}
              />
            </div>
          </div>
        </div>
        
        {/* Individual sides with labels to the left */}
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-20 text-sm font-medium text-gray-300">Superior</div>
            <input
              type="number"
              value={borders.top?.width || 0}
              onChange={(e) => handleBorderChange('top', createBorderConfig('top', { width: parseInt(e.target.value) || 0 }))}
              min="0"
              max="20"
              className="w-16 px-2 py-1 bg-gray-700 border border-gray-600 rounded text-sm text-white focus:outline-none"
            />
            <ColorPicker
              value={borders.top?.color || '#000000'}
              onChange={(value) => handleBorderChange('top', createBorderConfig('top', { color: value }))}
            />
            <BorderStyleDropdown
              value={borders.top?.style || 'solid'}
              onChange={(value) => handleBorderChange('top', createBorderConfig('top', { style: value }))}
            />
          </div>
          
          <div className="flex items-center gap-3">
            <div className="w-20 text-sm font-medium text-gray-300">Derecha</div>
            <input
              type="number"
              value={borders.right?.width || 0}
              onChange={(e) => handleBorderChange('right', createBorderConfig('right', { width: parseInt(e.target.value) || 0 }))}
              min="0"
              max="20"
              className="w-16 px-2 py-1 bg-gray-700 border border-gray-600 rounded text-sm text-white focus:outline-none"
            />
            <ColorPicker
              value={borders.right?.color || '#000000'}
              onChange={(value) => handleBorderChange('right', createBorderConfig('right', { color: value }))}
            />
            <BorderStyleDropdown
              value={borders.right?.style || 'solid'}
              onChange={(value) => handleBorderChange('right', createBorderConfig('right', { style: value }))}
            />
          </div>
          
          <div className="flex items-center gap-3">
            <div className="w-20 text-sm font-medium text-gray-300">Inferior</div>
            <input
              type="number"
              value={borders.bottom?.width || 0}
              onChange={(e) => handleBorderChange('bottom', createBorderConfig('bottom', { width: parseInt(e.target.value) || 0 }))}
              min="0"
              max="20"
              className="w-16 px-2 py-1 bg-gray-700 border border-gray-600 rounded text-sm text-white focus:outline-none"
            />
            <ColorPicker
              value={borders.bottom?.color || '#000000'}
              onChange={(value) => handleBorderChange('bottom', createBorderConfig('bottom', { color: value }))}
            />
            <BorderStyleDropdown
              value={borders.bottom?.style || 'solid'}
              onChange={(value) => handleBorderChange('bottom', createBorderConfig('bottom', { style: value }))}
            />
          </div>
          
          <div className="flex items-center gap-3">
            <div className="w-20 text-sm font-medium text-gray-300">Izquierda</div>
            <input
              type="number"
              value={borders.left?.width || 0}
              onChange={(e) => handleBorderChange('left', createBorderConfig('left', { width: parseInt(e.target.value) || 0 }))}
              min="0"
              max="20"
              className="w-16 px-2 py-1 bg-gray-700 border border-gray-600 rounded text-sm text-white focus:outline-none"
            />
            <ColorPicker
              value={borders.left?.color || '#000000'}
              onChange={(value) => handleBorderChange('left', createBorderConfig('left', { color: value }))}
            />
            <BorderStyleDropdown
              value={borders.left?.style || 'solid'}
              onChange={(value) => handleBorderChange('left', createBorderConfig('left', { style: value }))}
            />
          </div>
        </div>
      </div>
    </div>
  );
}; 