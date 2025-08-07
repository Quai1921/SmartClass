import React from 'react';

// Unit selector component for dimension controls
export const UnitSelector: React.FC<{
  value: string;
  onChange: (unit: string) => void;
  options: Array<{ value: string; label: string; tooltip: string }>;
  className?: string;
}> = ({ value, onChange, options, className = '' }) => {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`border border-gray-600 bg-gray-700 text-gray-200 rounded px-2 py-2 text-xs font-mono focus:border-blue-500 focus:ring-1 focus:ring-blue-500 ${className}`}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value} title={option.tooltip}>
          {option.label}
        </option>
      ))}
    </select>
  );
};
