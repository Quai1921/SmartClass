import type { Modifier } from '@dnd-kit/core';
import type { Element } from '../types';

/**
 * Creates a modifier that constrains dragged elements to their parent container boundaries
 */
export const createBoundaryConstraintModifier = (
  elements: Element[],
  draggedElementId: string
): Modifier => {
  return ({ transform }) => {
    // Find the dragged element
    const draggedElement = elements.find(el => el.id === draggedElementId);
    if (!draggedElement || !draggedElement.parentId) {
      return transform; // No constraints for root elements or new elements
    }

    // Find the parent container
    const parentContainer = elements.find(el => el.id === draggedElement.parentId);
    if (!parentContainer) {
      return transform; // No parent found, no constraints
    }

    // Get parent container DOM element
    const parentElement = document.querySelector(`[data-element-id="${parentContainer.id}"]`) as HTMLElement;
    if (!parentElement) {
      return transform; // Parent element not found in DOM
    }

    // Get dragged element DOM element
    const draggedDOMElement = document.querySelector(`[data-element-id="${draggedElementId}"]`) as HTMLElement;
    if (!draggedDOMElement) {
      return transform; // Dragged element not found in DOM
    }

    // Get container boundaries
    const parentRect = parentElement.getBoundingClientRect();
    const draggedRect = draggedDOMElement.getBoundingClientRect();

    // Define padding to keep elements away from edges
    const padding = 10;

    // Calculate available space for movement
    const maxX = parentRect.width - draggedRect.width - (padding * 2);
    const maxY = parentRect.height - draggedRect.height - (padding * 2);

    // Calculate current position relative to parent
    const currentX = draggedRect.left - parentRect.left;
    const currentY = draggedRect.top - parentRect.top;

    // Calculate new position with transform applied
    const newX = currentX + transform.x;
    const newY = currentY + transform.y;

    // Constrain the new position within boundaries
    const constrainedX = Math.max(padding, Math.min(maxX, newX));
    const constrainedY = Math.max(padding, Math.min(maxY, newY));

    // Calculate the constrained transform
    const constrainedTransform = {
      x: constrainedX - currentX,
      y: constrainedY - currentY,
      scaleX: transform.scaleX,
      scaleY: transform.scaleY,
    };

    // Log constraint violations for debugging
    if (newX !== constrainedX || newY !== constrainedY) {

    }

    return constrainedTransform;
  };
};

/**
 * Simple boundary constraint modifier that can be used directly with useSortable
 */
export const boundaryConstraintModifier: Modifier = ({ transform, containerNodeRect, activeNodeRect }) => {
  if (!containerNodeRect || !activeNodeRect) {
    return transform;
  }

  // Define padding to keep elements away from edges  
  const padding = 10;

  // Calculate boundaries
  const minX = padding;
  const minY = padding;
  const maxX = containerNodeRect.width - activeNodeRect.width - padding;
  const maxY = containerNodeRect.height - activeNodeRect.height - padding;

  // Constrain transform
  return {
    ...transform,
    x: Math.max(minX - activeNodeRect.left, Math.min(transform.x, maxX - activeNodeRect.left)),
    y: Math.max(minY - activeNodeRect.top, Math.min(transform.y, maxY - activeNodeRect.top)),
  };
};
