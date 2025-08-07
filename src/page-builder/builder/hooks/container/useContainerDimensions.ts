import { useEffect } from 'react';
import { useBuilder } from '../../../hooks/useBuilder';
import type { Element } from '../../../types';

interface UseContainerDimensionsProps {
  element: Element;
  isSelected: boolean;
  depth: number;
  containerRef: React.RefObject<HTMLDivElement | null>;
}

export const useContainerDimensions = ({ element, isSelected, depth, containerRef }: UseContainerDimensionsProps) => {
  const { updateElement } = useBuilder();
  const { properties } = element;

  // Ensure container has proper dimensions when first selected
  useEffect(() => {
    if (isSelected && containerRef.current) {
      // For simple containers (no children), allow responsive adjustment to canvas width
      const isSimpleContainer = !element.children || element.children.length === 0;
      const hasExplicitPosition = typeof properties.left === 'number' && typeof properties.top === 'number';
      const hasExplicitDimensions = typeof properties.width === 'number' && typeof properties.height === 'number';
      const isLargeWidth = typeof properties.width === 'number' && properties.width > 1000; // Detect responsive containers (>1000px likely responsive)
      const hasAbsolutePosition = properties.position === 'absolute';
      
      // Skip auto-adjustments for containers that are clearly responsive (large width + absolute positioning)
      if (hasExplicitPosition && hasExplicitDimensions && isLargeWidth && hasAbsolutePosition) {
        return;
      }
      
      // Skip auto-adjustments for containers that already have large responsive dimensions
      if (hasExplicitPosition && hasExplicitDimensions && isLargeWidth) {
        return;
      }
      
      // Skip auto-adjustments for complex containers with explicit positioning, 
      // but allow simple containers to be responsive
      if (!isSimpleContainer && hasExplicitPosition && hasExplicitDimensions) {
        return;
      }
      
      const rect = containerRef.current.getBoundingClientRect();
      
      // Check if width/height need defaults - handle CSS keywords properly
      const hasNumericWidth = typeof properties.width === 'number' && properties.width >= 50;
      const hasNumericHeight = typeof properties.height === 'number' && properties.height >= 50;
      const hasCSSKeywordWidth = typeof properties.width === 'string' && 
        (properties.width === 'max-content' || properties.width === 'min-content' || properties.width === 'fit-content');
      const hasCSSKeywordHeight = typeof properties.height === 'string' && 
        (properties.height === 'max-content' || properties.height === 'min-content' || properties.height === 'fit-content');
      
      const needsWidth = !hasNumericWidth && !hasCSSKeywordWidth;
      const needsHeight = !hasNumericHeight && !hasCSSKeywordHeight;
      
      // For root containers, also check positioning to ensure they fit within canvas
      const needsPositionCheck = depth === 0 && (needsWidth || needsHeight || 
        typeof properties.left !== 'number' || typeof properties.top !== 'number');
      
      if (needsWidth || needsHeight || needsPositionCheck) {
        // Calculate available canvas space for root containers
        let maxAllowedWidth = Infinity;
        if (depth === 0) {
          // Calculate canvas content area (accounting for 64px padding)
          const totalWidth = window.innerWidth;
          const sidebarWidth = 360; // Sidebar is typically visible for new containers
          const panelWidth = 0; // Property panel not usually open for new containers
          const canvasWidth = totalWidth - sidebarWidth - panelWidth;
          maxAllowedWidth = canvasWidth - 64; // Account for canvas padding
        }
        
        // Use the same logic as startResize: prioritize computed size, ensure minimums as last resort
        let defaultWidth: number = rect.width;
        let defaultHeight: number = rect.height;
        let defaultLeft: number = properties.left || 0;
        let defaultTop: number = properties.top || 0;
        
        if (needsWidth) {
          defaultWidth = rect.width;
          // Only use stored if it's a number and larger than computed
          if (typeof properties.width === 'number' && properties.width > rect.width) {
            defaultWidth = properties.width;
          }
          // Apply minimum only as last resort
          defaultWidth = Math.max(defaultWidth, depth > 0 ? 100 : 200);
          
          // For root containers, ensure width fits in canvas
          if (depth === 0) {
            defaultWidth = Math.min(defaultWidth, maxAllowedWidth - 40); // Leave some margin
          }
        }
        
        if (needsHeight) {
          defaultHeight = rect.height;
          // Only use stored if it's a number and larger than computed
          if (typeof properties.height === 'number' && properties.height > rect.height) {
            defaultHeight = properties.height;
          }
          // Apply minimum only as last resort
          defaultHeight = Math.max(defaultHeight, depth > 0 ? 60 : 100);
        }
        
        // For root containers, ensure positioning is within bounds
        if (depth === 0) {
          // Only adjust position if container would significantly overflow (more than 20px)
          const overflowAmount = (defaultLeft + defaultWidth) - maxAllowedWidth;
          if (overflowAmount > 20) {
            const adjustedLeft = Math.max(0, maxAllowedWidth - defaultWidth);
            // Only apply the adjustment if it doesn't move the container too far left
            if (adjustedLeft >= defaultLeft - 50) { // Don't move more than 50px left
              defaultLeft = adjustedLeft;
            }
          }
          // Ensure left position is not negative
          defaultLeft = Math.max(0, defaultLeft);
          // Ensure top position is not negative
          defaultTop = Math.max(0, defaultTop);
        }
        
        updateElement(element.id, {
          properties: {
            ...properties,
            position: properties.position || 'absolute',
            width: defaultWidth,
            height: defaultHeight,
            widthUnit: 'px' as const,
            heightUnit: 'px' as const,
            left: defaultLeft,
            top: defaultTop
          }
        });
      }
    }
  }, [isSelected, element.id, properties, depth, updateElement, containerRef]);
};
