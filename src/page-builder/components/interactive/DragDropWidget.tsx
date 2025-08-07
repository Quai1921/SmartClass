import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useDroppable, useDraggable, useDndContext } from '@dnd-kit/core';
import { MousePointerClick, Package, AlertCircle, Plus } from 'lucide-react';
import type { Element } from '../../types';
import { useBuilder } from '../../hooks/useBuilder';
import { createElementFromType } from '../../utils/elementFactory';
import { StandaloneWidget, type StandaloneWidgetProperties } from './StandaloneWidget';

// Add a module load debug log

// Remove ContentDropZone interface and component entirely
// interface ContentDropZoneProps { ... }
// const ContentDropZone: React.FC<ContentDropZoneProps> = ({ ... }) => { ... };

interface DragDropWidgetProps {
  element: Element;
  isSelected?: boolean;
  isPreviewMode?: boolean;
}

interface DroppedItem {
  id: string;
  type: string;
  name: string;
  order: number;
}

export const DragDropWidget: React.FC<DragDropWidgetProps> = ({
  element,
  isSelected = false,
  isPreviewMode = false,
}) => {
  const { addElement, updateElement, selectElement, elements } = useBuilder();
  const [isDragOver, setIsDragOver] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const properties = element.properties || {};
  
  // Get actual child elements AND elements owned by this widget
  const actualChildElements = useMemo(() => {
    return elements.filter(el => 
      el.parentId === element.id || // Direct children (dropped into widget)
      el.properties?.ownedBy === element.id || // Elements owned by this widget
      el.properties?.dragDropOwner === element.id // Alternative ownership property
    );
  }, [elements, element.id]);
  
  // Get direct children only (elements actually inside the widget)
  const directChildren = useMemo(() => {
    return elements.filter(el => el.parentId === element.id);
  }, [elements, element.id]);
  
  // Convert direct children to droppedItems format for display
  const droppedItems = useMemo(() => {
    return directChildren.map((child, index) => ({
      id: child.id,
      type: child.type,
      name: child.properties?.text || `Element ${index + 1}`,
      order: index
    }));
  }, [directChildren]);
  
  // Extract drag-drop specific properties with defaults
  const dropZoneText = properties.dropZoneText || 'Arrastra elementos aquí';
  const allowedTypes = properties.allowedTypes || [];
  const maxItems = properties.maxItems || 0; // 0 = unlimited
  const enableAnimations = properties.enableAnimations !== false; // default true

  // Visual feedback colors
  const dragOverColor = properties.dragOverColor || '#e0f2fe';
  const dragOverBorder = properties.dragOverBorder || '2px solid #0284c7';
  const successColor = properties.successColor || '#dcfce7';
  const successBorder = properties.successBorder || '2px solid #16a34a';
  const normalColor = properties.backgroundColor || '#f8fafc';
  const normalBorder = properties.border || '2px dashed #cbd5e1';

  // Enhanced styling properties
  const borderTopWidth = properties.borderTopWidth || '2px';
  const borderRightWidth = properties.borderRightWidth || '2px';
  const borderBottomWidth = properties.borderBottomWidth || '2px';
  const borderLeftWidth = properties.borderLeftWidth || '2px';
  const borderTopStyle = properties.borderTopStyle || 'dashed';
  const borderRightStyle = properties.borderRightStyle || 'dashed';
  const borderBottomStyle = properties.borderBottomStyle || 'dashed';
  const borderLeftStyle = properties.borderLeftStyle || 'dashed';
  const borderTopColor = properties.borderTopColor || '#cbd5e1';
  const borderRightColor = properties.borderRightColor || '#cbd5e1';
  const borderBottomColor = properties.borderBottomColor || '#cbd5e1';
  const borderLeftColor = properties.borderLeftColor || '#cbd5e1';
  
  // Corner radius properties
  const borderTopLeftRadius = properties.borderTopLeftRadius || '8px';
  const borderTopRightRadius = properties.borderTopRightRadius || '8px';
  const borderBottomRightRadius = properties.borderBottomRightRadius || '8px';
  const borderBottomLeftRadius = properties.borderBottomLeftRadius || '8px';
  const isFullyRounded = properties.isFullyRounded || false;
  
  // Background properties
  const backgroundImage = properties.backgroundImage || '';
  const backgroundSize = properties.backgroundSize || 'cover';
  const backgroundPosition = properties.backgroundPosition || 'center';
  const backgroundRepeat = properties.backgroundRepeat || 'no-repeat';
  
  // Transparency properties
  const isTransparent = properties.isTransparent || false;
  const buttonTransparency = properties.buttonTransparency || 'opaque'; // 'transparent', 'semi-transparent', 'opaque'

  // Calculate minimum dimensions based on child elements
  const calculateMinDimensions = useCallback(() => {
    if (directChildren.length === 0) {
      // Minimum size when empty: enough for header and some content
      return { minWidth: 200, minHeight: 120 };
    }

    // Calculate bounds of all child elements
    let maxRight = 0;
    let maxBottom = 0;
    
    directChildren.forEach(child => {
      const left = Number(child.properties?.left) || 0;
      const top = Number(child.properties?.top) || 0;
      const width = Number(child.properties?.width) || 80;
      const height = Number(child.properties?.height) || 80;
      
      maxRight = Math.max(maxRight, left + width);
      maxBottom = Math.max(maxBottom, top + height);
    });

    // Add padding for header (60px) and margins (20px each side)
    const headerHeight = 60;
    const padding = 20;
    
    return {
      minWidth: Math.max(200, maxRight + padding),
      minHeight: Math.max(120, maxBottom + headerHeight + padding)
    };
  }, [directChildren]);

  // Get current minimum dimensions
  const { minWidth, minHeight } = calculateMinDimensions();

  // Update element properties with minimum dimensions to prevent over-shrinking
  useEffect(() => {
    // Always keep minimum dimensions updated for ResizableWidget to use
    if (element.properties?.minWidth !== minWidth || element.properties?.minHeight !== minHeight) {
      updateElement(element.id, {
        properties: {
          ...element.properties,
          minWidth,
          minHeight,
        }
      });
    }
  }, [minWidth, minHeight, element.id, element.properties?.minWidth, element.properties?.minHeight, updateElement]);

  // Setup droppable with proper drag-drop-widget configuration  
  const { isOver, setNodeRef } = useDroppable({
    id: element.id,
    data: {
      type: 'drag-drop-widget',
      elementId: element.id,
      widgetType: 'drag-drop-widget',
      allowedTypes,
      maxItems,
      // Add ownership information
      ownerId: element.id, // This widget owns its created elements
      // Add element reference for the drag system
      element: element,
      // Accept all dragged elements including standalone widgets
      accepts: ['element', 'button', 'standalone-widget', 'standalone-element'], // Accept standalone widgets
    }
  });



  // Create a standalone element that belongs to this drag-drop widget
  const createStandaloneElement = useCallback(() => {
    if (isPreviewMode) return;
    
    // Remove capacity check from creation - users should always be able to create elements
    // Capacity limit only applies to dropping elements INTO the widget, not creating them
    
    // Calculate position outside the widget
    const widgetLeft = Number(element.properties?.left) || 0;
    const widgetTop = Number(element.properties?.top) || 0;
    const widgetWidth = Number(element.properties?.width) || 300;
    const widgetHeight = Number(element.properties?.height) || 200;
    const elementSize = 80;
    
    let elementLeft: number;
    let elementTop: number;
    
    // Smart positioning to avoid overlap with existing elements
    const siblingElements = elements.filter(el => el.parentId === element.parentId && el.id !== element.id);
    const positions = siblingElements.map(el => ({ 
      left: Number(el.properties?.left) || 0, 
      top: Number(el.properties?.top) || 0,
      width: Number(el.properties?.width) || 80,
      height: Number(el.properties?.height) || 80
    }));
    
    // Try to position to the right of the widget first
    elementLeft = widgetLeft + widgetWidth + 20;
    elementTop = widgetTop + 60; // Account for header
    
    // Check for overlap and adjust if needed
    let attempts = 0;
    while (attempts < 10) {
      const hasOverlap = positions.some(pos => 
        elementLeft < pos.left + pos.width &&
        elementLeft + elementSize > pos.left &&
        elementTop < pos.top + pos.height &&
        elementTop + elementSize > pos.top
      );
      
      if (!hasOverlap) break;
      
      // Move down or to next column
      elementTop += elementSize + 20;
      if (elementTop > widgetTop + 400) { // Max height, move to next column
        elementLeft += elementSize + 20;
        elementTop = widgetTop + 60;
      }
      attempts++;
    }
    
    // Fallback: position below the widget
    if (attempts >= 10) {
      elementLeft = widgetLeft + 20;
      elementTop = widgetTop + widgetHeight + 20;
    }
    
    const newElement = createElementFromType('standalone-widget', element.parentId, {
      text: (properties as any).elementText || '',
      left: elementLeft,
      top: elementTop,
      width: elementSize,
      height: elementSize,
      // Use configurable appearance from widget properties
      backgroundColor: (properties as any).elementBackgroundColor || 'transparent',
      backgroundImage: (properties as any).elementBackgroundImage || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiByeD0iOCIgZmlsbD0iIzRmNDZlNSIvPgo8dGV4dCB4PSI0MCIgeT0iNDUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIyNCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiPvCfk6Y8L3RleHQ+Cjwvc3ZnPgo=',
      border: (properties as any).elementBorder || 'none',
      borderRadius: (properties as any).elementBorderRadius || 8,
      color: (properties as any).elementTextColor || '#333',
      fontWeight: ((properties as any).elementFontWeight || '500') as '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900',
      zIndex: 10,
      
      // Store original position for snap-back behavior
      originalPosition: { x: elementLeft, y: elementTop },
      
      // Note: Don't set ownedBy/dragDropOwner during creation to prevent auto-move
      
      // Standalone element properties
      standaloneElementType: 'image',
      standaloneImageUrl: (properties as any).elementBackgroundImage || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1zbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiByeD0iOCIgZmlsbD0iIzRmNDZlNSIvPgo8dGV4dCB4PSI0MCIgeT0iNDUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIyNCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiPvCfk6Y8L3RleHQ+Cjwvc3ZnPgo=',
      standaloneImageAlt: (properties as any).elementImageAlt || 'Draggable element',
      standaloneImageFit: 'contain',
      standaloneBackgroundTransparent: true,
      
      // Visual effects and sizing properties
      backgroundSize: 'contain',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      
      // Additional styling for better visibility
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      cursor: 'grab',
      
      // Remove default button styling
      padding: 0,
      fontSize: 0,
      lineHeight: 0,
      
      // Hover effects
      transition: 'all 0.2s ease',
    });
    
    // Add the element to the canvas (same parent as the widget)
    addElement(newElement, element.parentId);
    
    // Set ownership after creation to enable ownership protection but prevent auto-correction
    setTimeout(() => {
      updateElement(newElement.id, {
        properties: {
          ...newElement.properties,
          ownedBy: element.id,
          dragDropOwner: element.id,
          // Ensure original position is stored for snap-back functionality
          originalPosition: { x: elementLeft, y: elementTop },
        }
      });
    }, 100); // Small delay to avoid triggering auto-correction during creation
  }, [addElement, updateElement, element.parentId, element.id, element.properties.left, element.properties.top, element.properties.width, element.properties.height, elements, isPreviewMode, properties]);

  // Handle drag over state changes and success feedback
  React.useEffect(() => {
    if (isOver !== isDragOver) {
      setIsDragOver(isOver);
      
      if (isOver && enableAnimations) {
        // Animate in
        const timeout = setTimeout(() => setShowSuccess(false), 200);
        return () => clearTimeout(timeout);
      }
    }
  }, [isOver, isDragOver, enableAnimations, element.id]);
  
  // Monitor for new child elements to show success feedback (only direct children)
  React.useEffect(() => {
    const previousCount = droppedItems.length;
    const currentCount = directChildren.length;
    
    if (currentCount > previousCount && !isPreviewMode) {
      // New element was dropped into the widget, show success feedback
      setShowSuccess(true);
      const timeout = setTimeout(() => setShowSuccess(false), 1000);
      return () => clearTimeout(timeout);
    }
  }, [directChildren.length, droppedItems.length, isPreviewMode, element.id, directChildren]);

  // Auto-correct child positions to prevent them from going outside widget bounds
  useEffect(() => {
    // TEMPORARILY DISABLED AGAIN for debugging
    return;
    
    const widgetWidth = Number(element.properties?.width) || 300;
    const widgetHeight = Number(element.properties?.height) || 200;
    const padding = 5;
    const headerHeight = 60;
    
    directChildren.forEach(child => {
      const childLeft = Number(child.properties?.left) || 0;
      const childTop = Number(child.properties?.top) || 0;
      const childWidth = Number(child.properties?.width) || 80;
      const childHeight = Number(child.properties?.height) || 80;
      
      // Calculate bounds - use the same permissive logic as the drag system
      const minLeft = padding;
      // For elements owned by this widget, allow them to go much higher
      const isOwned = child.properties?.ownedBy === element.id || child.properties?.dragDropOwner === element.id;
      const minTop = isOwned ? padding : headerHeight + padding; // Permissive for owned elements
      const maxLeft = widgetWidth - childWidth - padding;
      const maxTop = widgetHeight - childHeight - padding;
      
      
      // Check if child is out of bounds
      const constrainedLeft = Math.max(minLeft, Math.min(childLeft, maxLeft));
      const constrainedTop = Math.max(minTop, Math.min(childTop, maxTop));
      
      // Update position if needed
      if (constrainedLeft !== childLeft || constrainedTop !== childTop) {

        
        updateElement(child.id, {
          properties: {
            ...child.properties,
            left: constrainedLeft,
            top: constrainedTop
          }
        });
      }
    });
  }, [directChildren, element.properties.width, element.properties.height, updateElement]);

  // DEBUG: Monitor element property changes to catch what's overriding positions
  useEffect(() => {
    directChildren.forEach(child => {
    });
  }, [directChildren.map(c => `${c.id}-${c.properties?.left}-${c.properties?.top}`).join(',')]);
  
  // Calculate current background and border based on state
  const currentStyles = useMemo(() => {
    // Calculate independent borders
    const borderTop = `${borderTopWidth} ${borderTopStyle} ${borderTopColor}`;
    const borderRight = `${borderRightWidth} ${borderRightStyle} ${borderRightColor}`;
    const borderBottom = `${borderBottomWidth} ${borderBottomStyle} ${borderBottomColor}`;
    const borderLeft = `${borderLeftWidth} ${borderLeftStyle} ${borderLeftColor}`;
    
    // Calculate border radius
    let borderRadius: string;
    if (isFullyRounded) {
      borderRadius = '50%'; // Makes element completely round
    } else {
      borderRadius = `${borderTopLeftRadius} ${borderTopRightRadius} ${borderBottomRightRadius} ${borderBottomLeftRadius}`;
    }
    
    // Base styles
    const baseStyles = {
      borderTop,
      borderRight,
      borderBottom,
      borderLeft,
      borderRadius,
      backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'none',
      backgroundSize,
      backgroundPosition,
      backgroundRepeat,
    };
    
    if (showSuccess) {
      return {
        ...baseStyles,
        backgroundColor: isTransparent ? 'transparent' : successColor,
        borderTop: `${borderTopWidth} ${borderTopStyle} ${properties.successBorderColor || '#16a34a'}`,
        borderRight: `${borderRightWidth} ${borderRightStyle} ${properties.successBorderColor || '#16a34a'}`,
        borderBottom: `${borderBottomWidth} ${borderBottomStyle} ${properties.successBorderColor || '#16a34a'}`,
        borderLeft: `${borderLeftWidth} ${borderLeftStyle} ${properties.successBorderColor || '#16a34a'}`,
      };
    }
    if (isDragOver) {
      return {
        ...baseStyles,
        backgroundColor: isTransparent ? 'transparent' : dragOverColor,
        borderTop: `${borderTopWidth} ${borderTopStyle} ${properties.dragOverBorderColor || '#0284c7'}`,
        borderRight: `${borderRightWidth} ${borderRightStyle} ${properties.dragOverBorderColor || '#0284c7'}`,
        borderBottom: `${borderBottomWidth} ${borderBottomStyle} ${properties.dragOverBorderColor || '#0284c7'}`,
        borderLeft: `${borderLeftWidth} ${borderLeftStyle} ${properties.dragOverBorderColor || '#0284c7'}`,
      };
    }
    return {
      ...baseStyles,
      backgroundColor: isTransparent ? 'transparent' : normalColor,
    };
  }, [isDragOver, showSuccess, dragOverColor, dragOverBorder, successColor, successBorder, normalColor, normalBorder, 
      borderTopWidth, borderRightWidth, borderBottomWidth, borderLeftWidth,
      borderTopStyle, borderRightStyle, borderBottomStyle, borderLeftStyle,
      borderTopColor, borderRightColor, borderBottomColor, borderLeftColor,
      borderTopLeftRadius, borderTopRightRadius, borderBottomRightRadius, borderBottomLeftRadius,
      isFullyRounded, backgroundImage, backgroundSize, backgroundPosition, backgroundRepeat, isTransparent, properties]);

  // Check if we can accept more items
  const canAcceptMore = maxItems === 0 || droppedItems.length < maxItems;
  const isAtCapacity = maxItems > 0 && droppedItems.length >= maxItems;

  // Debug drop zone detection
  React.useEffect(() => {
    if (isOver) {
    }
  }, [isOver, element.id, canAcceptMore, droppedItems.length, maxItems]);

  // Handle successful drop (this would be called by the parent drag context)
  const handleDrop = useCallback((item: any) => {
    // This is a placeholder - actual drop handling would be done by the parent
    if (canAcceptMore) {
      setShowSuccess(true);
      const timeout = setTimeout(() => setShowSuccess(false), 1000);
      return () => clearTimeout(timeout);
    }
  }, [canAcceptMore]);

  // Use portal for child elements to avoid clipping issues (optional)
  const usePortalForChildren = false; // Set to true if clipping persists
  
  // Draggable wrapper component for child elements
  const DraggableChildElement: React.FC<{ child: Element }> = ({ child }) => {
    const { attributes, listeners, setNodeRef, isDragging, transform } = useDraggable({
      id: child.id,
      data: {
        type: 'standalone-element', // Use specific type for standalone widgets
        elementId: child.id,
        parentId: child.parentId,
        // Add ownership info to prevent cross-widget drops
        ownedBy: child.properties?.ownedBy,
        dragDropOwner: child.properties?.dragDropOwner,
        // Add drag source info
        dragSource: 'body',
        // Ensure this is recognized as a draggable element
        elementType: 'standalone-widget',
      },
      disabled: isPreviewMode, // Disable dragging in preview mode
    });

    // Debug drag detection
    React.useEffect(() => {
      if (isDragging) {
      }
    }, [isDragging, child.id, child.type, child.properties?.ownedBy, child.properties?.dragDropOwner]);

    const style = {
      position: 'absolute' as const,
      left: `${Number(child.properties?.left) || 0}px`,
      top: `${Number(child.properties?.top) || 0}px`,
      width: `${Number(child.properties?.width) || 80}px`, // Fixed width
      height: `${Number(child.properties?.height) || 80}px`, // Fixed height
      pointerEvents: 'auto' as const,
      zIndex: isDragging ? 1000 : 50, // Higher z-index when dragging
      cursor: isPreviewMode ? 'default' : (isDragging ? 'grabbing' : 'grab'),
      opacity: isDragging ? 0.5 : 1,
      transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
      transition: isDragging ? 'none' : 'all 0.2s ease',
      // Ensure the element can be dragged by its body
      userSelect: 'none' as const,
      // Prevent shrinking regardless of container size
      flexShrink: 0 as const,
      minWidth: `${Number(child.properties?.width) || 80}px`,
      minHeight: `${Number(child.properties?.height) || 80}px`,
    };

    return (
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
      >
        <StandaloneWidget 
          element={child}
          isSelected={false}
          isPreviewMode={isPreviewMode}
        />
      </div>
    );
  };
  
  const renderChild = (child: Element) => {
    const childElement = <DraggableChildElement key={child.id} child={child} />;
    
    // If portal is enabled, render to document body to avoid any container clipping
    if (usePortalForChildren && typeof document !== 'undefined') {
      return createPortal(childElement, document.body);
    }
    
    return childElement;
  };

  return (
    <div
      ref={setNodeRef}
      data-element-id={element.id}
      style={{
        ...currentStyles,
        position: 'relative',
        transition: 'all 0.2s ease',
        transform: isSelected ? 'scale(1.02)' : 'scale(1)',
        boxShadow: isSelected ? '0 8px 32px rgba(0,0,0,0.15)' : isOver ? '0 4px 16px rgba(14,165,233,0.2)' : 'none',
        overflow: 'visible', // Important: ensure children can extend outside
        // Proper positioning and layout
        width: element.properties?.width ? `${element.properties.width}px` : '300px',
        height: 'auto', // Allow height to grow with content
        minHeight: `${minHeight}px`, // Dynamic minimum height based on content
        // Apply minimum dimensions to prevent over-shrinking
        minWidth: `${minWidth}px`,
        // Ensure this creates a proper positioning context
        display: 'block',
      }}
      onClick={(e) => {
        e.stopPropagation();
        if (!isPreviewMode) {
          selectElement(element.id);
        }
      }}
    >
      {/* Header with icon, capacity info, and add button */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <MousePointerClick 
            size={16} 
            className={`transition-colors ${isDragOver ? 'text-blue-600' : 'text-gray-500'}`}
          />
          <span className="text-sm font-medium text-gray-700">
            {dropZoneText}
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          {maxItems > 0 && (
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <Package size={12} />
              <span>{droppedItems.length}/{maxItems}</span>
            </div>
          )}
          
          {/* Add Button */}
          {!isPreviewMode && (
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                createStandaloneElement();
              }}
              className={`flex items-center justify-center w-6 h-6 text-white rounded transition-colors ${
                buttonTransparency === 'transparent' 
                  ? 'bg-transparent border border-gray-400 text-gray-600 hover:bg-gray-100' 
                  : buttonTransparency === 'semi-transparent'
                  ? 'bg-blue-500 bg-opacity-70 hover:bg-opacity-90'
                  : 'bg-blue-500 hover:bg-blue-600'
              }`}
              title="Crear nuevo elemento"
              type="button"
            >
              <Plus size={14} strokeWidth={2} />
            </button>
          )}
        </div>
      </div>

      {/* Capacity warning - only show when widget is at capacity for drops */}
      {isAtCapacity && (
        <div className="flex items-center gap-2 mb-3 p-2 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-700">
          <AlertCircle size={14} />
          <span>Capacidad máxima para nuevos elementos</span>
        </div>
      )}

            {/* Dropped elements display area - show actual elements positioned where dropped */}
      <div 
        className="relative flex-1"
        style={{
          minHeight: `${Math.max(120, (Number(element.properties?.height) || 200) - 80)}px`,
          overflow: 'visible',
          position: 'relative',
        }}
      >
        {directChildren.length === 0 ? (
          <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-sm">
            <div className="text-center pointer-events-none">
              <Package size={24} className="mx-auto mb-2 opacity-50" />
              <p>No hay elementos</p>
              <p className="text-xs mt-1">Crea elementos con el botón + o arrastra aquí</p>
              {maxItems > 0 && (
                <p className="text-xs mt-1 text-gray-500">
                  Máximo {maxItems} elementos en esta área
                </p>
              )}
            </div>
          </div>
        ) : (
          // Render actual child elements using StandaloneWidget component
          directChildren.map(renderChild)
        )}
      </div>

      {/* Drop zone indicator when dragging over */}
      {isDragOver && canAcceptMore && (
        <div 
          className="absolute inset-0 flex items-center justify-center bg-blue-50 bg-opacity-90 rounded"
          style={{
            transition: enableAnimations ? 'opacity 0.2s ease' : 'none',
          }}
        >
          <div className="text-center">
            <MousePointerClick size={32} className="mx-auto mb-2 text-blue-500 animate-bounce" />
            <p className="text-blue-700 font-medium">
              {canAcceptMore ? 'Suelta aquí' : 'Capacidad máxima alcanzada'}
            </p>
            {canAcceptMore && allowedTypes.length > 0 && (
              <p className="text-xs text-blue-600 mt-1">
                Acepta: {allowedTypes.join(', ')}
              </p>
            )}
            {canAcceptMore && maxItems > 0 && (
              <p className="text-xs text-blue-600 mt-1">
                Espacio: {droppedItems.length}/{maxItems}
              </p>
            )}
            {!canAcceptMore && (
              <p className="text-xs text-orange-600 mt-1">
                Los elementos volverán a su posición original
              </p>
            )}
          </div>
        </div>
      )}

      {/* Success animation overlay */}
      {showSuccess && (
        <div 
          className="absolute inset-0 flex items-center justify-center bg-green-50 bg-opacity-90 rounded"
          style={{
            transition: enableAnimations ? 'opacity 0.3s ease' : 'none',
          }}
        >
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-2 bg-green-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xl">✓</span>
            </div>
            <p className="text-green-700 font-medium">¡Elemento añadido!</p>
          </div>
        </div>
      )}
    </div>
  );
};
