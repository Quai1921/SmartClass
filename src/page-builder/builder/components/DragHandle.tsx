import React, { useState } from 'react';
import { Move } from 'lucide-react';
import type { DraggableAttributes } from '@dnd-kit/core';

interface DragHandleProps {
  isSelected: boolean;
  isDragging: boolean;
  dragListeners?: any;
  dragAttributes?: DraggableAttributes;
  position?: 'left' | 'top';
  title?: string;
}

export const DragHandle: React.FC<DragHandleProps> = ({
  isSelected,
  isDragging,
  dragListeners,
  dragAttributes,
  position = 'left',
  title = "Arrastra para mover este elemento"
}) => {
  const [isHovered, setIsHovered] = useState(false);

  if (!isSelected) return null;

  const getStyles = (): React.CSSProperties => {
    const baseStyles: React.CSSProperties = {
      position: 'absolute',
      width: '32px',
      height: '20px',
      minWidth: '32px',
      minHeight: '20px',
      maxWidth: '32px',
      maxHeight: '20px',
      background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
      border: '2px solid rgba(255, 255, 255, 0.95)',
      borderRadius: '8px',
      cursor: 'move',
      zIndex: 99999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      fontSize: '12px',
      fontWeight: 500,
      transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
      userSelect: 'none',
      boxSizing: 'border-box',
      boxShadow: '0 2px 8px rgba(59, 130, 246, 0.3), 0 1px 3px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
      margin: '0',
      padding: '0',
      outline: 'none',
      textDecoration: 'none',
      backgroundColor: 'transparent'
    };

    // Position the handle
    if (position === 'left') {
      baseStyles.left = '-40px';
      baseStyles.top = '50%';
      baseStyles.transform = 'translateY(-50%)';
    } else {
      baseStyles.top = '-40px';
      baseStyles.left = '50%';
      baseStyles.transform = 'translateX(-50%)';
    }

    if (isDragging || isHovered) {
      return {
        ...baseStyles,
        background: 'linear-gradient(135deg, #1d4ed8, #1e40af)',
        transform: position === 'left' 
          ? 'translateY(-50%) scale(1.1)' 
          : 'translateX(-50%) scale(1.1)',
        boxShadow: '0 6px 20px rgba(59, 130, 246, 0.4), 0 3px 10px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
        border: '2px solid rgba(255, 255, 255, 1)'
      };
    }

    return baseStyles;
  };

  return (
    <div
      style={getStyles()}
      className="drag-handle reposition-handle"
      data-drag-source="handle"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      title={title}
      data-testid="drag-handle"
      {...(dragListeners || {})}
      {...(dragAttributes || {})}
    >
      <Move size={12} strokeWidth={2.5} />
    </div>
  );
}; 