import React, { useMemo, useCallback, useState } from 'react';
import { useDraggable } from '@dnd-kit/core';
import { Move } from 'lucide-react';
import type { Element } from '../types';
import { useBuilder } from '../hooks/useBuilder';
import type { Element } from '../types';
import { InlineEditor } from './components/InlineEditor';
import { ElementRenderer } from './ElementRenderer';
import { ContextMenu } from './components/ContextMenu';
import { ImageUploadModal } from './components/ImageWidget';
import { useResizeHandlers } from './hooks/useResizeHandlers';
import { useInlineEditing } from './hooks/useInlineEditing';
import { useSelectionBorder } from './hooks/useSelectionBorder';
import { useDragHandlers } from './hooks/useDragHandlers';
import { useMemoizedProperties } from './hooks/useMemoizedProperties';
import { ConnectionNodeIcon } from './components/ConnectionNodeIcon';
import { ResizeHandles } from './components/ResizeHandles';
import { InlineEditor } from './components/InlineEditor';

interface ResizableWidgetProps {
  element: Element;
  isSelected?: boolean;
  isPreviewMode?: boolean;
  isConstrained?: boolean;
  constraintType?: 'horizontal' | 'vertical' | 'both' | null;
}

export const ResizableWidget: React.FC<ResizableWidgetProps> = ({
  element,
  isSelected,
  isPreviewMode = false,
  isConstrained = false,
  constraintType = null,
}) => {
  // Early return for invalid element
  if (!element) {
    // console.error('[ResizableWidget] element is undefined/null!', element);
    return <div style={{ color: 'red' }}>Error: element is undefined/null</div>;
  }
  
  if (!element.properties) {
    // console.error('[ResizableWidget] element.properties is undefined!', element);
    return <div style={{ color: 'red' }}>Error: element.properties is undefined</div>;
  }

  const { selectElement, updateElement } = useBuilder();
  
  // Connection node check
  const isConnectionNode = element.type === 'connection-text-node' || element.type === 'connection-image-node';
  
  // Memoized properties to prevent unnecessary re-renders
  const memoizedProperties = useMemoizedProperties(element.properties);
  
  // State for inline editing
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState('');
  
  // Inline editing hook
  const { handleEditingComplete, handleEditingKeyDown } = useInlineEditing(
    element,
    setIsEditing,
    editText,
    setEditText,
    updateElement
  );

  // Drag handlers
  const { shouldDisableDrag } = useDragHandlers(isPreviewMode, isConstrained, constraintType);
  
  // Resize handlers
  const widgetRef = React.useRef<HTMLDivElement>(null);
  const { isResizing, startResize, getCursor } = useResizeHandlers(element, widgetRef);

  // Enhanced listeners that block resize handle interactions
  const enhancedListeners = useMemo(() => {
    // Enable body drag for standalone widgets, disable for other elements
    if (element.type === 'standalone-widget') {
      return listeners; // Enable full body dragging for standalone widgets
    }
    return {}; // Disable body drag for other elements - only use drag handles
  }, [listeners, element.type]);

  // Draggable configuration
  const {
    attributes,
    listeners,
    setNodeRef: setDragNodeRef,
    transform,
    isDragging,
  } = useDraggable({
    id: element.id,
    data: {
      type: 'element',
      elementId: element.id,
      parentId: element.parentId,
    },
    disabled: shouldDisableDrag,
  });

  // Selection border hook
  const selectionBorderRef = useSelectionBorder(isSelected);

  // Set refs for drag and resize functionality
  const setRefs = useCallback((node: HTMLDivElement | null) => {
    selectionBorderRef.current = node;
    setDragNodeRef(node);
    if (widgetRef) {
      (widgetRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
    }
  }, [setDragNodeRef]);

  // Get the appropriate cursor for the widget body
  const getWidgetCursor = () => {
    if (isResizing) return getCursor('se');
    if (shouldDisableDrag) return 'default';
    if (isConnectionNode) return 'default';
    return 'grab';
  };

  // Style computation with proper position, size and transform handling
  const widgetStyles = useMemo(() => {
    const baseLeft = Number(element.properties?.left) || 0;
    const baseTop = Number(element.properties?.top) || 0;
    const width = Number(element.properties?.width) || 100;
    const height = Number(element.properties?.height) || 100;
    
    // Apply minimum dimensions if they exist
    const minWidth = element.properties?.minWidth ? Number(element.properties.minWidth) : undefined;
    const minHeight = element.properties?.minHeight ? Number(element.properties.minHeight) : undefined;

    return {
      position: 'absolute' as const,
      left: `${baseLeft}px`,
      top: `${baseTop}px`,
      width: `${width}px`,
      height: `${height}px`,
      minWidth: minWidth ? `${minWidth}px` : undefined,
      minHeight: minHeight ? `${minHeight}px` : undefined,
      transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
      zIndex: isDragging ? 1000 : (isSelected ? 100 : 50),
      opacity: isDragging ? 0.5 : 1,
      transition: isDragging ? 'none' : 'all 0.2s ease',
      // Ensure the element can be dragged by its body for standalone widgets
      userSelect: element.type === 'standalone-widget' ? 'none' as const : undefined,
      touchAction: element.type === 'standalone-widget' ? 'none' as const : undefined,
      pointerEvents: 'auto' as const,
      overflow: 'visible' as const,
      boxSizing: 'border-box' as const,
      // Remove any potential margin/padding that could misalign
      margin: 0,
      padding: 0,
    };
  }, [element.properties?.left, element.properties?.top, element.properties?.width, element.properties?.height, element.properties?.minWidth, element.properties?.minHeight, isDragging, transform, isSelected, element.type]);

  return (
    <>
      <div
        ref={setRefs}
        style={{
          ...widgetStyles,
          cursor: getWidgetCursor(),
        }}
        {...attributes}
        {...enhancedListeners}
        onClick={(e) => {
          e.stopPropagation();
          if (!isPreviewMode) {
            selectElement(element.id);
          }
        }}
        onDoubleClick={(e) => {
          e.stopPropagation();
          if (!isPreviewMode && ['paragraph', 'heading', 'text'].includes(element.type)) {
            setIsEditing(true);
            setEditText(element.properties?.text || '');
          }
        }}
      >
        {/* Inline Editor */}
        {isEditing && ['paragraph', 'heading', 'text'].includes(element.type) && (
          <InlineEditor
            isEditing={isEditing}
            editText={editText}
            setEditText={setEditText}
            onComplete={handleEditingComplete}
            onKeyDown={handleEditingKeyDown}
          />
        )}

        {/* Element Content */}
        {!isEditing && (
          <ElementRenderer 
            element={element} 
            isPreviewMode={isPreviewMode}
          />
        )}

        {/* Resize Handles */}
        {isSelected && !isPreviewMode && !isConnectionNode && (
          <ResizeHandles
            isResizing={isResizing}
            onStartResize={startResize}
            getCursor={getCursor}
          />
        )}

        {/* Drag Handle for regular elements (not standalone) */}
        {isSelected && !isPreviewMode && !isConnectionNode && element.type !== 'standalone-widget' && (
          <div
            style={{
              position: 'absolute',
              top: '-15px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '32px',
              height: '32px',
              backgroundColor: isDragging 
                ? 'rgba(14, 165, 233, 0.9)' 
                : 'rgba(14, 165, 233, 0.8)',
              borderRadius: '8px',
              cursor: isDragging ? 'grabbing' : 'grab',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '14px',
              fontWeight: '600',
              boxShadow: isDragging
                ? '0 8px 32px rgba(14, 165, 233, 0.4), 0 4px 16px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
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
            {...attributes}
            {...listeners}
          >
            <Move size={16} />
          </div>
        )}

        {/* Connection Node Icon */}
        {isConnectionNode && (
          <ConnectionNodeIcon
            element={element}
            isSelected={isSelected}
            isDragging={isDragging}
            attributes={attributes}
            listeners={listeners}
          />
        )}

        {/* Context Menu */}
        {isSelected && !isPreviewMode && (
          <ContextMenu element={element} />
        )}
      </div>
    </>
  );
};
