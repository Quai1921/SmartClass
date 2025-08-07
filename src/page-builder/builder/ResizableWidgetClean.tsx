import React, { useState, useCallback, useRef, useMemo, useEffect } from 'react';
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
  const { updateElement, selectElement } = useBuilder();
  const widgetRef = useRef<HTMLDivElement>(null);
  const properties = element.properties;

  // Context menu states
  const [contextMenuOpen, setContextMenuOpen] = useState(false);
  const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });
  const [imageModalOpen, setImageModalOpen] = useState(false);

  // Custom hooks for functionality
  // Debug logging to see element type


  // MutationObserver to force auto-width for audio-true-false
  useEffect(() => {
    if (element.type === 'audio-true-false' && widgetRef.current) {
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
            const target = mutation.target as HTMLElement;
            if (target === widgetRef.current) {
              target.style.width = 'auto';
              target.style.height = 'auto';
              target.style.display = 'inline-flex';
              target.style.flexGrow = '0';
              target.style.flexShrink = '0';
              target.style.maxWidth = 'none';
            }
          }
        });
      });

      observer.observe(widgetRef.current, {
        attributes: true,
        attributeFilter: ['style', 'class']
      });

      return () => observer.disconnect();
    }
  }, [element.type]);
  const { isResizing, startResize, getCursor } = useResizeHandlers(element, widgetRef);
  const { triggerBorderUpdate } = useSelectionBorder(element, isSelected, widgetRef);
  const {
    isEditing,
    editText,
    setEditText,
    handleDoubleClick,
    handleEditingComplete,
    handleEditingKeyDown
  } = useInlineEditing(element, triggerBorderUpdate);

  // Check if this is a connection node that should not be draggable by body
  const isConnectionNode = element.type === 'connection-text-node' || element.type === 'connection-image-node';
  
  // Check if connection node is connected (connected nodes shouldn't be draggable to prevent position conflicts)
  const isConnectedNode = isConnectionNode && (element.properties as any).connectionState === 'connected';

  // Debug connection node drag state
  if (isConnectionNode) {

  }

  // Drag functionality with transform handling
  const { attributes, listeners, setNodeRef: setDragNodeRef, isDragging, transform } = useDraggable({
    id: element.id,
    data: {
      type: 'element',
      elementId: element.id,
      parentId: element.parentId,
    },
    disabled: isResizing || isEditing || isConnectedNode, // Disable drag for connected connection nodes
  });

  // Combined ref for drag and widget (stable reference)
  const combinedRef = useCallback((node: HTMLDivElement | null) => {
    widgetRef.current = node;
    setDragNodeRef(node);
  }, [setDragNodeRef]); // Include setDragNodeRef as dependency

  // Get computed styles for the widget using shared utility (memoized)
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
    
    const styles = getElementStyles(element, false);
    
    // Debug logging for audio-true-false styles
    if (element.type === 'audio-true-false') {

    }
    
    return styles;
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
          left: `${properties.left || 0}px`,
          top: `${properties.top || 0}px`,
          width: properties.width ? 
            (typeof properties.width === 'number' ? `${properties.width}px` : properties.width) : 
            'auto',
          height: properties.height ? 
            (typeof properties.height === 'number' ? `${properties.height}px` : properties.height) : 
            'auto',
          zIndex: properties.zIndex || 1,
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

  return (
    <>
      <div
        ref={combinedRef}
        data-element-id={element.id}
        data-element-type={element.type}
        data-dnd-kit-dragging={isDragging ? 'true' : 'false'}
        data-drag-source="body"
        className={`widget-resizable ${element.type === 'button' ? 'widget-button' : ''} ${isSelected ? 'selected' : ''} ${element.properties.widthUnit === 'max-content' ? 'width-max-content' : ''
          } ${element.properties.heightUnit === 'max-content' ? 'height-max-content' : ''
          } ${isDragging ? 'dragging' : ''} ${isDragging && isConstrained ? 'widget-constrained' : ''
          } ${isDragging && isConstrained && constraintType === 'horizontal' ? 'widget-constrained-horizontal' : ''
          } ${isDragging && isConstrained && constraintType === 'vertical' ? 'widget-constrained-vertical' : ''
          } ${isResizing ? 'resizing' : ''}`}
        onClick={(e) => {
          e.stopPropagation();
          selectElement(element.id);
        }}
        onDoubleClick={handleDoubleClick}
        onContextMenu={handleRightClick}
        style={{
          ...finalStyles,
          // Add CSS custom properties for interactive widgets (except audio-true-false)
          // REMOVED: CSS custom properties - use direct width/height instead
        }}
        // Add drag listeners to the main element for body dragging (repositioning)
        // But NOT for connection nodes - they should only be draggable by handles
        {...(isConnectionNode ? attributes : {
          ...listeners,
          ...attributes,
          onMouseDown: (e: React.MouseEvent) => {
            // Check if the click is on a resize handle - if so, don't start drag
            const target = e.target as HTMLElement;
            const isResizeHandle = target.classList.contains('resize-handle') ||
              target.closest('.resize-handle');

            if (isResizeHandle) {
              return; // Don't start drag if clicking on resize handle
            }

            // Start drag for non-connection elements
            if (listeners?.onMouseDown) {
              listeners.onMouseDown(e as any);
            }
          }
        })}
      >
        {/* Element Content */}
        {isEditing ? (
          <InlineEditor
            isEditing={isEditing}
            editText={editText}
            setEditText={setEditText}
            onComplete={handleEditingComplete}
            onKeyDown={handleEditingKeyDown}
          />
        ) : (
          <ElementRenderer element={element} isSelected={isSelected} />
        )}

        {/* Resize Handles - Disable for audio-true-false */}
        {(() => {
          const shouldShowHandles = element.type !== 'audio-true-false';
          console.log('🔍 ResizeHandles condition:', {
            elementType: element.type,
            shouldShowHandles,
            condition: element.type !== 'audio-true-false'
          });
          return shouldShowHandles;
        })() && (
          <ResizeHandles
            isSelected={isSelected}
            onStartResize={startResize}
            getCursor={getCursor}
          />
        )}

        {/* Blue repositioning handle for widgets inside containers - matching ElementWrapper style */}
        {element.parentId && isSelected && (
          <div
            data-drag-source="handle"
            style={{
              position: 'absolute',
              top: '-18px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '32px',
              height: '18px',
              minWidth: '32px',
              minHeight: '18px',
              maxWidth: '32px',
              maxHeight: '18px',
              background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
              border: '2px solid rgba(255, 255, 255, 0.9)',
              cursor: 'move',
              borderRadius: '6px',
              zIndex: isConnectionNode ? 1050 : 10004,
              boxShadow: '0 2px 8px rgba(59, 130, 246, 0.3), 0 1px 4px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '10px',
              fontWeight: '500',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              userSelect: 'none',
              boxSizing: 'border-box',
              backdropFilter: 'blur(6px)',
              margin: '0',
              padding: '0',
              outline: 'none',
              textDecoration: 'none',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'linear-gradient(135deg, #1d4ed8, #1e40af)';
              e.currentTarget.style.transform = 'translateX(-50%) scale(1.1)';
              e.currentTarget.style.boxShadow = '0 5px 16px rgba(59, 130, 246, 0.4), 0 2px 8px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'linear-gradient(135deg, #3b82f6, #2563eb)';
              e.currentTarget.style.transform = 'translateX(-50%)';
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(59, 130, 246, 0.3), 0 1px 4px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.4)';
            }}
            {...listeners}
            {...attributes}
          >
            <Move size={10} strokeWidth={2.5} />
          </div>
        )}
      </div>

      {/* Context Menu */}
      {contextMenuOpen && (
        <ContextMenu
          isOpen={contextMenuOpen}
          position={contextMenuPosition}
          onClose={handleCloseContextMenu}
          element={element}
          onDeleteElement={handleDelete}
          onDuplicateElement={handleDuplicate}
          onSetBackgroundImage={() => setImageModalOpen(true)}
        />
      )}

      {/* Image Upload Modal */}
      <ImageUploadModal
        isOpen={imageModalOpen}
        onClose={() => setImageModalOpen(false)}
        onImageSelect={handleImageSelect}
      />
    </>
  );
};
