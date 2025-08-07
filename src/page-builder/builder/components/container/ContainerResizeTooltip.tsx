import React from 'react';
import { createPortal } from 'react-dom';

interface ContainerResizeTooltipProps {
  isResizing: boolean;
  resizeDataRef: React.RefObject<{
    handle: string;
    startX: number;
    startY: number;
    startWidth: number;
    startHeight: number;
    startLeft: number;
    startTop: number;
  } | null>;
  containerRef: React.RefObject<HTMLDivElement | null>;
}

export const ContainerResizeTooltip: React.FC<ContainerResizeTooltipProps> = ({
  isResizing,
  resizeDataRef,
  containerRef
}) => {
  if (!isResizing || !resizeDataRef.current) return null;

  return createPortal(
    <div
      style={{
        position: 'fixed',
        top: resizeDataRef.current.startY - 40,
        left: resizeDataRef.current.startX + 20,
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        color: 'white',
        padding: '8px 12px',
        borderRadius: '6px',
        fontSize: '12px',
        fontFamily: 'monospace',
        zIndex: 10000,
        pointerEvents: 'none',
        boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
        border: '1px solid rgba(255,255,255,0.2)',
        whiteSpace: 'nowrap',
      }}
    >
      <div style={{ fontWeight: 'bold', marginBottom: '2px' }}>
        {resizeDataRef.current.handle.toUpperCase()} Resize
      </div>
      <div>
        {containerRef.current ? 
          `${Math.round(parseFloat(containerRef.current.style.width || '0'))}px × ${Math.round(parseFloat(containerRef.current.style.height || '0'))}px`
          : 'Loading...'
        }
      </div>
    </div>,
    document.body
  );
};
