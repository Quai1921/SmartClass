import React from 'react';
import { DragOverlay, useDndContext } from '@dnd-kit/core';
import { DragOverlayCard } from '../../utils/elementIcons';
import { ElementRenderer } from '../ElementRenderer';
import type { Element } from '../../types';

interface PageBuilderDragOverlayProps {
  activeId: string | null;
  dragSource: 'handle' | 'body' | 'sidebar';
  elements: Element[];
  draggedElement?: Element | null;
}

export const PageBuilderDragOverlay: React.FC<PageBuilderDragOverlayProps> = ({
  activeId,
  dragSource,
  elements,
  draggedElement,
}) => {
  const { active } = useDndContext();

  // --- FIX: Always show overlay for handle drags (except for drop-area-widget types, handled below) ---
  // Remove suppression for widget handle drags so preview is always visible

  // Don't show overlay for standalone elements (drag-drop widget created elements)
  // EXCEPT for standalone-widget types which need their own overlay
  if (!activeId?.startsWith('new-')) {
    let elementId = activeId;
    if (activeId?.startsWith('container-handle-')) {
      elementId = activeId.replace('container-handle-', '');
    } else if (activeId?.startsWith('child-container-')) {
      elementId = activeId.replace('child-container-', '');
    }

    const element = elements.find(el => el.id === elementId);
    if (element &&
      element.type !== 'standalone-widget' && // Allow standalone widgets to show overlay
      (element.properties?.ownedBy || element.properties?.dragDropOwner || element.properties?.standaloneElementType)) {
      return null;
    }
  }

  return (
    <DragOverlay
      dropAnimation={{
        duration: 150,
        easing: 'cubic-bezier(0.18, 0.67, 0.6, 1.22)',
      }}
    >
      {activeId ? (
        (() => {
          // For new elements from sidebar - show blue overlay card
          if (activeId.startsWith('new-')) {
            const elementType = activeId.replace('new-', '');
            return (
              <div style={{
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.4)',
                transformOrigin: 'center',
                opacity: 0.85,
              }}>
                <DragOverlayCard
                  type={elementType as any}
                  className="border-blue-500 bg-blue-600"
                />
              </div>
            );
          }

          // For existing elements - show actual element content
          // Handle different ID formats for containers
          let elementId = activeId;
          if (activeId?.startsWith('container-handle-')) {
            elementId = activeId.replace('container-handle-', '');
          } else if (activeId?.startsWith('child-container-')) {
            elementId = activeId.replace('child-container-', '');
          }

          const element = elements.find(el => el.id === elementId) || draggedElement;

          // Check both the element type and the drag data type
          if ((element && (element.type as any) === 'drop-area-widget') || (active?.data?.current && (active.data.current as any).type === 'drop-area-widget')) {
            // For DropAreaWidget, show the actual widget content instead of a placeholder overlay
            if (element) {
              const elementWidth = Number(element.properties?.width) || 120;
              const elementHeight = Number(element.properties?.height) || 80;

              return (
                <div style={{
                  transform: 'scale(0.95)',
                  boxShadow: '0 8px 25px rgba(59, 130, 246, 0.3)',
                  opacity: 0.85,
                  pointerEvents: 'none',
                  zIndex: 10000,
                  width: elementWidth,
                  height: elementHeight,
                  overflow: 'hidden',
                  border: '2px solid #3b82f6',
                  borderRadius: '4px',
                }}>
                  <div style={{
                    width: '100%',
                    height: '100%',
                    transform: 'scale(1)',
                    transformOrigin: 'top left',
                  }}>
                    <ElementRenderer
                      key={`drag-overlay-${element.id}`}
                      element={element}
                      isSelected={false}
                    />
                  </div>
                </div>
              );
            }
            // Fallback for when element is not available - use the draggedElement or active data
            const fallbackElement = draggedElement || active?.data?.current;
            const parseSize = (val: string | number | undefined, fallback: number): number => {
              if (typeof val === 'number') return Math.max(val, fallback);
              if (typeof val === 'string') {
                const num = parseInt(val, 10);
                return isNaN(num) ? fallback : Math.max(num, fallback);
              }
              return fallback;
            };
            const width = parseSize((fallbackElement as any)?.properties?.width, 80);
            const height = parseSize((fallbackElement as any)?.properties?.height, 40);
            return (
              <div style={{
                width,
                height,
                minWidth: 40,
                minHeight: 24,
                border: '2px solid #3b82f6',
                borderRadius: 4,
                background: '#f3f4f6',
                boxShadow: '0 4px 16px rgba(59,130,246,0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '12px',
                fontWeight: 'bold',
                color: '#333',
                opacity: 0.95,
                pointerEvents: 'none',
                zIndex: 10000,
              }}>
                {(fallbackElement as any)?.type || 'drop-area-widget'}
              </div>
            );
          }

          // Render a ghost copy for containers
          if (element && (element.type === 'container' || element.type === 'simple-container')) {
            const isHandleDrag = dragSource === 'handle';
            const isChildContainer = activeId?.startsWith('child-container-');
            // Determine container dimensions (fall back to 200x120)
            const containerWidth = Number(element.properties.width) || 200;
            const containerHeight = Number(element.properties.height) || 120;

            // Calculate offset to position overlay correctly relative to cursor
            // Handle is positioned at left-center of container, so we need to offset
            // the overlay so the cursor appears over the handle position
            let offsetX = 0;
            let offsetY = 0;

            if (isHandleDrag) {
              // Handle is at left-center of container
              offsetX = 40; // Handle is positioned to the left of container, offset rightward
              offsetY = -containerHeight / 2; // Center vertically relative to container
            }

            return (
              <div style={{
                transform: 'scale(0.95)', // Scale for drag feedback
                boxShadow: `0 8px 25px rgba(59, 130, 246, 0.4)`,
                transformOrigin: 'center',
                opacity: 0.9,
                pointerEvents: 'none',
                position: 'relative',
                zIndex: 10000,
                // Apply offsets to align cursor with handle position
                marginLeft: `${offsetX}px`,
                marginTop: `${offsetY}px`,
                // Use actual container dimensions
                width: `${containerWidth}px`,
                height: `${containerHeight}px`,
                // Allow containers to show full content
                maxWidth: 'none',
                maxHeight: 'none',
                overflow: 'visible',
              }}>
                {/* Simple container preview for drag overlay */}
                <div style={{
                  border: `3px solid ${isChildContainer ? '#8b5cf6' : '#3b82f6'}`,
                  borderRadius: '8px',
                  background: 'rgba(59, 130, 246, 0.1)',
                  backdropFilter: 'blur(4px)',
                  width: '100%',
                  height: '100%',
                  boxSizing: 'border-box',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  color: '#3b82f6',
                  position: 'relative',
                }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '32px', marginBottom: '8px' }}>📦</div>
                    <div>{element.type === 'simple-container' ? 'Contenedor Simple' : 'Contenedor'}</div>
                    {element.children && element.children.length > 0 && (
                      <div style={{ fontSize: '12px', opacity: 0.7, marginTop: '4px' }}>
                        {element.children.length} elemento{element.children.length !== 1 ? 's' : ''}
                      </div>
                    )}
                  </div>

                  {/* Show handle indicator for handle drags */}
                  {isHandleDrag && (
                    <div style={{
                      position: 'absolute',
                      left: '-20px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      width: '32px',
                      height: '20px',
                      background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                      border: '2px solid rgba(255, 255, 255, 0.95)',
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '12px',
                      color: 'white',
                      boxShadow: '0 4px 15px rgba(59, 130, 246, 0.3), 0 2px 8px rgba(0, 0, 0, 0.15)',
                    }}>
                      ↔
                    </div>
                  )}
                </div>
              </div>
            );
          }

          // Special handling for standalone widgets - no overlay needed
          // Let the original element show with reduced opacity during drag
          if (element && element.type === 'standalone-widget') {

            return null; // No overlay - let original element show during drag
          }

          if (element) {
            const isHandleDrag = dragSource === 'handle';

            const isInteractiveWidget = element.type === 'text-statement' ||
              element.type === 'image-choice' ||
              element.type === 'image-comparison' ||
              element.type === 'audio-comparison' ||
              element.type === 'audio-true-false' ||
              element.type === 'area-true-false' ||
              element.type === 'fill-in-blanks' ||
              element.type === 'single-choice';

            return (
              <div
                style={{
                  transform: 'scale(0.95)', // Scale for drag feedback without rotation
                  boxShadow: `0 8px 25px rgba(59, 130, 246, 0.4)`,
                  transformOrigin: 'center',
                  opacity: 0.9,
                  pointerEvents: 'none',
                  position: 'relative',
                  zIndex: 10000,
                  // Allow interactive widgets to show full content
                  maxWidth: isInteractiveWidget ? 'none' : '300px',
                  maxHeight: isInteractiveWidget ? 'none' : '200px',
                  overflow: isInteractiveWidget ? 'visible' : 'hidden',
                  // Ensure interactive widgets maintain their dimensions with extra space
                  width: isInteractiveWidget ? (element.properties.width ? `${Number(element.properties.width) + 20}px` : 'auto') : undefined,
                  height: isInteractiveWidget ? (element.properties.height ? `${Number(element.properties.height) + 20}px` : 'auto') : undefined,
                }}
              >
                {/* Render the actual element content */}
                <div style={{
                  border: `3px solid #3b82f6`,
                  borderRadius: '8px',
                  background: 'rgba(59, 130, 246, 0.1)',
                  backdropFilter: 'blur(4px)',
                  // Ensure inner container matches outer container size for interactive widgets
                  width: isInteractiveWidget ? '100%' : undefined,
                  height: isInteractiveWidget ? '100%' : undefined,
                  boxSizing: 'border-box',
                  overflow: isInteractiveWidget ? 'visible' : undefined,
                  // Add padding for interactive widgets so content doesn't touch borders
                  padding: isInteractiveWidget ? '12px' : undefined,
                  display: isInteractiveWidget ? 'flex' : undefined,
                  alignItems: isInteractiveWidget ? 'center' : undefined,
                  justifyContent: isInteractiveWidget ? 'center' : undefined,
                }}>
                  <ElementRenderer
                    element={element}
                    isSelected={false}
                    isPreviewMode={true} // Disable interactions during drag
                  />
                </div>

                {/* Add a small indicator */}
                <div className={`absolute -top-2 -right-2 w-6 h-6 rounded-full text-xs flex items-center justify-center text-white font-bold bg-blue-500`}>
                  🎯
                </div>
              </div>
            );
          }

          return null;
        })()
      ) : null}
    </DragOverlay>
  );
};
