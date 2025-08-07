import { useEffect, useCallback } from 'react';
import { useBuilder } from '../../hooks/useBuilder';
import { enforceContainerConstraints } from '../../utils/elementFactory';
import type { Element } from '../../types';

interface UseContainerConstraintsOptions {
  element: Element;
  disabled?: boolean;
  onConstraintApplied?: () => void; // Callback for when constraints are applied
}

/**
 * Hook to enforce container constraints for child elements in real-time
 * This ensures child elements stay within their parent container boundaries
 */
export const useContainerConstraints = ({
  element,
  disabled = false,
  onConstraintApplied
}: UseContainerConstraintsOptions) => {
  const { elements, updateElement } = useBuilder();

  // Function to check and enforce constraints - use ref to avoid infinite loops
  const enforceConstraints = useCallback(() => {
    if (disabled || !element.parentId) {
      return; // Skip if disabled or element is not a child
    }

    // Find the parent container
    const parentContainer = elements.find(el => el.id === element.parentId);
    if (!parentContainer) {
      return; // Parent container not found
    }

    // Check if constraints need to be enforced
    const constrainedElement = enforceContainerConstraints(element, parentContainer);
    
    if (constrainedElement) {
      // Apply the constraints by updating the element
      updateElement(element.id, {
        properties: constrainedElement.properties
      });
      
      // Trigger border update callback if provided
      if (onConstraintApplied) {
        // Delay the callback to ensure DOM updates are complete
        setTimeout(() => {
          onConstraintApplied();
        }, 50);
      }
    }
  }, [element, elements, disabled, onConstraintApplied]);

  // Enforce constraints when element changes (position, size, etc.)
  useEffect(() => {
    enforceConstraints();
  }, [
    element.properties.width,
    element.properties.height,
    element.properties.left,
    element.properties.top,
    enforceConstraints
  ]);

  // Also enforce constraints when parent container dimensions change
  useEffect(() => {
    if (!element.parentId) return;

    const parentContainer = elements.find(el => el.id === element.parentId);
    if (!parentContainer) return;

    // Re-check constraints when parent container size changes
    enforceConstraints();
  }, [
    elements.find(el => el.id === element.parentId)?.properties.width,
    elements.find(el => el.id === element.parentId)?.properties.height,
    elements.find(el => el.id === element.parentId)?.properties.padding,
    enforceConstraints
  ]);

  return {
    enforceConstraints
  };
};
