import { useEffect, useCallback, useRef } from 'react';
import { useBuilder } from '../../hooks/useBuilder';
import { useResponsiveChildPositioning } from './useResponsiveChildPositioning';

/**
 * Convert child element positions from pixels to percentages relative to container
 */
const convertChildPositionsToPercentages = (
  containerId: string, 
  containerWidth: number, 
  containerHeight: number, 
  elements: any[], 
  updateElement: (id: string, updates: any) => void
) => {
  // Find all child elements of this container
  const childElements = elements.filter(el => el.parentId === containerId);
  
  if (childElements.length === 0) return;
  
  
  childElements.forEach(child => {
    const currentLeft = child.properties.left || 0;
    const currentTop = child.properties.top || 0;
    const currentWidth = child.properties.width || 0;
    const currentHeight = child.properties.height || 0;
    
    // Skip if already using percentage units
    if (typeof currentLeft === 'string' && currentLeft.includes('%')) {
      return;
    }
    
    // Calculate percentages (ensure they don't exceed 100%)
    const leftPercent = Math.min(95, Math.max(0, (currentLeft / containerWidth) * 100));
    const topPercent = Math.min(95, Math.max(0, (currentTop / containerHeight) * 100));
    
    // For dimensions, we can also use percentages if desired
    const widthPercent = Math.min(100, Math.max(5, (currentWidth / containerWidth) * 100));
    const heightPercent = Math.min(100, Math.max(5, (currentHeight / containerHeight) * 100));
    
    // Update child element with percentage positioning
    updateElement(child.id, {
      properties: {
        ...child.properties,
        left: `${leftPercent.toFixed(1)}%`,
        top: `${topPercent.toFixed(1)}%`,
        // Optionally also convert dimensions to percentages
        // width: `${widthPercent.toFixed(1)}%`,
        // height: `${heightPercent.toFixed(1)}%`,
        // Mark as percentage-positioned for future reference
        positionUnit: 'percentage'
      }
    });
  });
};

/**
 * Hook that automatically resizes and re-centers containers when panels are hidden/shown
 * This provides adaptive responsive behavior for existing containers
 */
export const useAdaptiveContainerResize = () => {
  const { elements, updateElement, sidebarVisible, propertyPanelVisible } = useBuilder();
  const { convertContainerChildrenToPercentage } = useResponsiveChildPositioning();
  
  // Refs to prevent infinite loops
  const lastPanelState = useRef<string>('');
  const resizeTimeoutRef = useRef<number | null>(null);
  const isResizingRef = useRef(false);

  // Function to calculate if panels are hidden based on canvas size
  const detectPanelsHidden = useCallback(() => {
    const canvasElement = document.querySelector('[data-canvas]') as HTMLElement;
    if (!canvasElement) return false;
    
    const actualCanvasWidth = canvasElement.offsetWidth;
    const viewportWidth = window.innerWidth;
    const canvasWidthRatio = actualCanvasWidth / viewportWidth;
    
    // If canvas is >80% of viewport, panels are likely hidden
    return canvasWidthRatio > 0.8;
  }, []);

  // Function to resize and re-center top-level containers
  const resizeAndCenterContainers = useCallback(() => {
    // Prevent concurrent resize operations
    if (isResizingRef.current) {
      return;
    }

    const canvasElement = document.querySelector('[data-canvas]') as HTMLElement;
    if (!canvasElement) {
      return;
    }

    isResizingRef.current = true; // Set flag early

    try {
      const actualCanvasWidth = canvasElement.offsetWidth;
      const arePanelsHidden = detectPanelsHidden();
      
      // Create a state signature to prevent unnecessary re-runs
      const currentPanelState = `${sidebarVisible}-${propertyPanelVisible}-${actualCanvasWidth}`;
      
      // Skip if panel state hasn't actually changed
      if (lastPanelState.current === currentPanelState) {
        return;
      }
      
      lastPanelState.current = currentPanelState;

    // Find all top-level containers (no parentId)
    const topLevelContainers = elements.filter(el => 
      el.type === 'container' && !el.parentId
    );

    topLevelContainers.forEach(container => {
      const properties = container.properties;
      
      // Skip containers that don't have responsive dimensions (likely manually sized)
      const hasLargeWidth = typeof properties.width === 'number' && properties.width > 500;
      const hasAbsolutePosition = properties.position === 'absolute';
      
      if (!hasLargeWidth || !hasAbsolutePosition) {
        return;
      }

      // Determine if it's a simple column or multi-layout based on children count
      const childContainers = elements.filter(el => el.parentId === container.id);
      const isSimpleColumn = childContainers.length === 0;
      const hasMultipleColumns = childContainers.length > 1;

      // Calculate new size based on panel state (same logic as template creation)
      let newContainerWidthPx: number;
      
      if (isSimpleColumn) {
        const basePercentage = arePanelsHidden ? 0.85 : 0.75;
        newContainerWidthPx = Math.floor(actualCanvasWidth * basePercentage);
      } else if (hasMultipleColumns) {
        const basePercentage = arePanelsHidden ? 0.95 : 0.9;
        newContainerWidthPx = Math.floor(actualCanvasWidth * basePercentage);
      } else {
        const basePercentage = arePanelsHidden ? 0.9 : 0.85;
        newContainerWidthPx = Math.floor(actualCanvasWidth * basePercentage);
      }

      // Calculate new height maintaining 16:9 aspect ratio
      const newContainerHeight = Math.floor(newContainerWidthPx * 9 / 16);
      
      // Calculate new centered position
      const newContainerLeft = (actualCanvasWidth - newContainerWidthPx) / 2;

      // VIEWPORT OVERFLOW FIX: Check if container would exceed viewport and adjust
      const viewportHeight = window.innerHeight;
      const toolbarHeight = 60; // Approximate toolbar height
      const availableHeight = viewportHeight - toolbarHeight - 100; // Leave some margin
      
      let finalHeight = newContainerHeight;
      if (newContainerHeight > availableHeight) {
        finalHeight = availableHeight;
      }
        updateElement(container.id, {
          properties: {
            ...properties, // Preserve ALL existing properties including backgroundImage, styles, etc.
            width: newContainerWidthPx,
            height: finalHeight,
            left: Math.round(newContainerLeft),
            // Keep existing top position and all other properties intact
          }
        });

        // Convert child element positions to percentages for responsive behavior
        convertContainerChildrenToPercentage(container.id, {
          convertPosition: true,
          convertDimensions: false, // Keep dimensions in pixels for now
          preserveAspectRatio: true
        });
    });
    
    } catch (error) {
      // console.error('❌ Error in adaptive container resize:', error);
    } finally {
      // Always reset the resizing flag
      isResizingRef.current = false;
    }
  }, [elements, updateElement, detectPanelsHidden, sidebarVisible, propertyPanelVisible]);

  // Effect to watch for panel visibility changes
  useEffect(() => {
    // Clear any existing timeout
    if (resizeTimeoutRef.current) {
      clearTimeout(resizeTimeoutRef.current);
    }
    
    // Debounce the resize operation
    resizeTimeoutRef.current = window.setTimeout(() => {
      resizeAndCenterContainers();
    }, 150); // Reduced debounce time for more responsive feel

    return () => {
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }
    };
  }, [sidebarVisible, propertyPanelVisible]); // Remove resizeAndCenterContainers from deps to prevent loops

  // Also listen for window resize events that might affect canvas width
  useEffect(() => {
    let windowResizeTimeout: number | null = null;
    
    const handleResize = () => {
      // Clear existing timeout
      if (windowResizeTimeout) {
        clearTimeout(windowResizeTimeout);
      }
      
      // Debounce the resize to avoid excessive updates
      windowResizeTimeout = window.setTimeout(() => {
        resizeAndCenterContainers();
      }, 500); // Longer debounce for window resize
    };

    // Manual trigger for testing
    const handleManualTrigger = () => {
      resizeAndCenterContainers();
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('manual-adaptive-resize', handleManualTrigger);
    
    // Expose resize function globally for testing
    (window as any).__pageBuilderResizeContainers = resizeAndCenterContainers;
    (window as any).__pageBuilderResetState = () => {
      isResizingRef.current = false;
      lastPanelState.current = '';
    };
    
    return () => {
      if (windowResizeTimeout) {
        clearTimeout(windowResizeTimeout);
      }
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('manual-adaptive-resize', handleManualTrigger);
      delete (window as any).__pageBuilderResizeContainers;
      delete (window as any).__pageBuilderResetState;
    };
  }, []); // Empty deps - only set up listeners once

  return {
    resizeAndCenterContainers,
    detectPanelsHidden,
    // Add a reset function for debugging
    resetState: () => {
      isResizingRef.current = false;
      lastPanelState.current = '';
    }
  };
};
