import React from 'react';
import type { ResizeHandle } from '../../hooks/container/useContainerResize';

interface ContainerResizeHandlesProps {
  isSelected: boolean;
  onStartResize: (handle: ResizeHandle, e: React.MouseEvent) => void;
  getCursor: (handle: ResizeHandle) => string;
}

export const ContainerResizeHandles: React.FC<ContainerResizeHandlesProps> = ({
  isSelected,
  onStartResize,
  getCursor
}) => {
  if (!isSelected) return null;

  return (
    <>
      {(['n', 'ne', 'e', 'se', 's', 'sw', 'w', 'nw'] as ResizeHandle[]).map(handle => {
        return (
          <div
            key={handle}
            className={`resize-handle resize-${handle}`}
            onMouseDown={(e) => onStartResize(handle, e)}
            style={{
              cursor: getCursor(handle),
            }}
          />
        );
      })}
    </>
  );
};
