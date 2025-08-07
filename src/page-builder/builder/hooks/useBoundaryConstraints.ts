import { useState, useCallback } from 'react';
import type { Modifier } from '@dnd-kit/core';
import { useBuilder } from '../../hooks/useBuilder';

interface BoundaryConstraint {
  isConstrained: boolean;
  constraintType: 'horizontal' | 'vertical' | 'both' | null;
  parentName: string;
}

export const useBoundaryConstraints = (dragSource: 'handle' | 'body' | 'sidebar') => {
  const [boundaryConstraint, setBoundaryConstraint] = useState<BoundaryConstraint>({
    isConstrained: false,
    constraintType: null,
    parentName: '',
  });

  const { elements } = useBuilder();

  // COMPLETELY DISABLE the modifier for body drags to avoid interfering with drop detection
  // Only use it for handle drags where we want to prevent accidental movements
  const constrainToParent: Modifier = useCallback(({ transform, activeNodeRect, active }) => {
    // Apply strict constraints for body drags to keep element inside its parent container
    if (dragSource === 'body' && active && activeNodeRect) {
      const activeId = active.id.toString();
      if (!activeId.startsWith('new-')) {
        const activeElement = elements.find(el => el.id === activeId);
        if (activeElement?.parentId) {
          const parentEl = document.querySelector(`[data-element-id="${activeElement.parentId}"]`) as HTMLElement;
          if (parentEl) {
            const parentRect = parentEl.getBoundingClientRect();
            // Calculate new position relative to parent
            const newLeft = activeNodeRect.left + transform.x - parentRect.left;
            const newTop = activeNodeRect.top + transform.y - parentRect.top;
            // Constrain within bounds [0, parentSize - elementSize]
            const constrainedX = Math.max(0, Math.min(parentRect.width - activeNodeRect.width, newLeft));
            const constrainedY = Math.max(0, Math.min(parentRect.height - activeNodeRect.height, newTop));
            // If out of bounds, adjust transform
            if (constrainedX !== newLeft || constrainedY !== newTop) {
              return {
                ...transform,
                x: constrainedX - (activeNodeRect.left - parentRect.left),
                y: constrainedY - (activeNodeRect.top - parentRect.top),
              };
            }
          }
        }
      }
    }
    
    // Allow free movement for handle and sidebar drags
    return transform;
  }, [dragSource, elements]);

  // Handle constraint feedback through drag events instead of modifier
  const handleDragMove = useCallback((event: any) => {
    // Only show constraint feedback for body drags within same container
    if (dragSource === 'body' && event.active && !event.over) {
      const activeId = event.active.id.toString();
      if (!activeId.startsWith('new-')) {
        const activeElement = elements.find(el => el.id === activeId);
        if (activeElement?.parentId) {
          const parentElement = elements.find(el => el.id === activeElement.parentId);
          const parentName = parentElement?.type || 'Contenedor';
          
          // Show visual feedback that element is constrained to parent
          setBoundaryConstraint(prev => {
            if (!prev.isConstrained) {
              return {
                isConstrained: true,
                constraintType: 'both',
                parentName: parentName,
              };
            }
            return prev;
          });
          return;
        }
      }
    }
    
    // Clear constraints for all other cases
    setBoundaryConstraint(prev => {
      if (prev.isConstrained) {
        return { isConstrained: false, constraintType: null, parentName: '' };
      }
      return prev;
    });
  }, [dragSource, elements]);

  const resetBoundaryConstraint = useCallback(() => {
    setBoundaryConstraint({ isConstrained: false, constraintType: null, parentName: '' });
  }, []);

  return {
    boundaryConstraint,
    constrainToParent,
    resetBoundaryConstraint,
    handleDragMove, // New: handle constraint feedback separately
  };
};
