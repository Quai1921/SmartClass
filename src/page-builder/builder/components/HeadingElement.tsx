import React, { useState } from 'react';
import { useDraggable } from '@dnd-kit/core';
import { Type, ChevronDown } from 'lucide-react';
import type { ElementType } from '../../types';

interface HeadingElementProps {
  hasContainers: boolean;
  disabled?: boolean;
  disabledMessage?: string;
}

const HEADING_LEVELS = [
  { value: 1, label: 'H1', description: 'Título Principal', className: 'text-3xl font-bold', size: '3xl' },
  { value: 2, label: 'H2', description: 'Título Secundario', className: 'text-2xl font-semibold', size: '2xl' },
  { value: 3, label: 'H3', description: 'Subtítulo', className: 'text-xl font-medium', size: 'xl' },
  { value: 4, label: 'H4', description: 'Encabezado', className: 'text-lg font-medium', size: 'lg' },
  { value: 5, label: 'H5', description: 'Subencabezado', className: 'text-base font-medium', size: 'base' },
  { value: 6, label: 'H6', description: 'Encabezado Menor', className: 'text-sm font-medium', size: 'sm' }
];

export const HeadingElement: React.FC<HeadingElementProps> = ({ 
  hasContainers: _, // Mark as intentionally unused
  disabled = false, 
  disabledMessage 
}) => {
  const [selectedLevel, setSelectedLevel] = useState(1);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `new-heading`,
    data: { 
      type: 'heading' as ElementType,
      level: selectedLevel 
    },
    disabled,
  });

  const style = {
    opacity: disabled ? 0.4 : 1,
    pointerEvents: isDragging ? 'none' : 'auto',
    transform: isDragging ? 'scale(0.95) rotate(1deg)' : 'none',
    boxShadow: isDragging ? '0 8px 25px rgba(0, 0, 0, 0.3)' : 'none',
    transition: isDragging ? 'none' : 'all 0.2s ease',
  } as React.CSSProperties;

  const selectedHeading = HEADING_LEVELS.find(h => h.value === selectedLevel) || HEADING_LEVELS[0];

  const handleDropdownSelect = (level: number) => {
    setSelectedLevel(level);
    setIsDropdownOpen(false);
  };

  return (
    <div className="relative">
      <div
        ref={setNodeRef}
        style={style}
        data-dnd-kit-dragging={isDragging ? 'true' : 'false'}
        data-drag-source="sidebar"
        data-element-type="heading"
        {...(disabled ? {} : listeners)}
        {...(disabled ? {} : attributes)}
        className={`border rounded-lg transition-all duration-200 ${
          disabled 
            ? 'bg-gray-800 border-gray-600 cursor-not-allowed' 
            : 'bg-gray-700 border-gray-600 cursor-grab active:cursor-grabbing hover:bg-gray-600 ring-1 ring-blue-600/20'
        }`}
        title={disabled ? disabledMessage : undefined}
      >
        {/* Main draggable area */}
        <div className="p-3">
          <div className="flex items-center justify-between">
            {/* Left side - Icon and heading preview */}
            <div className="flex items-center space-x-3">
              <div className={`flex items-center justify-center text-xl ${
                disabled ? 'text-gray-500' : 'text-gray-300'
              }`}>
                <Type size={20} strokeWidth={2.5} />
              </div>
              <div>
                {React.createElement(
                  `h${selectedLevel}`,
                  {
                    className: `${selectedHeading.className} ${
                      disabled ? 'text-gray-500' : 'text-gray-200'
                    } truncate max-w-32`
                  },
                  selectedHeading.description
                )}
                <p className={`text-xs mt-1 ${
                  disabled ? 'text-gray-600' : 'text-gray-400'
                }`}>
                  Elemento: {selectedHeading.label}
                </p>
              </div>
            </div>

            {/* Right side - Current selection indicator */}
            <div className={`px-2 py-1 rounded text-xs font-bold ${
              disabled ? 'bg-gray-700 text-gray-500' : 'bg-blue-600 text-blue-100'
            }`}>
              {selectedHeading.label}
            </div>
          </div>
        </div>

        {/* Dropdown section - separate from draggable area */}
        {!disabled && (
          <div 
            className="border-t border-gray-600 bg-gray-700"
            onMouseDown={(e) => e.stopPropagation()} // Prevent dragging when clicking dropdown
          >
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsDropdownOpen(!isDropdownOpen);
              }}
              className="w-full px-3 py-2 flex items-center justify-between text-xs font-medium text-gray-300 hover:bg-gray-600 transition-colors rounded-b-lg"
            >
              <div className="flex items-center space-x-2 flex-1 min-w-0">
                <span>Cambiar a:</span>
                {React.createElement(
                  `h${selectedLevel}`,
                  {
                    className: `${selectedHeading.className} text-blue-400 truncate`
                  },
                  `${selectedHeading.label} - ${selectedHeading.description}`
                )}
              </div>
              <ChevronDown className={`w-3 h-3 transition-transform shrink-0 ml-2 ${
                isDropdownOpen ? 'rotate-180' : ''
              }`} />
            </button>
          </div>
        )}
      </div>

      {/* Dropdown menu */}
      {isDropdownOpen && !disabled && (
        <>
          {/* Overlay to close dropdown */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsDropdownOpen(false)}
          />
          
          {/* Dropdown content */}
          <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-gray-700 border border-gray-600 rounded-lg shadow-xl max-h-64 overflow-y-auto">
            {HEADING_LEVELS.map((heading) => (
              <button
                key={heading.value}
                onClick={() => handleDropdownSelect(heading.value)}
                className={`w-full px-3 py-3 text-left flex items-center justify-between hover:bg-gray-600 transition-colors ${
                  selectedLevel === heading.value ? 'bg-blue-600 text-white' : 'text-gray-300'
                } ${heading.value === 1 ? 'rounded-t-lg' : ''} ${heading.value === 6 ? 'rounded-b-lg' : ''}`}
              >
                <div className="flex items-center space-x-3 flex-1 min-w-0">
                  <span className={`font-bold shrink-0 ${
                    selectedLevel === heading.value ? 'text-blue-200' : 'text-blue-400'
                  }`}>
                    {heading.label}
                  </span>
                  <div className="min-w-0 flex-1">
                    {React.createElement(
                      `h${heading.value}`,
                      {
                        className: `${heading.className} ${
                          selectedLevel === heading.value ? 'text-white' : 'text-gray-300'
                        } truncate`
                      },
                      heading.description
                    )}
                  </div>
                </div>
                {selectedLevel === heading.value && (
                  <div className="w-2 h-2 bg-blue-200 rounded-full shrink-0 ml-2" />
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};
