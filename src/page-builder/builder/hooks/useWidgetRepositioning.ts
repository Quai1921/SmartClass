import { useState, useCallback, useRef, useEffect } from 'react';
import { useBuilder } from '../../hooks/useBuilder';
import type { Element } from '../../types';

interface UseWidgetRepositioningProps {
  element: Element;
  widgetRef: React.RefObject<HTMLDivElement | null>;
}

export const useWidgetRepositioning = ({ element, widgetRef }: UseWidgetRepositioningProps) => {
  const { updateElement } = useBuilder();
  
  const [isRepositioning, setIsRepositioning] = useState(false);
  const dragStartPosition = useRef({ x: 0, y: 0 });
  const originalPosition = useRef({ left: 0, top: 0 });

  const startRepositioning = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!widgetRef.current) return;
    
    
    // Store original position
    const props = element.properties as any;
    originalPosition.current = {
      left: props.left || 0,
      top: props.top || 0,
    };
    
    dragStartPosition.current = { x: e.clientX, y: e.clientY };
    setIsRepositioning(true);
    
    document.body.style.cursor = 'grabbing';
    document.body.style.userSelect = 'none';
    
    // Add visual feedback - semi-transparent and pulsating
    if (widgetRef.current) {
      widgetRef.current.style.opacity = '0.7';
      widgetRef.current.style.zIndex = '1000';
      widgetRef.current.style.animation = 'pulse 1s ease-in-out infinite alternate';
    }
  }, [element.id, element.properties]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isRepositioning || !widgetRef.current) return;
    
    const deltaX = e.clientX - dragStartPosition.current.x;
    const deltaY = e.clientY - dragStartPosition.current.y;
    
    const newLeft = originalPosition.current.left + deltaX;
    const newTop = originalPosition.current.top + deltaY;
    
    // Apply boundary constraints if element has a parent
    let constrainedLeft = newLeft;
    let constrainedTop = newTop;
    
    if (element.parentId) {
      const containerElement = document.querySelector(
        `[data-element-id="${element.parentId}"] .container-dropzone`
      ) as HTMLElement;
      
      if (containerElement) {
        const containerRect = containerElement.getBoundingClientRect();
        const widgetRect = widgetRef.current.getBoundingClientRect();
        
        const padding = 10;
        const minX = padding;
        const minY = padding;
        const maxX = Math.max(padding, containerRect.width - widgetRect.width - padding);
        const maxY = Math.max(padding, containerRect.height - widgetRect.height - padding);
        
        constrainedLeft = Math.max(minX, Math.min(maxX, newLeft));
        constrainedTop = Math.max(minY, Math.min(maxY, newTop));
      }
    }
    
    // Update element position in real-time
    updateElement(element.id, {
      properties: {
        ...element.properties,
        left: constrainedLeft,
        top: constrainedTop,
      },
    });
  }, [isRepositioning, element.id, element.parentId, element.properties, updateElement]);

  const handleMouseUp = useCallback(() => {
    if (!isRepositioning) return;
    
    setIsRepositioning(false);
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
    
    // Remove visual feedback
    if (widgetRef.current) {
      widgetRef.current.style.opacity = '';
      widgetRef.current.style.zIndex = '';
      widgetRef.current.style.animation = '';
    }
    
    // Remove global event listeners
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  }, [isRepositioning, element.id, handleMouseMove]);

  // Add global event listeners when repositioning starts
  useEffect(() => {
    if (isRepositioning) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isRepositioning, handleMouseMove, handleMouseUp]);

  return {
    isRepositioning,
    startRepositioning,
  };
};
