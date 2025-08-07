import { useState, useCallback, useRef } from 'react';
import { useBuilder } from '../../../hooks/useBuilder';
import type { Element } from '../../../types';

interface UseContainerRepositionProps {
  element: Element;
  containerRef: React.RefObject<HTMLDivElement | null>;
}

interface DropTarget {
  elementId: string;
  type: 'container' | 'canvas';
  rect: DOMRect;
}

export const useContainerReposition = ({ element, containerRef }: UseContainerRepositionProps) => {
  const { updateElement, moveElement } = useBuilder();
  
  // Repositioning state
  const [isRepositioning, setIsRepositioning] = useState(false);
  const [repositionStartPos, setRepositionStartPos] = useState({ x: 0, y: 0 });
  const [initialElementPos, setInitialElementPos] = useState({ left: 0, top: 0 });
  const [potentialDropTarget, setPotentialDropTarget] = useState<DropTarget | null>(null);
  
  const repositionDataRef = useRef<{
    startX: number;
    startY: number;
    initialLeft: number;
    initialTop: number;
    dragThreshold: number;
    hasExceededThreshold: boolean;
  } | null>(null);

  // Find potential drop targets at current mouse position
  const findDropTarget = useCallback((x: number, y: number): DropTarget | null => {
    // Get all potential container drop targets
    const containers = document.querySelectorAll('[data-container-id]');
    const canvas = document.querySelector('[data-canvas]');
    
    for (const container of containers) {
      const containerEl = container as HTMLElement;
      const containerId = containerEl.getAttribute('data-container-id');
      
      // Skip if it's the same element or a child of the current element
      if (containerId === element.id) continue;
      
      const rect = containerEl.getBoundingClientRect();
      if (x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom) {
        return {
          elementId: containerId!,
          type: 'container',
          rect
        };
      }
    }
    
    // Check if over canvas
    if (canvas) {
      const rect = canvas.getBoundingClientRect();
      if (x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom) {
        return {
          elementId: 'canvas',
          type: 'canvas',
          rect
        };
      }
    }
    
    return null;
  }, [element.id]);

  // Start repositioning
  const startReposition = useCallback((e: React.MouseEvent) => {
    
    if (!containerRef.current) {
      return;
    }

    const startX = e.clientX;
    const startY = e.clientY;
    const initialLeft = element.properties.left || 0;
    const initialTop = element.properties.top || 0;

    setIsRepositioning(true);
    setRepositionStartPos({ x: startX, y: startY });
    setInitialElementPos({ left: initialLeft, top: initialTop });
    setPotentialDropTarget(null);
    
    repositionDataRef.current = {
      startX,
      startY,
      initialLeft,
      initialTop,
      dragThreshold: 8, // pixels to move before considering cross-container drag
      hasExceededThreshold: false,
    };

    // Prevent text selection during repositioning
    document.body.style.userSelect = 'none';
    
    // Add global mouse event listeners
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    
    e.preventDefault();
    e.stopPropagation();
  }, [element.id, element.properties.left, element.properties.top, element.parentId]);

  // Handle mouse move during repositioning
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isRepositioning || !repositionDataRef.current || !containerRef.current) return;

    const { startX, startY, initialLeft, initialTop, dragThreshold } = repositionDataRef.current;
    const deltaX = e.clientX - startX;
    const deltaY = e.clientY - startY;
    const totalDistance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

    // Check if we've exceeded the drag threshold for cross-container operations
    if (totalDistance > dragThreshold && !repositionDataRef.current.hasExceededThreshold) {
      repositionDataRef.current.hasExceededThreshold = true;
    }

    // If we've exceeded threshold, look for drop targets
    if (repositionDataRef.current.hasExceededThreshold) {
      const dropTarget = findDropTarget(e.clientX, e.clientY);
      setPotentialDropTarget(dropTarget);
      
      if (dropTarget) {
        // Visual feedback - could add highlighting here
        document.body.style.cursor = 'copy';
      } else {
        document.body.style.cursor = 'grabbing';
      }
    } else {
      // Within threshold - normal repositioning
      document.body.style.cursor = 'grabbing';
      
      // Calculate new position for local repositioning
      let newLeft = initialLeft + deltaX;
      let newTop = initialTop + deltaY;

      // Apply boundary constraints for local repositioning
      const parentElement = containerRef.current.parentElement;
      if (parentElement && element.parentId) {
        const parentRect = parentElement.getBoundingClientRect();
        const containerRect = containerRef.current.getBoundingClientRect();
        
        const minLeft = 0;
        const minTop = 0;
        const maxLeft = parentRect.width - containerRect.width;
        const maxTop = parentRect.height - containerRect.height;
        
        newLeft = Math.max(minLeft, Math.min(newLeft, maxLeft));
        newTop = Math.max(minTop, Math.min(newTop, maxTop));
      } else {
        // For canvas elements, apply canvas constraints
        newLeft = Math.max(0, newLeft);
        newTop = Math.max(0, newTop);
      }

      // Update element position in real-time for local repositioning
      updateElement(element.id, {
        properties: {
          ...element.properties,
          left: Math.round(newLeft),
          top: Math.round(newTop)
        }
      });
    }
  }, [isRepositioning, element.id, element.properties, element.parentId, updateElement, findDropTarget]);

  // Handle mouse up - end repositioning or perform drop
  const handleMouseUp = useCallback((e: MouseEvent) => {
    if (!isRepositioning || !repositionDataRef.current) return;

    const { hasExceededThreshold } = repositionDataRef.current;

    // If we exceeded threshold and have a drop target, perform cross-container move
    if (hasExceededThreshold && potentialDropTarget) {
      if (potentialDropTarget.type === 'container') {
        
        // Calculate drop position relative to target container
        const targetRect = potentialDropTarget.rect;
        const relativeX = Math.max(10, e.clientX - targetRect.left);
        const relativeY = Math.max(10, e.clientY - targetRect.top);
        
        // Move element to new container
        moveElement(element.id, potentialDropTarget.elementId);
        
        // Update position within new container
        updateElement(element.id, {
          properties: {
            ...element.properties,
            left: relativeX,
            top: relativeY,
            // Clear grid positioning when moving to regular container
            gridRow: undefined,
            gridColumn: undefined
          }
        });
      } else if (potentialDropTarget.type === 'canvas') {
        
        // Calculate position relative to canvas
        const canvasRect = potentialDropTarget.rect;
        const canvasX = Math.max(10, e.clientX - canvasRect.left);
        const canvasY = Math.max(10, e.clientY - canvasRect.top);
        
        // Move element to canvas (no parent)
        moveElement(element.id, undefined);
        
        // Update position on canvas
        updateElement(element.id, {
          properties: {
            ...element.properties,
            left: canvasX,
            top: canvasY,
            // Clear grid positioning when moving to canvas
            gridRow: undefined,
            gridColumn: undefined
          }
        });
      }
    }
    
    // Cleanup
    setIsRepositioning(false);
    setRepositionStartPos({ x: 0, y: 0 });
    setInitialElementPos({ left: 0, top: 0 });
    setPotentialDropTarget(null);
    repositionDataRef.current = null;

    // Restore cursor and text selection
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
    
    // Remove global event listeners
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  }, [isRepositioning, element.id, element.properties, potentialDropTarget, moveElement, updateElement]);

  // Get cursor style for repositioning
  const getRepositionCursor = useCallback(() => {
    if (isRepositioning) {
      return potentialDropTarget ? 'copy' : 'grabbing';
    }
    return 'grab';
  }, [isRepositioning, potentialDropTarget]);

  // Clean up event listeners on unmount
  const cleanup = useCallback(() => {
    if (isRepositioning) {
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    }
  }, [isRepositioning, handleMouseMove, handleMouseUp]);

  return {
    isRepositioning,
    repositionStartPos,
    initialElementPos,
    repositionDataRef,
    potentialDropTarget,
    startReposition,
    getRepositionCursor,
    cleanup,
  };
};
