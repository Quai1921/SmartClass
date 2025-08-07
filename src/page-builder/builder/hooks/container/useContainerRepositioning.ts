import { useState, useCallback, useEffect } from 'react';
import { useBuilder } from '../../../hooks/useBuilder';
import type { Element } from '../../../types';

interface UseContainerRepositioningProps {
  element: Element;
  properties: any;
  containerRef: React.RefObject<HTMLDivElement | null>;
}

export const useContainerRepositioning = ({ element, properties, containerRef }: UseContainerRepositioningProps) => {
  const { updateElement, moveElement } = useBuilder();
  
  // Repositioning states for green handle
  const [isRepositioning, setIsRepositioning] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  // Start repositioning - for green handle
  const startRepositioning = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!containerRef.current) return;
    
    
    // Get the element's current position in the viewport
    const rect = containerRef.current.getBoundingClientRect();
    
    // Calculate offset as the difference between mouse position and element's top-left corner
    const offsetX = e.clientX - rect.left;
    const offsetY = e.clientY - rect.top;
    
    setDragOffset({ x: offsetX, y: offsetY });
    setIsRepositioning(true);
    document.body.style.cursor = 'grabbing';
    document.body.style.userSelect = 'none';
  }, [element.id]);

  // Helper function to show drop indicator for containers
  const showDropIndicator = useCallback((parentEl: HTMLElement, insertIndex: number, flexDirection: string, display: string, parentElementData?: any) => {
    // Remove existing indicator and grid overlay
    const existingIndicator = document.querySelector('.drop-indicator');
    const existingGridOverlay = document.querySelector('.grid-overlay');
    if (existingIndicator) {
      existingIndicator.remove();
    }
    if (existingGridOverlay) {
      existingGridOverlay.remove();
    }

    // Create new drop indicator
    const containerContent = parentEl.querySelector('.container-content') || parentEl;
    const siblings = Array.from(containerContent.children).filter(child => 
      child.hasAttribute('data-element-id') && child.getAttribute('data-element-id') !== element.id
    ) as HTMLElement[];

    if (display === 'grid') {
      // Grid layout - show grid overlay
      const gridOverlay = document.createElement('div');
      gridOverlay.className = 'grid-overlay';
      
      const cols = parentElementData?.properties?.gridColumns || 2;
      const rows = Math.ceil((siblings.length + 1) / cols);
      
      gridOverlay.style.cssText = `
        position: absolute; top: 0; left: 0; right: 0; bottom: 0;
        pointer-events: none; z-index: 10003;
        display: grid; grid-template-columns: repeat(${cols}, 1fr);
        grid-template-rows: repeat(${rows}, 1fr); gap: 8px; padding: 8px;
        background: rgba(59, 130, 246, 0.1);
        border: 2px dashed #3b82f6;
      `;
      
      // Add grid cell indicators
      for (let i = 0; i < cols * rows; i++) {
        const cell = document.createElement('div');
        cell.style.cssText = `
          border: 1px dashed #3b82f6; background: rgba(59, 130, 246, 0.05);
          ${i === insertIndex ? 'background: rgba(59, 130, 246, 0.3); border-color: #1d4ed8; border-width: 2px;' : ''}
        `;
        gridOverlay.appendChild(cell);
      }
      
      containerContent.appendChild(gridOverlay);
    } else {
      // Flex layout - show line indicator
      const indicator = document.createElement('div');
      indicator.className = 'drop-indicator';
      
      if (flexDirection === 'row' || flexDirection === 'row-reverse') {
        indicator.classList.add('drop-indicator--vertical');
        
        if (insertIndex === 0 && siblings[0]) {
          const firstRect = siblings[0].getBoundingClientRect();
          const containerRect = containerContent.getBoundingClientRect();
          indicator.style.left = `${firstRect.left - containerRect.left - 2}px`;
          indicator.style.top = `${firstRect.top - containerRect.top}px`;
          indicator.style.height = `${firstRect.height}px`;
        } else if (insertIndex >= siblings.length && siblings[siblings.length - 1]) {
          const lastRect = siblings[siblings.length - 1].getBoundingClientRect();
          const containerRect = containerContent.getBoundingClientRect();
          indicator.style.left = `${lastRect.right - containerRect.left + 2}px`;
          indicator.style.top = `${lastRect.top - containerRect.top}px`;
          indicator.style.height = `${lastRect.height}px`;
        } else if (siblings[insertIndex]) {
          const beforeRect = siblings[insertIndex].getBoundingClientRect();
          const containerRect = containerContent.getBoundingClientRect();
          indicator.style.left = `${beforeRect.left - containerRect.left - 2}px`;
          indicator.style.top = `${beforeRect.top - containerRect.top}px`;
          indicator.style.height = `${beforeRect.height}px`;
        }
      } else {
        indicator.classList.add('drop-indicator--horizontal');
        
        if (insertIndex === 0 && siblings[0]) {
          const firstRect = siblings[0].getBoundingClientRect();
          const containerRect = containerContent.getBoundingClientRect();
          indicator.style.left = `${firstRect.left - containerRect.left}px`;
          indicator.style.top = `${firstRect.top - containerRect.top - 2}px`;
          indicator.style.width = `${firstRect.width}px`;
        } else if (insertIndex >= siblings.length && siblings[siblings.length - 1]) {
          const lastRect = siblings[siblings.length - 1].getBoundingClientRect();
          const containerRect = containerContent.getBoundingClientRect();
          indicator.style.left = `${lastRect.left - containerRect.left}px`;
          indicator.style.top = `${lastRect.bottom - containerRect.top + 2}px`;
          indicator.style.width = `${lastRect.width}px`;
        } else if (siblings[insertIndex]) {
          const beforeRect = siblings[insertIndex].getBoundingClientRect();
          const containerRect = containerContent.getBoundingClientRect();
          indicator.style.left = `${beforeRect.left - containerRect.left}px`;
          indicator.style.top = `${beforeRect.top - containerRect.top - 2}px`;
          indicator.style.width = `${beforeRect.width}px`;
        }
      }
      
      containerContent.appendChild(indicator);
    }
  }, [element.id]);

  // Helper function to hide drop indicator
  const hideDropIndicator = useCallback(() => {
    const indicator = document.querySelector('.drop-indicator');
    const gridOverlay = document.querySelector('.grid-overlay');
    
    if (indicator) {
      indicator.remove();
    }
    if (gridOverlay) {
      gridOverlay.remove();
    }
  }, []);

  // Handle repositioning for child containers - similar to ResizableWidget
  useEffect(() => {
    if (!isRepositioning) return;
    
    const onMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      
      if (element.parentId) {
        // For child containers inside parent containers, use relative positioning within parent bounds
        const parentEl = document.querySelector(`[data-element-id="${element.parentId}"]`) as HTMLElement;
        if (parentEl) {
          const containerContent = parentEl.querySelector('.container-content') || parentEl;
          const contentRect = containerContent.getBoundingClientRect();
          
          // Calculate new position relative to parent content area
          const newLeft = e.clientX - contentRect.left - dragOffset.x;
          const newTop = e.clientY - contentRect.top - dragOffset.y;
          
          // Get container dimensions to apply bounds checking
          const containerWidth = properties.width || 200;
          const containerHeight = properties.height || 200;
          
          // Apply bounds checking to keep container within parent (with some padding)
          const parentPadding = 10; // Leave some padding from edges
          const maxLeft = Math.max(0, contentRect.width - containerWidth - parentPadding);
          const maxTop = Math.max(0, contentRect.height - containerHeight - parentPadding);
          
          const boundedLeft = Math.max(parentPadding, Math.min(newLeft, maxLeft));
          const boundedTop = Math.max(parentPadding, Math.min(newTop, maxTop));
          
          // Update element position within parent
          updateElement(element.id, {
            properties: {
              ...properties,
              position: 'absolute',
              left: Math.round(boundedLeft),
              top: Math.round(boundedTop)
            }
          });
        }
      } else {
        // For canvas-level containers, use absolute positioning
        let newLeft = e.clientX - dragOffset.x;
        let newTop = e.clientY - dragOffset.y;
        
        // Convert to canvas coordinates if we have a canvas element
        const canvas = document.querySelector('[data-canvas]') as HTMLElement;
        if (canvas) {
          const canvasRect = canvas.getBoundingClientRect();
          newLeft = newLeft - canvasRect.left;
          newTop = newTop - canvasRect.top;
          
          // Apply basic bounds checking
          newLeft = Math.max(0, newLeft);
          newTop = Math.max(0, newTop);
        }
        
        updateElement(element.id, { 
          properties: { 
            ...properties, 
            left: Math.round(newLeft), 
            top: Math.round(newTop)
          } 
        });
      }
    };
    
    const onMouseUp = () => {
      setIsRepositioning(false);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
      hideDropIndicator();
    };
    
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
    
    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };
  }, [isRepositioning, dragOffset, element.id, element.parentId, properties, updateElement, moveElement]);

  return {
    isRepositioning,
    startRepositioning,
    showDropIndicator,
    hideDropIndicator
  };
};
