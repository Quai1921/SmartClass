import React, { useState, useCallback, useRef, useMemo } from 'react';
import { useDraggable } from '@dnd-kit/core';
import { Move } from 'lucide-react';
import { useBuilder } from '../hooks/useBuilder';
import type { Element } from '../types';
import { ElementRenderer } from './ElementRenderer';
import { ContextMenu } from '../components/ContextMenu';
import { ImageUploadModal } from '../components/ImageWidget';
import { useResizeHandlers } from './hooks/useResizeHandlers';
import { useInlineEditing } from './hooks/useInlineEditing';
import { useSelectionBorder } from './hooks/useSelectionBorder';
import { ResizeHandles } from './components/ResizeHandles';
import { InlineEditor } from './components/InlineEditor';
import { getElementStyles } from '../utils/elementStyles';

interface ResizableWidgetProps {
  element: Element;
  isSelected: boolean;
  isPreviewMode?: boolean; // Add preview mode prop
  isConstrained?: boolean; // New prop for boundary constraint feedback
  constraintType?: 'horizontal' | 'vertical' | 'both' | null;
}

export const ResizableWidget: React.FC<ResizableWidgetProps> = ({
  element,
  isSelected,
  isPreviewMode = false, // Default to false
  isConstrained = false,
  constraintType = null,
}) => {
  if (!element) {
    // console.error('[ResizableWidget] element is undefined/null!', element);
    return <div style={{ color: 'red' }}>Error: element is undefined/null</div>;
  }
  if (!element.properties) {
    // console.error('[ResizableWidget] element.properties is undefined!', element);
    return <div style={{ color: 'red' }}>Error: element.properties is undefined</div>;
  }
  const { updateElement, selectElement } = useBuilder();
  const widgetRef = useRef<HTMLDivElement>(null);
  const properties = element.properties;

  const safe = (prop: any, fallback: any, label: string): any => {
    if (prop === undefined) {
      return fallback;
    }
    return prop;
  };

  // Context menu states
  const [contextMenuOpen, setContextMenuOpen] = useState(false);
  const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });
  const [imageModalOpen, setImageModalOpen] = useState(false);
  // Custom hooks for functionality
  const { isResizing, startResize, getCursor } = useResizeHandlers(element, widgetRef);
  const { triggerBorderUpdate } = useSelectionBorder(element, isSelected, widgetRef);
  const {
    isEditing,
    editText,
    setEditText,
    handleDoubleClick,
    handleEditingComplete,
    handleEditingKeyDown
  } = useInlineEditing(element, triggerBorderUpdate, isSelected);

  // Check if this is a connection node that should not be draggable by body
  const isConnectionNode = element.type === 'connection-text-node' || element.type === 'connection-image-node';

  // Check if we should disable drag entirely (when resizing)
  const shouldDisableDrag = isResizing || isEditing || 
                           document.body.getAttribute('data-disable-drag') === 'true' ||
                           (window as any).__RESIZE_IN_PROGRESS__ ||
                           (window as any).__GLOBAL_RESIZE_BLOCK__;

  // Drag functionality with transform handling
  const dragType = 'element';
  
  const { attributes, listeners, setNodeRef: setDragNodeRef, isDragging, transform } = useDraggable({
    id: element.id,
    data: {
      type: dragType,
      elementId: element.id,
      parentId: element.parentId,
    },
    disabled: shouldDisableDrag, // Enhanced disable logic
  });

  // NUCLEAR OPTION: Custom listeners that completely block resize handle interactions
  const nuclearFilteredListeners = useMemo(() => {
    if (isConnectionNode) {
      return {}; // Connection nodes don't use body drag
    }
    
    const originalListeners = listeners || {};
    
    // Create completely custom event handlers that check for resize handles
    return {
      onPointerDown: (e: React.PointerEvent) => {
        const target = e.target as HTMLElement;
        
        // Check global flags
        if (document.body.getAttribute('data-resize-starting') === 'true' ||
            document.body.getAttribute('data-disable-drag') === 'true' ||
            document.body.getAttribute('data-global-resize-active') === 'true' ||
            (window as any).__RESIZE_IN_PROGRESS__ ||
            (window as any).__GLOBAL_RESIZE_BLOCK__) {
          e.preventDefault();
          e.stopPropagation();
          e.nativeEvent.stopImmediatePropagation();
          return;
        }
        
        // Check if target is resize handle
        if (target.hasAttribute('data-resize-handle') ||
            target.hasAttribute('data-no-drag') ||
            target.hasAttribute('data-resize-in-progress') ||
            target.hasAttribute('data-block-all-drag') ||
            target.classList.contains('resize-handle')) {
          e.preventDefault();
          e.stopPropagation();
          e.nativeEvent.stopImmediatePropagation();
          return;
        }
        
        // Check parent elements for resize markers
        let currentElement = target;
        while (currentElement && currentElement !== document.body) {
          if (currentElement.hasAttribute('data-resize-handle') ||
              currentElement.hasAttribute('data-no-drag') ||
              currentElement.hasAttribute('data-resize-in-progress') ||
              currentElement.hasAttribute('data-block-all-drag') ||
              currentElement.classList.contains('resize-handle')) {
            e.preventDefault();
            e.stopPropagation();
            e.nativeEvent.stopImmediatePropagation();
            return;
          }
          currentElement = currentElement.parentElement!;
        }
        
        // Check proximity to resize handles
        const widgetElement = e.currentTarget as HTMLElement;
        const resizeHandles = widgetElement.querySelectorAll('[data-resize-handle="true"]');
        const clickX = e.clientX;
        const clickY = e.clientY;
        
        for (const handle of resizeHandles) {
          const handleRect = handle.getBoundingClientRect();
          const distance = Math.sqrt(
            Math.pow(clickX - (handleRect.left + handleRect.width / 2), 2) +
            Math.pow(clickY - (handleRect.top + handleRect.height / 2), 2)
          );
          
          if (distance < 50) {
            e.preventDefault();
            e.stopPropagation();
            e.nativeEvent.stopImmediatePropagation();
            return;
          }
        }
        
        // Call original handler if all checks pass
        if (originalListeners.onPointerDown) {
          originalListeners.onPointerDown(e);
        }
      },
      
      onMouseDown: (e: React.MouseEvent) => {
        const target = e.target as HTMLElement;
        
        if (document.body.getAttribute('data-resize-starting') === 'true' ||
            document.body.getAttribute('data-disable-drag') === 'true' ||
            document.body.getAttribute('data-global-resize-active') === 'true' ||
            (window as any).__RESIZE_IN_PROGRESS__ ||
            (window as any).__GLOBAL_RESIZE_BLOCK__) {
          e.preventDefault();
          e.stopPropagation();
          e.nativeEvent.stopImmediatePropagation();
          return;
        }
        
        if (target.hasAttribute('data-resize-handle') ||
            target.hasAttribute('data-no-drag') ||
            target.hasAttribute('data-resize-in-progress') ||
            target.hasAttribute('data-block-all-drag') ||
            target.classList.contains('resize-handle') ||
            target.closest('[data-resize-handle="true"]') ||
            target.closest('[data-no-drag="true"]') ||
            target.closest('[data-resize-in-progress="true"]') ||
            target.closest('[data-block-all-drag="true"]') ||
            target.closest('.resize-handle')) {
          e.preventDefault();
          e.stopPropagation();
          e.nativeEvent.stopImmediatePropagation();
          return;
        }
        
        if (originalListeners.onMouseDown) {
          originalListeners.onMouseDown(e);
        }
      },
      
      onDragStart: (e: React.DragEvent) => {
        
        // Block drag start completely if any resize indicators are present
        if (document.body.getAttribute('data-resize-starting') === 'true' ||
            document.body.getAttribute('data-disable-drag') === 'true' ||
            document.body.getAttribute('data-global-resize-active') === 'true' ||
            (window as any).__RESIZE_IN_PROGRESS__ ||
            (window as any).__GLOBAL_RESIZE_BLOCK__) {
          e.preventDefault();
          e.stopPropagation();
          e.nativeEvent.stopImmediatePropagation();
          return false;
        }
        
        const target = e.target as HTMLElement;
        if (target.hasAttribute('data-resize-handle') ||
            target.hasAttribute('data-no-drag') ||
            target.hasAttribute('data-resize-in-progress') ||
            target.hasAttribute('data-block-all-drag') ||
            target.classList.contains('resize-handle') ||
            target.closest('[data-resize-handle="true"]')) {
          e.preventDefault();
          e.stopPropagation();
          e.nativeEvent.stopImmediatePropagation();
          return false;
        }
        
        if (originalListeners.onDragStart) {
          return originalListeners.onDragStart(e);
        }
      }
    };
  }, [isConnectionNode, listeners]);

  // Conditionally apply drag attributes and listeners
  const dragProps = shouldDisableDrag ? {} : {
    ...attributes,
    ...nuclearFilteredListeners
  };

  // Combined ref for drag and widget (stable reference)
  const combinedRef = useCallback((node: HTMLDivElement | null) => {
    widgetRef.current = node;
    setDragNodeRef(node);
  }, [setDragNodeRef]); // Include setDragNodeRef as dependency  // Get computed styles for the widget using shared utility (memoized)
  // For connection nodes, don't apply visual styles to wrapper since they handle their own styling
  const computedStyles = useMemo(() => {
    if (isConnectionNode) {
      // Only apply positioning and essential layout styles, not visual appearance
      return {
        position: 'absolute' as const,
        left: `${element.properties.left || 0}px`,
        top: `${element.properties.top || 0}px`,
        width: 'auto',
        height: 'auto',
        zIndex: 1050, // Higher z-index for connection nodes
      };
    }
    return getElementStyles(element, false);
  }, [element, isConnectionNode]);

  // Apply drag transform if dragging (memoized with stable dependency)
  const dragStyles = useMemo(() => {
    const hasTransform = isDragging && transform && (transform.x !== 0 || transform.y !== 0);

    // Base drag styles
    let styles: React.CSSProperties = {};

    if (hasTransform) {
      styles.transform = `translate3d(${transform.x}px, ${transform.y}px, 0)`;
      styles.opacity = 0.7;
      styles.animation = 'pulse 1s ease-in-out infinite alternate';
    } else if (isDragging) {
      styles.opacity = 0.7;
      styles.animation = 'pulse 1s ease-in-out infinite alternate';
    }

    return styles;
  }, [isDragging, transform?.x, transform?.y, isConstrained, constraintType]);

  // Combine computed styles with drag styles (memoized with stable key)
  const finalStyles = useMemo(() => {
    const styles = {
      ...computedStyles,
      ...dragStyles,
      userSelect: isEditing ? 'text' : 'none',
    } as React.CSSProperties;

    return styles;
  }, [computedStyles, dragStyles, isEditing]);

  // Context menu handlers
  const handleCloseContextMenu = useCallback(() => {
    setContextMenuOpen(false);
  }, []);

  const handleDelete = useCallback(() => {
    // Implementation for delete
    setContextMenuOpen(false);
  }, []);

  const handleDuplicate = useCallback(() => {
    // Implementation for duplicate
    setContextMenuOpen(false);
  }, []);

  const handleRightClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenuPosition({ x: e.clientX, y: e.clientY });
    setContextMenuOpen(true);
  }, []);

  const handleImageSelect = useCallback((src: string, _alt?: string) => {
    updateElement(element.id, {
      properties: {
        ...properties,
        backgroundImage: `url(${src})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      },
    });
    setImageModalOpen(false);
  }, [element.id, properties, updateElement]);

  // In preview mode, render a simplified version without interaction capabilities
  if (isPreviewMode) {
    return (
      <div
        data-element-id={element.id}
        data-element-type={element.type}
        style={{
          position: 'absolute',
          left: `${safe(properties.left, 0, 'left')}px`,
          top: `${safe(properties.top, 0, 'top')}px`,
          width: properties.width ? 
            (typeof properties.width === 'number' ? `${properties.width}px` : properties.width) : 
            'auto',
          height: properties.height ? 
            (typeof properties.height === 'number' ? `${properties.height}px` : properties.height) : 
            'auto',
          zIndex: safe(properties.zIndex, 1, 'zIndex'),
          pointerEvents: 'none',
          userSelect: 'none'
        }}
      >
        <ElementRenderer 
          element={element} 
          isSelected={false} 
          isPreviewMode={true} 
        />
      </div>
    );
  }

  // Main wrapper div with combined ref and styles


  return (
    <div
      ref={combinedRef}
      className={`widget-resizable${isSelected ? ' selected' : ''}`}
      data-container-id={element.id}
      data-drag-source="body"
      {...dragProps}
      style={{
        position: 'absolute',
        left: safe(Number(properties.left), 0, 'left'),
        top: safe(Number(properties.top), 0, 'top'),
        width: safe(Number(properties.width), 'auto', 'width'),
        height: safe(Number(properties.height), 'auto', 'height'),
        zIndex: safe(Number(properties.zIndex), 1, 'zIndex'),
        transform: isDragging ? `translate(${transform?.x || 0}px, ${transform?.y || 0}px)` : 'none',
        cursor: isDragging ? 'grabbing' : 'grab',
        userSelect: 'none',
        ...getElementStyles(element, false),
      }}
      onDoubleClick={handleDoubleClick}
      onClick={(e) => {
        e.stopPropagation();
        selectElement(element.id, e.ctrlKey || e.metaKey);
      }}
      onContextMenu={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setContextMenuPosition({ x: e.clientX, y: e.clientY });
        setContextMenuOpen(true);
      }}
      data-element-id={element.id}
      data-element-type={element.type}
    >
      {/* Inner Element Renderer */}
      <ElementRenderer element={element} isSelected={isSelected} />

      {/* Selection Border and Resize Handles */}
      {isSelected && !isPreviewMode && !isEditing && (
        <ResizeHandles
          onStartResize={startResize}
          getCursor={getCursor}
          isSelected={isSelected}
        />
      )}

      {/* Drag Handle - Standard left-side drag handle for all elements */}
      {isSelected && !isPreviewMode && !shouldDisableDrag && (
        <div
          {...attributes}
          {...listeners}
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
            opacity: isSelected || isDragging ? 1 : 0.7,
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
          data-drag-source="handle"
          title="Arrastra para mover este elemento"
        >
          <Move size={16} strokeWidth={2.5} color="white" />
        </div>
      )}

      {/* Inline Editor */}
      {isSelected && isEditing && (
        <InlineEditor
          editText={editText}
          setEditText={setEditText}
          onComplete={handleEditingComplete}
          onKeyDown={handleEditingKeyDown}
          isEditing={isEditing}
        />
      )}

      {/* Context Menu */}
      <ContextMenu
        isOpen={contextMenuOpen}
        onClose={() => setContextMenuOpen(false)}
        position={contextMenuPosition}
        element={element}
        onDeleteElement={handleDelete}
        onDuplicateElement={handleDuplicate}
        onSetBackgroundImage={() => setImageModalOpen(true)}
      />

      {/* Image Upload Modal */}
      {imageModalOpen && (
        <ImageUploadModal
          isOpen={imageModalOpen}
          onClose={() => setImageModalOpen(false)}
          onImageSelect={(url: string) => {
            updateElement(element.id, { properties: { src: url } });
          }}
        />
      )}
    </div>
  );
};
