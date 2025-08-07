import React, { useRef, useEffect, useCallback, useMemo } from 'react';
import { useDraggable } from '@dnd-kit/core';
import { useBuilder } from '../hooks/useBuilder';
import type { Element } from '../types';
import { ContainerDropZone } from './ContainerDropZone';
import {
  ContainerResizeHandles,
  ContainerResizeTooltip
} from './components/container';
import { getContainerStyles } from './utils/container/containerStyles';
import { useContainerContextMenu } from './hooks/container/useContainerContextMenu';
import { useContainerResize } from './hooks/container/useContainerResize';
import { ContextMenu } from '../components/ContextMenu';

interface ResizableContainerProps {
  element: Element;
  isSelected: boolean;
  depth?: number;
  preventRecursion?: boolean;
  canvasWidth?: number;
  isPreviewMode?: boolean;
  isConstrained?: boolean;
  constraintType?: 'horizontal' | 'vertical' | 'both' | null;
  draggedElementId?: string | null;
  openImageChoiceModal?: (containerId: string, context?: 'ADD_ELEMENT' | 'SET_BACKGROUND') => void;
}

export const ResizableContainer: React.FC<ResizableContainerProps> = ({
  element,
  isSelected,
  depth = 0,
  isPreviewMode = false,
  isConstrained = false,
  constraintType = null,
  draggedElementId = null,
  openImageChoiceModal,
}) => {
  const { updateElement, selectElement } = useBuilder();
  const containerRef = useRef<HTMLDivElement>(null);
  const originalPosition = useRef<{ left: number; width: number } | null>(null);
  const [isHovered, setIsHovered] = React.useState(false);

  // Context menu functionality
  const {
    contextMenuOpen,
    contextMenuPosition,
    handleContextMenu,
    handleCloseContextMenu,
    // imageModalOpen,  // unused
    // setImageModalOpen,  // unused
    handleDuplicate,
    handleDelete,
    handleImageUpload,
    handleRemoveBackgroundImage,
    handleMoveElement,
    handleElementSettings,
  } = useContainerContextMenu({
    element,
    properties: element.properties,
    openImageChoiceModal,
  });

  // Resize functionality
  const {
    isResizing,
    resizeDataRef,
    startResize,
    getCursor,
    // localResizeState, // unused for now
  } = useContainerResize({
    element,
    depth,
    containerRef,
  });

  // Determine if this is a child container
  const isChildContainer = depth > 0;
  
  // Drag functionality - all containers use useDraggable but with different IDs and data
  // This ensures they can be dropped on any droppable container
  const { attributes, listeners, setNodeRef: setDragNodeRef, isDragging, transform } = useDraggable({
    id: isChildContainer ? `child-container-${element.id}` : `container-handle-${element.id}`,
    data: {
      type: 'element',
      elementId: element.id,
      parentId: element.parentId,
      dragSource: 'handle',
      isChildContainer: isChildContainer, // Flag to help identify child containers
    },
    disabled: isResizing || isPreviewMode,
  });

  // Combined ref for container only (no drag functionality on body)
  const combinedRef = useCallback((node: HTMLDivElement | null) => {
    containerRef.current = node;
    // Don't assign setDragNodeRef here since it's now on the drag handle
  }, []);

  // Keep original element in place during drag - overlay handles the visual feedback
  const dragStyles = useMemo(() => {
    if (isDragging) {
      // When dragging, keep element in place but provide subtle visual feedback
      return {
        transform: 'none', // Keep in place - overlay handles movement
        opacity: 0.5, // Make semi-transparent to show drag state
        zIndex: 'auto', // Normal z-index - overlay is elevated
        outline: '2px dashed #3b82f6', // Blue dashed outline
        backgroundColor: 'rgba(59, 130, 246, 0.05)', // Very subtle blue tint
      };
    }
    
    return {
      transform: 'none', // Keep original element in place
      opacity: 1, // Keep fully visible
      zIndex: 'auto', // Normal z-index
    };
  }, [isDragging]);
  
  // Store original position on mount
  useEffect(() => {
    const props = element.properties as any;
    originalPosition.current = {
      left: props.left || 0,
      width: props.width || 200,
    };
  }, [element.id]);

  // Cleanup reposition listeners on unmount
  // Removed cleanup - no longer needed

  // Effect: respond to isSelected changes - overflow prevention only
  const updateElementRef = useRef(updateElement);
  updateElementRef.current = updateElement;
  
  useEffect(() => {
    if (!containerRef.current || !originalPosition.current) return;
    const props = element.properties as any;
    const container = containerRef.current;
    const parent = container.parentElement;
    if (!parent) return;
    const parentRect = parent.getBoundingClientRect();
    const left = props.left || 0;
    const width = props.width || 200;
    const right = left + width;
    const availableWidth = parentRect.width;

    if (isSelected) {
      // If overflows right, adjust left/width
      if (right > availableWidth) {
        const newWidth = Math.max(100, availableWidth - left);
        updateElementRef.current(element.id, {
          properties: { ...props, width: newWidth }
        });
      }
      // If overflows left, adjust left
      if (left < 0) {
        updateElementRef.current(element.id, {
          properties: { ...props, left: 0 }
        });
      }
    }
    // REMOVED: Automatic restoration when deselected
    // This was causing manual resize changes to be overridden
    // The container should keep its user-resized dimensions
  }, [isSelected, element.id, element.properties.left, element.properties.width]);

  // Auto-resize to fit children - EXPAND ONLY, never shrink
  const { elements } = useBuilder();
  useEffect(() => {
    // TEMPORARILY DISABLED for debugging width collapse issue
    // TODO: Re-enable with proper manual resize detection
    return;
    
    // Only auto-resize for non-root containers
    if (depth === 0) return;
    const children = elements.filter(el => el.parentId === element.id);
    if (children.length === 0) return;
    
    // Calculate children bounds
    let minLeft = Infinity, minTop = Infinity, maxRight = -Infinity, maxBottom = -Infinity;
    children.forEach(child => {
      const left = Number(child.properties.left) || 0;
      const top = Number(child.properties.top) || 0;
      const width = Number(child.properties.width) || 0;
      const height = Number(child.properties.height) || 0;
      minLeft = Math.min(minLeft, left);
      minTop = Math.min(minTop, top);
      maxRight = Math.max(maxRight, left + width);
      maxBottom = Math.max(maxBottom, top + height);
    });
    
    const padding = 16;
    const currentWidth = Number(element.properties.width) || 200;
    const currentHeight = Number(element.properties.height) || 120;
    
    // Calculate required dimensions to fit children
    const requiredWidth = Math.max(40, maxRight - Math.min(0, minLeft) + padding);
    const requiredHeight = Math.max(40, maxBottom - Math.min(0, minTop) + padding);
    
    // Only EXPAND container if children don't fit, never shrink
    const newWidth = Math.max(currentWidth, requiredWidth);
    const newHeight = Math.max(currentHeight, requiredHeight);
    
    // Handle out-of-bounds children by shifting them
    if (minLeft < 0 || minTop < 0) {
      const shiftX = minLeft < 0 ? -minLeft : 0;
      const shiftY = minTop < 0 ? -minTop : 0;
      
      // Shift children to be within bounds
      children.forEach(child => {
        updateElement(child.id, {
          properties: {
            ...child.properties,
            left: (Number(child.properties.left) || 0) + shiftX,
            top: (Number(child.properties.top) || 0) + shiftY,
          }
        });
      });
      
      // Update container size and position
      updateElement(element.id, {
        properties: {
          ...element.properties,
          width: newWidth,
          height: newHeight,
          left: (element.properties.left || 0) + minLeft,
          top: (element.properties.top || 0) + minTop,
        }
      });
    } else {
      // Only update size if it needs to expand
      if (newWidth > currentWidth || newHeight > currentHeight) {
        updateElement(element.id, {
          properties: {
            ...element.properties,
            width: newWidth,
            height: newHeight,
          }
        });
      }
    }
  }, [elements, element.id, depth, updateElement]);

  const containerStyles = getContainerStyles(element);

  // Debug width collapse issue - trace all width changes
  useEffect(() => {
    const widthType = typeof element.properties.width;
    const isCalcExpression = typeof element.properties.width === 'string' && element.properties.width.includes('calc(');
    

    
    // CRITICAL: If width becomes undefined/null after being a number, this is the bug!
    if (element.properties.width === undefined || element.properties.width === null) {
      // console.error(`� CRITICAL BUG: Width became undefined/null!`, {
      //   elementId: element.id,
      //   depth,
      //   isSelected,
      //   allProperties: element.properties,
      //   stackTrace: new Error().stack
      // });
    }
    
    // If width changed to our fallback values, this indicates the property was cleared
    if (element.properties.width === 400 || element.properties.width === 200) {
      // console.warn(`⚠️ Width is fallback value (${element.properties.width}px) - property might have been cleared`, {
      //   elementId: element.id,
      //   depth,
      //   isSelected
      // });
    }
  }, [element.properties.width, element.properties.widthUnit, element.id, isSelected, depth]);

  // Debug background image
  React.useEffect(() => {
    if (element.properties.backgroundImage) {

    }
  }, [element.properties.backgroundImage, element.id]);

  if (isPreviewMode) {
    return (
      <div
        data-element-id={element.id}
        data-parent-id={element.parentId || undefined}
        style={{
          ...containerStyles,
          // Use block display for preview mode as well
          position: 'relative',
          marginBottom: '1rem',
          backgroundColor: 'transparent',
          cursor: 'default',
          pointerEvents: 'none',
          userSelect: 'none',
          outline: 'none',
          boxShadow: containerStyles.boxShadow || undefined,
          overflow: 'hidden',
        }}
      >
        {element.properties.backgroundColor && !element.properties.backgroundImage && (
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: element.properties.backgroundColor,
              borderRadius: element.properties.borderRadius ? `${element.properties.borderRadius}px` : undefined,
              zIndex: -1,
              pointerEvents: 'none',
            }}
          />
        )}
        <ContainerDropZone
          element={element}
          depth={depth}
          isPreviewMode={isPreviewMode}
          isConstrained={false}
          constraintType={null}
          draggedElementId={null}
        />
      </div>
    );
  }

  return (
    <>
      <div
        ref={combinedRef}
        data-element-id={element.id}
        data-parent-id={element.parentId || undefined}
        data-dnd-kit-dragging={isDragging ? 'true' : 'false'}
        data-drag-source="body"
        className={`resizable-container ${isSelected ? 'selected' : ''} ${element.type} ${element.properties.backgroundImage ? 'has-background-image' : ''} ${isDragging ? 'dragging' : ''}`}
        style={{
          // Apply containerStyles but EXCLUDE width/height and backgroundColor when there's a background image
          ...Object.fromEntries(
            Object.entries(containerStyles).filter(([key]) => {
              if (key === 'width' || key === 'height') return false;
              // Exclude backgroundColor if there's a background image to prevent conflicts
              if (key === 'backgroundColor' && element.properties.backgroundImage) return false;
              return true;
            })
          ),
          ...dragStyles, // Now returns empty styles to keep element stationary
          boxSizing: 'border-box',
          // FIXED: Properly handle calc() expressions and other CSS values
          width: typeof element.properties.width === 'number' 
            ? `${element.properties.width}px`
            : typeof element.properties.width === 'string'
              ? element.properties.width // Use string values directly (including calc())
              : '400px', // Fallback only for undefined/null
          height: typeof element.properties.height === 'number'
            ? `${element.properties.height}px`
            : typeof element.properties.height === 'string'
              ? element.properties.height // Use string values directly (including calc())
              : '200px', // Fallback only for undefined/null
          // EXTRA FORCE: Override any CSS class calc() expressions
          minWidth: 'unset',
          maxWidth: 'none',
          // FIXED: Top-level containers need absolute positioning to respect left/top coordinates
          position: (!element.parentId || depth > 0) ? 'absolute' : 'relative',
          left: (!element.parentId || depth > 0) ? (element.properties.left || 0) : undefined,
          top: (!element.parentId || depth > 0) ? (element.properties.top || 0) : undefined,
          marginBottom: depth === 0 && element.parentId ? '1rem' : undefined,
          // Apply background image styles properly - force with higher specificity if needed
          ...(element.properties.backgroundImage && {
            backgroundImage: element.properties.backgroundImage,
            backgroundSize: element.properties.backgroundSize || 'cover',
            backgroundPosition: element.properties.backgroundPosition || 'center',
            backgroundRepeat: element.properties.backgroundRepeat || 'no-repeat',
            // Ensure the background is visible
            minHeight: element.properties.height || '200px',
          }),
        }}
        onClick={(e) => {
          e.stopPropagation();
          selectElement(element.id);
        }}
        onContextMenu={handleContextMenu}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        // No body drag listeners - only handle drag is active
      >
        {/* Drag Handle - matching ElementWrapper style */}
        {!isPreviewMode && (
          <div
            ref={setDragNodeRef} // Connect the drag handle to the drag system
            {...attributes}
            {...listeners}
            data-drag-source="handle"
            className="absolute cursor-grab active:cursor-grabbing transition-all duration-150 hover:scale-110 drag-handle"
            style={{
              left: '-40px',
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 100000,
              backgroundColor: isDragging ? '#1d4ed8' : '#3b82f6',
              borderRadius: '8px',
              padding: '8px',
              boxShadow: isDragging
                ? '0 8px 25px rgba(59, 130, 246, 0.4), 0 4px 12px rgba(29, 78, 216, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)' 
                : '0 4px 15px rgba(59, 130, 246, 0.3), 0 2px 8px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.15)',
              border: isDragging ? '2px solid rgba(255, 255, 255, 0.9)' : '2px solid rgba(255, 255, 255, 0.7)',
              opacity: isSelected || isHovered || isDragging ? 1 : 0.7,
              transition: isDragging
                ? 'none'
                : 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              pointerEvents: 'auto',
              minWidth: '32px',
              minHeight: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backdropFilter: 'blur(8px)',
            }}
            onMouseEnter={(e) => {
              if (!isDragging) {
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(59, 130, 246, 0.4), 0 3px 10px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.25)';
                e.currentTarget.style.transform = 'translateY(-50%) scale(1.05)';
              }
            }}
            onMouseLeave={(e) => {
              if (!isDragging) {
                e.currentTarget.style.boxShadow = '0 4px 15px rgba(59, 130, 246, 0.3), 0 2px 8px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.15)';
                e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
              }
            }}
            title={isChildContainer ? "Arrastra para reordenar dentro del contenedor" : "Arrastra para mover al canvas"}
          >
            <div className="w-4 h-4 flex flex-col justify-center items-center space-y-px">
              <div className="w-1.5 h-0.5 bg-white rounded-full"></div>
              <div className="w-1.5 h-0.5 bg-white rounded-full"></div>
              <div className="w-1.5 h-0.5 bg-white rounded-full"></div>
              <div className="w-1.5 h-0.5 bg-white rounded-full"></div>
              <div className="w-1.5 h-0.5 bg-white rounded-full"></div>
              <div className="w-1.5 h-0.5 bg-white rounded-full"></div>
            </div>
          </div>
        )}

        {/* Selection Indicator - matching ElementWrapper style */}
        {isSelected && (
          <div 
            className="element-label"
            style={{ 
              position: 'fixed',
              top: '10px',
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 99999,
              backgroundColor: '#3b82f6',
              color: 'white',
              fontSize: '12px',
              fontWeight: 'bold',
              padding: '4px 8px',
              borderRadius: '4px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
              border: '1px solid rgba(255,255,255,0.2)',
              pointerEvents: 'none',
            }}
          >
            {element.name || element.type}
          </div>
        )}

        {element.properties.backgroundColor && !element.properties.backgroundImage && (
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: element.properties.backgroundColor,
              borderRadius: element.properties.borderRadius ? `${element.properties.borderRadius}px` : undefined,
              zIndex: -1,
              pointerEvents: 'none',
            }}
          />
        )}
        <ContainerDropZone
          element={element}
          depth={depth}
          isConstrained={isConstrained}
          constraintType={constraintType}
          draggedElementId={draggedElementId}
          openImageChoiceModal={openImageChoiceModal}
        />
        <ContainerResizeHandles
          isSelected={isSelected}
          onStartResize={startResize}
          getCursor={getCursor}
        />
        {/* Removed ContainerRepositionHandle - using ElementWrapper drag handle instead */}
      </div>
      <ContainerResizeTooltip
        isResizing={isResizing}
        resizeDataRef={resizeDataRef}
        containerRef={containerRef}
      />
      
      {/* Context Menu */}
      <ContextMenu
        isOpen={contextMenuOpen}
        onClose={handleCloseContextMenu}
        position={contextMenuPosition}
        element={element}
        onRemoveBackgroundImage={handleRemoveBackgroundImage}
        onSetBackgroundImage={handleImageUpload}
        onDeleteElement={handleDelete}
        onDuplicateElement={handleDuplicate}
        onMoveElement={handleMoveElement}
        onElementSettings={handleElementSettings}
      />
    </>
  );
};

/**
 * CONTAINER AUTO-RESIZE BEHAVIOR:
 * - EXPAND: Container grows when children extend beyond current bounds
 * - PRESERVE: Container maintains user-set dimensions when children are smaller
 * - SHIFT: Out-of-bounds children are moved inside container (with expansion if needed)
 * 
 * This ensures containers feel responsive to content while respecting user intent.
 */

export default ResizableContainer;
