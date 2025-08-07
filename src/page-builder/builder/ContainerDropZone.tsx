import React from 'react';
import { useDroppable, useDndContext } from '@dnd-kit/core';
import { useBuilder } from '../hooks/useBuilder';
import { ResizableContainer } from './ResizableContainer';
import { ElementWrapper } from './ElementWrapper';
import { ErrorBoundary } from '../components/ErrorBoundary';
import type { Element } from '../types';

// Add a module load debug log to verify module is imported

// Utility function to extract actual element ID from drag IDs with prefixes
const extractElementIdFromDragId = (dragId: string): string => {
  if (dragId.startsWith('child-container-')) {
    return dragId.replace('child-container-', '');
  } else if (dragId.startsWith('container-handle-')) {
    return dragId.replace('container-handle-', '');
  }
  return dragId;
};

// Grid cell drop zone component is now controlled by parent
const GridCellDropZone: React.FC<{
  containerId: string;
  row: number;
  col: number;
  isDragging: boolean;
}> = ({ containerId, row, col, isDragging }) => {
  const { elements } = useBuilder();
  const { active } = useDndContext();
  
  // Check if the dragged element is trying to drop on itself or its descendants
  const isInvalidDrop = React.useMemo(() => {
    if (!active || active.id.toString().startsWith('new-')) return false;
    
    // Extract the actual element ID from drag ID (handle prefixes)
    let draggedElementId = active.id.toString();
    draggedElementId = extractElementIdFromDragId(draggedElementId);
    
    const draggedElement = elements.find(el => el.id === draggedElementId);
    
    if (!draggedElement) return false;
    
    // Check if dragging element is the same as the container
    if (draggedElementId === containerId) return true;
    
    // Check if the container is a descendant of the dragged element
    // This prevents containers from being dropped on their own children
    const isDescendant = (parentId: string, childId: string): boolean => {
      const child = elements.find(el => el.id === childId);
      if (!child || !child.parentId) return false;
      if (child.parentId === parentId) return true;
      return isDescendant(parentId, child.parentId);
    };
    
    // Only invalid if the container is a descendant of the dragged element
    return isDescendant(draggedElementId, containerId);
  }, [active, elements, containerId]);

  const { setNodeRef, isOver } = useDroppable({
    id: `grid-cell-${containerId}-${row}-${col}`,
    data: {
      type: 'grid-cell',
      containerId,
      row,
      col,
      isEmpty: true,
      // Add accepts configuration to allow standalone widgets and other elements
      accepts: ['element', 'button', 'standalone-widget', 'standalone-element', 'container'],
      allowedTypes: ['element', 'button', 'standalone-widget', 'standalone-element', 'container']
    },
    disabled: isInvalidDrop, // Disable drop zone if invalid drop
  });

  const shouldShowDropZone = isDragging;

  return (
    <div
      ref={setNodeRef}
      className={`grid-cell ${isOver && isDragging ? 'highlight' : ''}`}
      style={{
        gridRow: row,
        gridColumn: col,
        minHeight: '60px',
        border: shouldShowDropZone
          ? isInvalidDrop
            ? '2px solid rgba(239, 68, 68, 0.8)'
            : isOver && isDragging
              ? '2px solid rgba(34, 197, 94, 0.8)'
              : '2px dashed rgba(59, 130, 246, 0.5)'
          : '1px dashed rgba(59, 130, 246, 0.1)',
        borderRadius: '6px',
        backgroundColor: isInvalidDrop
          ? 'rgba(239, 68, 68, 0.15)'
          : isOver && isDragging
            ? 'rgba(34, 197, 94, 0.15)'
            : shouldShowDropZone
              ? 'rgba(59, 130, 246, 0.05)'
              : 'transparent',
        transition: 'all 0.15s ease',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        opacity: shouldShowDropZone ? 1 : 0.3,
      }}
      data-row={row}
      data-col={col}
    >
      {shouldShowDropZone && (
        <div className="text-xs text-gray-500 pointer-events-none font-medium">
          {row},{col}
        </div>
      )}
      {/* Removed green drop indicator bar */}
    </div>
  );
};

interface ContainerDropZoneProps {
  element: Element;
  depth?: number;
  isPreviewMode?: boolean; // Add preview mode prop
  // Constraint feedback props
  isConstrained?: boolean;
  constraintType?: 'horizontal' | 'vertical' | 'both' | null;
  draggedElementId?: string | null;
  openImageChoiceModal?: (containerId: string, context?: 'ADD_ELEMENT' | 'SET_BACKGROUND') => void;
}

export const ContainerDropZone: React.FC<ContainerDropZoneProps> = ({
  element,
  depth = 0,
  isPreviewMode = false, // Default to false
  isConstrained = false,
  constraintType = null,
  draggedElementId = null,
  openImageChoiceModal,
}) => {
  const { elements, selectedElementIds, selectElement } = useBuilder();
  const { active } = useDndContext();
  const isDraggingAny = Boolean(active);

  // Check if the dragged element is trying to drop on itself or its descendants
  const isInvalidDrop = React.useMemo(() => {
    if (!active || active.id.toString().startsWith('new-')) return false;
    
    // Extract the actual element ID from drag ID (handle prefixes)
    let draggedElementId = active.id.toString();
    draggedElementId = extractElementIdFromDragId(draggedElementId);
    
    const draggedElement = elements.find(el => el.id === draggedElementId);
    
    if (!draggedElement) return false;
    
    // Check if dragging element is the same as the drop target
    if (draggedElementId === element.id) {
      return true;
    }
    
    // Check if the drop target is a descendant of the dragged element
    // This prevents containers from being dropped on their own children
    const isDescendant = (parentId: string, childId: string): boolean => {
      const child = elements.find(el => el.id === childId);
      if (!child || !child.parentId) return false;
      if (child.parentId === parentId) return true;
      return isDescendant(parentId, child.parentId);
    };
    
    // Only invalid if the drop target (element.id) is a descendant of the dragged element
    const isInvalid = isDescendant(draggedElementId, element.id);
    
    return isInvalid;
  }, [active, elements, element.id]);

  const { setNodeRef, isOver } = useDroppable({
    id: element.id,
    data: { 
      type: 'container', 
      elementId: element.id, // Add elementId for drag-and-drop logic
      element, 
      depth,
      // Add accepts configuration to allow standalone widgets and other elements
      accepts: ['element', 'button', 'standalone-widget', 'standalone-element', 'container'],
      allowedTypes: ['element', 'button', 'standalone-widget', 'standalone-element', 'container']
    },
    disabled: false, // Temporarily disable invalid drop check to test
  });

  // Debug drop zone registration
  React.useEffect(() => {

  }, [element.id, element.type, isOver, isDraggingAny]);

  // Debug drop zone detection
  React.useEffect(() => {
    if (isDraggingAny) {

    }
  }, [isOver, isInvalidDrop, isDraggingAny, element.id, element.type]);

  // Debug DOM measurements after render  
  React.useEffect(() => {
    const containerElement = document.querySelector(`[data-container-id="${element.id}"]`) as HTMLElement;
    if (containerElement) {
      const rect = containerElement.getBoundingClientRect();
      const computedStyle = window.getComputedStyle(containerElement);
      
    }
  }, [element.id]);

  const { properties } = element;
  const isTopLevel = depth === 0;

  // Centralized grid configuration
  const isGrid = properties.layout === 'grid';
  const gridColumns = isGrid ? Math.max(1, properties.gridColumns || 2) : 0;
  const gridRows = isGrid ? Math.max(1, properties.gridRows || 2) : 0;

  const children = React.useMemo(
    () => elements.filter((el) => el.parentId === element.id),
    [elements, element.id]
  );

  const childrenHash = React.useMemo(
    () =>
      children
        .map(
          (child) =>
            `${child.id}-${child.properties?.gridRow || 0}-${
              child.properties?.gridColumn || 0
            }`
        )
        .join(','),
    [children]
  );

  const gridCellsContent = React.useMemo(() => {
    if (!isGrid) {
      return null;
    }

    const occupiedCells = new Map<string, Element>();
    children.forEach((child) => {
      const row = child.properties?.gridRow;
      const col = child.properties?.gridColumn;
      // Convert to numbers for comparison
      const rowNum = typeof row === 'string' ? parseInt(row, 10) : row;
      const colNum = typeof col === 'string' ? parseInt(col, 10) : col;
      if (rowNum && colNum && rowNum >= 1 && rowNum <= gridRows && colNum >= 1 && colNum <= gridColumns) {
        occupiedCells.set(`${rowNum}-${colNum}`, child);
      }
    });

    const cells = [];
    for (let row = 1; row <= gridRows; row++) {
      for (let col = 1; col <= gridColumns; col++) {
        const cellKey = `${row}-${col}`;
        const occupiedBy = occupiedCells.get(cellKey);

        if (occupiedBy) {
          const isSelected = selectedElementIds.includes(occupiedBy.id);
          cells.push(
            <div key={occupiedBy.id} style={{ gridRow: row, gridColumn: col }}>
              {(occupiedBy.type === 'container' || occupiedBy.type === 'simple-container') ? (
                <ResizableContainer
                  element={occupiedBy}
                  isSelected={isSelected}
                  depth={depth + 1}
                  isConstrained={isConstrained && draggedElementId === occupiedBy.id}
                  constraintType={constraintType}
                  draggedElementId={draggedElementId}
                />
              ) : (
                <ElementWrapper
                  element={occupiedBy}
                  isSelected={isSelected}
                  isDragging={draggedElementId === occupiedBy.id}
                  onClick={(event) => {
                    event.stopPropagation();
                    selectElement(occupiedBy.id, event.ctrlKey || event.metaKey);
                  }}
                  isPreviewMode={isPreviewMode}
                  isConstrained={isConstrained && draggedElementId === occupiedBy.id}
                  constraintType={constraintType}
                />
              )}
            </div>
          );
        } else {
          cells.push(
            <GridCellDropZone
              key={`grid-cell-${element.id}-${row}-${col}`}
              containerId={element.id}
              row={row}
              col={col}
              isDragging={isDraggingAny}
            />
          );
        }
      }
    }
    return cells;
  }, [
    isGrid,
    gridColumns,
    gridRows,
    childrenHash,
    element.id,
    depth,
    isDraggingAny,
    selectedElementIds,
  ]);

  const containerStyles = React.useMemo((): React.CSSProperties => {
    const isEmpty = children.length === 0;
    const isUninitialized = !properties.width && !properties.height && !properties.backgroundColor && !properties.borderColor;
    const shouldShowPlaceholder = isEmpty && isUninitialized;

    const computedFlexDirection = properties.layout === 'row' ? 'row' : 
                                 properties.layout === 'column' ? 'column' : 
                                 properties.flexDirection || 'column';

    

    return {
      display: isGrid ? 'grid' : 'flex',
      flexDirection: computedFlexDirection,
      gridTemplateColumns: isGrid ? `repeat(${gridColumns}, 1fr)` : undefined,
      gridTemplateRows: isGrid ? `repeat(${gridRows}, 1fr)` : undefined,
      gap: properties.gap ? `${Math.max(0, properties.gap)}px` : '12px',
      justifyContent: properties.justifyContent || 'flex-start',
      alignItems: properties.alignItems || 'stretch',
      width: '100%',
      height: '100%',
      minHeight: shouldShowPlaceholder && !isPreviewMode ? '120px' : isGrid && !isPreviewMode ? '200px' : 'auto',
      position: 'relative',
      boxSizing: 'border-box',
      backgroundColor: (!isPreviewMode && shouldShowPlaceholder && !properties.backgroundImage ? 'rgba(249, 250, 251, 0.5)' : !isPreviewMode && isGrid && !shouldShowPlaceholder ? 'rgba(59, 130, 246, 0.02)' : 'transparent'),
      // Only show editor placeholders when NOT in preview mode
      ...(!isPreviewMode && shouldShowPlaceholder && !properties.backgroundImage && {
        border: '2px dashed #d1d5db',
        borderRadius: '8px',
      }),
      ...(!isPreviewMode && isGrid && !shouldShowPlaceholder && {
        border: '2px dashed rgba(59, 130, 246, 0.4)',
        borderRadius: '6px',
      }),
      ...properties.style,
    };
  }, [
    properties,
    isGrid,
    gridColumns,
    gridRows,
    children.length,
    isPreviewMode, // Add preview mode to dependencies
  ]);

  const isEmpty = children.length === 0;
  const isUninitialized = !properties.width && !properties.height && !properties.backgroundColor && !properties.borderColor;
  const shouldShowPlaceholder = isEmpty && isUninitialized;

  

  return (
    <div
      ref={setNodeRef}
      className={`container-dropzone ${properties.className || ''}`}
      style={{
        // Don't use containerStyles here - it causes width collapse
        // The parent ResizableContainer handles the sizing
        width: '100%',
        height: '100%',
        // Make dropzone transparent if parent has background image
        ...(element.properties.backgroundImage && {
          backgroundColor: 'transparent',
          background: 'transparent',
        }),
        pointerEvents: isPreviewMode ? 'none' : 'auto',
        zIndex: isOver ? 1000 : Math.max(1, (depth + 1) * 10),
        // Ensure child elements can escape clipping during drag
        overflow: isDraggingAny ? 'visible' : 'visible',
        // Use flex layout from properties - OVERRIDE CSS with !important
        display: isTopLevel ? 'block' : properties.layout === 'grid' ? 'grid' : ((properties.layout === 'row' || properties.layout === 'column' || properties.flexDirection) ? 'flex' : 'block'),
        flexDirection: isTopLevel ? undefined : (properties.flexDirection ? properties.flexDirection : (properties.layout === 'row' ? 'row' : properties.layout === 'column' ? 'column' : undefined)),
        justifyContent: isTopLevel ? undefined : properties.justifyContent || 'flex-start',
        alignItems: isTopLevel ? undefined : properties.alignItems || 'stretch',
        gap: properties.gap ? `${properties.gap}px` : '8px',
        // Override any CSS that might interfere with flex layout
        flexWrap: 'nowrap',
        alignContent: 'flex-start',
      }}
      data-container-id={element.id}
    >
      {isDraggingAny && !isPreviewMode && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 2000,
            pointerEvents: 'none',
            background: isInvalidDrop 
              ? 'rgba(239,68,68,0.08)' 
              : isOver 
                ? 'rgba(59,130,246,0.08)' 
                : 'transparent',
            border: isInvalidDrop
              ? '2px solid #ef4444'
              : isOver
                ? '2px solid #3b82f6'
                : isGrid
                  ? '1px dashed rgba(59, 130, 246, 0.4)'
                  : '1px dashed rgba(156, 163, 175, 0.3)',
            borderRadius: '8px',
            transition: 'all 0.15s ease',
          }}
        >
          {isInvalidDrop && (
            <div
              style={{
                position: 'absolute',
                top: 4,
                right: 4,
                background: '#ef4444',
                color: '#fff',
                fontSize: 10,
                fontWeight: 600,
                borderRadius: 3,
                padding: '2px 6px',
              }}
            >
              INVALID DROP
            </div>
          )}
          {isOver && !isInvalidDrop && (
            <div
              style={{
                position: 'absolute',
                top: 4,
                right: 4,
                background: '#3b82f6',
                color: '#fff',
                fontSize: 10,
                fontWeight: 600,
                borderRadius: 3,
                padding: '2px 6px',
              }}
            >
              {isGrid ? 'GRID CONTAINER' : 'DROP ZONE'}
            </div>
          )}
        </div>
      )}

      {shouldShowPlaceholder ? (
        <div
          className="empty-container-placeholder flex items-center justify-center text-gray-400 text-center"
          style={{ width: '100%', height: '100%', minHeight: '120px', padding: '16px' }}
        >
          <div>
            <div className="mb-2">
              <svg className="w-8 h-8 mx-auto text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <p className="text-sm">Arrastra elementos aquí</p>
            <p className="text-xs text-gray-300">Contenedor {properties.layout || 'column'}</p>
          </div>
        </div>
      ) : isGrid ? (
        <ErrorBoundary
          fallback={
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded">
              <p className="text-yellow-600 text-sm">Grid layout temporarily unavailable</p>
            </div>
          }
        >
          {gridCellsContent}
        </ErrorBoundary>
      ) : (
        children.map((child) => {
          const isSelected = selectedElementIds.includes(child.id);
          if (child.type === 'container' || child.type === 'simple-container') {
            return (
              <ResizableContainer
                key={child.id}
                element={child}
                isSelected={isSelected}
                depth={depth + 1}
                isConstrained={isConstrained && draggedElementId === child.id}
                constraintType={constraintType}
                draggedElementId={draggedElementId}
              />
            );
          } else {
            return (
              <ElementWrapper
                key={child.id}
                element={child}
                isSelected={isSelected}
                isDragging={draggedElementId === child.id}
                onClick={(event) => {
                  event.stopPropagation();
                  selectElement(child.id, event.ctrlKey || event.metaKey);
                }}
                isPreviewMode={isPreviewMode}
                isConstrained={isConstrained && draggedElementId === child.id}
                constraintType={constraintType}
              />
            );
          }
        })
      )}
    </div>
  );
};
