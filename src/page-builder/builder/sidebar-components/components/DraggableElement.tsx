import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import type { ElementType } from '../../../types';

interface DraggableElementProps {
  type: ElementType;
  label: string;
  icon: React.ReactNode;
  disabled?: boolean;
  disabledMessage?: string;
}

export const DraggableElement: React.FC<DraggableElementProps> = ({ 
  type, 
  label, 
  icon,
  disabled = false,
  disabledMessage
}) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `new-${type}`,
    data: { type },
    disabled, // Disable dragging when disabled
  });

  // Keep the original element visible during drag (no overlay used)
  const style = {
    opacity: disabled ? 0.4 : 1, // No longer hide during drag
    pointerEvents: isDragging ? 'none' : 'auto',
    transform: isDragging ? 'scale(0.95) rotate(1deg)' : 'none', // Add visual feedback
    boxShadow: isDragging ? '0 8px 25px rgba(0, 0, 0, 0.3)' : 'none',
    transition: isDragging ? 'none' : 'all 0.2s ease',
  } as React.CSSProperties;

  return (
    <div
      ref={setNodeRef}
      style={style}
      data-dnd-kit-dragging={isDragging ? 'true' : 'false'}
      data-drag-source="sidebar"
      data-element-type={type}
      {...(disabled ? {} : listeners)}
      {...(disabled ? {} : attributes)}
      className={`border rounded-lg p-3 transition-all duration-200 ${
        disabled 
          ? 'bg-gray-800 border-gray-600 cursor-not-allowed' 
          : 'bg-gray-700 border-gray-600 cursor-grab active:cursor-grabbing hover:bg-gray-600'
      }`}
      title={disabled ? disabledMessage : undefined}
    >
      <div className="flex flex-col items-center space-y-2">
        <div className={`flex items-center justify-center text-xl ${
          disabled ? 'text-gray-500' : 'text-gray-300'
        }`}>
          {icon}
        </div>
        <p className={`text-xs text-center font-medium ${
          disabled ? 'text-gray-500' : 'text-gray-200'
        }`}>
          {label}
        </p>
      </div>
    </div>
  );
};
