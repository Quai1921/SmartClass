import React, { useState, useCallback, useRef, useMemo } from 'react';
import { Move } from 'lucide-react';
import { useBuilder } from '../hooks/useBuilder';
import type { Element } from '../types';
import { ElementRenderer } from './ElementRenderer';
import { ContextMenu } from '../components/ContextMenu';
import { ImageUploadModal } from '../components/ImageWidget';
import { useResizeHandlers } from './hooks/useResizeHandlers';
import { useInlineEditing } from './hooks/useInlineEditing';
import { useSelectionBorder } from './hooks/useSelectionBorder';
import { useWidgetRepositioning } from './hooks/useWidgetRepositioning';
import { ResizeHandles } from './components/ResizeHandles';
import { InlineEditor } from './components/InlineEditor';
import { RefactoredEnhancedInlineEditor } from './components/EnhancedInlineEditor';
import { getElementStyles } from '../utils/elementStyles';

interface ManualDragWidgetProps {
  element: Element;
  isSelected: boolean;
}

export const ManualDragWidget: React.FC<ManualDragWidgetProps> = ({
  element,
  isSelected,
}) => {
  const { updateElement, selectElement } = useBuilder();
  const widgetRef = useRef<HTMLDivElement>(null);
  const properties = element.properties;

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
    setIsEditing,
    handleDoubleClick, 
    handleEditingComplete, 
    handleEditingKeyDown 
  } = useInlineEditing(element, triggerBorderUpdate);
  
  // Create a manual editing trigger for testing
  const startEditing = () => {
    const currentText = element.properties.htmlContent || element.properties.text || '';
    setEditText(currentText);
    setIsEditing(true);
  };


  // Manual drag repositioning
  const { isRepositioning, startRepositioning } = useWidgetRepositioning({
    element,
    widgetRef
  });

  // Get computed styles for the widget (memoized)
  const computedStyles = useMemo(() => getElementStyles(element, false), [element]);

  // Apply repositioning visual feedback (memoized)
  const finalStyles = useMemo(() => ({
    ...computedStyles,
    userSelect: isEditing ? 'text' : 'none',
    // Visual feedback is handled directly in the repositioning hook
  } as React.CSSProperties), [computedStyles, isEditing]);

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

  return (
    <>
      <div
        ref={widgetRef}
        data-element-id={element.id}
        data-element-type={element.type}
        data-manual-drag="true"
        className={`widget-resizable ${element.type === 'button' ? 'widget-button' : ''} ${isSelected ? 'selected' : ''} ${
          element.properties.widthUnit === 'max-content' ? 'width-max-content' : ''
        } ${
          element.properties.heightUnit === 'max-content' ? 'height-max-content' : ''
        } ${isRepositioning ? 'repositioning' : ''}`}
        onClick={(e) => {
          e.stopPropagation();
          selectElement(element.id);
        }}
        onDoubleClick={handleDoubleClick}
        onContextMenu={handleRightClick}
        style={finalStyles}
      >
        {/* ALWAYS VISIBLE TEST ELEMENT */}
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
          MANUAL DRAG WIDGET RENDERED
        </div>
        
        {/* Element Content */}
        {isEditing ? (
          element.type === 'paragraph' ? (
            <div style={{ border: '2px solid green', padding: '10px' }}>
              <div style={{ color: 'green', fontSize: '12px' }}>USING ENHANCED EDITOR FOR PARAGRAPH</div>
              <RefactoredEnhancedInlineEditor
                isEditing={isEditing}
                content={editText}
                onContentChange={setEditText}
                onComplete={handleEditingComplete}
                onKeyDown={handleEditingKeyDown}
                placeholder="Escribe aquí..."
              />
            </div>
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
            {/* Always show debug info for paragraphs */}
            {element.type === 'paragraph' && (
              <div style={{ 
                position: 'absolute', 
                top: '-50px', 
                left: '0px', 
                background: 'purple', 
                color: 'white', 
                padding: '5px', 
                fontSize: '10px',
                zIndex: 9999,
                border: '3px solid orange'
              }}>
                ALWAYS: type={element.type}, selected={isSelected.toString()}
              </div>
            )}
            {/* Temporary test button for paragraphs */}
            {element.type === 'paragraph' && isSelected && (
              <div style={{ 
                position: 'absolute', 
                top: '-40px', 
                right: '0px', 
                background: 'red', 
                color: 'white', 
                padding: '5px', 
                fontSize: '10px',
                zIndex: 9999,
                border: '2px solid yellow'
              }}>
                DEBUG: element.type={element.type}, isSelected={isSelected.toString()}
              </div>
            )}
            {element.type === 'paragraph' && isSelected && (
              <button
                onClick={startEditing}
                style={{
                  position: 'absolute',
                  top: '-30px',
                  right: '0px',
                  background: 'blue',
                  color: 'white',
                  border: 'none',
                  padding: '5px 10px',
                  borderRadius: '4px',
                  fontSize: '12px',
                  cursor: 'pointer',
                  zIndex: 9999
                }}
              >
                Start Enhanced Editor
              </button>
            )}
          </div>
        )}

        {/* Resize Handles */}
        <ResizeHandles
          isSelected={isSelected}
          onStartResize={startResize}
          getCursor={getCursor}
        />

        {/* Blue repositioning handle for widgets inside containers - matching ElementWrapper style */}
        {element.parentId && isSelected && !isResizing && (
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
              zIndex: 10004,
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
            onMouseDown={startRepositioning}
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
