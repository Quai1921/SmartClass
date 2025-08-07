import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { useDraggable, useDndContext } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import type { Element } from '../types';
import { ElementRenderer } from './ElementRenderer';
import { getAdaptiveHeight } from '../utils/elementFactory';
import { useResizeHandlers } from './hooks/useResizeHandlers';
import { useSelectionBorder } from './hooks/useSelectionBorder';
import { ResizeHandles } from './components/ResizeHandles';
import { useInlineEditing } from './hooks/useInlineEditing';
import { InlineEditor } from './components/InlineEditor';
import { RefactoredEnhancedInlineEditor } from './components/EnhancedInlineEditor';
import { getElementStyles } from '../utils/elementStyles';
import { useBuilder } from '../hooks/useBuilder';

interface ElementWrapperProps {
  element: Element;
  isSelected: boolean;
  isDragging: boolean;
  onClick: (event: React.MouseEvent) => void; // Updated to pass event
  isPreviewMode?: boolean; // Add preview mode prop
  isConstrained?: boolean; // New prop for boundary constraint feedback
  constraintType?: 'horizontal' | 'vertical' | 'both' | null;
}

export const ElementWrapper: React.FC<ElementWrapperProps> = ({
  element,
  isSelected,
  isDragging,
  onClick,
  isPreviewMode = false, // Default to false
  isConstrained = false,
  constraintType = null,
}) => {
  const { updateElement } = useBuilder();
  const widgetRef = React.useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = React.useState(false);
  
  // Use DND context to detect if THIS element is being dragged
  const { active } = useDndContext();
  const isThisElementBeingDragged = active?.id === element.id;
  
  // Debug logging to see element type
  if (element.type === 'audio-true-false') {

  }

  // MutationObserver to force auto-width for audio-true-false in ElementWrapper
  React.useEffect(() => {
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
  
  // Resize and editing functionality
  const { isResizing, startResize, getCursor } = useResizeHandlers(element, widgetRef);
  
  const { triggerBorderUpdate } = useSelectionBorder(element, isSelected, widgetRef);
  const {
    isEditing,
    editText,
    setEditText,
    setIsEditing,
    handleDoubleClick,
    handleEditingComplete,
    handleEditingKeyDown
  } = useInlineEditing(element, triggerBorderUpdate);
  
  // Debug logging for paragraphs

  
  // Create a manual editing trigger for testing
  const startEditing = () => {

    const currentText = element.properties.htmlContent || element.properties.text || '';
    setEditText(currentText);
    setIsEditing(true);
  };
  
  // Compute element styles
  const computedStyles = React.useMemo(() => {
    return getElementStyles(element, false);
  }, [element]);

  // In preview mode, render simplified version without drag/resize
  if (isPreviewMode) {
    return (
      <div
        ref={widgetRef}
        data-element-id={element.id}
        data-element-type={element.type}
        style={computedStyles}
        className="widget-resizable"
      >
        <ElementRenderer element={element} isSelected={false} />
      </div>
    );
  }
  
  // For standalone widgets, enable body dragging; for others, use handle-based dragging
  const isStandaloneWidget = element.type === 'standalone-widget';
  
  // Use useDraggable for standalone widgets, useSortable for others
  const draggableResult = isStandaloneWidget ? useDraggable({
    id: element.id,
    data: {
      type: 'element',
      elementType: element.type,
      elementId: element.id,
      parentId: element.parentId,
      dragSource: 'body',
      ownedBy: element.properties?.ownedBy,
      dragDropOwner: element.properties?.dragDropOwner,
    },
  }) : null;

  const sortableResult = !isStandaloneWidget ? useSortable({
    id: element.id,
    data: {
      type: 'element',
      elementType: element.type,
      elementId: element.id,
      parentId: element.parentId,
      dragSource: 'handle',
    },
  }) : null;

  // Get the appropriate result
  const dragResult = isStandaloneWidget ? draggableResult : sortableResult;
  
  // Debug the drag result for audio-true-false
  if (element.type === 'audio-true-false') {

  }
  
  // Safely extract properties with fallbacks
  const attributes = dragResult?.attributes || {};
  const listeners = dragResult?.listeners || {};
  const setNodeRef = dragResult?.setNodeRef || (() => {});
  const transform = dragResult?.transform || null;
  const isDraggingFromHook = dragResult?.isDragging || false;
  
  // Get transition from sortable result if available
  const transition = sortableResult?.transition;

  // Split listeners for wrapper vs handle
  const wrapperListeners = isStandaloneWidget ? listeners : {};
  const handleListeners = isStandaloneWidget ? {} : listeners;

  // Debug drag state - AUDIO TRUE FALSE ONLY
  if (element.type === 'audio-true-false') {

  }

  // Debug when drag state changes - AUDIO TRUE FALSE ONLY
  React.useEffect(() => {
    if (element.type === 'audio-true-false') {
      if (isDraggingFromHook) {

      } else {

      }
    }
  }, [isDraggingFromHook, element.id, element.type]);

  // Get adaptive height for the element
  const adaptiveHeight = getAdaptiveHeight(element);

  // Custom transform handling for standalone widgets to prevent scaling
  const getCustomTransform = () => {
    if (isDraggingFromHook && isStandaloneWidget && transform) {
      // Extract only the translate values from the transform, ignore scaling
      const translateX = transform.x || 0;
      const translateY = transform.y || 0;
      return `translate3d(${translateX}px, ${translateY}px, 0)`;
    }
    return isDraggingFromHook ? CSS.Transform.toString(transform) : undefined;
  };

  return (
    <div
      ref={(node) => {
        setNodeRef(node);
        widgetRef.current = node;
      }}
      data-element-id={element.id}
      data-element-type={element.type}
      {...attributes}
      {...wrapperListeners}
      onDragStart={(e) => {

      }}
      onDragEnd={(e) => {

      }}
      style={{
        // Use custom transform for standalone widgets to prevent scaling
        transform: getCustomTransform(),
        transition: isStandaloneWidget && isDraggingFromHook ? 'none' : transition, // No transition for standalone during drag
        opacity: isDraggingFromHook ? (isStandaloneWidget ? 0.8 : 0.5) : 1, // Less opacity reduction for standalone widgets
        zIndex: isDraggingFromHook ? 500 : undefined, // Lower z-index when dragging to allow dropzone detection
        // Use DND context detection for pointer events - more reliable
        pointerEvents: (isThisElementBeingDragged && element.type === 'audio-true-false') ? 'none' : 'auto',
        ...computedStyles,
        // Ensure the element is properly positioned for resize handles
        position: computedStyles.position || 'relative',
        // Add visual feedback for constraints
        outline: isConstrained ? '2px dashed #f59e0b' : 'none',
        outlineOffset: isConstrained ? '2px' : '0',
        // Add slight shadow for standalone widgets during drag (no border)
        ...(isDraggingFromHook && isStandaloneWidget ? {
          boxShadow: '0 8px 25px rgba(59, 130, 246, 0.3)',
        } : {}),
      }}
      className={`element-wrapper widget-resizable group ${
        isSelected ? 'selected ring-2 ring-blue-500 bg-blue-50/20' : ''
      } ${isDraggingFromHook ? 'cursor-grabbing' : isStandaloneWidget ? 'cursor-grab' : 'cursor-pointer'} ${
        isDraggingFromHook && isStandaloneWidget ? 'standalone-dragging' : ''
      } transition-all`}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onDoubleClick={handleDoubleClick}
    >
      {/* Handle drag for non-standalone widgets */}
      {!isStandaloneWidget && (
        <div
          {...handleListeners}
          data-drag-source="handle"
          className="absolute cursor-grab active:cursor-grabbing drag-handle"
          style={{
            left: '-40px', // Fixed positioning instead of -left-8
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 100000, // Higher z-index to ensure visibility
            backgroundColor: isDragging || isDraggingFromHook ? '#1d4ed8' : '#3b82f6', // Professional blue instead of green
            borderRadius: '8px',
            padding: '8px',
            boxShadow: isDragging || isDraggingFromHook
              ? '0 8px 25px rgba(59, 130, 246, 0.4), 0 4px 12px rgba(29, 78, 216, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)' 
              : '0 4px 15px rgba(59, 130, 246, 0.3), 0 2px 8px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.15)',
            border: isDragging || isDraggingFromHook ? '2px solid rgba(255, 255, 255, 0.9)' : '2px solid rgba(255, 255, 255, 0.7)',
            opacity: isSelected || isHovered || isDragging || isDraggingFromHook ? 1 : 0.7,
            transition: isDragging || isDraggingFromHook
              ? 'none' // No transition during drag for immediate feedback
              : 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            pointerEvents: 'auto', // Always allow handle interactions
            minWidth: '32px',
            minHeight: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backdropFilter: 'blur(8px)',
          }}        onMouseEnter={(e) => {
          if (!(isDragging || isDraggingFromHook)) {
            e.currentTarget.style.boxShadow = '0 6px 20px rgba(59, 130, 246, 0.4), 0 3px 10px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.25)';
            e.currentTarget.style.transform = 'translateY(-50%) scale(1.05)';
          }
        }}
        onMouseLeave={(e) => {
          if (!(isDragging || isDraggingFromHook)) {
            e.currentTarget.style.boxShadow = '0 4px 15px rgba(59, 130, 246, 0.3), 0 2px 8px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.15)';
            e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
          }
        }}
        title="Arrastra para reordenar"
      ><div className="w-4 h-4 flex flex-col justify-center items-center space-y-px">
          <div className="w-1.5 h-0.5 bg-white rounded-full"></div>
          <div className="w-1.5 h-0.5 bg-white rounded-full"></div>
          <div className="w-1.5 h-0.5 bg-white rounded-full"></div>
          <div className="w-1.5 h-0.5 bg-white rounded-full"></div>
          <div className="w-1.5 h-0.5 bg-white rounded-full"></div>
          <div className="w-1.5 h-0.5 bg-white rounded-full"></div>
        </div>
      </div>
      )}

      {/* Debug element - only show in development */}
      {false && (
        <div style={{
          position: 'absolute',
          top: '-60px',
          left: '0px',
          background: 'lime',
          color: 'black',
          padding: '3px',
          fontSize: '8px',
          zIndex: 99999,
          border: '2px solid black'
        }}>
          ELEMENT WRAPPER RENDERED
        </div>
      )}
      
      {/* Element Content */}
      <div 
        className={`element-content ${element.properties.className || ''}`}
        style={{
          // Containers need special handling - don't constrain their layout
          // Note: Containers don't use ElementWrapper anymore, so this is for other elements
          height: adaptiveHeight,
          minHeight: adaptiveHeight?.includes('max-content') ? `${element.properties.minHeight || 40}px` : undefined,
          display: 'flex',
          alignItems: element.type === 'image' || element.type === 'video' ? 'center' : 'flex-start',
          justifyContent: element.type === 'image' || element.type === 'video' ? 'center' : 'flex-start',
          // Enable body dragging cursor for standalone widgets
          cursor: isStandaloneWidget ? (isDraggingFromHook ? 'grabbing' : 'grab') : 'default',
          position: 'relative'
        }}
      >
        {isEditing ? (
          (element.type === 'paragraph' || element.type === 'quote') ? (
            <>
              {/* Backdrop */}
              <div 
                style={{
                  position: 'fixed',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'rgba(16, 20, 30, 0.45)',
                  backdropFilter: 'blur(6px)',
                  zIndex: 9999999,
                  isolation: 'isolate',
                  contain: 'layout style paint',
                  transform: 'translateZ(0)',
                  willChange: 'z-index'
                }}
                onClick={(e) => {
                  e.stopPropagation();
                }}
              />
              {/* Modal */}
              <div 
                style={{ 
                  position: 'fixed',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%) translateZ(0)',
                  background: '#1f2937',
                  border: '1px solid #374151',
                  borderRadius: '12px',
                  boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                  zIndex: 10000000,
                  minWidth: '600px',
                  minHeight: '400px',
                  width: '700px',
                  height: '500px',
                  maxWidth: '90vw',
                  maxHeight: '80vh',
                  overflow: 'hidden',
                  resize: 'both',
                  display: 'flex',
                  flexDirection: 'column',
                  isolation: 'isolate',
                  contain: 'layout style paint',
                  willChange: 'z-index',
                  backfaceVisibility: 'hidden'
                }}
                onClick={(e) => {
                  e.stopPropagation();
                }}
                onMouseDown={(e) => {
                  e.stopPropagation();
                }}
              >
                <RefactoredEnhancedInlineEditor
                  isEditing={isEditing}
                  content={editText}
                  onContentChange={setEditText}
                  onComplete={handleEditingComplete}
                  onKeyDown={handleEditingKeyDown}
                  placeholder={element.type === 'quote' ? "Escribe tu cita aquí..." : "Escribe aquí..."}
                  elementType={element.type}
                  backgroundColor={element.properties.backgroundColor}
                />
              </div>
            </>
          ) : (
            <InlineEditor
              isEditing={isEditing}
              editText={editText}
              setEditText={setEditText}
              onComplete={handleEditingComplete}
              onKeyDown={handleEditingKeyDown}
            />
          )
        ) : (
          <div style={{ position: 'relative' }}>
            <ElementRenderer element={element} isSelected={isSelected} />
            {/* Clean edit button for paragraphs and quotes */}
            {(element.type === 'paragraph' || element.type === 'quote') && isSelected && (
              <button
                onClick={startEditing}
                style={{
                  position: 'absolute',
                  top: '-35px',
                  right: '0px',
                  background: '#3b82f6',
                  color: 'white',
                  border: 'none',
                  padding: '6px 12px',
                  borderRadius: '6px',
                  fontSize: '12px',
                  cursor: 'pointer',
                  zIndex: 1000,
                  fontWeight: '500',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#2563eb';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#3b82f6';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                ✏️ Edit
              </button>
            )}
          </div>
        )}
      </div>      {/* Selection Indicator */}
      {isSelected && !isEditing && (
        <>
          <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 1000 }}>
            {/* Empty container for positioning reference */}
          </div>
          
          {/* Resize Handles - Show for all resizable elements */}
          <ResizeHandles 
            isSelected={isSelected}
            onStartResize={startResize}
            getCursor={getCursor}
          />
          
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
            }}          >
            {element.name || element.type}
          </div>
        </>
      )}
    </div>
  );
};
