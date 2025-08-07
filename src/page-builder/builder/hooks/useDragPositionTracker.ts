import { useEffect, useRef } from 'react';
import { useDndContext } from '@dnd-kit/core';
import { useBuilder } from '../../hooks/useBuilder';

export const useDragPositionTracker = (elementId: string) => {
  const { updateElement } = useBuilder();
  const { active, over } = useDndContext();
  const lastPositionRef = useRef<{ x: number; y: number } | null>(null);
  const elementRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (active?.id === elementId) {
      // Store reference to the dragging element
      elementRef.current = document.querySelector(`[data-element-id="${elementId}"]`) as HTMLElement;
    }
  }, [active?.id, elementId]);

  useEffect(() => {
    // When drag ends and this element was being dragged
    if (!active && lastPositionRef.current && elementRef.current) {
      
      const element = elementRef.current;
      const transform = window.getComputedStyle(element).transform;
      
      
      // Extract position from transform matrix if available
      if (transform && transform !== 'none') {
        const matrixMatch = transform.match(/matrix\(([^)]+)\)/);
        if (matrixMatch) {
          const values = matrixMatch[1].split(',').map(parseFloat);
          const translateX = values[4] || 0;
          const translateY = values[5] || 0;
          
          // Update element position
          updateElement(elementId, {
            properties: {
              left: (lastPositionRef.current.x || 0) + translateX,
              top: (lastPositionRef.current.y || 0) + translateY,
            }
          });
        }
      }
      
      // Reset tracking
      lastPositionRef.current = null;
      elementRef.current = null;
    }
  }, [active, elementId, updateElement]);
};
