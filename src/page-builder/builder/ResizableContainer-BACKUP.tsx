import React, { useState, useCallback, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useBuilder } from '../hooks/useBuilder';
import type { Element } from '../types';
import { ContainerDropZone } from './ContainerDropZone';
import { ContextMenu } from '../components/ContextMenu';
import { ImageUploadModal } from '../components/ImageWidget';

interface ResizableContainerProps {
  element: Element;
  isSelected: boolean;
  depth?: number;
  preventRecursion?: boolean;
}

type ResizeHandle = 'n' | 'ne' | 'e' | 'se' | 's' | 'sw' | 'w' | 'nw';

export const ResizableContainer: React.FC<ResizableContainerProps> = ({
  element,
  isSelected,
  depth = 0,
}) => {
  const { updateElement, removeElement, selectElement } = useBuilder(); // Removed setResizeState
  const containerRef = useRef<HTMLDivElement>(null);
    // Simple resize state
  const [isResizing, setIsResizing] = useState(false);
  const [resizeHandle, setResizeHandle] = useState<ResizeHandle | null>(null);
  const [initialMousePos, setInitialMousePos] = useState({ x: 0, y: 0 });
  const [initialRect, setInitialRect] = useState({ 
    width: 0, 
    height: 0, 
    left: 0, 
    top: 0, 
    right: 0, 
    bottom: 0 
  });
  
  // Context menu states
  const [contextMenuOpen, setContextMenuOpen] = useState(false);
  const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });
  const [imageModalOpen, setImageModalOpen] = useState(false);
  
  const { properties } = element;

  // Start resize
  const startResize = useCallback((handle: ResizeHandle, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    

      setIsResizing(true);
    setResizeHandle(handle);
    setInitialMousePos({ x: e.clientX, y: e.clientY });
    setInitialRect({
      width: rect.width,
      height: rect.height,
      left: properties.left || 0,
      top: properties.top || 0,
      right: (properties.left || 0) + rect.width,
      bottom: (properties.top || 0) + rect.height
    });
    
    // Notify global state
    // setResizeState(element.id, { width: rect.width, height: rect.height }, true); // REMOVED - no longer used
    
    document.body.style.cursor = getCursor(handle);
    document.body.style.userSelect = 'none';
  }, [element.id, properties.left, properties.top]); // Removed setResizeState dependency
  // Handle resize
  const handleResize = useCallback((e: MouseEvent) => {
    if (!isResizing || !resizeHandle || !containerRef.current) return;
    
    const deltaX = e.clientX - initialMousePos.x;
    const deltaY = e.clientY - initialMousePos.y;

    
    // Calculate new dimensions based on handle - with proper constraints
    let newWidth = initialRect.width;
    let newHeight = initialRect.height;
    let newLeft = initialRect.left;
    let newTop = initialRect.top;
    
    const minWidth = 50;
    const minHeight = 30;
      // Handle resize logic with proper boundary calculations
    switch (resizeHandle) {
      case 'n': // North - resize from bottom edge
        const newHeightN = initialRect.height - deltaY;
        if (newHeightN >= minHeight) {
          newHeight = newHeightN;
          if (properties.position === 'absolute' || properties.position === 'fixed') {
            newTop = initialRect.bottom - newHeight; // Calculate top from bottom boundary
          }
        }
        break;
        
      case 'ne': // Northeast - resize from bottom-left corner
        const newWidthNE = initialRect.width + deltaX;
        const newHeightNE = initialRect.height - deltaY;
        if (newWidthNE >= minWidth) {
          newWidth = newWidthNE;
        }
        if (newHeightNE >= minHeight) {
          newHeight = newHeightNE;
          if (properties.position === 'absolute' || properties.position === 'fixed') {
            newTop = initialRect.bottom - newHeight; // Calculate from bottom
          }
        }
        break;
        
      case 'e': // East - resize from left edge
        const newWidthE = initialRect.width + deltaX;
        if (newWidthE >= minWidth) {
          newWidth = newWidthE;
        }
        break;
        
      case 'se': // Southeast - resize from top-left corner (standard)
        const newWidthSE = initialRect.width + deltaX;
        const newHeightSE = initialRect.height + deltaY;
        if (newWidthSE >= minWidth) {
          newWidth = newWidthSE;
        }
        if (newHeightSE >= minHeight) {
          newHeight = newHeightSE;
        }
        break;
        
      case 's': // South - resize from top edge
        const newHeightS = initialRect.height + deltaY;
        if (newHeightS >= minHeight) {
          newHeight = newHeightS;
        }
        break;
        
      case 'sw': // Southwest - resize from top-right corner
        const newWidthSW = initialRect.width - deltaX;
        const newHeightSW = initialRect.height + deltaY;
        if (newWidthSW >= minWidth) {
          newWidth = newWidthSW;
          if (properties.position === 'absolute' || properties.position === 'fixed') {
            newLeft = initialRect.right - newWidth; // Calculate from right boundary
          }
        }
        if (newHeightSW >= minHeight) {
          newHeight = newHeightSW;
        }
        break;
        
      case 'w': // West - resize from right edge
        const newWidthW = initialRect.width - deltaX;
        if (newWidthW >= minWidth) {
          newWidth = newWidthW;
          if (properties.position === 'absolute' || properties.position === 'fixed') {
            newLeft = initialRect.right - newWidth; // Calculate from right boundary
          }
        }
        break;
        
      case 'nw': // Northwest - resize from bottom-right corner
        const newWidthNW = initialRect.width - deltaX;
        const newHeightNW = initialRect.height - deltaY;
        if (newWidthNW >= minWidth) {
          newWidth = newWidthNW;
          if (properties.position === 'absolute' || properties.position === 'fixed') {
            newLeft = initialRect.right - newWidth; // Calculate from right boundary
          }
        }
        if (newHeightNW >= minHeight) {
          newHeight = newHeightNW;
          if (properties.position === 'absolute' || properties.position === 'fixed') {
            newTop = initialRect.bottom - newHeight; // Calculate from bottom boundary
          }
        }
        break;
    }
    

    
    // Apply visual changes immediately with explicit pixel values
    containerRef.current.style.width = `${newWidth}px`;
    containerRef.current.style.height = `${newHeight}px`;
    
    // Only update position for absolute/fixed elements
    if (properties.position === 'absolute' || properties.position === 'fixed') {
      containerRef.current.style.left = `${newLeft}px`;
      containerRef.current.style.top = `${newTop}px`;
    }
    
    // Update live dimensions for property panel
    // setResizeState(element.id, { width: newWidth, height: newHeight }, true); // REMOVED - no longer used
    
    // Update tooltip with current dimensions
    const tooltip = document.querySelector('.resize-tooltip');
    if (tooltip) {
      tooltip.textContent = `${Math.round(newWidth)}px × ${Math.round(newHeight)}px`;
    }
  }, [isResizing, resizeHandle, initialMousePos, initialRect, properties.position, element.id]); // Removed setResizeState dependency
  // End resize
  const endResize = useCallback(() => {
    if (!isResizing || !containerRef.current) return;
    
    // Get final computed dimensions from the element
    const computedStyles = window.getComputedStyle(containerRef.current);
    const finalWidth = parseFloat(computedStyles.width);
    const finalHeight = parseFloat(computedStyles.height);
    
    // Get final position from style or computed styles
    let finalLeft = properties.left || 0;
    let finalTop = properties.top || 0;
    
    if (properties.position === 'absolute' || properties.position === 'fixed') {
      finalLeft = parseFloat(containerRef.current.style.left) || properties.left || 0;
      finalTop = parseFloat(containerRef.current.style.top) || properties.top || 0;
    }
    

      // Prepare update object
    const updatedProperties = {
      ...properties,
      width: finalWidth,
      height: finalHeight,
      widthUnit: 'px' as const,
      heightUnit: 'px' as const,
    };
    
    // Only include position updates for positioned elements
    if (properties.position === 'absolute' || properties.position === 'fixed') {
      updatedProperties.left = finalLeft;
      updatedProperties.top = finalTop;
    }
    
    // Update element properties
    const updates: Partial<Element> = {
      properties: updatedProperties
    };
    
    updateElement(element.id, updates);
    
    // Clear resize state
    // setResizeState(null, null, false); // REMOVED - no longer used
    setIsResizing(false);
    setResizeHandle(null);
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
    

  }, [isResizing, resizeHandle, initialRect, properties, updateElement, element.id]); // Removed setResizeState dependency

  // Mouse event listeners
  useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleResize);
      document.addEventListener('mouseup', endResize);
      return () => {
        document.removeEventListener('mousemove', handleResize);
        document.removeEventListener('mouseup', endResize);
      };
    }
  }, [isResizing, handleResize, endResize]);

  // Get cursor for handle
  const getCursor = (handle: ResizeHandle): string => {
    const cursors = {
      n: 'ns-resize',
      ne: 'ne-resize', 
      e: 'ew-resize',
      se: 'se-resize',
      s: 'ns-resize',
      sw: 'sw-resize',
      w: 'ew-resize',
      nw: 'nw-resize',
    };
    return cursors[handle];
  };

  // Context menu handlers
  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenuPosition({ x: e.clientX, y: e.clientY });
    setContextMenuOpen(true);
  }, []);

  const handleCloseContextMenu = useCallback(() => {
    setContextMenuOpen(false);
  }, []);

  const handleDuplicate = useCallback(() => {
    setContextMenuOpen(false);
  }, []);

  const handleDelete = useCallback(() => {
    removeElement(element.id);
    setContextMenuOpen(false);
  }, [element.id, removeElement]);

  const handleImageUpload = useCallback(() => {
    setImageModalOpen(true);
    setContextMenuOpen(false);
  }, []);

  // Container styles
  const containerStyles: React.CSSProperties = {
    position: properties.position || 'relative',
    width: properties.width ? `${properties.width}${properties.widthUnit || 'px'}` : 'auto',
    height: properties.height ? `${properties.height}${properties.heightUnit || 'px'}` : 'auto',
    minWidth: properties.minWidth ? `${properties.minWidth}px` : undefined,
    minHeight: properties.minHeight ? `${properties.minHeight}px` : undefined,
    maxWidth: properties.maxWidth ? `${properties.maxWidth}px` : undefined,
    maxHeight: properties.maxHeight ? `${properties.maxHeight}px` : undefined,
    left: (properties.position === 'absolute' || properties.position === 'fixed') ? `${properties.left || 0}px` : undefined,
    top: (properties.position === 'absolute' || properties.position === 'fixed') ? `${properties.top || 0}px` : undefined,
    padding: properties.padding ? `${properties.padding}px` : '16px',
    margin: properties.margin ? `${properties.margin}px` : undefined,
    backgroundColor: properties.backgroundColor || 'transparent',
    borderRadius: properties.borderRadius ? `${properties.borderRadius}px` : undefined,
    flexDirection: properties.flexDirection || undefined,
    justifyContent: properties.justifyContent || undefined,
    alignItems: properties.alignItems || undefined,
    gap: properties.gap ? `${properties.gap}px` : undefined,
    zIndex: properties.zIndex || undefined,
  };

  return (
    <>
      <div
        ref={containerRef}
        data-element-id={element.id}
        className={`resizable-container ${isSelected ? 'selected' : ''} ${element.type}`}
        style={containerStyles}
        onClick={(e) => {
          e.stopPropagation();
          selectElement(element.id);
        }}
        onContextMenu={handleContextMenu}
      >
        <ContainerDropZone
          element={element}
          depth={depth}
        />
          {/* Resize Handles */}
        {isSelected && (
          <>
            {/* Visual feedback during resize */}
            {isResizing && (
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  border: '2px dashed #007acc',
                  backgroundColor: 'rgba(0, 122, 204, 0.1)',
                  pointerEvents: 'none',
                  zIndex: 999,
                }}
              />
            )}
            
            {/* Corner handles */}
            <div
              className="resize-handle corner nw"
              onMouseDown={(e) => startResize('nw', e)}
              style={{
                position: 'absolute',
                top: '-6px',
                left: '-6px',
                width: '12px',
                height: '12px',
                backgroundColor: '#007acc',
                border: '2px solid #fff',
                borderRadius: '2px',
                cursor: 'nw-resize',
                zIndex: 1000,
                boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
              }}
            />
            <div
              className="resize-handle corner ne"
              onMouseDown={(e) => startResize('ne', e)}
              style={{
                position: 'absolute',
                top: '-6px',
                right: '-6px',
                width: '12px',
                height: '12px',
                backgroundColor: '#007acc',
                border: '2px solid #fff',
                borderRadius: '2px',
                cursor: 'ne-resize',
                zIndex: 1000,
                boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
              }}
            />
            <div
              className="resize-handle corner se"
              onMouseDown={(e) => startResize('se', e)}
              style={{
                position: 'absolute',
                bottom: '-6px',
                right: '-6px',
                width: '12px',
                height: '12px',
                backgroundColor: '#007acc',
                border: '2px solid #fff',
                borderRadius: '2px',
                cursor: 'se-resize',
                zIndex: 1000,
                boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
              }}
            />
            <div
              className="resize-handle corner sw"
              onMouseDown={(e) => startResize('sw', e)}
              style={{
                position: 'absolute',
                bottom: '-6px',
                left: '-6px',
                width: '12px',
                height: '12px',
                backgroundColor: '#007acc',
                border: '2px solid #fff',
                borderRadius: '2px',
                cursor: 'sw-resize',
                zIndex: 1000,
                boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
              }}
            />
            
            {/* Edge handles */}
            <div
              className="resize-handle edge n"
              onMouseDown={(e) => startResize('n', e)}
              style={{
                position: 'absolute',
                top: '-4px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '24px',
                height: '8px',
                backgroundColor: '#007acc',
                border: '1px solid #fff',
                borderRadius: '4px',
                cursor: 'ns-resize',
                zIndex: 1000,
                boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
              }}
            />
            <div
              className="resize-handle edge s"
              onMouseDown={(e) => startResize('s', e)}
              style={{
                position: 'absolute',
                bottom: '-4px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '24px',
                height: '8px',
                backgroundColor: '#007acc',
                border: '1px solid #fff',
                borderRadius: '4px',
                cursor: 'ns-resize',
                zIndex: 1000,
                boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
              }}
            />
            <div
              className="resize-handle edge w"
              onMouseDown={(e) => startResize('w', e)}
              style={{
                position: 'absolute',
                top: '50%',
                left: '-4px',
                transform: 'translateY(-50%)',
                width: '8px',
                height: '24px',
                backgroundColor: '#007acc',
                border: '1px solid #fff',
                borderRadius: '4px',
                cursor: 'ew-resize',
                zIndex: 1000,
                boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
              }}
            />
            <div
              className="resize-handle edge e"
              onMouseDown={(e) => startResize('e', e)}
              style={{
                position: 'absolute',
                top: '50%',
                right: '-4px',
                transform: 'translateY(-50%)',
                width: '8px',
                height: '24px',
                backgroundColor: '#007acc',
                border: '1px solid #fff',
                borderRadius: '4px',
                cursor: 'ew-resize',
                zIndex: 1000,
                boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
              }}
            />
          </>
        )}
      </div>      {/* Resize tooltip */}
      {isResizing && createPortal(
        <div
          className="resize-tooltip"
          style={{
            position: 'fixed',
            top: initialMousePos.y - 40,
            left: initialMousePos.x + 20,
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
            color: 'white',
            padding: '8px 12px',
            borderRadius: '6px',
            fontSize: '12px',
            fontFamily: 'monospace',
            zIndex: 10000,
            pointerEvents: 'none',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
            border: '1px solid rgba(255,255,255,0.2)',
            whiteSpace: 'nowrap',
          }}
        >
          <div style={{ fontWeight: 'bold', marginBottom: '2px' }}>
            {resizeHandle?.toUpperCase()} Resize
          </div>
          <div>
            {containerRef.current ? 
              `${Math.round(parseFloat(containerRef.current.style.width || '0'))}px × ${Math.round(parseFloat(containerRef.current.style.height || '0'))}px`
              : 'Loading...'
            }
          </div>
        </div>,
        document.body
      )}

      {/* Context Menu */}
      {contextMenuOpen && (
        <ContextMenu
          isOpen={contextMenuOpen}
          onClose={handleCloseContextMenu}
          position={contextMenuPosition}
          element={element}
          onDeleteElement={handleDelete}
          onDuplicateElement={handleDuplicate}
          onSetBackgroundImage={handleImageUpload}
        />
      )}

      {/* Image Upload Modal */}
      {imageModalOpen && (
        <ImageUploadModal
          isOpen={imageModalOpen}
          onClose={() => setImageModalOpen(false)}
          onImageSelect={(imageUrl) => {
            updateElement(element.id, {
              properties: {
                ...properties,
                backgroundImage: `url(${imageUrl})`,
              }
            });
            setImageModalOpen(false);
          }}
        />
      )}
    </>
  );
};

// Default export for better compatibility
export default ResizableContainer;
