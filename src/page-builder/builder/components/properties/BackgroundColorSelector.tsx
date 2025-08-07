import React, { useCallback } from 'react';
import { Tooltip } from './Tooltip';

// Memoized background color selection component to prevent re-renders
export const BackgroundColorSelector = React.memo<{
  backgroundColor: string;
  onBackgroundColorChange: (color: string) => void;
}>(({ backgroundColor, onBackgroundColorChange }) => {
  const colorValue = backgroundColor || '#ffffff';
  const textValue = backgroundColor || '';

  const handleColorChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onBackgroundColorChange(e.target.value);
  }, [onBackgroundColorChange]);

  const handleTextChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onBackgroundColorChange(e.target.value);
  }, [onBackgroundColorChange]);

  return (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-2">
        Color de fondo
      </label>
      <div className="flex space-x-2">
        <input
          type="color"
          value={colorValue}
          onChange={handleColorChange}
          className="w-12 h-8 border border-gray-600 bg-gray-700 rounded"
        />
        <input
          type="text"
          value={textValue}
          onChange={handleTextChange}
          placeholder="#ffffff"
          className="flex-1 border border-gray-600 bg-gray-700 text-gray-200 rounded px-3 py-1 text-sm font-mono focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        />
      </div>
    </div>
  );
});

BackgroundColorSelector.displayName = 'BackgroundColorSelector';
