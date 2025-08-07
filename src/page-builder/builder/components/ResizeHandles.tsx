import React, { useEffect } from 'react';
import type { ResizeHandle } from '../hooks/useResizeHandlers';

interface ResizeHandlesProps {
  isSelected: boolean;
  onStartResize: (handle: ResizeHandle, e: React.PointerEvent) => void;
  getCursor: (handle: ResizeHandle) => string;
}

export const ResizeHandles: React.FC<ResizeHandlesProps> = ({
  isSelected,
  onStartResize,
  getCursor,
}) => {
  // Add global document-level event blocking for resize handles
  useEffect(() => {
    const blockDragOnResizeHandles = (e: Event) => {
      const target = e.target as HTMLElement;
      if (target && (
        target.hasAttribute('data-resize-handle') ||
        target.classList.contains('resize-handle') ||
        target.closest('[data-resize-handle="true"]')
      )) {
        // Only block drag events, not resize events
        if (e.type === 'dragstart') {
          e.preventDefault();
          e.stopPropagation();
          e.stopImmediatePropagation();
          
          // Set global flags to prevent any drag system activation
          document.body.setAttribute('data-global-resize-active', 'true');
          (window as any).__GLOBAL_RESIZE_BLOCK__ = true;
          
          // Clear flags after a delay
          setTimeout(() => {
            document.body.removeAttribute('data-global-resize-active');
            (window as any).__GLOBAL_RESIZE_BLOCK__ = false;
          }, 200);
          
          return false;
        }
        // For pointer and mouse events, allow them to proceed for resize functionality
      }
    };

    // Only add dragstart listener to prevent drag initiation
    document.addEventListener('dragstart', blockDragOnResizeHandles, { capture: true });

    return () => {
      document.removeEventListener('dragstart', blockDragOnResizeHandles, { capture: true });
    };
  }, []);

  if (!isSelected) return null;

  const handles: ResizeHandle[] = ['n', 'ne', 'e', 'se', 's', 'sw', 'w', 'nw'];

  return (
    <>
      {handles.map((handle) => {
        return (
          <div
            key={handle}
            className={`resize-handle resize-${handle}`}
            data-resize-handle="true"
            data-no-drag="true"
            data-resize-in-progress="false"
            data-block-all-drag="true"
            draggable={false}
            onPointerDown={(e) => {
              
              // Prevent default browser behavior but allow our resize handler
              e.preventDefault();
              e.stopPropagation();
              
              // Set global flags to prevent drag
              document.body.setAttribute('data-resize-starting', 'true');
              document.body.setAttribute('data-disable-drag', 'true');
              (window as any).__RESIZE_IN_PROGRESS__ = true;
              
              // Start resize - this should work now
              onStartResize(handle, e);
            }}
            onMouseDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            onDragStart={(e) => {
              e.preventDefault();
              e.stopPropagation();
              return false;
            }}
            onTouchStart={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            style={{
              cursor: getCursor(handle),
              pointerEvents: 'auto',
              touchAction: 'none',
              // MAXIMUM z-index to ensure handles are always on top
              zIndex: 999999,
              // Prevent any user selection
              userSelect: 'none',
              WebkitUserSelect: 'none',
              msUserSelect: 'none',
              MozUserSelect: 'none',
              // Force isolation from parent contexts
              isolation: 'isolate',
              contain: 'layout style paint',
              // Additional drag prevention handled by CSS
            }}
          />
        );
      })}
    </>
  );
};
