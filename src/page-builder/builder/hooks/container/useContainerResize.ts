import { useState, useCallback, useRef, useEffect } from 'react';
import { useBuilder } from '../../../hooks/useBuilder';
import type { Element } from '../../../types';

export type ResizeHandle = 'n' | 'ne' | 'e' | 'se' | 's' | 'sw' | 'w' | 'nw';

interface UseContainerResizeProps {
  element: Element;
  depth: number;
  containerRef: React.RefObject<HTMLDivElement | null>;
  onManualChange?: () => void; // Callback to track manual changes
}

export const useContainerResize = ({ element, depth, containerRef, onManualChange }: UseContainerResizeProps) => {
  const { updateElement, propertyPanelVisible, selectedElementId, elements, sidebarVisible } = useBuilder();
  const { properties } = element;

  // Resize state - using useRef to avoid stale closures
  const [isResizing, setIsResizing] = useState(false);
  const resizeDataRef = useRef<{
    handle: ResizeHandle;
    startX: number;
    startY: number;
    startWidth: number;
    startHeight: number;
    startLeft: number;
    startTop: number;
    // Cache expensive calculations to avoid recalculating on every mouse move
    constraints: {
      maxWidth: number;
      maxHeight: number;
      maxRight: number;
      maxBottom: number;
      minWidth: number;
      minHeight: number;
    };
  } | null>(null);
    // LOCAL resize state to avoid context updates during resize
  const [localResizeState, setLocalResizeState] = useState<{
    elementId: string | null;
    dimensions: { width: number; height: number } | null;
    isResizing: boolean;
  }>({
    elementId: null,
    dimensions: null,
    isResizing: false,
  });

  // Throttle resize updates to improve performance
  const throttleResizeUpdate = useCallback(() => {
    let lastUpdate = 0;
    const THROTTLE_DELAY = 16; // ~60fps

    return (updateFn: () => void) => {
      const now = Date.now();
      if (now - lastUpdate >= THROTTLE_DELAY) {
        updateFn();
        lastUpdate = now;
      }
    };
  }, []);
  
  const throttledUpdate = useRef(throttleResizeUpdate());

  // Throttling for debug logs
  let lastLogTime = 0;
  const LOG_THROTTLE_MS = 1000; // Only log every 1000ms (1 second)

  // Calculate constraints once to avoid expensive recalculation on every mouse move
  const calculateConstraints = useCallback(() => {
    // Minimum resize: apply reasonable minimums for all containers
    const minWidth = depth > 0 ? 100 : 200; // Nested: 100px, Root: 200px
    const minHeight = depth > 0 ? 60 : 100; // Nested: 60px, Root: 100px

    // Initialize constraints
    let maxWidth = Infinity;
    let maxHeight = Infinity;
    let maxRight = Infinity;
    let maxBottom = Infinity;
    
    // Parent constraints
    if (element.parentId) {
      const parentEl = document.querySelector(`[data-element-id="${element.parentId}"]`) as HTMLElement;
      if (parentEl) {
        // Calculate parent's inner bounds (accounting for padding)
        const parentStyle = window.getComputedStyle(parentEl);
        const parentPaddingLeft = parseFloat(parentStyle.paddingLeft) || 0;
        const parentPaddingTop = parseFloat(parentStyle.paddingTop) || 0;
        const parentPaddingRight = parseFloat(parentStyle.paddingRight) || 0;
        const parentPaddingBottom = parseFloat(parentStyle.paddingBottom) || 0;
        
        // Get parent's inner dimensions (content area)
        const parentInnerWidth = parentEl.offsetWidth - parentPaddingLeft - parentPaddingRight;
        const parentInnerHeight = parentEl.offsetHeight - parentPaddingTop - parentPaddingBottom;
        
        // Set max constraints
        maxWidth = parentInnerWidth;
        maxHeight = parentInnerHeight;
        maxRight = parentInnerWidth;
        maxBottom = parentInnerHeight;
      }
    }

    // Canvas boundary constraints for root-level containers
    if (depth === 0) {
      // Calculate dynamic canvas width based on current UI state
      const totalWidth = window.innerWidth;
      const sidebarWidth = sidebarVisible ? 360 : 0;
      
      // Calculate property panel width based on selected element type
      let propertyPanelWidth = 0;
      if (propertyPanelVisible) {
        const selectedElement = elements.find(el => el.id === selectedElementId);
        if (selectedElement?.type) { // Add type guard
          const isTextElement = selectedElement.type === 'text' || 
                               selectedElement.type === 'heading' || 
                               selectedElement.type === 'paragraph';
          const isButtonElement = selectedElement.type === 'button';
          const needsWidePanel = isTextElement || isButtonElement;
          const baseWidth = needsWidePanel ? 450 : 350;
          propertyPanelWidth = Math.max(300, Math.min(baseWidth, window.innerWidth * 0.45));
        }
      }
      
      const dynamicCanvasWidth = totalWidth - sidebarWidth - propertyPanelWidth;
      
      // For root level containers, canvas provides the boundary
      // Canvas has 32px left + 32px right = 64px total padding
      const contentAreaWidth = dynamicCanvasWidth - 64;
      
      maxRight = Math.min(maxRight, contentAreaWidth);
      maxWidth = Math.min(maxWidth, contentAreaWidth);
    }

    return {
      maxWidth,
      maxHeight,
      maxRight,
      maxBottom,
      minWidth,
      minHeight
    };
  }, [element.parentId, depth, sidebarVisible, propertyPanelVisible, elements, selectedElementId]);

  // Start resize - completely new approach
  const startResize = useCallback((handle: ResizeHandle, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
      if (!containerRef.current) return;    
    // Get actual computed dimensions - always use offsetWidth/offsetHeight for resize start
    // since CSS keywords like 'max-content' need to be resolved to actual pixel values
    let currentWidth = containerRef.current.offsetWidth;
    let currentHeight = containerRef.current.offsetHeight;
    
    // SAFEGUARD: If dimensions are 0, use reasonable defaults before starting resize
    // This can happen with empty containers using CSS keywords like max-content
    const minWidth = depth > 0 ? 100 : 200;
    const minHeight = depth > 0 ? 60 : 100;
    
    if (currentWidth === 0) {
      // console.warn(`🔧 Container ${element.id} has zero width, using minimum:`, minWidth);
      currentWidth = minWidth;
    }
    if (currentHeight === 0) {
      // console.warn(`🔧 Container ${element.id} has zero height, using minimum:`, minHeight);
      currentHeight = minHeight;
    }
    
    // DEBUGGING: Check if container has zero dimensions before resize
    if (currentWidth === 0 || currentHeight === 0) {
      // console.error(`🚨 CONTAINER HAS ZERO DIMENSIONS BEFORE RESIZE:`, {
      //   element: element.id,
      //   properties: { width: properties.width, height: properties.height, widthUnit: properties.widthUnit, heightUnit: properties.heightUnit },
      //   offsetDimensions: { width: currentWidth, height: currentHeight },
      //   computedStyles: {
      //     width: window.getComputedStyle(containerRef.current).width,
      //     height: window.getComputedStyle(containerRef.current).height,
      //     display: window.getComputedStyle(containerRef.current).display,
      //     position: window.getComputedStyle(containerRef.current).position
      //   },
      //   containerRect: containerRef.current.getBoundingClientRect()
      // });
    }

    // Calculate constraints once at the start to avoid expensive recalculation on every mouse move
    const constraints = calculateConstraints();

    // Store resize data in ref to avoid stale closures
    resizeDataRef.current = {
      handle,
      startX: e.clientX,
      startY: e.clientY,
      startWidth: currentWidth,
      startHeight: currentHeight,
      startLeft: properties.left || 0,
      startTop: properties.top || 0,
      constraints
    };
      setIsResizing(true);
    // Update local resize state instead of global context
    setLocalResizeState({
      elementId: element.id,
      dimensions: { width: currentWidth, height: currentHeight },
      isResizing: true,
    });
    
    document.body.style.cursor = getCursor(handle);
    document.body.style.userSelect = 'none';
  }, [element.id, properties.left, properties.top, properties.width, properties.height]);

  // Handle resize - enhanced logic for better containment
  const handleResize = useCallback((e: MouseEvent) => {
    if (!isResizing || !resizeDataRef.current || !containerRef.current) return;
    const { handle, startX, startY, startWidth, startHeight, startLeft, startTop, constraints } = resizeDataRef.current;
    
    // Calculate raw deltas
    const rawDX = e.clientX - startX;
    const rawDY = e.clientY - startY;
    
    // Signed deltas for north (positive up) and west (positive left)
    const northDY = startY - e.clientY;
    const westDX = startX - e.clientX;
    
    // Use cached constraints - no more expensive calculations on every mouse move!
    const { minWidth, minHeight, maxWidth, maxHeight, maxRight, maxBottom } = constraints;
    
    // Initialize with starting values
    let newWidth = startWidth;
    let newHeight = startHeight;
    let newLeft = startLeft;
    let newTop = startTop;
    
    // Calculate resize based on handle
    switch (handle) {
      case 'n':
        // Calculate desired values
        let northHeight = Math.max(minHeight, startHeight + northDY);
        let northTop = startTop - northDY;
        
        // Apply containment - prevent moving out of top boundary
        if (northTop < 0) {
          northTop = 0;
          northHeight = startHeight + startTop; // Adjust height
        }
        
        newHeight = Math.min(northHeight, maxHeight);
        newTop = northTop;
        break;
        
      case 'ne':
        // Handle north direction
        let neHeight = Math.max(minHeight, startHeight + northDY);
        let neTop = startTop - northDY;
        
        // Apply top containment
        if (neTop < 0) {
          neTop = 0;
          neHeight = startHeight + startTop;
        }
        
        // Handle east direction
        let neWidth = Math.max(minWidth, startWidth + rawDX);
        
        // Apply right containment
        if (startLeft + neWidth > maxRight) {
          neWidth = maxRight - startLeft;
        }
        
        newWidth = Math.min(neWidth, maxWidth);
        newHeight = Math.min(neHeight, maxHeight);
        newTop = neTop;
        break;
        
      case 'e':
        let eastWidth = Math.max(minWidth, startWidth + rawDX);
        
        // Apply right containment
        if (startLeft + eastWidth > maxRight) {
          eastWidth = maxRight - startLeft;
        }
        
        newWidth = Math.min(eastWidth, maxWidth);
        break;
        
      case 'se':
        // Handle south direction (bottom edge)
        let seHeight = Math.max(minHeight, startHeight + rawDY);
        
        // Apply bottom containment
        if (startTop + seHeight > maxBottom) {
          seHeight = maxBottom - startTop;
        }
        
        // Handle east direction (right edge)
        let seWidth = Math.max(minWidth, startWidth + rawDX);
        
        // Apply right containment
        if (startLeft + seWidth > maxRight) {
          seWidth = maxRight - startLeft;
        }
        
        newWidth = Math.min(seWidth, maxWidth);
        newHeight = Math.min(seHeight, maxHeight);
        break;
        
      case 's':
        let southHeight = Math.max(minHeight, startHeight + rawDY);
        
        // Apply bottom containment
        if (startTop + southHeight > maxBottom) {
          southHeight = maxBottom - startTop;
        }
        
        newHeight = Math.min(southHeight, maxHeight);
        break;
        
      case 'sw':
        // Handle south direction
        let swHeight = Math.max(minHeight, startHeight + rawDY);
        
        // Apply bottom containment
        if (startTop + swHeight > maxBottom) {
          swHeight = maxBottom - startTop;
        }
        
        // Handle west direction
        let swWidth = Math.max(minWidth, startWidth + westDX);
        let swLeft = startLeft - westDX;
        
        // Apply left containment
        if (swLeft < 0) {
          swLeft = 0;
          swWidth = startLeft + startWidth; // Adjust width
        }
        
        newWidth = Math.min(swWidth, maxWidth);
        newHeight = Math.min(swHeight, maxHeight);
        newLeft = swLeft;
        break;
        
      case 'w':
        let westWidth = Math.max(minWidth, startWidth + westDX);
        let westLeft = startLeft - westDX;
        
        // Apply left containment
        if (westLeft < 0) {
          westLeft = 0;
          westWidth = startLeft + startWidth;
        }
        
        newWidth = Math.min(westWidth, maxWidth);
        newLeft = westLeft;
        break;
        
      case 'nw':
        // Handle north direction
        let nwHeight = Math.max(minHeight, startHeight + northDY);
        let nwTop = startTop - northDY;
        
        // Apply top containment
        if (nwTop < 0) {
          nwTop = 0;
          nwHeight = startHeight + startTop;
        }
        
        // Handle west direction
        let nwWidth = Math.max(minWidth, startWidth + westDX);
        let nwLeft = startLeft - westDX;
        
        // Apply left containment
        if (nwLeft < 0) {
          nwLeft = 0;
          nwWidth = startLeft + startWidth;
        }
        
        newWidth = Math.min(nwWidth, maxWidth);
        newHeight = Math.min(nwHeight, maxHeight);
        newLeft = nwLeft;
        newTop = nwTop;
        break;
    }
    
    // Log calculated dimensions and positions after all constraints applied
    const now = Date.now();
    if (now - lastLogTime >= LOG_THROTTLE_MS) {
      lastLogTime = now;
    }
    
    // Apply visual feedback if we hit constraints
    if (containerRef.current) {
      // Check if we had to enforce constraints (we did if we hit min/max values)
      const hitConstraints =        newWidth === minWidth ||
        newHeight === minHeight ||
        newLeft === 0 || 
        newTop === 0 ||
        (element.parentId && (
          newWidth === maxWidth || 
          newHeight === maxHeight ||
          newLeft + newWidth >= maxRight - 1 ||  // -1 for numerical precision
          newTop + newHeight >= maxBottom - 1
        ));
        
      if (hitConstraints) {
        // Add a temporary visual indicator when hitting boundaries
        containerRef.current.style.boxShadow = '0 0 0 2px #ff6b6b, 0 0 10px rgba(255, 107, 107, 0.3)';
        setTimeout(() => {
          if (containerRef.current) {
            containerRef.current.style.boxShadow = '';
          }
        }, 150);
      }
    }
    
    // Apply changes immediately
    containerRef.current.style.width = `${newWidth}px`;    containerRef.current.style.height = `${newHeight}px`;
    containerRef.current.style.left = `${newLeft}px`;
    containerRef.current.style.top = `${newTop}px`;
    
    // Update local resize state instead of global context
    setLocalResizeState({
      elementId: element.id,
      dimensions: { width: newWidth, height: newHeight },
      isResizing: true,
    });
  }, [isResizing, element.id, element.parentId, depth]);

  // End resize
  const endResize = useCallback(() => {
    if (!isResizing || !resizeDataRef.current || !containerRef.current) {
      return;
    }
    
    const finalWidth = parseFloat(containerRef.current.style.width);
    const finalHeight = parseFloat(containerRef.current.style.height);
    const finalLeft = parseFloat(containerRef.current.style.left) || properties.left || 0;
    const finalTop = parseFloat(containerRef.current.style.top) || properties.top || 0;
    
    // Update element
    const updatedProperties = {
      ...properties,
      // ensure we persist absolute positioning so left/top are applied
      position: properties.position || 'absolute',
      width: finalWidth,
      height: finalHeight,
      widthUnit: 'px' as const,
      heightUnit: 'px' as const,
    };

    // Always store final position
    updatedProperties.left = finalLeft;
    updatedProperties.top = finalTop;

    // Use immediate update for resize completion to prevent conflicts
    updateElement(element.id, { properties: updatedProperties });
    
    // Track manual change for restoration logic
    onManualChange?.();
      // Cleanup - only local state updates
    setLocalResizeState({
      elementId: null,
      dimensions: null,
      isResizing: false,
    });
    setIsResizing(false);
    resizeDataRef.current = null;
    // Robust cleanup: always reset global styles
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
    // Remove any global attributes used for resizing
    document.body.removeAttribute('data-resizing');
    document.body.removeAttribute('data-resize-starting');
    document.body.removeAttribute('data-disable-drag');
    (window as any).__RESIZE_IN_PROGRESS__ = false;
    // Remove event listeners in case mouseup happened outside window
    document.removeEventListener('mousemove', handleResize);
    document.removeEventListener('mouseup', endResize);
    document.removeEventListener('mouseleave', endResize);
    document.removeEventListener('pointerup', endResize);
    document.removeEventListener('pointercancel', endResize);
  }, [isResizing, properties, updateElement, element.id, onManualChange, handleResize]);

  // Event listeners
  useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleResize);
      document.addEventListener('mouseup', endResize);
      // Add extra listeners for robustness
      document.addEventListener('mouseleave', endResize);
      document.addEventListener('pointerup', endResize);
      document.addEventListener('pointercancel', endResize);
      return () => {
        document.removeEventListener('mousemove', handleResize);
        document.removeEventListener('mouseup', endResize);
        document.removeEventListener('mouseleave', endResize);
        document.removeEventListener('pointerup', endResize);
        document.removeEventListener('pointercancel', endResize);
      };
    }
    return undefined;
  }, [isResizing, handleResize, endResize]);

  // Failsafe global cleanup
  useEffect(() => {
    const failsafeMouseUp = (e: MouseEvent) => {
      if (isResizing) {
        endResize();
      }
    };
    window.addEventListener('mouseup', failsafeMouseUp);
    return () => window.removeEventListener('mouseup', failsafeMouseUp);
  }, [isResizing, endResize]);

  // Get cursor for handle
  const getCursor = (handle: ResizeHandle): string => {
    const cursors = {
      n: 'ns-resize', ne: 'ne-resize', e: 'ew-resize', se: 'se-resize',
      s: 'ns-resize', sw: 'sw-resize', w: 'ew-resize', nw: 'nw-resize',
    };
    return cursors[handle];
  };
  return {
    isResizing,
    resizeDataRef,
    startResize,
    getCursor,
    localResizeState
  };
};
