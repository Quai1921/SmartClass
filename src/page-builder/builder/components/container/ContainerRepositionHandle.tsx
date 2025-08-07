import React, { useState } from 'react';
import { Move } from 'lucide-react';
import type { DraggableAttributes } from '@dnd-kit/core';

interface ContainerRepositionHandleProps {
  depth: number;
  isRepositioning: boolean;
  onStartRepositioning: (e: React.MouseEvent) => void;
  dragListeners?: any; // DnD Kit listeners
  dragAttributes?: DraggableAttributes;
  setDragNodeRef?: (element: HTMLElement | null) => void;
}

export const ContainerRepositionHandle: React.FC<ContainerRepositionHandleProps> = ({
  depth,
  isRepositioning,
  onStartRepositioning,
  dragListeners,
  dragAttributes,
  setDragNodeRef
}) => {
  const [isHovered, setIsHovered] = useState(false);

  if (depth === 0) return null;
  const getStyles = (): React.CSSProperties => {
    return {
      top: '-40px',
      left: '50%',
      transform: 'translateX(-50%)',
    };
  };

  return (
    <div
      ref={setDragNodeRef}
      style={getStyles()}
      className="absolute cursor-grab active:cursor-grabbing transition-all duration-150 hover:scale-110 drag-handle reposition-handle container-reposition-handle"
      data-drag-source="handle"
      onMouseDown={(e) => {
        onStartRepositioning(e);
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      title="Arrastra para reposicionar este contenedor"
      data-testid="reposition-handle"
      // Add dnd-kit drag functionality for integration with main drag system
      {...(dragListeners || {})}
      {...(dragAttributes || {})}
    >
      <div className="w-4 h-4 flex flex-col justify-center items-center space-y-px">
        <div className="w-1.5 h-0.5 bg-white rounded-full"></div>
        <div className="w-1.5 h-0.5 bg-white rounded-full"></div>
        <div className="w-1.5 h-0.5 bg-white rounded-full"></div>
        <div className="w-1.5 h-0.5 bg-white rounded-full"></div>
        <div className="w-1.5 h-0.5 bg-white rounded-full"></div>
        <div className="w-1.5 h-0.5 bg-white rounded-full"></div>
      </div>
    </div>
  );
};
