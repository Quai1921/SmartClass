import { useState, useCallback, useRef, useEffect } from 'react';
import type { Element } from '../../types';
import { useBuilder } from '../../hooks/useBuilder';
import { calculateTextMinimumDimensions } from '../../utils/textMeasurement';

export type ResizeHandle = 'n' | 'ne' | 'e' | 'se' | 's' | 'sw' | 'w' | 'nw';

interface ResizeData {
  handle: ResizeHandle;
  startX: number;
  startY: number;
  startWidth: number;
  startHeight: number;
  startLeft: number;
  startTop: number;
  minWidth: number;
  minHeight: number;
  moved: boolean;
  element: Element;
}

export const useResizeHandlers = (element: Element, widgetRef: React.RefObject<HTMLDivElement | null>) => {
  const { updateElement } = useBuilder();
  const [isResizing, setIsResizing] = useState(false);
  const resizeDataRef = useRef<ResizeData | null>(null);

  // Stop resize function
  const stopResize = useCallback(() => {
    if (!resizeDataRef.current) return;

    const data = resizeDataRef.current;

    // Get final dimensions
    if (widgetRef.current) {
      const finalWidth = widgetRef.current.offsetWidth;
      const finalHeight = widgetRef.current.offsetHeight;
      
      // Only get position from inline styles if position was actually changed
      const finalLeft = (data.handle.includes('w') || data.handle.includes('n')) 
        ? (parseFloat(widgetRef.current.style.left) || data.startLeft)
        : data.startLeft;
      const finalTop = (data.handle.includes('w') || data.handle.includes('n'))
        ? (parseFloat(widgetRef.current.style.top) || data.startTop)
        : data.startTop;

      // Update element with final dimensions
      // Debug logging for all resize operations
      
      if (data.element.type === 'audio-true-false') {
        // For auto-sizing widgets, allow visual resizing but only update position, not dimensions
        // We need to exclude width/height from the spread to avoid re-setting them
        const { width, height, widthUnit, heightUnit, ...otherProperties } = data.element.properties;
        updateElement(data.element.id, { 
          properties: {
            ...otherProperties,
            left: finalLeft,
            top: finalTop,
            // Explicitly don't include width/height - let it auto-size
            // But user can still see visual feedback during resize
          }
        });
      } else {
        
        updateElement(data.element.id, { 
          properties: {
            ...data.element.properties,
            width: finalWidth,
            height: finalHeight,
            left: finalLeft,
            top: finalTop,
            widthUnit: 'px' as const,
            heightUnit: 'px' as const,
            position: 'absolute' as const,
          }
        });
      }

      // Remove inline styles
      widgetRef.current.style.removeProperty('width');
      widgetRef.current.style.removeProperty('height');
      // Only remove position styles if they were actually set during resize
      if (data.handle.includes('w') || data.handle.includes('n')) {
        widgetRef.current.style.removeProperty('left');
        widgetRef.current.style.removeProperty('top');
      }
    }

    // Reset state
    setIsResizing(false);
    resizeDataRef.current = null;

    // Reset document state and global flags
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
    document.body.removeAttribute('data-resize-starting');
    document.body.removeAttribute('data-disable-drag');
    document.body.removeAttribute('data-global-resize-active');
    (window as any).__RESIZE_IN_PROGRESS__ = false;
    (window as any).__GLOBAL_RESIZE_BLOCK__ = false;
  }, [updateElement, widgetRef]);

  // Mouse/Pointer move handler
  const handleMove = useCallback((e: MouseEvent | PointerEvent) => {
    if (!resizeDataRef.current || !widgetRef.current) return;

    const data = resizeDataRef.current;
    const deltaX = e.clientX - data.startX;
    const deltaY = e.clientY - data.startY;

    let newWidth = data.startWidth;
    let newHeight = data.startHeight;
    let newLeft = data.startLeft;
    let newTop = data.startTop;

    // Calculate new dimensions based on handle
    if (data.handle.includes('e')) {
      newWidth = data.startWidth + deltaX;
    } else if (data.handle.includes('w')) {
      newWidth = data.startWidth - deltaX;
      newLeft = data.startLeft + deltaX;
    }

    if (data.handle.includes('s')) {
      newHeight = data.startHeight + deltaY;
    } else if (data.handle.includes('n')) {
      newHeight = data.startHeight - deltaY;
      newTop = data.startTop + deltaY;
    }

    // Apply minimum constraints
    const isTextElement = ['heading', 'paragraph', 'quote', 'text'].includes(data.element.type);
    const safetyMargin = isTextElement ? 10 : 0;
    
    newWidth = Math.max(data.minWidth + safetyMargin, newWidth);
    newHeight = Math.max(data.minHeight + safetyMargin, newHeight);

    // Adjust position when hitting minimums
    if (data.handle.includes('w') && newWidth === data.minWidth + safetyMargin) {
      newLeft = data.startLeft + data.startWidth - newWidth;
    }
    if (data.handle.includes('n') && newHeight === data.minHeight + safetyMargin) {
      newTop = data.startTop + data.startHeight - newHeight;
    }

    // Apply to DOM immediately - but preserve positioning consistency
    widgetRef.current.style.width = `${newWidth}px`;
    widgetRef.current.style.height = `${newHeight}px`;
    
    // Only update position for handles that affect position (w, nw, n, ne)
    if (data.handle.includes('w') || data.handle.includes('n')) {
      widgetRef.current.style.left = `${newLeft}px`;
      widgetRef.current.style.top = `${newTop}px`;
    }
  }, [widgetRef]);

  // Mouse/Pointer up handler - this is the critical one
  const handleUp = useCallback((e: MouseEvent | PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Remove ALL possible listeners first
    document.removeEventListener('mousemove', handleMove as EventListener);
    document.removeEventListener('mouseup', handleUp as EventListener);
    document.removeEventListener('pointermove', handleMove as EventListener);
    document.removeEventListener('pointerup', handleUp as EventListener);
    
    // Then stop resize
    stopResize();
  }, [handleMove, stopResize]);

  // Start resize function
  const startResize = useCallback((handle: ResizeHandle, e: React.MouseEvent | React.PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!widgetRef.current || isResizing) return;


    const rect = widgetRef.current.getBoundingClientRect();
    
    // Calculate minimum dimensions for text elements
    const isTextElement = ['heading', 'paragraph', 'quote', 'text'].includes(element.type);
    let minWidth = 30;
    let minHeight = 30;
    
    if (isTextElement) {
      const textMinDimensions = calculateTextMinimumDimensions(element, element.properties);
      minWidth = textMinDimensions.minWidth;
      minHeight = textMinDimensions.minHeight;
    }
    
    // Store resize data
    resizeDataRef.current = {
      handle,
      startX: e.clientX,
      startY: e.clientY,
      startWidth: rect.width,
      startHeight: rect.height,
      startLeft: element.properties.left || 0,
      startTop: element.properties.top || 0,
      minWidth,
      minHeight,
      moved: false,
      element,
    };
    
    setIsResizing(true);

    // Set cursor and global flags
    const cursors = {
      n: 'ns-resize',
      ne: 'nesw-resize',
      e: 'ew-resize',
      se: 'nwse-resize',
      s: 'ns-resize',
      sw: 'nesw-resize',
      w: 'ew-resize',
      nw: 'nwse-resize',
    };
    document.body.style.cursor = cursors[handle];
    document.body.style.userSelect = 'none';
    document.body.setAttribute('data-global-resize-active', 'true');
    (window as any).__RESIZE_IN_PROGRESS__ = true;

    // Add both mouse and pointer listeners for maximum compatibility
    document.addEventListener('mousemove', handleMove as EventListener);
    document.addEventListener('mouseup', handleUp as EventListener);
    document.addEventListener('pointermove', handleMove as EventListener);
    document.addEventListener('pointerup', handleUp as EventListener);
    
  }, [element, widgetRef, isResizing, handleMove, handleUp]);

  // Get cursor for handle
  const getCursor = useCallback((handle: ResizeHandle): string => {
    const cursors = {
      n: 'ns-resize',
      ne: 'nesw-resize',
      e: 'ew-resize',
      se: 'nwse-resize',
      s: 'ns-resize',
      sw: 'nesw-resize',
      w: 'ew-resize',
      nw: 'nwse-resize',
    };
    return cursors[handle];
  }, []);

  // Escape key handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isResizing) {
        // Remove all listeners
        document.removeEventListener('mousemove', handleMove as EventListener);
        document.removeEventListener('mouseup', handleUp as EventListener);
        document.removeEventListener('pointermove', handleMove as EventListener);
        document.removeEventListener('pointerup', handleUp as EventListener);
        stopResize();
      }
    };

    if (isResizing) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isResizing, handleMove, handleUp, stopResize]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (isResizing) {
        document.removeEventListener('mousemove', handleMove as EventListener);
        document.removeEventListener('mouseup', handleUp as EventListener);
        document.removeEventListener('pointermove', handleMove as EventListener);
        document.removeEventListener('pointerup', handleUp as EventListener);
        stopResize();
      }
    };
  }, [isResizing, handleMove, handleUp, stopResize]);

  return {
    startResize,
    isResizing,
    getCursor,
  };
};
