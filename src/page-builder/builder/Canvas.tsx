import React, { useCallback, useMemo } from 'react';
import { useDroppable, useDndContext } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useBuilder } from '../hooks/useBuilder';
import type { Element } from '../types';
import { ResizableContainer } from './ResizableContainer';
import { ElementWrapper } from './ElementWrapper';

interface CanvasProps {
  className?: string;
  canvasWidth?: number; // Add canvas width prop to help with container positioning
  // Constraint feedback props
  isConstrained?: boolean;
  constraintType?: 'horizontal' | 'vertical' | 'both' | null;
  draggedElementId?: string | null;
  openImageChoiceModal?: (containerId: string, context?: 'ADD_ELEMENT' | 'SET_BACKGROUND') => void;
}

export const Canvas: React.FC<CanvasProps> = ({ 
  className = '', 
  canvasWidth,
  isConstrained = false,
  constraintType = null,
  draggedElementId = null,
  openImageChoiceModal,
}) => {
  const {
    elements,
    selectedElementIds,
    selectElement,
    draggedElement,
    currentPage,
    course,
  } = useBuilder();

  // Get the active drag context for more accurate drag state detection
  const { active: dndActive } = useDndContext();
  
  // Get current page elements based on the existing page system
  const currentPageElements = useMemo(() => {
    if (!currentPage) {
      return elements; // Show all elements if no current page
    }
    
    // If current page has content, parse it and show those elements
    if (currentPage.content) {
      try {
        const pageElements = JSON.parse(currentPage.content);
        return Array.isArray(pageElements) ? pageElements : elements;
      } catch (error) {
        // console.error('Error parsing page content:', error);
        return elements;
      }
    }
    
    return elements;
  }, [currentPage, elements]);
  
  // Only render top-level elements (no parentId) in the main canvas
  const topLevelElements = currentPageElements.filter((el: Element) => !el.parentId);  // Track if we're currently dragging for visual debug using improved detection
  const isDragging = !!(dndActive || draggedElement);

  // Make the main canvas droppable
  const { setNodeRef, isOver } = useDroppable({
    id: 'main-canvas',
    data: { 
      type: 'canvas',
      accepts: ['element', 'container'] 
    },
  });

  const handleCanvasClick = useCallback((event: React.MouseEvent) => {
    // Only clear selection if clicking on the canvas itself, not on elements
    if (event.target === event.currentTarget) {
      selectElement(null, false); // Clear all selections
    }
  }, [selectElement]);return (
    <div className={`page-builder-canvas bg-white h-full ${className}`}>      <div 
        ref={setNodeRef}
        onClick={handleCanvasClick} // Add canvas click handler
        data-canvas="true" // Add canvas identifier for widget positioning
        className={`canvas-content min-h-[400px] h-full rounded-lg transition-colors ${
          elements.length === 0 ? 'border-2 border-dashed' : ''
        } ${
          isOver && elements.length === 0 ? 'border-blue-400 bg-blue-50' : ''
        } ${
          isOver && elements.length > 0 ? 'bg-blue-25 border-blue-300' : '' // Add hover state for non-empty canvas
        } ${
          elements.length === 0 ? 'border-gray-300' : ''
        } ${
          isDragging ? 'canvas-drag-active' : '' // Add drag state class
        }`}        style={{
          padding: '32px', // Uniform padding for all sides
          paddingLeft: '32px', // Consistent left padding 
          paddingRight: '32px', // Consistent right padding
          overflow: 'visible', // Allow resize handles to show outside elements
          position: 'relative',
          width: '100%',
          boxSizing: 'border-box',
        }}
      >

        {/* Page indicator - only show if we have a current page */}
        {currentPage && (
          <div
            style={{
              position: 'absolute',
              top: 12,
              right: 12,
              background: 'rgba(0, 0, 0, 0.7)',
              color: '#fff',
              fontSize: 12,
              fontWeight: 600,
              borderRadius: 6,
              padding: '8px 12px',
              zIndex: 1000,
              pointerEvents: 'none',
            }}
          >
            {currentPage.title}
          </div>
        )}

        {/* Canvas drop indicator */}
        {isDragging && isOver && (
          <div
            style={{
              position: 'absolute',
              top: 12,
              left: 12,
              background: 'rgba(59, 130, 246, 0.95)',
              color: '#fff',
              fontSize: 11,
              fontWeight: 700,
              borderRadius: 6,
              padding: '6px 10px',
              zIndex: 3000,
              pointerEvents: 'none',
              boxShadow: '0 2px 8px rgba(59, 130, 246, 0.4)',
              animation: 'dropHintBounce 0.6s ease-in-out infinite alternate',
            }}
          >
            📍 DROP ON CANVAS (TOP-LEVEL)
          </div>
        )}

        <SortableContext
          items={topLevelElements.map((el: Element) => el.id)}
          strategy={verticalListSortingStrategy}
        >
          {topLevelElements.length === 0 ? (
            <div className="empty-canvas flex items-center justify-center h-64">
              <div className="text-center text-gray-500">
                <div className="mb-4">
                  <svg className="w-16 h-16 mx-auto text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>                <p className="text-lg font-medium mb-2">Tu curso está vacío</p>
                <p className="text-sm">Arrastra elementos desde la barra lateral para comenzar</p>
                <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-xs text-blue-600 mb-2">
                    💡 <strong>Paso 1:</strong> Comienza arrastrando un <strong>Contenedor</strong> para organizar tu contenido
                  </p>
                  <p className="text-xs text-blue-500 mt-1">
                    📐 <strong>Paso 2:</strong> Los contenedores se pueden redimensionar arrastrando sus bordes cuando están seleccionados
                  </p>
                  <p className="text-xs text-blue-500 mt-1">
                    🎯 <strong>Paso 3:</strong> Arrastra otros widgets dentro de los contenedores para agregar contenido
                  </p>
                  <p className="text-xs text-blue-500 mt-1">
                    ⚡ <strong>Tip:</strong> <strong>Ctrl+Click</strong> para seleccionar múltiples elementos
                  </p>
                </div>
              </div>
            </div>          ) : (            <div className="elements-container">
              {/* Multi-selection indicator */}
              {selectedElementIds.length > 1 && (
                <div className="mb-4 p-2 bg-blue-100 border border-blue-300 rounded-lg text-sm text-blue-700">
                  <span className="font-medium">{selectedElementIds.length} elementos seleccionados</span>
                  <span className="text-blue-500 ml-2 text-xs">• Ctrl+Click para añadir/quitar • Click para seleccionar uno</span>
                </div>
              )}              {topLevelElements.map((element: Element) => {
                // Handle containers vs regular elements differently
                if (element.type === 'container' || element.type === 'simple-container') {
                  return (
                    <ResizableContainer
                      key={element.id}
                      element={element}
                      isSelected={selectedElementIds.includes(element.id)}
                      depth={0}
                      isConstrained={isConstrained && draggedElementId === element.id}
                      constraintType={constraintType}
                      draggedElementId={draggedElementId}
                      openImageChoiceModal={openImageChoiceModal}
                    />
                  );
                } else {
                  // Top-level widgets use ElementWrapper for drag handles and positioning
                  return (
                    <ElementWrapper
                      key={element.id}
                      element={element}
                      isSelected={selectedElementIds.includes(element.id)}
                      isDragging={draggedElementId === element.id}
                      onClick={(event) => {
                        event.stopPropagation();
                        selectElement(element.id, event.ctrlKey || event.metaKey);
                      }}
                      isConstrained={isConstrained && draggedElementId === element.id}
                      constraintType={constraintType}
                    />
                  );
                }
              })}
            </div>
          )}
        </SortableContext>
      </div>
    </div>
  );
};
